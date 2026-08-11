import type { ComputedRef } from 'vue'
import type { MessageKey, SmapLocale } from '~/i18n/messages'
import { computed, watch } from 'vue'
import { translateDomainText } from '~/i18n/domainMessages'
import { messages } from '~/i18n/messages'

export interface SmapI18n {
  locale: ComputedRef<SmapLocale>
  localeLabel: ComputedRef<string>
  setLocale: (value: SmapLocale) => void
  t: (key: MessageKey, params?: Readonly<Record<string, string | number>>) => string
  td: (value: string) => string
}

const storageKey = 'smap:locale'
let browserSyncInstalled = false

function isSmapLocale(value: unknown): value is SmapLocale {
  return value === 'zh-CN' || value === 'en'
}

function interpolate(message: string, params?: Readonly<Record<string, string | number>>): string {
  if (!params)
    return message

  return message.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key]
    return value === undefined ? match : String(value)
  })
}

export function useSmapI18n(): SmapI18n {
  const locale = useState<SmapLocale>('smap:locale', () => 'zh-CN')

  if (import.meta.client && !browserSyncInstalled) {
    browserSyncInstalled = true

    const storedLocale = localStorage.getItem(storageKey)
    locale.value = isSmapLocale(storedLocale) ? storedLocale : 'zh-CN'

    watch(locale, (value) => {
      localStorage.setItem(storageKey, value)
      document.documentElement.lang = value
    }, { immediate: true })
  }

  const localeLabel = computed(() => locale.value === 'zh-CN' ? '中' : 'EN')

  function setLocale(value: SmapLocale): void {
    locale.value = value
  }

  function t(key: MessageKey, params?: Readonly<Record<string, string | number>>): string {
    return interpolate(messages[locale.value][key], params)
  }

  function td(value: string): string {
    return translateDomainText(value, locale.value)
  }

  return {
    locale: computed(() => locale.value),
    localeLabel,
    setLocale,
    t,
    td,
  }
}
