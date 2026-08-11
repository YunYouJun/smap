import { describe, expect, it } from 'vitest'
import { translateDomainText } from '../app/i18n/domainMessages'
import { enMessages, messages, zhCNMessages } from '../app/i18n/messages'

describe('smap messages', () => {
  it('keeps locale dictionaries structurally aligned', () => {
    expect(Object.keys(enMessages).sort()).toEqual(Object.keys(zhCNMessages).sort())
  })

  it('exposes both supported static locales', () => {
    expect(Object.keys(messages)).toEqual(['zh-CN', 'en'])
  })

  it('translates static domain labels and units without mutating Chinese copy', () => {
    expect(translateDomainText('火星中继站', 'en')).toBe('Mars Relay')
    expect(translateDomainText('3.7 光时', 'en')).toBe('3.7 light-hours')
    expect(translateDomainText('火星中继站', 'zh-CN')).toBe('火星中继站')
  })
})
