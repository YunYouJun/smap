import type { SsoFailureReason } from '@yunlefun/sso'

const failureMessages: Record<SsoFailureReason, string> = {
  closed: '登录窗口已关闭',
  error: '登录失败，请稍后重试',
  invalid_request: '登录请求无效，请刷新后重试',
  not_authenticated: '',
  not_configured: '登录服务尚未配置',
  popup_blocked: '浏览器阻止了登录窗口，请允许弹窗后重试',
  timeout: '登录服务响应超时，请稍后重试',
}

export function formatSsoFailureMessage(reason: SsoFailureReason | null): string {
  return reason ? failureMessages[reason] : ''
}

export function formatUnexpectedAuthError(): string {
  return '登录服务暂时不可用，请稍后重试'
}
