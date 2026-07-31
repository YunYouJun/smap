import type { RouteOption, Waypoint } from '../app/components/smap/types'
import { describe, expect, it } from 'vitest'
import {
  createNavigationPlan,
  createNavigationSimulation,
  formatRemainingDuration,
  getNavigationPosition,
  navigationStatusLabel,
  reduceNavigationSimulation,
} from '../app/components/smap/navigationSimulation'

const route: RouteOption = {
  id: 'test-route',
  label: '测试路线',
  mode: '智能推荐',
  duration: '2 光时',
  stops: 2,
  risk: 'medium',
  color: '#1677ff',
  path: ['earth', 'supply', 'mars'],
  alerts: ['辐射预警', '补给稳定'],
}

const waypoints: Waypoint[] = [
  {
    id: 'earth',
    label: '地球港',
    shortLabel: '地球',
    role: 'origin',
    x: 0,
    y: 0,
    time: '出发',
  },
  {
    id: 'supply',
    label: '补给站',
    shortLabel: '补给',
    role: 'supply',
    x: 50,
    y: 20,
    time: '1 光时',
    note: '可进行燃料补给',
  },
  {
    id: 'mars',
    label: '火星站',
    shortLabel: '火星',
    role: 'destination',
    x: 100,
    y: 40,
    time: '到达',
  },
]

describe('navigation simulation', () => {
  const plan = createNavigationPlan(route, waypoints)

  it('starts, pauses, resumes and ends without completing a trip', () => {
    let state = createNavigationSimulation(plan)

    state = reduceNavigationSimulation(state, plan, { type: 'start' })
    expect(state.status).toBe('navigating')
    expect(state.events[0]?.kind).toBe('departure')

    state = reduceNavigationSimulation(state, plan, { type: 'tick', amount: 2 })
    const pausedProgress = state.progress
    state = reduceNavigationSimulation(state, plan, { type: 'pause' })
    state = reduceNavigationSimulation(state, plan, { type: 'tick', amount: 4 })
    expect(state.status).toBe('paused')
    expect(state.progress).toBe(pausedProgress)

    state = reduceNavigationSimulation(state, plan, { type: 'resume' })
    expect(state.status).toBe('navigating')

    state = reduceNavigationSimulation(state, plan, { type: 'end' })
    expect(state).toMatchObject({
      status: 'idle',
      progress: 0,
      events: [],
    })
    expect(state.summary).toBeUndefined()
  })

  it('emits route events once and produces an arrival summary', () => {
    let state = reduceNavigationSimulation(
      createNavigationSimulation(plan),
      plan,
      { type: 'start' },
    )

    state = reduceNavigationSimulation(state, plan, { type: 'tick', amount: plan.totalTicks })

    expect(state.status).toBe('arrived')
    expect(state.progress).toBe(100)
    expect(state.events.filter(event => event.kind === 'risk')).toHaveLength(1)
    expect(state.events.filter(event => event.kind === 'service')).toHaveLength(2)
    expect(state.events.filter(event => event.id === 'arrival')).toHaveLength(1)
    expect(state.summary).toEqual({
      routeId: 'test-route',
      routeLabel: '测试路线 · 智能推荐',
      completedEvents: 4,
      completedLegs: 2,
    })
  })

  it('restarts an arrived trip with clean progress and events', () => {
    let state = reduceNavigationSimulation(
      createNavigationSimulation(plan),
      plan,
      { type: 'start' },
    )
    state = reduceNavigationSimulation(state, plan, { type: 'tick', amount: plan.totalTicks })
    state = reduceNavigationSimulation(state, plan, { type: 'start' })

    expect(state.status).toBe('navigating')
    expect(state.progress).toBe(0)
    expect(state.events.map(event => event.id)).toEqual(['departure'])
    expect(state.summary).toBeUndefined()
  })

  it('interpolates the visible ship position along the current leg', () => {
    let state = reduceNavigationSimulation(
      createNavigationSimulation(plan),
      plan,
      { type: 'start' },
    )
    state = reduceNavigationSimulation(state, plan, { type: 'tick', amount: 3 })

    expect(getNavigationPosition(state, plan)).toEqual({ x: 25, y: 10 })
  })

  it('formats status and remaining route duration for the UI', () => {
    expect(navigationStatusLabel('paused')).toBe('已暂停')
    expect(navigationStatusLabel('arrived')).toBe('已抵达')
    expect(formatRemainingDuration('3.7 光时', 50)).toBe('1.9 光时')
    expect(formatRemainingDuration('3.7 光时', 100)).toBe('0 光时')
  })
})
