export interface TravelMode {
  id: string
  label: string
  description: string
  icon: string
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

export type MobileService = 'navigation' | 'ride-hailing'

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
  icon: string
}
