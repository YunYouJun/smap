import type { ComputedRef, Ref } from 'vue'
import type { HazardZone, MobileService, RideOption, RouteOption, TelemetryMetric, TravelMode, Waypoint } from './types'
import { computed, readonly, shallowRef } from 'vue'
import { hazardZones, rideOptions, routeOptions, telemetryMetrics, travelModes, waypoints } from './smapData'

function isWaypoint(waypoint: Waypoint | undefined): waypoint is Waypoint {
  return Boolean(waypoint)
}

interface RouteLine {
  id: string
  color: string
  points: string
}

interface UseSmapNavigationReturn {
  activeMobileService: Readonly<Ref<MobileService>>
  activeMode: ComputedRef<TravelMode>
  activeModeId: Readonly<Ref<string>>
  activeRideOption: ComputedRef<RideOption>
  activeRideOptionId: Readonly<Ref<string>>
  activeRoute: ComputedRef<RouteOption>
  activeRouteId: Readonly<Ref<string>>
  activeRoutePoints: ComputedRef<string>
  activeRouteWaypoints: ComputedRef<Waypoint[]>
  alternativeRoutePoints: ComputedRef<RouteLine[]>
  hazardZones: HazardZone[]
  isNavigating: Readonly<Ref<boolean>>
  isRideRequested: Readonly<Ref<boolean>>
  rideOptions: RideOption[]
  routeOptions: RouteOption[]
  routeProgress: ComputedRef<number>
  selectMobileService: (service: MobileService) => void
  selectMode: (modeId: string) => void
  selectRideOption: (optionId: string) => void
  selectRoute: (routeId: string) => void
  selectWaypoint: (waypointId: string) => void
  selectedWaypoint: ComputedRef<Waypoint>
  selectedWaypointId: Readonly<Ref<string>>
  telemetryMetrics: TelemetryMetric[]
  toggleNavigation: () => void
  toggleRideRequest: () => void
  travelModes: TravelMode[]
  waypoints: Waypoint[]
  zoomIn: () => void
  zoomLevel: Readonly<Ref<number>>
  zoomOut: () => void
  resetZoom: () => void
}

const defaultRoute = routeOptions[0]!
const defaultMode = travelModes[0]!
const defaultRideOption = rideOptions[0]!
const defaultWaypoint = waypoints[waypoints.length - 1]!

export function useSmapNavigation(): UseSmapNavigationReturn {
  const activeRouteId = shallowRef(defaultRoute.id)
  const activeModeId = shallowRef(defaultMode.id)
  const activeMobileService = shallowRef<MobileService>('navigation')
  const activeRideOptionId = shallowRef(defaultRideOption.id)
  const selectedWaypointId = shallowRef('mars-relay')
  const zoomLevel = shallowRef(1)
  const isNavigating = shallowRef(false)
  const isRideRequested = shallowRef(false)

  const waypointMap = computed(() => new Map(waypoints.map(waypoint => [waypoint.id, waypoint])))

  const activeRoute = computed<RouteOption>(() => {
    return routeOptions.find(route => route.id === activeRouteId.value) || defaultRoute
  })

  const activeMode = computed<TravelMode>(() => {
    return travelModes.find(mode => mode.id === activeModeId.value) || defaultMode
  })

  const activeRideOption = computed<RideOption>(() => {
    return rideOptions.find(option => option.id === activeRideOptionId.value) || defaultRideOption
  })

  const selectedWaypoint = computed<Waypoint>(() => {
    return waypointMap.value.get(selectedWaypointId.value) || defaultWaypoint
  })

  const activeRouteWaypoints = computed(() => {
    return activeRoute.value.path
      .map(id => waypointMap.value.get(id))
      .filter(isWaypoint)
  })

  const activeRoutePoints = computed(() => {
    return activeRouteWaypoints.value
      .map(waypoint => `${waypoint.x},${waypoint.y}`)
      .join(' ')
  })

  const alternativeRoutePoints = computed(() => {
    return routeOptions
      .filter(route => route.id !== activeRouteId.value)
      .map((route) => {
        const points = route.path
          .map(id => waypointMap.value.get(id))
          .filter(isWaypoint)
          .map(waypoint => `${waypoint.x},${waypoint.y}`)
          .join(' ')

        return {
          id: route.id,
          color: route.color,
          points,
        }
      })
  })

  const routeProgress = computed(() => Math.min(100, Math.round((activeRoute.value.stops / 18) * 100)))

  function selectRoute(routeId: string): void {
    const route = routeOptions.find(item => item.id === routeId)

    if (!route)
      return

    activeRouteId.value = route.id
    activeModeId.value = route.id
  }

  function selectMobileService(service: MobileService): void {
    activeMobileService.value = service
  }

  function selectMode(modeId: string): void {
    const mode = travelModes.find(item => item.id === modeId)

    if (!mode)
      return

    activeModeId.value = mode.id

    if (routeOptions.some(route => route.id === mode.id))
      activeRouteId.value = mode.id
  }

  function selectRideOption(optionId: string): void {
    const option = rideOptions.find(item => item.id === optionId)

    if (!option)
      return

    activeRideOptionId.value = option.id
    isRideRequested.value = false
  }

  function selectWaypoint(waypointId: string): void {
    if (waypoints.some(waypoint => waypoint.id === waypointId))
      selectedWaypointId.value = waypointId
  }

  function zoomIn(): void {
    zoomLevel.value = Math.min(1.28, Number((zoomLevel.value + 0.08).toFixed(2)))
  }

  function zoomOut(): void {
    zoomLevel.value = Math.max(0.84, Number((zoomLevel.value - 0.08).toFixed(2)))
  }

  function resetZoom(): void {
    zoomLevel.value = 1
  }

  function toggleNavigation(): void {
    isNavigating.value = !isNavigating.value
  }

  function toggleRideRequest(): void {
    isRideRequested.value = !isRideRequested.value
  }

  return {
    activeMobileService: readonly(activeMobileService),
    activeMode,
    activeModeId: readonly(activeModeId),
    activeRideOption,
    activeRideOptionId: readonly(activeRideOptionId),
    activeRoute,
    activeRouteId: readonly(activeRouteId),
    activeRoutePoints,
    activeRouteWaypoints,
    alternativeRoutePoints,
    hazardZones,
    isNavigating: readonly(isNavigating),
    isRideRequested: readonly(isRideRequested),
    rideOptions,
    routeOptions,
    routeProgress,
    selectMobileService,
    selectMode,
    selectRideOption,
    selectRoute,
    selectWaypoint,
    selectedWaypoint,
    selectedWaypointId: readonly(selectedWaypointId),
    telemetryMetrics,
    toggleNavigation,
    toggleRideRequest,
    travelModes,
    waypoints,
    zoomIn,
    zoomLevel: readonly(zoomLevel),
    zoomOut,
    resetZoom,
  }
}
