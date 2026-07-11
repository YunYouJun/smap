import type { SsoFailureReason, SsoMode, SsoSetSessionAuth } from '@yunlefun/sso'
import type { ComputedRef, Ref } from 'vue'
import { computed, readonly } from 'vue'
import { useRuntimeConfig, useState } from '#imports'

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
    yunlefunSsoOrigin?: string
  }
}

interface CloudbaseUser {
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

interface YunlefunAuthClient extends SsoSetSessionAuth {
  currentUser?: CloudbaseUser | null
  getLoginState: () => Promise<CloudbaseLoginState | null>
  onLoginStateChanged?: (callback: (state: CloudbaseLoginState | null) => void) => void
  signOut?: () => Promise<unknown>
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
  refresh: () => Promise<void>
  signIn: (mode?: SsoMode) => Promise<boolean>
  signOut: () => Promise<void>
  status: Readonly<Ref<YunlefunAuthStatus>>
  syncSilently: () => Promise<boolean>
}

let cachedApp: YunlefunCloudbaseApp | undefined
let cachedAuth: YunlefunAuthClient | undefined
let pendingApp: Promise<YunlefunCloudbaseApp | undefined> | undefined
let pendingAuth: Promise<YunlefunAuthClient | undefined> | undefined
let loginStateListenerAttached = false

export function useYunlefunAuth(): UseYunlefunAuthReturn {
  const config = useRuntimeConfig() as unknown as YunlefunRuntimeConfig
  const account = useState<YunlefunAccount | null>('yunlefun:auth:account', () => null)
  const status = useState<YunlefunAuthStatus>('yunlefun:auth:status', () => 'idle')
  const lastFailure = useState<SsoFailureReason | null>('yunlefun:auth:last-failure', () => null)
  const lastError = useState<string | null>('yunlefun:auth:last-error', () => null)
  const silentAttempted = useState<boolean>('yunlefun:auth:silent-attempted', () => false)
  const inNativeApp = useState<boolean>('yunlefun:auth:in-native-app', () => false)

  const cloudbaseEnv = computed(() => normalizeConfigValue(config.public.yunlefunCloudbaseEnv))
  const ssoOrigin = computed(() => normalizeConfigValue(config.public.yunlefunSsoOrigin))
  const isAuthenticated = computed(() => Boolean(account.value))
  const displayName = computed(() => account.value?.displayName ?? '')
  const errorMessage = computed(() => lastError.value ?? failureMessage(lastFailure.value))

  async function initialize(): Promise<void> {
    const auth = await ensureAuth(cloudbaseEnv.value)
    if (!auth)
      return

    attachLoginStateListener(auth, syncLoginState)
    await refresh()
  }

  async function refresh(): Promise<void> {
    const auth = await ensureAuth(cloudbaseEnv.value)
    if (!auth)
      return

    const state = await getLoginState(auth)
    syncLoginState(state)
  }

  async function signIn(mode: SsoMode = 'interactive'): Promise<boolean> {
    if (!import.meta.client)
      return false

    const auth = await ensureAuth(cloudbaseEnv.value)
    if (!auth)
      return false

    attachLoginStateListener(auth, syncLoginState)
    status.value = mode === 'interactive' ? 'signing-in' : 'checking'
    lastFailure.value = null
    lastError.value = null

    try {
      const { isInYunleApp, signInWithSso } = await import('@yunlefun/sso')
      inNativeApp.value = isInYunleApp()
      const result = await signInWithSso(auth, {
        mode,
        ...(ssoOrigin.value ? { ssoOrigin: ssoOrigin.value } : {}),
      })

      if (result.ok) {
        await refresh()
        return true
      }

      lastFailure.value = result.reason
      await refresh()
      if (mode === 'interactive' && result.reason !== 'not_authenticated')
        status.value = 'error'
      return false
    }
    catch (error) {
      lastError.value = error instanceof Error ? error.message : String(error)
      status.value = mode === 'interactive' ? 'error' : 'signed-out'
      return false
    }
  }

  async function syncSilently(): Promise<boolean> {
    if (silentAttempted.value || isAuthenticated.value)
      return isAuthenticated.value

    silentAttempted.value = true
    return signIn('silent')
  }

  async function signOut(): Promise<void> {
    const auth = await ensureAuth(cloudbaseEnv.value)
    if (auth?.signOut)
      await auth.signOut()

    account.value = null
    status.value = 'signed-out'
    lastFailure.value = null
    lastError.value = null
    silentAttempted.value = false
  }

  function syncLoginState(state: CloudbaseLoginState | null): void {
    const next = normalizeAccount(state?.user ?? cachedAuth?.currentUser)
    account.value = next
    status.value = next ? 'signed-in' : 'signed-out'
  }

  return {
    account: readonly(account),
    displayName,
    errorMessage,
    inNativeApp: readonly(inNativeApp),
    initialize,
    isAuthenticated,
    refresh,
    signIn,
    signOut,
    status: readonly(status),
    syncSilently,
  }
}

async function ensureAuth(env: string): Promise<YunlefunAuthClient | undefined> {
  if (!import.meta.client)
    return undefined
  if (!env)
    throw new Error('Missing NUXT_PUBLIC_YUNLEFUN_CLOUDBASE_ENV.')
  if (cachedAuth)
    return cachedAuth

  pendingAuth ??= createAuth(env)
  cachedAuth = await pendingAuth
  return cachedAuth
}

async function createAuth(env: string): Promise<YunlefunAuthClient> {
  const app = await ensureCloudbaseApp(env)
  if (!app)
    throw new Error('CloudBase is unavailable outside the browser.')

  return app.auth({ persistence: 'local' })
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

function attachLoginStateListener(
  auth: YunlefunAuthClient,
  syncLoginState: (state: CloudbaseLoginState | null) => void,
): void {
  if (loginStateListenerAttached || !auth.onLoginStateChanged)
    return

  loginStateListenerAttached = true
  auth.onLoginStateChanged((state) => {
    syncLoginState(state)
  })
}

async function getLoginState(auth: YunlefunAuthClient): Promise<CloudbaseLoginState | null> {
  try {
    return await auth.getLoginState()
  }
  catch {
    return null
  }
}

function normalizeAccount(user: CloudbaseUser | null | undefined): YunlefunAccount | null {
  if (!user?.uid || user.is_anonymous)
    return null

  return {
    uid: user.uid,
    displayName: firstNonEmpty([
      user.displayName,
      user.name,
      user.nickName,
      user.username,
      user.email,
      user.uid.slice(0, 8),
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

function failureMessage(reason: SsoFailureReason | null): string {
  if (!reason || reason === 'not_authenticated')
    return ''
  return reason
}
