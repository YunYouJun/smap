import type {
  SmapLayer,
  SmapPoi,
  SmapRoute,
  SmapRouteStrategy,
  SmapWaypoint,
} from '@yunyoujun/smap-sdk'
import type {
  ExploreSpot,
  HazardZone,
  MapTool,
  MobileServiceItem,
  ProfileAction,
  RideOption,
  RouteOption,
  RoutePlace,
  TelemetryMetric,
  TravelMode,
  Waypoint,
} from './types'
import { createSmapClient } from '@yunyoujun/smap-sdk'

export const smapClient = createSmapClient()

const waypointViewMeta: Record<string, { shortLabel: string, time: string, note?: string }> = {
  'sun-observatory': {
    shortLabel: '太阳',
    time: '近日校准',
    note: '太阳日冕观测与内太阳系导航基准',
  },
  'mercury-relay': {
    shortLabel: '水星',
    time: '0.3 光时',
    note: '内太阳系高速中继点',
  },
  'venus-orbit': {
    shortLabel: '金星',
    time: '0.4 光时',
    note: '金星云顶补给窗口',
  },
  'earth-port': {
    shortLabel: '地球',
    time: '出发',
    note: '主推进校准完成',
  },
  'sirius-jump': {
    shortLabel: '天狼',
    time: '7.2 光时',
    note: '本地泡到猎户臂的高亮星际跳点',
  },
  'xuanyuan-station': {
    shortLabel: '轩辕',
    time: '1.1 光时',
    note: '补给站',
  },
  'centauri-jump': {
    shortLabel: '半人马',
    time: '4.3 光时',
    note: '太阳系外第一跳点',
  },
  'orion-jump': {
    shortLabel: '参宿四',
    time: '11.6 光时',
    note: '猎户臂主干航道跃迁口',
  },
  'aldebaran-jump': {
    shortLabel: '毕宿五',
    time: '14.8 光时',
    note: '金牛座方向深空贸易跳点',
  },
  'mars-relay': {
    shortLabel: '火星',
    time: '到达',
  },
  'asteroid-belt-hub': {
    shortLabel: '小行星带',
    time: '2.4 光时',
    note: '谷神星方向补给与矿业转运节点',
  },
  'jupiter-gateway': {
    shortLabel: '木星',
    time: '5.1 光时',
    note: '木星系卫星群入口与辐射避让站',
  },
  'saturn-ringport': {
    shortLabel: '土星',
    time: '7.8 光时',
    note: '土星环面观测与补给港',
  },
  'uranus-relay': {
    shortLabel: '天王星',
    time: '10.9 光时',
    note: '外太阳系偏航校准点',
  },
  'neptune-port': {
    shortLabel: '海王星',
    time: '13.6 光时',
    note: '深空探测船队换乘港',
  },
  'kuiper-gate': {
    shortLabel: '柯伊伯',
    time: '16.8 光时',
    note: '太阳系边界与星际航道入口',
  },
  'local-bubble-observatory': {
    shortLabel: '本地泡',
    time: '18.4 光时',
    note: '太阳邻域星际介质观测站',
  },
  'perseus-arm-gate': {
    shortLabel: '英仙臂',
    time: '24.1 光时',
    note: '银河英仙臂方向的远端跃迁门',
  },
  'sagittarius-arm-hub': {
    shortLabel: '人马臂',
    time: '21.7 光时',
    note: '人马臂贸易与科研换乘中心',
  },
  'galactic-core-beacon': {
    shortLabel: '银心',
    time: '到达',
    note: '银河中心方向高能导航信标',
  },
}

const routeViewMeta: Record<string, { label: string, mode: string, stops: number }> = {
  'wormhole': {
    label: '推荐',
    mode: '虫洞优先',
    stops: 12,
  },
  'low-radiation': {
    label: '备选',
    mode: '低辐射',
    stops: 16,
  },
  'economy': {
    label: '备选',
    mode: '经济模式',
    stops: 18,
  },
  'solar-grand-tour': {
    label: '太阳系',
    mode: '行星窗口',
    stops: 11,
  },
  'solar-safe-transfer': {
    label: '稳妥',
    mode: '低辐射转运',
    stops: 8,
  },
  'galaxy-orion-spur': {
    label: '银河',
    mode: '猎户臂主干',
    stops: 24,
  },
  'galaxy-core-express': {
    label: '快线',
    mode: '银心快线',
    stops: 18,
  },
  'galaxy-supply-chain': {
    label: '补给',
    mode: '跨臂补给链',
    stops: 30,
  },
}

const travelModeViewMeta: Record<string, { label: string, description: string, icon: TravelMode['icon'] }> = {
  'wormhole': {
    label: '虫洞优先',
    description: '最少跳迁',
    icon: 'vortex',
  },
  'low-radiation': {
    label: '低辐射',
    description: '避开风暴',
    icon: 'shield',
  },
  'economy': {
    label: '补给站',
    description: '低燃耗',
    icon: 'supply',
  },
  'solar-grand-tour': {
    label: '太阳系',
    description: '行星巡航',
    icon: 'route',
  },
  'solar-safe-transfer': {
    label: '低辐射',
    description: '安全转运',
    icon: 'shield',
  },
  'galaxy-orion-spur': {
    label: '猎户臂',
    description: '银河主干',
    icon: 'vortex',
  },
  'galaxy-core-express': {
    label: '银心快线',
    description: '长距跃迁',
    icon: 'vortex',
  },
  'galaxy-supply-chain': {
    label: '补给链',
    description: '跨臂低耗',
    icon: 'supply',
  },
}

const layerToolMeta: Record<string, { id: string, label: string, description: string, icon: MapTool['icon'] }> = {
  traffic: {
    id: 'traffic',
    label: '实时路况',
    description: '显示跃迁拥堵与限速区',
    icon: 'traffic',
  },
  poi: {
    id: 'layers',
    label: '星图图层',
    description: '切换补给、风暴、港口图层',
    icon: 'layers',
  },
  favorite: {
    id: 'favorite',
    label: '收藏点',
    description: '标记常用星港与中继站',
    icon: 'favorite',
  },
  safety: {
    id: 'safety',
    label: '护航提醒',
    description: '自动提示高风险航段',
    icon: 'safety',
  },
}

const mapToolOrder = new Map([
  ['traffic', 0],
  ['layers', 1],
  ['favorite', 2],
  ['safety', 3],
])

const poiViewMeta: Record<string, { distance: string, eta: string, popularity: string, tone: ExploreSpot['tone'] }> = {
  'venus-dock': {
    distance: '0.8 光分',
    eta: '绕行 6 分钟',
    popularity: '本周热度 92',
    tone: 'cyan',
  },
  'orion-market': {
    distance: '1.4 光分',
    eta: '顺路 12 分钟',
    popularity: '星际旅客推荐',
    tone: 'orange',
  },
  'mars-hotel': {
    distance: '2.1 光分',
    eta: '到达后 3 分钟',
    popularity: '可用泊位 18',
    tone: 'blue',
  },
  'tranquility-base': {
    distance: '0.2 光分',
    eta: '地月转运 18 分钟',
    popularity: '科研预约开放',
    tone: 'cyan',
  },
  'europa-iceport': {
    distance: '5.4 光分',
    eta: '绕行 28 分钟',
    popularity: '冰下任务热度 88',
    tone: 'blue',
  },
  'titan-harbor': {
    distance: '8.2 光分',
    eta: '顺路 42 分钟',
    popularity: '燃料余量充足',
    tone: 'orange',
  },
  'heliopause-array': {
    distance: '16.8 光分',
    eta: '深空窗口 2 小时',
    popularity: '边界观测中',
    tone: 'blue',
  },
  'centauri-outpost': {
    distance: '4.3 光时',
    eta: '外港换乘 35 分钟',
    popularity: '星际中转推荐',
    tone: 'cyan',
  },
  'perseus-survey-yard': {
    distance: '24.1 光时',
    eta: '需深空许可',
    popularity: '测绘任务密集',
    tone: 'blue',
  },
  'galactic-core-array': {
    distance: '31.8 光时',
    eta: '高能区护航',
    popularity: '银心观测窗口',
    tone: 'orange',
  },
}

function toWaypointRole(role: SmapWaypoint['role']): Waypoint['role'] {
  if (role === 'origin' || role === 'destination' || role === 'supply')
    return role

  return 'transfer'
}

function toWaypoint(waypoint: SmapWaypoint): Waypoint {
  const meta = waypointViewMeta[waypoint.id] ?? {
    shortLabel: waypoint.label,
    time: '途经',
  }
  const note = meta.note ?? waypoint.description

  return {
    id: waypoint.id,
    label: waypoint.label,
    shortLabel: meta.shortLabel,
    role: toWaypointRole(waypoint.role),
    x: waypoint.coordinate.x,
    y: waypoint.coordinate.y,
    time: meta.time,
    ...(note ? { note } : {}),
  }
}

function strategyLabel(strategy: SmapRouteStrategy | undefined): string {
  if (strategy === 'safest')
    return '低风险'

  if (strategy === 'economy')
    return '经济模式'

  return '智能推荐'
}

function formatDuration(duration: number): string {
  return `${duration.toFixed(1).replace(/\.0$/, '')} 光时`
}

function toRouteOption(route: SmapRoute): RouteOption {
  const meta = routeViewMeta[route.id] ?? {
    label: route.label,
    mode: strategyLabel(route.strategy),
    stops: Math.max(1, route.waypointIds.length - 1),
  }

  return {
    id: route.id,
    label: meta.label,
    mode: meta.mode,
    duration: formatDuration(route.duration),
    stops: meta.stops,
    risk: route.risk,
    color: route.color ?? '#1677ff',
    path: [...route.waypointIds],
    alerts: [...(route.alerts ?? [])],
  }
}

function toTravelMode(route: RouteOption): TravelMode {
  const meta = travelModeViewMeta[route.id] ?? {
    label: route.mode,
    description: `${route.stops} 个跃迁点`,
    icon: 'route',
  }

  return {
    id: route.id,
    label: meta.label,
    description: meta.description,
    icon: meta.icon,
  }
}

function toMapTool(layer: SmapLayer): MapTool {
  const meta = layerToolMeta[layer.id] ?? {
    id: layer.id,
    label: layer.label,
    description: layer.description ?? layer.label,
    icon: 'layers' as const,
  }

  return {
    id: meta.id,
    label: meta.label,
    description: meta.description,
    icon: meta.icon,
  }
}

function toExploreSpot(poi: SmapPoi): ExploreSpot {
  const meta = poiViewMeta[poi.id] ?? {
    distance: '附近',
    eta: '可顺路前往',
    popularity: poi.description ?? '推荐地点',
    tone: 'blue' as const,
  }

  return {
    id: poi.id,
    title: poi.label,
    category: poi.category,
    distance: meta.distance,
    eta: meta.eta,
    popularity: meta.popularity,
    waypointId: poi.waypointId ?? poi.id,
    tone: meta.tone,
  }
}

function normalizePlaceSearch(value: string): string {
  return value.trim().toLowerCase()
}

function waypointCategory(waypoint: Waypoint): string {
  if (waypoint.role === 'origin')
    return '星港'

  if (waypoint.role === 'destination')
    return '中继站'

  if (waypoint.role === 'supply')
    return '补给站'

  return '跃迁点'
}

function toRoutePlaceFromWaypoint(waypoint: Waypoint): RoutePlace {
  return {
    id: `waypoint:${waypoint.id}`,
    label: waypoint.label,
    category: waypointCategory(waypoint),
    description: waypoint.note ?? waypoint.time,
    waypointId: waypoint.id,
    source: 'waypoint',
  }
}

function toRoutePlaceFromPoi(poi: SmapPoi, validWaypointIds: ReadonlySet<string>): RoutePlace | undefined {
  const waypointId = poi.waypointId && validWaypointIds.has(poi.waypointId)
    ? poi.waypointId
    : validWaypointIds.has(poi.id)
      ? poi.id
      : undefined

  if (!waypointId)
    return undefined

  return {
    id: `poi:${poi.id}`,
    label: poi.label,
    category: poi.category,
    description: poi.description ?? '推荐地点',
    waypointId,
    source: 'poi',
  }
}

export function createRouteOptions(
  originId = 'earth-port',
  destinationId = 'mars-relay',
  strategy: SmapRouteStrategy = 'fastest',
): RouteOption[] {
  const routePlan = smapClient.planRoute({
    originId,
    destinationId,
    strategy,
    limit: 3,
  })

  return [
    routePlan.recommended,
    ...routePlan.alternatives,
  ].map(toRouteOption)
}

export function createTravelModes(routes: RouteOption[]): TravelMode[] {
  return routes.map(toTravelMode)
}

export const mobileServices: MobileServiceItem[] = [
  {
    id: 'navigation',
    label: '导航',
    description: '路线规划',
    icon: 'navigate',
  },
  {
    id: 'explore',
    label: '探索',
    description: '周边发现',
    icon: 'compass',
  },
  {
    id: 'ride-hailing',
    label: '打车',
    description: '快船接驳',
    icon: 'taxi',
  },
  {
    id: 'profile',
    label: '我的',
    description: '账号服务',
    icon: 'user',
  },
]

export const waypoints: Waypoint[] = smapClient.getWaypoints().map(toWaypoint)

const validWaypointIds = new Set(waypoints.map(waypoint => waypoint.id))

export const routePlaces: RoutePlace[] = [
  ...waypoints.map(toRoutePlaceFromWaypoint),
  ...smapClient
    .searchPois()
    .map(poi => toRoutePlaceFromPoi(poi, validWaypointIds))
    .filter((place): place is RoutePlace => Boolean(place)),
]

export const defaultOriginPlace = routePlaces.find(place => place.waypointId === 'earth-port') ?? routePlaces[0]!

export const defaultDestinationPlace = routePlaces.find(place => place.waypointId === 'mars-relay') ?? routePlaces[1] ?? defaultOriginPlace

export function searchRoutePlaces(query: string, limit = 8): RoutePlace[] {
  const normalizedQuery = normalizePlaceSearch(query)

  const matches = normalizedQuery
    ? routePlaces.filter((place) => {
        return normalizePlaceSearch(`${place.label} ${place.category} ${place.description}`).includes(normalizedQuery)
      })
    : routePlaces

  return matches.slice(0, limit)
}

export const routeOptions: RouteOption[] = createRouteOptions(
  defaultOriginPlace.waypointId,
  defaultDestinationPlace.waypointId,
)

export const travelModes: TravelMode[] = createTravelModes(routeOptions)

const layerToolPairs = smapClient
  .getLayers()
  .map(layer => ({
    layer,
    tool: toMapTool(layer),
  }))
  .sort((a, b) => {
    return (mapToolOrder.get(a.tool.id) ?? 99) - (mapToolOrder.get(b.tool.id) ?? 99)
  })

export const mapTools: MapTool[] = layerToolPairs.map(({ tool }) => tool)

export const mapToolLayerIds = new Map(layerToolPairs.map(({ layer, tool }) => [tool.id, layer.id]))

export const defaultEnabledMapToolIds = layerToolPairs
  .filter(({ layer }) => layer.visible)
  .map(({ tool }) => tool.id)

export const exploreSpots: ExploreSpot[] = smapClient.searchPois({ limit: 8 }).map(toExploreSpot)

export const rideOptions: RideOption[] = [
  {
    id: 'orbital-shuttle',
    label: '轨道快船',
    badge: '推荐',
    description: '直达航线 · 快速稳定',
    eta: '3 分钟接驾',
    duration: '2 小时 28 分送达',
    price: '320 星币',
    vehicle: 'orbital',
  },
  {
    id: 'warp-premium',
    label: '跃迁专车',
    description: '高速抵达 · 独立舱位',
    eta: '5 分钟接驾',
    duration: '1 小时 12 分送达',
    price: '520 星币',
    vehicle: 'warp',
  },
  {
    id: 'shared-cabin',
    label: '拼舱',
    description: '拼舱出行 · 经济实惠',
    eta: '8 分钟接驾',
    duration: '4 小时 45 分送达',
    price: '160 星币',
    vehicle: 'shared',
  },
]

export const profileActions: ProfileAction[] = [
  {
    id: 'favorite',
    label: '我的收藏',
    description: '常用星港、避险点、补给站',
    icon: 'favorite',
  },
  {
    id: 'orders',
    label: '打车订单',
    description: '快船行程与发票记录',
    icon: 'orders',
  },
  {
    id: 'settings',
    label: '导航偏好',
    description: '避险、燃耗、亮暗模式',
    icon: 'settings',
  },
]

export const hazardZones: HazardZone[] = [
  {
    id: 'radiation-belt',
    label: '辐射带',
    level: '中等',
    tone: 'amber',
    x: 664,
    y: 412,
    radius: 58,
  },
  {
    id: 'micro-asteroids',
    label: '小行星带',
    level: '中等',
    tone: 'amber',
    x: 432,
    y: 470,
    radius: 42,
  },
  {
    id: 'magnetic-storm',
    label: '电磁风暴区',
    level: '高',
    tone: 'magenta',
    x: 748,
    y: 438,
    radius: 70,
  },
  {
    id: 'gravity-vortex',
    label: '引力漩涡',
    level: '低',
    tone: 'cyan',
    x: 806,
    y: 342,
    radius: 36,
  },
]

export const telemetryMetrics: TelemetryMetric[] = [
  {
    id: 'fuel',
    label: '剩余燃料',
    value: '78%',
    level: 78,
    icon: 'fuel',
  },
  {
    id: 'jump',
    label: '跃迁能量',
    value: '92%',
    level: 92,
    icon: 'bolt',
  },
  {
    id: 'shield',
    label: '护盾强度',
    value: '100%',
    level: 100,
    icon: 'shield',
  },
  {
    id: 'integrity',
    label: '船体完整性',
    value: '100%',
    level: 100,
    icon: 'ship',
  },
  {
    id: 'speed',
    label: '航行速度',
    value: '0.78 c',
    level: 48,
    icon: 'speed',
  },
]

export const starField = [
  [72, 91, 1],
  [119, 183, 2],
  [181, 118, 1],
  [245, 226, 2],
  [294, 92, 1],
  [352, 156, 3],
  [404, 89, 1],
  [463, 350, 2],
  [516, 74, 1],
  [574, 276, 2],
  [638, 95, 1],
  [703, 221, 3],
  [760, 118, 1],
  [832, 311, 2],
  [891, 184, 1],
  [946, 84, 2],
  [93, 508, 1],
  [183, 547, 2],
  [286, 448, 1],
  [366, 512, 2],
  [538, 484, 1],
  [615, 565, 2],
  [811, 538, 1],
  [926, 472, 2],
] as const
