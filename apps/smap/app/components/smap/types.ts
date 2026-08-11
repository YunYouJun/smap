import type { SmapIconName } from './iconTypes'

export interface TravelMode {
  id: string
  label: string
  description: string
  icon: SmapIconName
}

export interface Waypoint {
  id: string
  label: string
  shortLabel: string
  role: 'origin' | 'transfer' | 'supply' | 'destination'
  x: number
  y: number
  time: string
  note?: string
}

export interface RouteOption {
  id: string
  label: string
  mode: string
  duration: string
  stops: number
  risk: 'low' | 'medium' | 'high'
  color: string
  path: string[]
  alerts: string[]
}

export type RouteEndpointRole = 'origin' | 'destination'

export type RoutePlaceSource = 'waypoint' | 'poi'

export interface RoutePlace {
  id: string
  label: string
  category: string
  description: string
  waypointId: string
  source: RoutePlaceSource
}

export type MobileService = 'navigation' | 'ride-hailing' | 'explore' | 'profile'

export interface MobileServiceItem {
  id: MobileService
  label: string
  description: string
  icon: 'navigate' | 'taxi' | 'compass' | 'user'
}

export interface MapTool {
  id: string
  label: string
  description: string
  icon: 'traffic' | 'layers' | 'favorite' | 'safety'
}

export interface ExploreSpot {
  id: string
  title: string
  category: string
  distance: string
  eta: string
  popularity: string
  waypointId: string
  tone: 'cyan' | 'orange' | 'blue'
}

export interface ProfileAction {
  id: string
  label: string
  description: string
  icon: 'login' | 'favorite' | 'orders' | 'settings'
  badge?: string
}

export interface RideOption {
  id: string
  label: string
  badge?: string
  description: string
  eta: string
  duration: string
  price: string
  vehicle: 'orbital' | 'warp' | 'shared'
}

export interface HazardZone {
  id: string
  label: string
  level: '低' | '中等' | '高'
  tone: 'cyan' | 'amber' | 'magenta'
  x: number
  y: number
  radius: number
}

export interface TelemetryMetric {
  id: string
  label: string
  value: string
  level: number
  icon: SmapIconName
}
