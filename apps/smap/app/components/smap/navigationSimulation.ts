import type { RouteOption, Waypoint } from './types'

export type NavigationStatus = 'idle' | 'navigating' | 'paused' | 'arrived'
export type NavigationSpeed = 1 | 2 | 4
export type NavigationEventKind = 'departure' | 'waypoint' | 'service' | 'risk' | 'arrival'

export interface NavigationPosition {
  x: number
  y: number
}

export interface NavigationLeg {
  id: string
  index: number
  fromId: string
  fromLabel: string
  fromPosition: NavigationPosition
  toId: string
  toLabel: string
  toPosition: NavigationPosition
  startTick: number
  endTick: number
}

export interface NavigationScheduledEvent {
  id: string
  kind: Exclude<NavigationEventKind, 'departure' | 'arrival'>
  tick: number
  title: string
  detail: string
  waypointId?: string
}

export interface NavigationPlan {
  routeId: string
  routeLabel: string
  totalTicks: number
  legs: NavigationLeg[]
  scheduledEvents: NavigationScheduledEvent[]
}

export interface NavigationEvent extends Omit<NavigationScheduledEvent, 'kind'> {
  kind: NavigationEventKind
  progress: number
}

export interface NavigationSummary {
  routeId: string
  routeLabel: string
  completedEvents: number
  completedLegs: number
}

export interface NavigationSimulationState {
  routeId: string
  status: NavigationStatus
  elapsedTicks: number
  progress: number
  currentLegIndex: number
  events: NavigationEvent[]
  summary?: NavigationSummary
}

export type NavigationAction
  = | { type: 'start' }
    | { type: 'pause' }
    | { type: 'resume' }
    | { type: 'end' }
    | { type: 'tick', amount?: number }

const MIN_ROUTE_TICKS = 12
const TICKS_PER_LIGHT_HOUR = 6

export function createNavigationPlan(route: RouteOption, waypoints: readonly Waypoint[]): NavigationPlan {
  const waypointMap = new Map(waypoints.map(waypoint => [waypoint.id, waypoint]))
  const routeWaypoints = route.path
    .map(id => waypointMap.get(id))
    .filter((waypoint): waypoint is Waypoint => Boolean(waypoint))
  const totalTicks = Math.max(
    MIN_ROUTE_TICKS,
    Math.round(parseRouteDuration(route.duration) * TICKS_PER_LIGHT_HOUR),
    Math.max(1, routeWaypoints.length - 1) * 3,
  )
  const legs = createNavigationLegs(routeWaypoints, totalTicks)
  const scheduledEvents = [
    ...createWaypointEvents(routeWaypoints, legs),
    ...createAlertEvents(route, totalTicks),
  ].sort((a, b) => a.tick - b.tick || a.id.localeCompare(b.id))

  return {
    routeId: route.id,
    routeLabel: `${route.label} · ${route.mode}`,
    totalTicks,
    legs,
    scheduledEvents,
  }
}

export function createNavigationSimulation(plan: NavigationPlan): NavigationSimulationState {
  return {
    routeId: plan.routeId,
    status: 'idle',
    elapsedTicks: 0,
    progress: 0,
    currentLegIndex: 0,
    events: [],
  }
}

export function reduceNavigationSimulation(
  state: NavigationSimulationState,
  plan: NavigationPlan,
  action: NavigationAction,
): NavigationSimulationState {
  const currentState = state.routeId === plan.routeId
    ? state
    : createNavigationSimulation(plan)

  if (action.type === 'start') {
    if (currentState.status !== 'idle' && currentState.status !== 'arrived')
      return currentState

    return {
      ...createNavigationSimulation(plan),
      status: 'navigating',
      events: [
        {
          id: 'departure',
          kind: 'departure',
          tick: 0,
          progress: 0,
          title: '导航已启动',
          detail: plan.legs[0]
            ? `正在前往 ${plan.legs[0].toLabel}`
            : plan.routeLabel,
          waypointId: plan.legs[0]?.fromId,
        },
      ],
    }
  }

  if (action.type === 'pause') {
    return currentState.status === 'navigating'
      ? { ...currentState, status: 'paused' }
      : currentState
  }

  if (action.type === 'resume') {
    return currentState.status === 'paused'
      ? { ...currentState, status: 'navigating' }
      : currentState
  }

  if (action.type === 'end') {
    return currentState.status === 'navigating' || currentState.status === 'paused'
      ? createNavigationSimulation(plan)
      : currentState
  }

  if (currentState.status !== 'navigating')
    return currentState

  const nextElapsedTicks = Math.min(
    plan.totalTicks,
    currentState.elapsedTicks + Math.max(1, action.amount ?? 1),
  )
  const progress = calculateProgress(nextElapsedTicks, plan.totalTicks)
  const scheduledEvents = plan.scheduledEvents
    .filter(event => event.tick > currentState.elapsedTicks && event.tick <= nextElapsedTicks)
    .filter(event => !currentState.events.some(existingEvent => existingEvent.id === event.id))
    .map(event => ({
      ...event,
      progress: calculateProgress(event.tick, plan.totalTicks),
    }))
  const arrived = nextElapsedTicks >= plan.totalTicks
  const events = [...currentState.events, ...scheduledEvents]

  if (arrived) {
    const arrivalEvent: NavigationEvent = {
      id: 'arrival',
      kind: 'arrival',
      tick: plan.totalTicks,
      progress: 100,
      title: '已抵达目的地',
      detail: plan.legs.at(-1)?.toLabel ?? plan.routeLabel,
      waypointId: plan.legs.at(-1)?.toId,
    }
    const completedEvents = events.filter(event => event.kind !== 'departure').length + 1

    return {
      ...currentState,
      status: 'arrived',
      elapsedTicks: nextElapsedTicks,
      progress,
      currentLegIndex: Math.max(0, plan.legs.length - 1),
      events: [...events, arrivalEvent],
      summary: {
        routeId: plan.routeId,
        routeLabel: plan.routeLabel,
        completedEvents,
        completedLegs: plan.legs.length,
      },
    }
  }

  return {
    ...currentState,
    elapsedTicks: nextElapsedTicks,
    progress,
    currentLegIndex: findCurrentLegIndex(plan.legs, nextElapsedTicks),
    events,
    summary: undefined,
  }
}

export function getNavigationPosition(
  state: NavigationSimulationState,
  plan: NavigationPlan,
): NavigationPosition | undefined {
  const leg = plan.legs[state.currentLegIndex]

  if (!leg)
    return undefined

  if (state.status === 'arrived')
    return leg.toPosition

  const legDuration = Math.max(1, leg.endTick - leg.startTick)
  const legProgress = Math.min(1, Math.max(0, (state.elapsedTicks - leg.startTick) / legDuration))

  return {
    x: interpolate(leg.fromPosition.x, leg.toPosition.x, legProgress),
    y: interpolate(leg.fromPosition.y, leg.toPosition.y, legProgress),
  }
}

export function formatRemainingDuration(routeDuration: string, progress: number): string {
  const remaining = parseRouteDuration(routeDuration) * Math.max(0, 1 - progress / 100)

  if (remaining <= 0)
    return '0 光时'

  return `${Math.max(0.1, remaining).toFixed(1).replace(/\.0$/, '')} 光时`
}

export function navigationStatusLabel(status: NavigationStatus): string {
  if (status === 'navigating')
    return '导航中'

  if (status === 'paused')
    return '已暂停'

  if (status === 'arrived')
    return '已抵达'

  return '待启动'
}

function createNavigationLegs(routeWaypoints: readonly Waypoint[], totalTicks: number): NavigationLeg[] {
  const legCount = Math.max(1, routeWaypoints.length - 1)

  return routeWaypoints.slice(0, -1).map((from, index) => {
    const to = routeWaypoints[index + 1]!
    const startTick = Math.round((index / legCount) * totalTicks)
    const endTick = Math.max(startTick + 1, Math.round(((index + 1) / legCount) * totalTicks))

    return {
      id: `${from.id}:${to.id}`,
      index,
      fromId: from.id,
      fromLabel: from.label,
      fromPosition: { x: from.x, y: from.y },
      toId: to.id,
      toLabel: to.label,
      toPosition: { x: to.x, y: to.y },
      startTick,
      endTick,
    }
  })
}

function createWaypointEvents(
  routeWaypoints: readonly Waypoint[],
  legs: readonly NavigationLeg[],
): NavigationScheduledEvent[] {
  return legs.slice(0, -1).map((leg) => {
    const waypoint = routeWaypoints[leg.index + 1]!
    const isService = waypoint.role === 'supply'

    return {
      id: `waypoint:${waypoint.id}`,
      kind: isService ? 'service' : 'waypoint',
      tick: leg.endTick,
      title: isService ? `补给窗口 · ${waypoint.label}` : `通过 ${waypoint.label}`,
      detail: waypoint.note ?? (isService ? '可进行燃料与设备补给' : '航段校准完成'),
      waypointId: waypoint.id,
    }
  })
}

function createAlertEvents(route: RouteOption, totalTicks: number): NavigationScheduledEvent[] {
  return route.alerts.map((alert, index) => {
    const tick = Math.max(
      1,
      Math.min(totalTicks - 1, Math.round(((index + 1) / (route.alerts.length + 1)) * totalTicks)),
    )
    const kind = isServiceAlert(alert) ? 'service' : 'risk'

    return {
      id: `alert:${index}:${alert}`,
      kind,
      tick,
      title: kind === 'service' ? `航行服务 · ${alert}` : `航线提醒 · ${alert}`,
      detail: kind === 'service' ? '已更新补给与燃耗计划' : '导航系统已自动校正航向',
    }
  })
}

function isServiceAlert(alert: string): boolean {
  return /补给|燃耗|换乘|转运/.test(alert)
}

function findCurrentLegIndex(legs: readonly NavigationLeg[], elapsedTicks: number): number {
  const currentIndex = legs.findIndex(leg => elapsedTicks < leg.endTick)
  return currentIndex === -1 ? Math.max(0, legs.length - 1) : currentIndex
}

function calculateProgress(elapsedTicks: number, totalTicks: number): number {
  return Math.min(100, Math.round((elapsedTicks / Math.max(1, totalTicks)) * 100))
}

function parseRouteDuration(duration: string): number {
  const parsed = Number.parseFloat(duration)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function interpolate(from: number, to: number, progress: number): number {
  return Number((from + (to - from) * progress).toFixed(2))
}
