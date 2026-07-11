import type { ComputedRef, Ref } from 'vue'
import type { SmapEphemerisState } from './smapProviders'
import type {
  ExploreSpot,
  HazardZone,
  MapTool,
  MobileService,
  MobileServiceItem,
  ProfileAction,
  RideOption,
  RouteEndpointRole,
  RouteOption,
  RoutePlace,
  TelemetryMetric,
  TravelMode,
  Waypoint,
} from './types'
import { computed, onMounted, readonly, shallowRef } from 'vue'
import {
  createRouteOptions,
  createTravelModes,
  defaultDestinationPlace,
  defaultEnabledMapToolIds,
  defaultOriginPlace,
  exploreSpots,
  hazardZones,
  mapToolLayerIds,
  mapTools,
  mobileServices,
  profileActions,
  rideOptions,
  routePlaces,
  searchRoutePlaces,
  smapClient,
  telemetryMetrics,
  waypoints,
} from './smapData'
import { createStaticSmapEphemerisState, loadSmapEphemeris } from './smapProviders'

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
  activeSearchRole: Readonly<Ref<RouteEndpointRole | null>>
  alternativeRoutePoints: ComputedRef<RouteLine[]>
  destination: ComputedRef<RoutePlace>
  enabledMapToolIds: Readonly<Ref<readonly string[]>>
  ephemerisState: Readonly<Ref<SmapEphemerisState>>
  exploreSpots: ExploreSpot[]
  hazardZones: HazardZone[]
  isNavigating: Readonly<Ref<boolean>>
  isRideRequested: Readonly<Ref<boolean>>
  mapTools: MapTool[]
  mobileServices: MobileServiceItem[]
  origin: ComputedRef<RoutePlace>
  profileActions: ProfileAction[]
  rideOptions: RideOption[]
  routeOptions: Readonly<Ref<RouteOption[]>>
  routeProgress: ComputedRef<number>
  routeSearchQuery: Readonly<Ref<string>>
  routeSearchResults: ComputedRef<RoutePlace[]>
  clearRouteSearch: () => void
  focusRouteSearch: (role: RouteEndpointRole) => void
  resetRouteEndpoint: (role: RouteEndpointRole) => void
  selectMobileService: (service: MobileService) => void
  selectMode: (modeId: string) => void
  selectRideOption: (optionId: string) => void
  selectRoute: (routeId: string) => void
  selectRouteSearchResult: (role: RouteEndpointRole, placeId: string) => void
  selectWaypoint: (waypointId: string) => void
  selectedWaypoint: ComputedRef<Waypoint>
  selectedWaypointId: Readonly<Ref<string>>
  submitRouteSearch: () => void
  swapRouteEndpoints: () => void
  telemetryMetrics: TelemetryMetric[]
  toggleMapTool: (toolId: string) => void
  toggleNavigation: () => void
  toggleRideRequest: () => void
  travelModes: Readonly<Ref<TravelMode[]>>
  updateRouteSearchQuery: (query: string) => void
  waypoints: ComputedRef<Waypoint[]>
  zoomIn: () => void
  zoomLevel: Readonly<Ref<number>>
  zoomOut: () => void
  resetZoom: () => void
}

const initialRouteOptions = createRouteOptions(defaultOriginPlace.waypointId, defaultDestinationPlace.waypointId)
const initialTravelModes = createTravelModes(initialRouteOptions)
const defaultRoute = initialRouteOptions[0]!
const defaultMode = initialTravelModes[0]!
const defaultRideOption = rideOptions[0]!
const defaultWaypoint = waypoints[waypoints.length - 1]!

export function useSmapNavigation(initialService: MobileService = 'navigation'): UseSmapNavigationReturn {
  const routeOptions = shallowRef<RouteOption[]>([...initialRouteOptions])
  const travelModes = shallowRef<TravelMode[]>([...initialTravelModes])
  const activeRouteId = shallowRef(defaultRoute.id)
  const activeModeId = shallowRef(defaultMode.id)
  const activeMobileService = shallowRef<MobileService>(initialService)
  const activeRideOptionId = shallowRef(defaultRideOption.id)
  const originPlaceId = shallowRef(defaultOriginPlace.id)
  const destinationPlaceId = shallowRef(defaultDestinationPlace.id)
  const selectedWaypointId = shallowRef(defaultDestinationPlace.waypointId)
  const activeSearchRole = shallowRef<RouteEndpointRole | null>(null)
  const routeSearchQuery = shallowRef('')
  const zoomLevel = shallowRef(1)
  const isNavigating = shallowRef(false)
  const isRideRequested = shallowRef(false)
  const enabledMapToolIds = shallowRef<string[]>([...defaultEnabledMapToolIds])
  const ephemerisState = shallowRef<SmapEphemerisState>(createStaticSmapEphemerisState())

  const waypointMap = computed(() => new Map(waypoints.map(waypoint => [waypoint.id, waypoint])))
  const routePlaceMap = new Map(routePlaces.map(place => [place.id, place]))

  if (import.meta.client) {
    onMounted(async () => {
      ephemerisState.value = await loadSmapEphemeris()
    })
  }

  const origin = computed<RoutePlace>(() => {
    return routePlaceMap.get(originPlaceId.value) ?? defaultOriginPlace
  })

  const destination = computed<RoutePlace>(() => {
    return routePlaceMap.get(destinationPlaceId.value) ?? defaultDestinationPlace
  })

  const displayWaypoints = computed<Waypoint[]>(() => {
    return waypoints.map((waypoint) => {
      if (waypoint.id === origin.value.waypointId)
        return { ...waypoint, role: 'origin' as const }

      if (waypoint.id === destination.value.waypointId)
        return { ...waypoint, role: 'destination' as const }

      if (waypoint.role === 'origin' || waypoint.role === 'destination')
        return { ...waypoint, role: 'transfer' as const }

      return waypoint
    })
  })

  const routeSearchResults = computed(() => searchRoutePlaces(routeSearchQuery.value))

  const activeRoute = computed<RouteOption>(() => {
    return routeOptions.value.find(route => route.id === activeRouteId.value) || routeOptions.value[0] || defaultRoute
  })

  const activeMode = computed<TravelMode>(() => {
    return travelModes.value.find(mode => mode.id === activeModeId.value) || travelModes.value[0] || defaultMode
  })

  const activeRideOption = computed<RideOption>(() => {
    return rideOptions.find(option => option.id === activeRideOptionId.value) || defaultRideOption
  })

  const selectedWaypoint = computed<Waypoint>(() => {
    return waypointMap.value.get(selectedWaypointId.value) || defaultWaypoint
  })

  const activeRouteWaypoints = computed<Waypoint[]>(() => {
    return activeRoute.value.path
      .map(id => waypointMap.value.get(id))
      .filter(isWaypoint)
      .map((waypoint, index, routeWaypoints) => {
        if (index === 0)
          return { ...waypoint, role: 'origin' as const }

        if (index === routeWaypoints.length - 1)
          return { ...waypoint, role: 'destination' as const }

        if (waypoint.role === 'origin' || waypoint.role === 'destination')
          return { ...waypoint, role: 'transfer' as const }

        return waypoint
      })
  })

  const activeRoutePoints = computed(() => {
    return activeRouteWaypoints.value
      .map(waypoint => `${waypoint.x},${waypoint.y}`)
      .join(' ')
  })

  const alternativeRoutePoints = computed(() => {
    return routeOptions.value
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

  function replaceRouteOptions(nextRoutes: RouteOption[]): void {
    const fallbackRoutes = nextRoutes.length > 0 ? nextRoutes : [...initialRouteOptions]
    const nextModes = createTravelModes(fallbackRoutes)
    const nextRoute = fallbackRoutes[0]!

    routeOptions.value = fallbackRoutes
    travelModes.value = nextModes
    activeRouteId.value = nextRoute.id
    activeModeId.value = nextModes[0]?.id ?? nextRoute.id
  }

  function replanRoute(): void {
    replaceRouteOptions(createRouteOptions(origin.value.waypointId, destination.value.waypointId))
    selectedWaypointId.value = destination.value.waypointId
    isNavigating.value = false
  }

  function oppositeRole(role: RouteEndpointRole): RouteEndpointRole {
    return role === 'origin' ? 'destination' : 'origin'
  }

  function setEndpoint(role: RouteEndpointRole, place: RoutePlace): void {
    const oppositeEndpoint = role === 'origin' ? destination.value : origin.value

    if (place.waypointId === oppositeEndpoint.waypointId) {
      if (role === 'origin')
        destinationPlaceId.value = originPlaceId.value
      else
        originPlaceId.value = destinationPlaceId.value
    }

    if (role === 'origin')
      originPlaceId.value = place.id
    else
      destinationPlaceId.value = place.id

    activeMobileService.value = 'navigation'
    replanRoute()
  }

  function selectRoute(routeId: string): void {
    const route = routeOptions.value.find(item => item.id === routeId)

    if (!route)
      return

    activeRouteId.value = route.id
    activeModeId.value = route.id
    smapClient.selectRoute(route.id)
  }

  function selectMobileService(service: MobileService): void {
    activeMobileService.value = service
  }

  function selectMode(modeId: string): void {
    const mode = travelModes.value.find(item => item.id === modeId)

    if (!mode)
      return

    activeModeId.value = mode.id

    if (routeOptions.value.some(route => route.id === mode.id))
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

  function focusRouteSearch(role: RouteEndpointRole): void {
    activeSearchRole.value = role
    routeSearchQuery.value = role === 'origin' ? origin.value.label : destination.value.label
  }

  function updateRouteSearchQuery(query: string): void {
    routeSearchQuery.value = query
  }

  function clearRouteSearch(): void {
    activeSearchRole.value = null
    routeSearchQuery.value = ''
  }

  function selectRouteSearchResult(role: RouteEndpointRole, placeId: string): void {
    const place = routePlaceMap.get(placeId)

    if (!place)
      return

    setEndpoint(role, place)
    clearRouteSearch()
  }

  function submitRouteSearch(): void {
    const role = activeSearchRole.value ?? 'destination'
    const [firstResult] = routeSearchResults.value

    if (firstResult)
      selectRouteSearchResult(role, firstResult.id)
  }

  function resetRouteEndpoint(role: RouteEndpointRole): void {
    setEndpoint(role, role === 'origin' ? defaultOriginPlace : defaultDestinationPlace)
  }

  function swapRouteEndpoints(): void {
    const nextOriginPlaceId = destinationPlaceId.value
    const nextDestinationPlaceId = originPlaceId.value

    originPlaceId.value = nextOriginPlaceId
    destinationPlaceId.value = nextDestinationPlaceId
    activeSearchRole.value = activeSearchRole.value ? oppositeRole(activeSearchRole.value) : null
    replanRoute()
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

  function toggleMapTool(toolId: string): void {
    const sdkLayerId = mapToolLayerIds.get(toolId)

    if (!sdkLayerId)
      return

    const shouldEnable = !enabledMapToolIds.value.includes(toolId)
    const layer = smapClient.setLayerVisible(sdkLayerId, shouldEnable)

    if (!layer)
      return

    enabledMapToolIds.value = shouldEnable
      ? [...enabledMapToolIds.value, toolId]
      : enabledMapToolIds.value.filter(id => id !== toolId)
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
    activeSearchRole: readonly(activeSearchRole),
    alternativeRoutePoints,
    destination,
    enabledMapToolIds: readonly(enabledMapToolIds),
    ephemerisState: readonly(ephemerisState),
    exploreSpots,
    hazardZones,
    isNavigating: readonly(isNavigating),
    isRideRequested: readonly(isRideRequested),
    mapTools,
    mobileServices,
    origin,
    profileActions,
    rideOptions,
    routeOptions,
    routeProgress,
    routeSearchQuery: readonly(routeSearchQuery),
    routeSearchResults,
    clearRouteSearch,
    focusRouteSearch,
    resetRouteEndpoint,
    selectMobileService,
    selectMode,
    selectRideOption,
    selectRoute,
    selectRouteSearchResult,
    selectWaypoint,
    selectedWaypoint,
    selectedWaypointId: readonly(selectedWaypointId),
    submitRouteSearch,
    swapRouteEndpoints,
    telemetryMetrics,
    toggleMapTool,
    toggleNavigation,
    toggleRideRequest,
    travelModes,
    updateRouteSearchQuery,
    waypoints: displayWaypoints,
    zoomIn,
    zoomLevel: readonly(zoomLevel),
    zoomOut,
    resetZoom,
  }
}
