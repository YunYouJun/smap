import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

const smapSdkSource = fileURLToPath(new URL('../../packages/smap-sdk/src/index.ts', import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2026-07-06',
  srcDir: 'app',
  ssr: false,
  devtools: { enabled: false },

  css: ['~/assets/styles/smap.css'],

  nitro: {
    output: {
      publicDir: 'dist',
    },
  },

  app: {
    head: {
      title: 'SMAP 星际导航',
      meta: [
        { name: 'description', content: 'Interstellar navigation map with YunLeFun account integration.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      smapEphemerisApi: process.env.NUXT_PUBLIC_SMAP_EPHEMERIS_API || '',
      yunlefunCloudbaseEnv: process.env.NUXT_PUBLIC_YUNLEFUN_CLOUDBASE_ENV || 'yunlefun-8g7ybcxc7345c490',
      yunlefunSsoClientId: process.env.NUXT_PUBLIC_YUNLEFUN_SSO_CLIENT_ID || 'smap-web',
      yunlefunSsoExchangeUrl: process.env.NUXT_PUBLIC_YUNLEFUN_SSO_EXCHANGE_URL || 'https://api.yunle.fun/sso-ticket',
      yunlefunSsoOrigin: process.env.NUXT_PUBLIC_YUNLEFUN_SSO_ORIGIN || 'https://www.yunle.fun',
      yunlefunSsoRedirectUri: process.env.NUXT_PUBLIC_YUNLEFUN_SSO_REDIRECT_URI || 'https://smap.yunle.fun/tabs/profile',
      yunlefunSsoScope: process.env.NUXT_PUBLIC_YUNLEFUN_SSO_SCOPE || 'identity:bootstrap',
      yunlefunSsoSessionEndpoint: process.env.NUXT_PUBLIC_YUNLEFUN_SSO_SESSION_ENDPOINT || '/api/session',
      yunlefunSsoSessionMode: process.env.NUXT_PUBLIC_YUNLEFUN_SSO_SESSION_MODE || 'browser',
    },
  },

  vite: {
    build: {
      // CloudBase auth is isolated in a lazy chunk; the map entry stays well below this limit.
      chunkSizeWarningLimit: 800,
    },
    resolve: {
      alias: {
        '@yunyoujun/smap-sdk': smapSdkSource,
      },
    },
    optimizeDeps: {
      include: [
        '@cloudbase/js-sdk',
        '@yunlefun/sso',
        '@yunlefun/sso/browser',
      ],
    },
  },
})
