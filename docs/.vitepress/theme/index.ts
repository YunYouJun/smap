// https://vitepress.dev/guide/custom-theme
import type { EnhanceAppContext } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import { Content, useData } from 'vitepress'
import Theme from 'vitepress/theme'
import { h } from 'vue'

import '@shikijs/vitepress-twoslash/style.css'
import 'uno.css'
import './style.css'
import 'virtual:group-icons.css'

// @unocss-include

export default {
  extends: Theme,
  Layout() {
    const { frontmatter } = useData()

    if (frontmatter.value.layout === 'smap')
      return h(Content)

    return h(Theme.Layout)
  },
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue)
  },
}
