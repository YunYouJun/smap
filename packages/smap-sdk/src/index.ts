/**
 * Risk level used by route planning and route cards.
 */
export type SmapRiskLevel = 'low' | 'medium' | 'high'

/**
 * Route ranking strategy requested by an SDK consumer.
 */
export type SmapRouteStrategy = 'fastest' | 'safest' | 'economy'

/**
 * Semantic role for a waypoint on a map or route.
 */
export type SmapWaypointRole = 'origin' | 'destination' | 'transfer' | 'supply' | 'station'

/**
 * Built-in map layer categories exposed by the SDK.
 */
export type SmapLayerKind = 'traffic' | 'terrain' | 'safety' | 'favorite' | 'poi'

/**
 * Coordinate in a logical SMAP map coordinate system.
 */
export interface SmapCoordinate {
  x: number
  y: number
  z?: number
  system?: string
}

/**
 * A navigable point on the SMAP map.
 */
export interface SmapWaypoint {
  id: string
  label: string
  coordinate: SmapCoordinate
  role?: SmapWaypointRole
  description?: string
  metadata?: Readonly<Record<string, unknown>>
}

/**
 * A route option between two or more waypoints.
 */
export interface SmapRoute {
  id: string
  label: string
  waypointIds: readonly string[]
  distance: number
  duration: number
  strategy?: SmapRouteStrategy
  risk: SmapRiskLevel
  color?: string
  alerts?: readonly string[]
  metadata?: Readonly<Record<string, unknown>>
}

/**
 * Point of interest shown around the current route or viewport.
 */
export interface SmapPoi {
  id: string
  label: string
  category: string
  coordinate: SmapCoordinate
  waypointId?: string
  description?: string
  tags?: readonly string[]
  metadata?: Readonly<Record<string, unknown>>
}

/**
 * Toggleable map layer state.
 */
export interface SmapLayer {
  id: string
  label: string
  kind: SmapLayerKind
  visible: boolean
  description?: string
}

/**
 * Input for route planning.
 */
export interface SmapRoutePlanRequest {
  originId: string
  destinationId: string
  strategy?: SmapRouteStrategy
  limit?: number
}

/**
 * Route planning output with a recommended route and alternatives.
 */
export interface SmapRoutePlanResult {
  request: SmapRoutePlanRequest
  recommended: SmapRoute
  alternatives: readonly SmapRoute[]
}

/**
 * POI search filters.
 */
export interface SmapPoiSearchRequest {
  query?: string
  category?: string
  tag?: string
  limit?: number
}

/**
 * Data source contract used to integrate third-party map data.
 */
export interface SmapDataSource {
  listWaypoints: () => readonly SmapWaypoint[]
  listRoutes: () => readonly SmapRoute[]
  listPois: () => readonly SmapPoi[]
  listLayers: () => readonly SmapLayer[]
}

/**
 * Data provider runtime status.
 */
export type SmapDataProviderStatus = 'static' | 'live' | 'error'

/**
 * Runtime context passed to a SMAP data provider.
 */
export interface SmapDataProviderContext {
  now?: Date
}

/**
 * Data snapshot returned by a static or remote SMAP data provider.
 */
export interface SmapDataProviderSnapshot {
  source: string
  label: string
  status: SmapDataProviderStatus
  updatedAt: string
  dataSource: SmapDataSource
  metadata?: Readonly<Record<string, unknown>>
}

/**
 * Async-capable data provider used to bridge static fallback data and remote feeds.
 */
export interface SmapDataProvider {
  id: string
  label: string
  getSnapshot: (context?: SmapDataProviderContext) => SmapDataProviderSnapshot | Promise<SmapDataProviderSnapshot>
}

/**
 * Typed SDK event payloads.
 */
export interface SmapEventMap {
  'route:planned': SmapRoutePlanResult
  'route:selected': SmapRoute
  'layer:changed': SmapLayer
  'poi:selected': SmapPoi
}

/**
 * Supported event names.
 */
export type SmapEventName = keyof SmapEventMap

/**
 * Typed event handler for a given SDK event.
 */
export type SmapEventHandler<EventName extends SmapEventName> = (payload: SmapEventMap[EventName]) => void

/**
 * Plugin hook for third-party SDK extensions.
 */
export interface SmapPlugin {
  name: string
  setup: (client: SmapClient) => void
}

/**
 * Main SDK client used by applications and integrations.
 */
export interface SmapClient {
  getWaypoints: () => readonly SmapWaypoint[]
  getRoutes: () => readonly SmapRoute[]
  getLayers: () => readonly SmapLayer[]
  getSelectedRoute: () => SmapRoute | undefined
  searchPois: (request?: SmapPoiSearchRequest) => readonly SmapPoi[]
  selectPoi: (poiId: string) => SmapPoi | undefined
  planRoute: (request: SmapRoutePlanRequest) => SmapRoutePlanResult
  selectRoute: (routeId: string) => SmapRoute | undefined
  setLayerVisible: (layerId: string, visible: boolean) => SmapLayer | undefined
  use: (plugin: SmapPlugin) => SmapClient
  on: <EventName extends SmapEventName>(
    eventName: EventName,
    handler: SmapEventHandler<EventName>,
  ) => () => void
  off: <EventName extends SmapEventName>(
    eventName: EventName,
    handler: SmapEventHandler<EventName>,
  ) => void
}

/**
 * Options for creating an SDK client.
 */
export interface SmapClientOptions {
  dataSource?: SmapDataSource
}

/**
 * Input used by the default in-memory data source.
 */
export interface MemorySmapDataSourceInput {
  waypoints?: readonly SmapWaypoint[]
  routes?: readonly SmapRoute[]
  pois?: readonly SmapPoi[]
  layers?: readonly SmapLayer[]
}

/**
 * Options for creating a static SMAP data provider.
 */
export interface StaticSmapDataProviderOptions {
  id?: string
  label?: string
  source?: string
  metadata?: Readonly<Record<string, unknown>>
}

/**
 * Default demo waypoints used when no custom data source is provided.
 */
export const defaultSmapWaypoints: readonly SmapWaypoint[] = [
  {
    id: 'sun-observatory',
    label: '太阳日冕观测站',
    role: 'station',
    coordinate: { x: 82, y: 340, system: 'solar' },
    description: '太阳近旁科研与航线校准站',
    metadata: { scale: 'solar-system', body: 'Sun' },
  },
  {
    id: 'mercury-relay',
    label: '水星近日中继',
    role: 'transfer',
    coordinate: { x: 108, y: 372, system: 'solar' },
    description: '内太阳系高速中继点',
    metadata: { scale: 'solar-system', body: 'Mercury' },
  },
  {
    id: 'venus-orbit',
    label: '金星云顶轨道',
    role: 'station',
    coordinate: { x: 128, y: 444, system: 'solar' },
    description: '金星高层大气补给窗口',
    metadata: { scale: 'solar-system', body: 'Venus' },
  },
  {
    id: 'earth-port',
    label: '地球轨道港',
    role: 'origin',
    coordinate: { x: 146, y: 405, system: 'solar' },
    description: '地球同步轨道主出发港',
    metadata: { scale: 'solar-system', body: 'Earth' },
  },
  {
    id: 'moon-gateway',
    label: '月球门户站',
    role: 'station',
    coordinate: { x: 174, y: 390, system: 'solar' },
    description: '地月转运与深空发射门户',
    metadata: { scale: 'solar-system', body: 'Moon' },
  },
  {
    id: 'sirius-jump',
    label: '天狼跃迁点',
    role: 'transfer',
    coordinate: { x: 505, y: 178, system: 'milky-way' },
    description: '本地泡到猎户臂的高亮星际跳点',
    metadata: { scale: 'milky-way', region: 'Local Bubble' },
  },
  {
    id: 'xuanyuan-station',
    label: '轩辕枢纽站',
    role: 'supply',
    coordinate: { x: 326, y: 320, system: 'solar' },
    description: '补给和维修中继站',
    metadata: { scale: 'milky-way', region: 'Orion Spur' },
  },
  {
    id: 'centauri-jump',
    label: '半人马跃迁点',
    role: 'transfer',
    coordinate: { x: 392, y: 222, system: 'milky-way' },
    description: '太阳系外第一跳点，连接半人马座方向',
    metadata: { scale: 'milky-way', region: 'Local Interstellar Cloud' },
  },
  {
    id: 'orion-jump',
    label: '参宿四跃迁点',
    role: 'transfer',
    coordinate: { x: 618, y: 154, system: 'milky-way' },
    description: '猎户臂主干航道跃迁口',
    metadata: { scale: 'milky-way', region: 'Orion Arm' },
  },
  {
    id: 'aldebaran-jump',
    label: '毕宿五跃迁点',
    role: 'transfer',
    coordinate: { x: 710, y: 198, system: 'milky-way' },
    description: '金牛座方向深空贸易跳点',
    metadata: { scale: 'milky-way', region: 'Orion Arm' },
  },
  {
    id: 'mars-relay',
    label: '火星中继站',
    role: 'destination',
    coordinate: { x: 780, y: 274, system: 'solar' },
    description: '火星轨道中继停靠区',
    metadata: { scale: 'solar-system', body: 'Mars' },
  },
  {
    id: 'asteroid-belt-hub',
    label: '小行星带枢纽',
    role: 'supply',
    coordinate: { x: 458, y: 408, system: 'solar' },
    description: '谷神星方向补给与矿业转运节点',
    metadata: { scale: 'solar-system', region: 'Asteroid Belt' },
  },
  {
    id: 'jupiter-gateway',
    label: '木星伽利略门户',
    role: 'station',
    coordinate: { x: 606, y: 452, system: 'solar' },
    description: '木星系卫星群入口与辐射避让站',
    metadata: { scale: 'solar-system', body: 'Jupiter' },
  },
  {
    id: 'saturn-ringport',
    label: '土星环港',
    role: 'station',
    coordinate: { x: 704, y: 508, system: 'solar' },
    description: '土星环面观测、补给与旅游港',
    metadata: { scale: 'solar-system', body: 'Saturn' },
  },
  {
    id: 'uranus-relay',
    label: '天王星极轨中继',
    role: 'transfer',
    coordinate: { x: 808, y: 486, system: 'solar' },
    description: '外太阳系偏航校准点',
    metadata: { scale: 'solar-system', body: 'Uranus' },
  },
  {
    id: 'neptune-port',
    label: '海王星深空港',
    role: 'station',
    coordinate: { x: 884, y: 430, system: 'solar' },
    description: '深空探测船队换乘港',
    metadata: { scale: 'solar-system', body: 'Neptune' },
  },
  {
    id: 'kuiper-gate',
    label: '柯伊伯边界门',
    role: 'transfer',
    coordinate: { x: 930, y: 360, system: 'solar' },
    description: '太阳系边界与星际航道入口',
    metadata: { scale: 'solar-system', region: 'Kuiper Belt' },
  },
  {
    id: 'local-bubble-observatory',
    label: '本地泡观测站',
    role: 'station',
    coordinate: { x: 306, y: 176, system: 'milky-way' },
    description: '太阳邻域星际介质观测站',
    metadata: { scale: 'milky-way', region: 'Local Bubble' },
  },
  {
    id: 'perseus-arm-gate',
    label: '英仙臂远端门',
    role: 'transfer',
    coordinate: { x: 796, y: 134, system: 'milky-way' },
    description: '银河英仙臂方向的远端跃迁门',
    metadata: { scale: 'milky-way', region: 'Perseus Arm' },
  },
  {
    id: 'sagittarius-arm-hub',
    label: '人马臂枢纽',
    role: 'supply',
    coordinate: { x: 740, y: 304, system: 'milky-way' },
    description: '人马臂贸易与科研换乘中心',
    metadata: { scale: 'milky-way', region: 'Sagittarius Arm' },
  },
  {
    id: 'galactic-core-beacon',
    label: '银河中心信标',
    role: 'destination',
    coordinate: { x: 872, y: 244, system: 'milky-way' },
    description: '银心方向高能观测与长距导航信标',
    metadata: { scale: 'milky-way', region: 'Galactic Center' },
  },
]

/**
 * Default demo route options used when no custom data source is provided.
 */
export const defaultSmapRoutes: readonly SmapRoute[] = [
  {
    id: 'wormhole',
    label: '推荐路线',
    strategy: 'fastest',
    waypointIds: [
      'earth-port',
      'sirius-jump',
      'xuanyuan-station',
      'centauri-jump',
      'orion-jump',
      'aldebaran-jump',
      'mars-relay',
    ],
    distance: 13.8,
    duration: 3.7,
    risk: 'low',
    color: '#1677ff',
    alerts: ['低辐射', '补给稳定', '跃迁稳定'],
  },
  {
    id: 'low-radiation',
    label: '低辐射路线',
    strategy: 'safest',
    waypointIds: [
      'earth-port',
      'sirius-jump',
      'xuanyuan-station',
      'centauri-jump',
      'mars-relay',
    ],
    distance: 16.2,
    duration: 4.6,
    risk: 'medium',
    color: '#00a870',
    alerts: ['绕行辐射带', '燃耗增加'],
  },
  {
    id: 'economy',
    label: '经济路线',
    strategy: 'economy',
    waypointIds: [
      'earth-port',
      'xuanyuan-station',
      'orion-jump',
      'aldebaran-jump',
      'mars-relay',
    ],
    distance: 18.4,
    duration: 5.2,
    risk: 'medium',
    color: '#ff7a00',
    alerts: ['补给密集', '低燃耗'],
  },
  {
    id: 'solar-grand-tour',
    label: '太阳系大巡航',
    strategy: 'fastest',
    waypointIds: [
      'sun-observatory',
      'mercury-relay',
      'venus-orbit',
      'earth-port',
      'moon-gateway',
      'mars-relay',
      'asteroid-belt-hub',
      'jupiter-gateway',
      'saturn-ringport',
      'uranus-relay',
      'neptune-port',
      'kuiper-gate',
    ],
    distance: 62.4,
    duration: 29.7,
    risk: 'medium',
    color: '#2f82ff',
    alerts: ['太阳系主干航线', '行星窗口校准', '外太阳系补给'],
  },
  {
    id: 'solar-safe-transfer',
    label: '太阳系安全转运',
    strategy: 'safest',
    waypointIds: [
      'venus-orbit',
      'earth-port',
      'moon-gateway',
      'mars-relay',
      'asteroid-belt-hub',
      'jupiter-gateway',
      'saturn-ringport',
    ],
    distance: 35.2,
    duration: 18.6,
    risk: 'low',
    color: '#00a870',
    alerts: ['避开近日高热区', '辐射窗口稳定', '补给站密集'],
  },
  {
    id: 'galaxy-orion-spur',
    label: '银河猎户臂航线',
    strategy: 'fastest',
    waypointIds: [
      'earth-port',
      'moon-gateway',
      'kuiper-gate',
      'local-bubble-observatory',
      'centauri-jump',
      'sirius-jump',
      'orion-jump',
      'aldebaran-jump',
      'perseus-arm-gate',
      'galactic-core-beacon',
    ],
    distance: 1240,
    duration: 31.8,
    risk: 'medium',
    color: '#8b5cf6',
    alerts: ['猎户臂主干', '深空通信延迟', '长距跃迁'],
  },
  {
    id: 'galaxy-core-express',
    label: '银心快线',
    strategy: 'fastest',
    waypointIds: [
      'earth-port',
      'kuiper-gate',
      'centauri-jump',
      'sirius-jump',
      'sagittarius-arm-hub',
      'galactic-core-beacon',
    ],
    distance: 980,
    duration: 24.2,
    risk: 'high',
    color: '#f04d41',
    alerts: ['快线跃迁', '高能区预警', '需护航许可'],
  },
  {
    id: 'galaxy-supply-chain',
    label: '银河补给链',
    strategy: 'economy',
    waypointIds: [
      'earth-port',
      'moon-gateway',
      'mars-relay',
      'asteroid-belt-hub',
      'jupiter-gateway',
      'kuiper-gate',
      'local-bubble-observatory',
      'xuanyuan-station',
      'orion-jump',
      'sagittarius-arm-hub',
      'galactic-core-beacon',
    ],
    distance: 1320,
    duration: 39.6,
    risk: 'medium',
    color: '#ff7a00',
    alerts: ['补给密集', '燃耗稳定', '跨星区转运'],
  },
]

/**
 * Default demo points of interest used when no custom data source is provided.
 */
export const defaultSmapPois: readonly SmapPoi[] = [
  {
    id: 'venus-dock',
    label: '金星云顶船坞',
    category: '维修补给',
    waypointId: 'venus-orbit',
    coordinate: { x: 132, y: 432, system: 'solar' },
    description: '顺路维修和燃料补给',
    tags: ['repair', 'supply', 'solar-system', 'venus'],
  },
  {
    id: 'orion-market',
    label: '猎户座自由集市',
    category: '餐饮购物',
    waypointId: 'xuanyuan-station',
    coordinate: { x: 348, y: 298, system: 'solar' },
    description: '热门餐饮和补给交易区',
    tags: ['food', 'shopping', 'milky-way', 'orion-arm'],
  },
  {
    id: 'mars-hotel',
    label: '火星环轨休息港',
    category: '住宿休息',
    waypointId: 'mars-relay',
    coordinate: { x: 806, y: 292, system: 'solar' },
    description: '到达后可停靠休息',
    tags: ['hotel', 'rest', 'solar-system', 'mars'],
  },
  {
    id: 'tranquility-base',
    label: '月球静海基地',
    category: '科研参观',
    waypointId: 'moon-gateway',
    coordinate: { x: 182, y: 380, system: 'solar' },
    description: '地月导航校准与月面参观点',
    tags: ['moon', 'science', 'solar-system'],
  },
  {
    id: 'europa-iceport',
    label: '木卫二冰下港',
    category: '科研补给',
    waypointId: 'jupiter-gateway',
    coordinate: { x: 628, y: 438, system: 'solar' },
    description: '木星系冰下科考补给站',
    tags: ['jupiter', 'europa', 'science', 'supply', 'solar-system'],
  },
  {
    id: 'titan-harbor',
    label: '土卫六甲烷港',
    category: '燃料补给',
    waypointId: 'saturn-ringport',
    coordinate: { x: 724, y: 524, system: 'solar' },
    description: '外太阳系燃料转运与停靠港',
    tags: ['saturn', 'titan', 'fuel', 'solar-system'],
  },
  {
    id: 'heliopause-array',
    label: '日球层顶观测阵列',
    category: '深空观测',
    waypointId: 'kuiper-gate',
    coordinate: { x: 944, y: 342, system: 'solar' },
    description: '太阳风边界与星际介质观测站',
    tags: ['heliopause', 'kuiper', 'science', 'solar-system'],
  },
  {
    id: 'centauri-outpost',
    label: '半人马外港',
    category: '星际中转',
    waypointId: 'centauri-jump',
    coordinate: { x: 410, y: 236, system: 'milky-way' },
    description: '太阳邻域外第一座长期中转港',
    tags: ['centauri', 'milky-way', 'transfer'],
  },
  {
    id: 'perseus-survey-yard',
    label: '英仙臂测绘站',
    category: '星图测绘',
    waypointId: 'perseus-arm-gate',
    coordinate: { x: 812, y: 120, system: 'milky-way' },
    description: '银河旋臂结构与远端航线测绘站',
    tags: ['perseus-arm', 'milky-way', 'survey'],
  },
  {
    id: 'galactic-core-array',
    label: '银心高能观测阵列',
    category: '高能观测',
    waypointId: 'galactic-core-beacon',
    coordinate: { x: 892, y: 230, system: 'milky-way' },
    description: '银河中心方向高能天体观测阵列',
    tags: ['galactic-core', 'milky-way', 'science'],
  },
]

/**
 * Default map layer definitions used when no custom data source is provided.
 */
export const defaultSmapLayers: readonly SmapLayer[] = [
  {
    id: 'traffic',
    label: '实时路况',
    kind: 'traffic',
    visible: true,
    description: '显示跃迁拥堵与限速区',
  },
  {
    id: 'safety',
    label: '护航提醒',
    kind: 'safety',
    visible: true,
    description: '显示高风险航段',
  },
  {
    id: 'poi',
    label: '附近地点',
    kind: 'poi',
    visible: true,
    description: '显示补给、维修、住宿和服务点',
  },
  {
    id: 'favorite',
    label: '收藏点',
    kind: 'favorite',
    visible: false,
    description: '显示第三方或用户收藏地点',
  },
]

/**
 * Calculate Euclidean distance between two logical map coordinates.
 */
export function calculateDistance(from: SmapCoordinate, to: SmapCoordinate): number {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dz = (to.z ?? 0) - (from.z ?? 0)

  return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2)
}

/**
 * Create an in-memory data source for SDK demos, tests, or simple integrations.
 */
export function createMemoryDataSource(input: MemorySmapDataSourceInput = {}): SmapDataSource {
  const waypoints = [...(input.waypoints ?? defaultSmapWaypoints)]
  const routes = [...(input.routes ?? defaultSmapRoutes)]
  const pois = [...(input.pois ?? defaultSmapPois)]
  const layers = [...(input.layers ?? defaultSmapLayers)]

  return {
    listWaypoints: () => waypoints,
    listRoutes: () => routes,
    listPois: () => pois,
    listLayers: () => layers,
  }
}

/**
 * Create a static provider backed by the in-memory SMAP data source.
 */
export function createStaticSmapDataProvider(
  input: MemorySmapDataSourceInput = {},
  options: StaticSmapDataProviderOptions = {},
): SmapDataProvider {
  const dataSource = createMemoryDataSource(input)

  return {
    id: options.id ?? 'static',
    label: options.label ?? '静态示例',
    getSnapshot: context => ({
      source: options.source ?? 'static',
      label: options.label ?? '静态示例',
      status: 'static',
      updatedAt: (context?.now ?? new Date()).toISOString(),
      dataSource,
      metadata: options.metadata,
    }),
  }
}

/**
 * Create a SMAP SDK client.
 */
export function createSmapClient(options: SmapClientOptions = {}): SmapClient {
  const dataSource = options.dataSource ?? createMemoryDataSource()
  const handlers = new Map<SmapEventName, Set<SmapEventHandler<SmapEventName>>>()
  const layerState = new Map(dataSource.listLayers().map(layer => [layer.id, { ...layer }]))
  let selectedRoute: SmapRoute | undefined

  function emit<EventName extends SmapEventName>(eventName: EventName, payload: SmapEventMap[EventName]): void {
    handlers.get(eventName)?.forEach((handler) => {
      handler(payload)
    })
  }

  const client: SmapClient = {
    getWaypoints: () => dataSource.listWaypoints(),
    getRoutes: () => dataSource.listRoutes(),
    getLayers: () => [...layerState.values()],
    getSelectedRoute: () => selectedRoute,
    searchPois: (request = {}) => {
      const query = normalizeSearch(request.query)
      const category = normalizeSearch(request.category)
      const tag = normalizeSearch(request.tag)
      const limit = request.limit ?? Number.POSITIVE_INFINITY

      return dataSource
        .listPois()
        .filter((poi) => {
          const searchableText = normalizeSearch([
            poi.label,
            poi.category,
            poi.description,
            ...(poi.tags ?? []),
          ].filter(Boolean).join(' '))
          const matchesQuery = !query || searchableText.includes(query)
          const matchesCategory = !category || normalizeSearch(poi.category) === category
          const matchesTag = !tag || poi.tags?.some(item => normalizeSearch(item) === tag)

          return matchesQuery && matchesCategory && matchesTag
        })
        .slice(0, limit)
    },
    selectPoi: (poiId) => {
      const poi = dataSource.listPois().find(item => item.id === poiId)

      if (poi)
        emit('poi:selected', poi)

      return poi
    },
    planRoute: (request) => {
      const result = planRoute(dataSource, request)
      emit('route:planned', result)

      return result
    },
    selectRoute: (routeId) => {
      selectedRoute = dataSource.listRoutes().find(route => route.id === routeId)

      if (selectedRoute)
        emit('route:selected', selectedRoute)

      return selectedRoute
    },
    setLayerVisible: (layerId, visible) => {
      const layer = layerState.get(layerId)

      if (!layer)
        return undefined

      const nextLayer = { ...layer, visible }
      layerState.set(layerId, nextLayer)
      emit('layer:changed', nextLayer)

      return nextLayer
    },
    use: (plugin) => {
      plugin.setup(client)
      return client
    },
    on: (eventName, handler) => {
      const bucket = handlers.get(eventName) ?? new Set()
      bucket.add(handler as SmapEventHandler<SmapEventName>)
      handlers.set(eventName, bucket)

      return () => client.off(eventName, handler)
    },
    off: (eventName, handler) => {
      handlers.get(eventName)?.delete(handler as SmapEventHandler<SmapEventName>)
    },
  }

  return client
}

function planRoute(dataSource: SmapDataSource, request: SmapRoutePlanRequest): SmapRoutePlanResult {
  const candidates = dataSource
    .listRoutes()
    .filter(route => routeConnects(route, request.originId, request.destinationId))
    .map(route => createRouteSegment(route, request.originId, request.destinationId))
    .sort((a, b) => compareRoutes(a, b, request.strategy ?? 'fastest'))

  const limitedCandidates = candidates.slice(0, request.limit ?? 3)
  const recommended = limitedCandidates[0] ?? createDirectRoute(dataSource, request)

  return {
    request,
    recommended,
    alternatives: limitedCandidates.filter(route => route.id !== recommended.id),
  }
}

function routeConnects(route: SmapRoute, originId: string, destinationId: string): boolean {
  const originIndex = route.waypointIds.indexOf(originId)
  const destinationIndex = route.waypointIds.indexOf(destinationId)

  return originIndex >= 0 && destinationIndex >= 0 && originIndex !== destinationIndex
}

function createRouteSegment(route: SmapRoute, originId: string, destinationId: string): SmapRoute {
  const originIndex = route.waypointIds.indexOf(originId)
  const destinationIndex = route.waypointIds.indexOf(destinationId)

  if (originIndex === 0 && destinationIndex === route.waypointIds.length - 1)
    return route

  const isForward = originIndex < destinationIndex
  const waypointIds = isForward
    ? route.waypointIds.slice(originIndex, destinationIndex + 1)
    : route.waypointIds.slice(destinationIndex, originIndex + 1).reverse()
  const totalSegments = Math.max(1, route.waypointIds.length - 1)
  const segmentRatio = Math.max(1, waypointIds.length - 1) / totalSegments

  return {
    ...route,
    id: `${route.id}-${originId}-${destinationId}`,
    label: `${route.label}区间`,
    waypointIds,
    distance: Number((route.distance * segmentRatio).toFixed(1)),
    duration: Number((route.duration * segmentRatio).toFixed(1)),
  }
}

function compareRoutes(a: SmapRoute, b: SmapRoute, strategy: SmapRouteStrategy): number {
  if (strategy === 'safest')
    return riskScore(a.risk) - riskScore(b.risk) || a.duration - b.duration

  if (strategy === 'economy')
    return a.distance - b.distance || a.duration - b.duration

  return a.duration - b.duration
}

function riskScore(risk: SmapRiskLevel): number {
  if (risk === 'low')
    return 1

  if (risk === 'medium')
    return 2

  return 3
}

function createDirectRoute(dataSource: SmapDataSource, request: SmapRoutePlanRequest): SmapRoute {
  const waypointById = new Map(dataSource.listWaypoints().map(waypoint => [waypoint.id, waypoint]))
  const origin = waypointById.get(request.originId)
  const destination = waypointById.get(request.destinationId)

  if (!origin || !destination)
    throw new Error(`Unable to plan route from "${request.originId}" to "${request.destinationId}".`)

  const distance = calculateDistance(origin.coordinate, destination.coordinate) / 100

  return {
    id: `${origin.id}-${destination.id}-direct`,
    label: '直达路线',
    waypointIds: [origin.id, destination.id],
    distance,
    duration: Number((distance / 3.2).toFixed(1)),
    strategy: request.strategy ?? 'fastest',
    risk: 'medium',
    color: '#1677ff',
    alerts: ['SDK 自动生成路线'],
  }
}

function normalizeSearch(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? ''
}
