import { describe, expect, it } from 'vitest'
import { formatSsoFailureMessage, formatUnexpectedAuthError } from '../app/utils/authErrors'

describe('authentication error messages', () => {
  it('keeps ordinary unauthenticated state quiet', () => {
    expect(formatSsoFailureMessage(null)).toBe('')
    expect(formatSsoFailureMessage('not_authenticated')).toBe('')
  })

  it('maps technical failure reasons to actionable copy', () => {
    expect(formatSsoFailureMessage('timeout')).toBe('登录服务响应超时，请稍后重试')
    expect(formatSsoFailureMessage('popup_blocked')).toBe('浏览器阻止了登录窗口，请允许弹窗后重试')
    expect(formatSsoFailureMessage('not_configured')).toBe('登录服务尚未配置')
  })

  it('does not expose unexpected exception details', () => {
    expect(formatUnexpectedAuthError()).toBe('登录服务暂时不可用，请稍后重试')
  })
})
