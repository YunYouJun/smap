import type { RedirectSsoOptions, SsoCodeExchangeOptions } from '@yunlefun/sso'
import {
  readSsoClientId,
  readSsoRedirectUri,
  readSsoScope,
} from '@yunlefun/sso'

export interface YunlefunSsoConfigInput {
  clientId?: string
  exchangeUrl?: string
  redirectUri?: string
  scope?: string
  sessionEndpoint?: string
  sessionMode?: string
  ssoOrigin?: string
}

export type YunlefunSsoSessionMode = 'browser' | 'bff'

export interface YunlefunSsoConfig {
  exchange: SsoCodeExchangeOptions
  redirect: RedirectSsoOptions
  sessionEndpoint?: string
  sessionMode: YunlefunSsoSessionMode
}

export type YunlefunSsoConfigResult
  = | { ok: true, config: YunlefunSsoConfig }
    | { ok: false, message: string }

export function resolveYunlefunSsoConfig(
  input: YunlefunSsoConfigInput,
  currentOrigin: string,
): YunlefunSsoConfigResult {
  const clientId = readSsoClientId(input.clientId)
  const scope = readSsoScope(input.scope)
  const redirectUri = readSsoRedirectUri(input.redirectUri)
  const exchangeUrl = readSsoRedirectUri(input.exchangeUrl)
  const sessionMode = readSessionMode(input.sessionMode)
  const ssoOrigin = normalizeHttpsOrigin(input.ssoOrigin)

  if (!clientId || scope.length === 0 || !redirectUri || !exchangeUrl || !sessionMode || !ssoOrigin) {
    return {
      ok: false,
      message: '登录服务尚未完成 SSO v3 配置',
    }
  }

  if (new URL(redirectUri).origin !== currentOrigin) {
    return {
      ok: false,
      message: '当前域名尚未登记为登录回跳地址',
    }
  }

  const sessionEndpoint = sessionMode === 'bff'
    ? normalizeSameOriginEndpoint(input.sessionEndpoint, currentOrigin)
    : undefined

  if (sessionMode === 'bff' && !sessionEndpoint) {
    return {
      ok: false,
      message: 'BFF 会话端点尚未配置',
    }
  }

  return {
    ok: true,
    config: {
      redirect: {
        clientId,
        scope,
        redirectUri,
        ssoOrigin,
      },
      exchange: {
        exchangeUrl,
      },
      sessionMode,
      ...(sessionEndpoint ? { sessionEndpoint } : {}),
    },
  }
}

function readSessionMode(value: string | undefined): YunlefunSsoSessionMode | '' {
  const normalized = value?.trim().toLowerCase()
  return normalized === 'browser' || normalized === 'bff' ? normalized : ''
}

function normalizeSameOriginEndpoint(value: string | undefined, currentOrigin: string): string {
  const normalized = value?.trim() ?? ''

  if (!normalized)
    return ''

  try {
    const url = new URL(normalized, currentOrigin)

    if (url.origin !== currentOrigin || url.hash || url.username || url.password)
      return ''

    return url.toString()
  }
  catch {
    return ''
  }
}

function normalizeHttpsOrigin(value: string | undefined): string {
  const normalized = value?.trim().replace(/\/+$/, '') ?? ''

  if (!normalized)
    return ''

  try {
    const url = new URL(normalized)

    if (url.protocol !== 'https:' || url.username || url.password || url.origin !== normalized)
      return ''

    return url.origin
  }
  catch {
    return ''
  }
}
