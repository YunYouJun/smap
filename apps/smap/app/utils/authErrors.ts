import type { SsoFailureReason } from '@yunlefun/sso'

const failureMessages: Record<SsoFailureReason, string> = {
  access_denied: '登录授权已取消',
  invalid_request: '登录请求无效，请刷新后重试',
  not_authenticated: '',
  server_error: '登录服务响应异常，请稍后重试',
}

export function formatSsoFailureMessage(reason: SsoFailureReason | null): string {
  return reason ? failureMessages[reason] : ''
}

export function formatUnexpectedAuthError(): string {
  return '登录服务暂时不可用，请稍后重试'
}
