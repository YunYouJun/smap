import type { RideOption } from '../app/components/smap/types'
import { describe, expect, it } from 'vitest'
import { formatRideCtaDetail, formatRideCtaLabel } from '../app/components/smap/ridePresentation'

const rideOption: RideOption = {
  id: 'test-ride',
  label: '测试快船',
  description: '测试车型',
  eta: '3 分钟接驾',
  duration: '1 小时送达',
  price: '100 星币',
  vehicle: 'orbital',
}

describe('ride presentation', () => {
  it('formats the initial request action', () => {
    expect(formatRideCtaLabel(rideOption, false)).toBe('呼叫测试快船')
    expect(formatRideCtaDetail(rideOption, false, '地球轨道港')).toBe('3 分钟接驾 · 1 小时送达')
  })

  it('formats the accepted request state', () => {
    expect(formatRideCtaLabel(rideOption, true)).toBe('测试快船已响应')
    expect(formatRideCtaDetail(rideOption, true, '地球轨道港')).toBe('3 分钟接驾 · 前往地球轨道港')
  })
})
