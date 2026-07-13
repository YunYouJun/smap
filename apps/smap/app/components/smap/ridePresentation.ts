import type { RideOption } from './types'

export function formatRideCtaLabel(option: RideOption, isRequested: boolean): string {
  if (isRequested)
    return `${option.label}已响应`

  return `呼叫${option.label}`
}

export function formatRideCtaDetail(
  option: RideOption,
  isRequested: boolean,
  originLabel: string,
): string {
  if (isRequested)
    return `${option.eta} · 前往${originLabel}`

  return `${option.eta} · ${option.duration}`
}
