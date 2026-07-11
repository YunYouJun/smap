import type { DefaultTheme } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { getVitepressConfig } from '@yunyoujun/docs'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { version } from '../../../package.json'
import typedocSidebar from '../../api/typedoc-sidebar.json'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'SMAP 星际导航', link: '/' },
  { text: '什么是 SMAP？', link: '/guide/what-is' },
  { text: '快速开始', link: '/guide/getting-started' },
  { text: '配置与部署', link: '/guide/configuration' },
]

const DESIGN: DefaultTheme.NavItemWithLink[] = [
  { text: '设计沉淀', link: '/design/' },
]

const VERSIONS: (DefaultTheme.NavItemWithLink | DefaultTheme.NavItemChildren)[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `Release Notes`, link: 'https://github.com/YunYouJun/smap/releases' },
  { text: `Changelog`, link: '/changelog' },
]

const vpConfig = getVitepressConfig({
  repo: 'https://github.com/YunYouJun/smap',
})

export default defineConfig({
  ...vpConfig,

  title: 'SMAP',
  description: '星际导航地图应用原型',
  markdown: {
    codeTransformers: [
      transformerTwoslash(),
    ],
    languages: ['js', 'jsx', 'ts', 'tsx'],
    config: (md) => {
      md.use(groupIconMdPlugin)
    },
  },
  cleanUrls: true,

  themeConfig: {
    ...vpConfig.themeConfig,

    search: {
      provider: 'local',
    },

    nav: [
      {
        text: '星际导航',
        link: '/',
      },
      {
        text: '文档',
        items: [
          {
            items: GUIDES,
          },
        ],
      },
      {
        text: '设计',
        items: DESIGN,
      },
      {
        text: 'API',
        link: '/api/',
      },
      {
        text: `v${version}`,
        items: VERSIONS,
      },
    ],
    sidebar: {
      '/': [
        {
          text: '文档',
          items: GUIDES,
        },
        {
          text: '设计',
          items: DESIGN,
        },
      ],
      '/api/': typedocSidebar,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/YunYouJun/smap' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-PRESENT YunYouJun.',
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'YunYouJun' }],
    ['meta', { property: 'og:title', content: 'SMAP 星际导航' }],
    ['meta', { property: 'og:description', content: '星际导航地图应用原型' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
})
