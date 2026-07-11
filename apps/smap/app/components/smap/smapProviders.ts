import type { SmapWaypoint } from '@yunyoujun/smap-sdk'
import {
  createStaticSmapDataProvider,
  defaultSmapWaypoints,
} from '@yunyoujun/smap-sdk'

export type SmapEphemerisStatus = 'static' | 'live' | 'error'
export type SmapEphemerisSource = 'static' | 'jpl-horizons'

export interface SmapEphemerisBody {
  id: string
  label: string
  command?: string
  waypointId: string
  projected: {
    x: number
    y: number
    z?: number
  }
  vector?: {
    x: number
    y: number
    z: number
    vx?: number
    vy?: number
    vz?: number
    unit: 'AU-D'
  }
  source: SmapEphemerisSource
}

export interface SmapEphemerisState {
  status: SmapEphemerisStatus
  source: SmapEphemerisSource
  sourceLabel: string
  updatedAt: string
  targetDate?: string
  bodies: readonly SmapEphemerisBody[]
  error?: string
}

interface SmapEphemerisProvider {
  id: SmapEphemerisSource
  label: string
  load: () => Promise<SmapEphemerisState>
}

interface HorizonsPayload {
  status: 'live'
  source: 'jpl-horizons'
  sourceLabel: string
  updatedAt: string
  targetDate: string
  bodies: readonly SmapEphemerisBody[]
}

const staticBodyIds: Record<string, string> = {
  Sun: 'sun',
  Mercury: 'mercury',
  Venus: 'venus',
  Earth: 'earth',
  Moon: 'moon',
  Mars: 'mars',
  Jupiter: 'jupiter',
  Saturn: 'saturn',
  Uranus: 'uranus',
  Neptune: 'neptune',
}

export const staticSmapDataProvider = createStaticSmapDataProvider(undefined, {
  source: 'static',
  label: '静态示例',
})

export const jplHorizonsProvider: SmapEphemerisProvider = {
  id: 'jpl-horizons',
  label: '实时星历',
  async load() {
    const response = await fetch('/api/smap/horizons')

    if (!response.ok)
      throw new Error(`JPL Horizons proxy returned ${response.status}`)

    const payload = await response.json() as HorizonsPayload

    return {
      status: payload.status,
      source: payload.source,
      sourceLabel: payload.sourceLabel,
      updatedAt: payload.updatedAt,
      targetDate: payload.targetDate,
      bodies: payload.bodies,
    }
  },
}

export function createStaticSmapEphemerisState(error?: unknown): SmapEphemerisState {
  return {
    status: error ? 'error' : 'static',
    source: 'static',
    sourceLabel: error ? '星历异常' : '静态示例',
    updatedAt: new Date().toISOString(),
    bodies: defaultSmapWaypoints
      .filter(isSolarWaypoint)
      .map(createStaticEphemerisBody),
    error: error ? errorToMessage(error) : undefined,
  }
}

export async function loadSmapEphemeris(): Promise<SmapEphemerisState> {
  try {
    return await jplHorizonsProvider.load()
  }
  catch (error) {
    return createStaticSmapEphemerisState(error)
  }
}

function isSolarWaypoint(waypoint: SmapWaypoint): boolean {
  return waypoint.coordinate.system === 'solar' && typeof waypoint.metadata?.body === 'string'
}

function createStaticEphemerisBody(waypoint: SmapWaypoint): SmapEphemerisBody {
  const body = waypoint.metadata?.body

  return {
    id: typeof body === 'string' ? staticBodyIds[body] ?? waypoint.id : waypoint.id,
    label: waypoint.label,
    waypointId: waypoint.id,
    projected: {
      x: waypoint.coordinate.x,
      y: waypoint.coordinate.y,
      z: waypoint.coordinate.z,
    },
    source: 'static',
  }
}

function errorToMessage(error: unknown): string {
  if (error instanceof Error)
    return error.message

  return String(error)
}
