import { describe, expect, it } from 'vitest'
import { resolveYunlefunSsoConfig } from '../app/utils/yunlefunSsoConfig'

const validConfig = {
  clientId: 'smap-web',
  exchangeUrl: 'https://api.yunle.fun/sso-ticket',
  redirectUri: 'https://smap.yunle.fun/tabs/profile',
  scope: 'identity:bootstrap',
  sessionMode: 'browser',
  ssoOrigin: 'https://www.yunle.fun',
}

describe('resolveYunlefunSsoConfig', () => {
  it('normalizes a registered SSO v3 configuration', () => {
    expect(resolveYunlefunSsoConfig(validConfig, 'https://smap.yunle.fun')).toEqual({
      ok: true,
      config: {
        redirect: {
          clientId: 'smap-web',
          redirectUri: 'https://smap.yunle.fun/tabs/profile',
          scope: ['identity:bootstrap'],
          ssoOrigin: 'https://www.yunle.fun',
        },
        exchange: {
          exchangeUrl: 'https://api.yunle.fun/sso-ticket',
        },
        sessionMode: 'browser',
      },
    })
  })

  it('requires a same-origin session endpoint in BFF mode', () => {
    expect(resolveYunlefunSsoConfig({
      ...validConfig,
      sessionEndpoint: '/api/session',
      sessionMode: 'bff',
    }, 'https://smap.yunle.fun')).toEqual({
      ok: true,
      config: {
        redirect: {
          clientId: 'smap-web',
          redirectUri: 'https://smap.yunle.fun/tabs/profile',
          scope: ['identity:bootstrap'],
          ssoOrigin: 'https://www.yunle.fun',
        },
        exchange: {
          exchangeUrl: 'https://api.yunle.fun/sso-ticket',
        },
        sessionEndpoint: 'https://smap.yunle.fun/api/session',
        sessionMode: 'bff',
      },
    })

    expect(resolveYunlefunSsoConfig({
      ...validConfig,
      sessionEndpoint: 'https://other.example/api/session',
      sessionMode: 'bff',
    }, 'https://smap.yunle.fun')).toEqual({
      ok: false,
      message: 'BFF 会话端点尚未配置',
    })
  })

  it('rejects a redirect registered for another origin', () => {
    expect(resolveYunlefunSsoConfig(validConfig, 'http://127.0.0.1:4173')).toEqual({
      ok: false,
      message: '当前域名尚未登记为登录回跳地址',
    })
  })

  it('rejects invalid client, scope and HTTPS endpoint values', () => {
    expect(resolveYunlefunSsoConfig({
      ...validConfig,
      clientId: 'SMAP',
      exchangeUrl: 'http://api.yunle.fun/sso-ticket',
      scope: 'identity:*',
    }, 'https://smap.yunle.fun')).toEqual({
      ok: false,
      message: '登录服务尚未完成 SSO v3 配置',
    })
  })
})
