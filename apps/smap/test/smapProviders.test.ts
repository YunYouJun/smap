import { afterEach, describe, expect, it, vi } from 'vitest'
import { createStaticSmapEphemerisState, loadSmapEphemeris } from '../app/components/smap/smapProviders'

describe('smap ephemeris providers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses static data without making a request when no endpoint is configured', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const state = await loadSmapEphemeris()

    expect(state.status).toBe('static')
    expect(state.sourceLabel).toBe('静态示例')
    expect(state.bodies.length).toBeGreaterThan(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('loads live data from the configured endpoint', async () => {
    const payload = {
      status: 'live',
      source: 'jpl-horizons',
      sourceLabel: '实时星历',
      updatedAt: '2026-07-13T00:00:00.000Z',
      targetDate: '2026-07-13',
      bodies: [],
    }
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload)))
    vi.stubGlobal('fetch', fetchMock)

    const state = await loadSmapEphemeris('https://example.com/horizons')

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/horizons')
    expect(state).toMatchObject(payload)
  })

  it('falls back to static data when the configured endpoint fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })))

    const state = await loadSmapEphemeris('https://example.com/horizons')

    expect(state.status).toBe('error')
    expect(state.source).toBe('static')
    expect(state.sourceLabel).toBe('星历异常')
    expect(state.error).toContain('503')
  })

  it('creates a stable static state for the default deployment', () => {
    const state = createStaticSmapEphemerisState()

    expect(state.status).toBe('static')
    expect(state.source).toBe('static')
    expect(state.error).toBeUndefined()
  })
})
