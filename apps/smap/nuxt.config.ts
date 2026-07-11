import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

const smapSdkSource = fileURLToPath(new URL('../../packages/smap-sdk/src/index.ts', import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2026-07-06',
  srcDir: 'app',
  ssr: false,
  devtools: { enabled: false },

  modules: ['@nuxtjs/ionic'],

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
      yunlefunCloudbaseEnv: process.env.NUXT_PUBLIC_YUNLEFUN_CLOUDBASE_ENV || 'yunlefun-8g7ybcxc7345c490',
      yunlefunSsoOrigin: process.env.NUXT_PUBLIC_YUNLEFUN_SSO_ORIGIN || 'https://www.yunle.fun',
    },
  },

  vite: {
    resolve: {
      alias: {
        '@yunyoujun/smap-sdk': smapSdkSource,
      },
    },
    optimizeDeps: {
      include: [
        '@cloudbase/js-sdk',
        '@yunlefun/sso',
      ],
    },
  },
})
