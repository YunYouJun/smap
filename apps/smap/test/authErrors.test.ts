import { describe, expect, it } from 'vitest'
import { formatSsoFailureMessage, formatUnexpectedAuthError } from '../app/utils/authErrors'

describe('authentication error messages', () => {
  it('keeps ordinary unauthenticated state quiet', () => {
    expect(formatSsoFailureMessage(null)).toBe('')
    expect(formatSsoFailureMessage('not_authenticated')).toBe('')
  })

  it('maps technical failure reasons to actionable copy', () => {
    expect(formatSsoFailureMessage('access_denied')).toBe('登录授权已取消')
    expect(formatSsoFailureMessage('invalid_request')).toBe('登录请求无效，请刷新后重试')
    expect(formatSsoFailureMessage('server_error')).toBe('登录服务响应异常，请稍后重试')
  })

  it('does not expose unexpected exception details', () => {
    expect(formatUnexpectedAuthError()).toBe('登录服务暂时不可用，请稍后重试')
  })
})
