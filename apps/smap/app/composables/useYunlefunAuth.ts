import type {
  SsoAuthorizationResult,
  SsoFailureReason,
} from '@yunlefun/sso'
import type {
  SsoIdentityAdoptionAuth,
  SsoIdentityProof,
} from '@yunlefun/sso/browser'
import type { ComputedRef, Ref } from 'vue'
import type {
  YunlefunSsoConfig,
  YunlefunSsoConfigResult,
  YunlefunSsoSessionMode,
} from '~/utils/yunlefunSsoConfig'
import {
  adoptSsoCode,
  consumeSsoRedirect,
  hasSsoRedirectResult,
  startSsoRedirect,
} from '@yunlefun/sso'
import {
  adoptSsoIdentityProof,
  requestHostSsoAuthorization,
} from '@yunlefun/sso/browser'
import { computed, readonly } from 'vue'
import { useRuntimeConfig, useState } from '#imports'
import { formatSsoFailureMessage, formatUnexpectedAuthError } from '~/utils/authErrors'
import { resolveYunlefunSsoConfig } from '~/utils/yunlefunSsoConfig'

export type YunlefunAuthStatus = 'idle' | 'checking' | 'signed-in' | 'signed-out' | 'signing-in' | 'error'

export interface YunlefunAccount {
  uid: string
  displayName: string
  email?: string
  avatarUrl?: string
}

interface YunlefunRuntimeConfig {
  public: {
    yunlefunCloudbaseEnv?: string
    yunlefunSsoClientId?: string
    yunlefunSsoExchangeUrl?: string
    yunlefunSsoOrigin?: string
    yunlefunSsoRedirectUri?: string
    yunlefunSsoScope?: string
    yunlefunSsoSessionEndpoint?: string
    yunlefunSsoSessionMode?: string
  }
}

interface CloudbaseUser {
  id?: string
  uid?: string
  name?: string
  displayName?: string
  nickName?: string
  username?: string
  email?: string
  avatar?: string
  avatarUrl?: string
  photoURL?: string
  is_anonymous?: boolean
}

interface CloudbaseLoginState {
  user?: CloudbaseUser | null
}

interface BffSessionResponse {
  account?: CloudbaseUser | null
}

interface YunlefunAuthClient extends SsoIdentityAdoptionAuth {
  currentUser?: CloudbaseUser | null
  getLoginState: () => Promise<CloudbaseLoginState | null>
  signOut: () => Promise<unknown>
}

interface YunlefunCloudbaseApp {
  auth: (options?: { persistence: 'local' | 'session' | 'none' }) => YunlefunAuthClient
}

interface CloudbaseModule {
  default?: {
    init: (config: { env: string }) => YunlefunCloudbaseApp
  }
  init?: (config: { env: string }) => YunlefunCloudbaseApp
}

interface UseYunlefunAuthReturn {
  account: Readonly<Ref<YunlefunAccount | null>>
  displayName: ComputedRef<string>
  errorMessage: ComputedRef<string>
  inNativeApp: Readonly<Ref<boolean>>
  initialize: () => Promise<void>
  isAuthenticated: ComputedRef<boolean>
  sessionMode: ComputedRef<YunlefunSsoSessionMode>
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  status: Readonly<Ref<YunlefunAuthStatus>>
}

let cachedApp: YunlefunCloudbaseApp | undefined
let cachedAuth: YunlefunAuthClient | undefined
let pendingApp: Promise<YunlefunCloudbaseApp | undefined> | undefined
let pendingAuth: Promise<YunlefunAuthClient | undefined> | undefined
let cachedPersistence: 'none' | 'session' | undefined

export function useYunlefunAuth(): UseYunlefunAuthReturn {
  const config = useRuntimeConfig() as unknown as YunlefunRuntimeConfig
  const account = useState<YunlefunAccount | null>('yunlefun:auth:account', () => null)
  const status = useState<YunlefunAuthStatus>('yunlefun:auth:status', () => 'idle')
  const lastFailure = useState<SsoFailureReason | null>('yunlefun:auth:last-failure', () => null)
  const lastError = useState<string | null>('yunlefun:auth:last-error', () => null)
  const initialized = useState<boolean>('yunlefun:auth:v3:initialized', () => false)
  const inNativeApp = useState<boolean>('yunlefun:auth:in-native-app', () => false)

  const isAuthenticated = computed(() => Boolean(account.value))
  const displayName = computed(() => account.value?.displayName ?? '')
  const errorMessage = computed(() => lastError.value ?? formatSsoFailureMessage(lastFailure.value))
  const sessionMode = computed<YunlefunSsoSessionMode>(() => {
    return config.public.yunlefunSsoSessionMode === 'bff' ? 'bff' : 'browser'
  })

  async function initialize(): Promise<void> {
    if (!import.meta.client || initialized.value)
      return

    initialized.value = true
    status.value = 'checking'
    lastFailure.value = null
    lastError.value = null

    const hadRedirectResult = hasSsoRedirectResult(window.location.hash)
    let attemptedAuthorization = hadRedirectResult

    try {
      const redirectResult = consumeSsoRedirect()

      if (redirectResult) {
        if (!redirectResult.ok) {
          applyFailure(redirectResult.reason)
          return
        }

        await adoptAuthorization(redirectResult, resolveConfigOrThrow())
        return
      }

      if (hadRedirectResult) {
        applyFailure('invalid_request')
        return
      }

      const resolved = resolveConfig()
      if (!resolved.ok) {
        status.value = 'signed-out'
        return
      }

      if (await restoreSession(resolved.config))
        return

      const hostAuthorization = await requestHostSsoAuthorization(resolved.config.redirect)
      if (!hostAuthorization) {
        status.value = 'signed-out'
        return
      }

      attemptedAuthorization = true
      inNativeApp.value = true
      await adoptAuthorization(hostAuthorization, resolved.config)
    }
    catch {
      account.value = null
      status.value = attemptedAuthorization ? 'error' : 'signed-out'
      lastError.value = attemptedAuthorization ? formatUnexpectedAuthError() : null
    }
  }

  async function signIn(): Promise<void> {
    if (!import.meta.client)
      return

    const resolved = resolveConfig()
    if (!resolved.ok) {
      status.value = 'error'
      lastFailure.value = null
      lastError.value = resolved.message
      return
    }

    status.value = 'signing-in'
    lastFailure.value = null
    lastError.value = null

    try {
      await startSsoRedirect(resolved.config.redirect)
    }
    catch {
      status.value = 'error'
      lastError.value = formatUnexpectedAuthError()
    }
  }

  async function signOut(): Promise<void> {
    const resolved = import.meta.client ? resolveConfig() : null
    if (resolved?.ok && resolved.config.sessionMode === 'bff' && resolved.config.sessionEndpoint) {
      await fetch(resolved.config.sessionEndpoint, {
        method: 'DELETE',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          accept: 'application/json',
        },
      }).catch(() => undefined)
    }

    const auth = await ensureAuth(
      normalizeConfigValue(config.public.yunlefunCloudbaseEnv),
      sessionMode.value === 'browser' ? 'session' : 'none',
    )
    if (auth) {
      try {
        await auth.signOut()
      }
      catch {
        // The SSO v3 identity is already memory-only; local state can still be cleared.
      }
    }

    account.value = null
    status.value = 'signed-out'
    lastFailure.value = null
    lastError.value = null
    inNativeApp.value = false
  }

  async function adoptAuthorization(
    authorization: SsoAuthorizationResult,
    ssoConfig: YunlefunSsoConfig,
  ): Promise<void> {
    const persistence = ssoConfig.sessionMode === 'browser' ? 'session' : 'none'
    const auth = await ensureAuth(
      normalizeConfigValue(config.public.yunlefunCloudbaseEnv),
      persistence,
    )
    if (!auth)
      throw new Error('CloudBase auth is unavailable')

    let nextAccount: YunlefunAccount | null

    if (ssoConfig.sessionMode === 'browser') {
      const adopted = await adoptSsoCode(auth, authorization, ssoConfig.exchange)
      if (!adopted)
        throw new Error('SSO authorization is invalid')

      nextAccount = await readCloudbaseAccount(auth)
    }
    else {
      try {
        const proof = await adoptSsoIdentityProof(auth, authorization, ssoConfig.exchange)
        nextAccount = await createBffSession(proof, ssoConfig)
      }
      finally {
        await auth.signOut().catch(() => undefined)
      }
    }

    if (!nextAccount)
      throw new Error('SSO identity is unavailable')

    account.value = nextAccount
    status.value = 'signed-in'
    lastFailure.value = null
    lastError.value = null
  }

  async function restoreSession(ssoConfig: YunlefunSsoConfig): Promise<boolean> {
    const nextAccount = ssoConfig.sessionMode === 'browser'
      ? await restoreBrowserSession()
      : await restoreBffSession(ssoConfig)

    if (!nextAccount)
      return false

    account.value = nextAccount
    status.value = 'signed-in'
    lastFailure.value = null
    lastError.value = null
    return true
  }

  async function restoreBrowserSession(): Promise<YunlefunAccount | null> {
    const auth = await ensureAuth(
      normalizeConfigValue(config.public.yunlefunCloudbaseEnv),
      'session',
    )

    return auth ? readCloudbaseAccount(auth) : null
  }

  async function restoreBffSession(ssoConfig: YunlefunSsoConfig): Promise<YunlefunAccount | null> {
    if (!ssoConfig.sessionEndpoint)
      return null

    const response = await fetch(ssoConfig.sessionEndpoint, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        accept: 'application/json',
      },
    })

    if (response.status === 401 || response.status === 404)
      return null
    if (!response.ok)
      throw new Error('BFF session lookup failed')

    return readBffAccount(await response.json())
  }

  async function createBffSession(
    proof: SsoIdentityProof,
    ssoConfig: YunlefunSsoConfig,
  ): Promise<YunlefunAccount | null> {
    if (!ssoConfig.sessionEndpoint)
      throw new Error('BFF session endpoint is unavailable')

    const response = await fetch(ssoConfig.sessionEndpoint, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(proof),
    })

    if (!response.ok)
      throw new Error('BFF session creation failed')

    return readBffAccount(await response.json())
  }

  function resolveConfig(): YunlefunSsoConfigResult {
    return resolveYunlefunSsoConfig({
      clientId: config.public.yunlefunSsoClientId,
      exchangeUrl: config.public.yunlefunSsoExchangeUrl,
      redirectUri: config.public.yunlefunSsoRedirectUri,
      scope: config.public.yunlefunSsoScope,
      sessionEndpoint: config.public.yunlefunSsoSessionEndpoint,
      sessionMode: config.public.yunlefunSsoSessionMode,
      ssoOrigin: config.public.yunlefunSsoOrigin,
    }, window.location.origin)
  }

  function resolveConfigOrThrow(): YunlefunSsoConfig {
    const resolved = resolveConfig()

    if (!resolved.ok)
      throw new Error(resolved.message)

    return resolved.config
  }

  function applyFailure(reason: SsoFailureReason): void {
    account.value = null
    lastFailure.value = reason === 'not_authenticated' ? null : reason
    lastError.value = null
    status.value = reason === 'not_authenticated' ? 'signed-out' : 'error'
  }

  return {
    account: readonly(account),
    displayName,
    errorMessage,
    inNativeApp: readonly(inNativeApp),
    initialize,
    isAuthenticated,
    sessionMode,
    signIn,
    signOut,
    status: readonly(status),
  }
}

async function ensureAuth(
  env: string,
  persistence: 'none' | 'session',
): Promise<YunlefunAuthClient | undefined> {
  if (!import.meta.client)
    return undefined
  if (!env)
    throw new Error('Missing NUXT_PUBLIC_YUNLEFUN_CLOUDBASE_ENV.')
  if (cachedAuth) {
    if (cachedPersistence !== persistence)
      throw new Error('CloudBase auth persistence cannot change at runtime.')

    return cachedAuth
  }

  cachedPersistence = persistence
  pendingAuth ??= createAuth(env, persistence)
  cachedAuth = await pendingAuth
  return cachedAuth
}

async function createAuth(
  env: string,
  persistence: 'none' | 'session',
): Promise<YunlefunAuthClient> {
  const app = await ensureCloudbaseApp(env)
  if (!app)
    throw new Error('CloudBase is unavailable outside the browser.')

  return app.auth({ persistence })
}

async function ensureCloudbaseApp(env: string): Promise<YunlefunCloudbaseApp | undefined> {
  if (!import.meta.client)
    return undefined
  if (!env)
    throw new Error('Missing NUXT_PUBLIC_YUNLEFUN_CLOUDBASE_ENV.')
  if (cachedApp)
    return cachedApp

  pendingApp ??= createCloudbaseApp(env)
  cachedApp = await pendingApp
  return cachedApp
}

async function createCloudbaseApp(env: string): Promise<YunlefunCloudbaseApp> {
  const cloudbaseModule = await import('@cloudbase/js-sdk') as unknown as CloudbaseModule
  const cloudbase = cloudbaseModule.default ?? cloudbaseModule
  if (!cloudbase.init)
    throw new Error('@cloudbase/js-sdk does not expose init().')

  return cloudbase.init({ env })
}

async function getLoginState(auth: YunlefunAuthClient): Promise<CloudbaseLoginState | null> {
  try {
    return await auth.getLoginState()
  }
  catch {
    return null
  }
}

async function readCloudbaseAccount(auth: YunlefunAuthClient): Promise<YunlefunAccount | null> {
  const loginState = await getLoginState(auth)
  return normalizeAccount(loginState?.user ?? auth.currentUser)
}

function readBffAccount(payload: unknown): YunlefunAccount | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload))
    return null

  return normalizeAccount((payload as BffSessionResponse).account)
}

function normalizeAccount(user: CloudbaseUser | null | undefined): YunlefunAccount | null {
  const uid = firstNonEmpty([user?.uid, user?.id])
  if (!user || !uid || user.is_anonymous)
    return null

  return {
    uid,
    displayName: firstNonEmpty([
      user.displayName,
      user.name,
      user.nickName,
      user.username,
      user.email,
      uid.slice(0, 8),
    ])!,
    email: firstNonEmpty([user.email]),
    avatarUrl: firstNonEmpty([user.avatarUrl, user.avatar, user.photoURL]),
  }
}

function firstNonEmpty(values: Array<string | undefined>): string | undefined {
  return values.find(value => typeof value === 'string' && value.trim())?.trim()
}

function normalizeConfigValue(value: string | undefined): string {
  return typeof value === 'string' ? value.trim() : ''
}
