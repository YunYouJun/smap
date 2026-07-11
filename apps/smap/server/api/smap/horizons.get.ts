import { createError, defineEventHandler, getQuery } from 'h3'

type HorizonsBodyId
  = | 'sun'
    | 'mercury'
    | 'venus'
    | 'earth'
    | 'moon'
    | 'mars'
    | 'jupiter'
    | 'saturn'
    | 'uranus'
    | 'neptune'

interface HorizonsBodyConfig {
  id: HorizonsBodyId
  label: string
  command: string
  waypointId: string
  staticPosition: {
    x: number
    y: number
    z?: number
  }
}

interface HorizonsVector {
  x: number
  y: number
  z: number
  vx?: number
  vy?: number
  vz?: number
  unit: 'AU-D'
}

interface HorizonsBody {
  id: HorizonsBodyId
  label: string
  command: string
  waypointId: string
  vector?: HorizonsVector
  projected: {
    x: number
    y: number
    z?: number
  }
  source: 'jpl-horizons' | 'static'
}

interface HorizonsPayload {
  status: 'live'
  source: 'jpl-horizons'
  sourceLabel: string
  updatedAt: string
  targetDate: string
  cacheTtlSeconds: number
  bodies: HorizonsBody[]
  errors?: string[]
}

interface CacheEntry {
  key: string
  expiresAt: number
  payload: HorizonsPayload
}

const HORIZONS_ENDPOINT = 'https://ssd.jpl.nasa.gov/api/horizons.api'
const CACHE_TTL_SECONDS = 60 * 60
const CACHE_TTL_MS = CACHE_TTL_SECONDS * 1000
const ONE_DAY_MS = 24 * 60 * 60 * 1000
const AU_TO_MAP_UNITS = 18
const SOLAR_MAP_CENTER = { x: 146, y: 405 }

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const bodyConfigs: readonly HorizonsBodyConfig[] = [
  {
    id: 'sun',
    label: '太阳',
    command: '10',
    waypointId: 'sun-observatory',
    staticPosition: { x: 82, y: 340 },
  },
  {
    id: 'mercury',
    label: '水星',
    command: '199',
    waypointId: 'mercury-relay',
    staticPosition: { x: 108, y: 372 },
  },
  {
    id: 'venus',
    label: '金星',
    command: '299',
    waypointId: 'venus-orbit',
    staticPosition: { x: 128, y: 444 },
  },
  {
    id: 'earth',
    label: '地球',
    command: '399',
    waypointId: 'earth-port',
    staticPosition: { x: 146, y: 405 },
  },
  {
    id: 'moon',
    label: '月球',
    command: '301',
    waypointId: 'moon-gateway',
    staticPosition: { x: 174, y: 388 },
  },
  {
    id: 'mars',
    label: '火星',
    command: '499',
    waypointId: 'mars-relay',
    staticPosition: { x: 205, y: 332 },
  },
  {
    id: 'jupiter',
    label: '木星',
    command: '599',
    waypointId: 'jupiter-gateway',
    staticPosition: { x: 278, y: 288 },
  },
  {
    id: 'saturn',
    label: '土星',
    command: '699',
    waypointId: 'saturn-ringport',
    staticPosition: { x: 326, y: 320 },
  },
  {
    id: 'uranus',
    label: '天王星',
    command: '799',
    waypointId: 'uranus-relay',
    staticPosition: { x: 382, y: 284 },
  },
  {
    id: 'neptune',
    label: '海王星',
    command: '899',
    waypointId: 'neptune-port',
    staticPosition: { x: 430, y: 250 },
  },
]

let cache: CacheEntry | undefined

export default defineEventHandler(async (event): Promise<HorizonsPayload> => {
  const query = getQuery(event)
  const targetDate = normalizeDateQuery(query.date)
  const cacheKey = targetDate
  const now = Date.now()

  if (cache?.key === cacheKey && cache.expiresAt > now)
    return cache.payload

  const startDate = createUtcDate(targetDate)
  const stopDate = new Date(startDate.getTime() + ONE_DAY_MS)
  const { bodies, errors } = await fetchHorizonsBodies(startDate, stopDate)

  if (bodies.every(body => body.source === 'static')) {
    throw createError({
      statusCode: 502,
      message: 'JPL Horizons data unavailable',
    })
  }

  const payload: HorizonsPayload = {
    status: 'live',
    source: 'jpl-horizons',
    sourceLabel: '实时星历',
    updatedAt: new Date().toISOString(),
    targetDate,
    cacheTtlSeconds: CACHE_TTL_SECONDS,
    bodies,
    errors: errors.length > 0 ? errors : undefined,
  }

  cache = {
    key: cacheKey,
    expiresAt: now + CACHE_TTL_MS,
    payload,
  }

  return payload
})

async function fetchHorizonsBodies(startDate: Date, stopDate: Date): Promise<{
  bodies: HorizonsBody[]
  errors: string[]
}> {
  const bodies: HorizonsBody[] = []
  const errors: string[] = []

  for (const body of bodyConfigs) {
    try {
      bodies.push(await fetchHorizonsBody(body, startDate, stopDate))
    }
    catch (error) {
      bodies.push(createStaticHorizonsBody(body))
      errors.push(`${body.label}: ${errorToMessage(error)}`)
    }

    await wait(90)
  }

  return { bodies, errors }
}

function normalizeDateQuery(value: unknown): string {
  const [firstValue] = Array.isArray(value) ? value : [value]

  if (typeof firstValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(firstValue))
    return firstValue

  if (firstValue)
    throw createError({ statusCode: 400, message: 'date must use YYYY-MM-DD format' })

  return new Date().toISOString().slice(0, 10)
}

async function fetchHorizonsBody(
  body: HorizonsBodyConfig,
  startDate: Date,
  stopDate: Date,
): Promise<HorizonsBody> {
  if (body.id === 'sun') {
    return {
      ...createStaticHorizonsBody(body),
      vector: { x: 0, y: 0, z: 0, unit: 'AU-D' },
      source: 'jpl-horizons',
    }
  }

  const url = new URL(HORIZONS_ENDPOINT)
  const params = {
    format: 'text',
    COMMAND: body.command,
    OBJ_DATA: 'NO',
    MAKE_EPHEM: 'YES',
    EPHEM_TYPE: 'VECTORS',
    CENTER: '@sun',
    START_TIME: formatHorizonsDate(startDate),
    STOP_TIME: formatHorizonsDate(stopDate),
    STEP_SIZE: '1d',
    CSV_FORMAT: 'YES',
    VEC_TABLE: '2',
    OUT_UNITS: 'AU-D',
  }

  for (const [key, value] of Object.entries(params))
    url.searchParams.set(key, value)

  const response = await fetch(url)

  if (!response.ok) {
    throw createError({
      statusCode: 502,
      message: `JPL Horizons request failed for ${body.label}`,
    })
  }

  const text = await response.text()
  const vector = parseHorizonsVector(text)

  if (!vector) {
    throw createError({
      statusCode: 502,
      message: `JPL Horizons vector missing for ${body.label}`,
    })
  }

  return {
    id: body.id,
    label: body.label,
    command: body.command,
    waypointId: body.waypointId,
    vector,
    projected: projectVectorToMap(vector),
    source: 'jpl-horizons',
  }
}

function createStaticHorizonsBody(body: HorizonsBodyConfig): HorizonsBody {
  return {
    id: body.id,
    label: body.label,
    command: body.command,
    waypointId: body.waypointId,
    projected: body.staticPosition,
    source: 'static',
  }
}

function parseHorizonsVector(text: string): HorizonsVector | undefined {
  const start = text.indexOf('$$SOE')
  const end = text.indexOf('$$EOE')

  if (start < 0 || end <= start)
    return undefined

  const ephemeris = text.slice(start + '$$SOE'.length, end)
  const row = ephemeris
    .split('\n')
    .map(line => line.trim())
    .find(line => /^\d+\.\d+,/.test(line))

  if (!row)
    return undefined

  const values = row
    .split(',')
    .map(part => Number(part.trim()))
    .filter(value => Number.isFinite(value))

  if (values.length < 7)
    return undefined

  return {
    x: values[1]!,
    y: values[2]!,
    z: values[3]!,
    vx: values[4],
    vy: values[5],
    vz: values[6],
    unit: 'AU-D',
  }
}

function projectVectorToMap(vector: HorizonsVector): HorizonsBody['projected'] {
  return {
    x: Number((SOLAR_MAP_CENTER.x + vector.x * AU_TO_MAP_UNITS).toFixed(2)),
    y: Number((SOLAR_MAP_CENTER.y - vector.y * AU_TO_MAP_UNITS).toFixed(2)),
    z: Number(vector.z.toFixed(6)),
  }
}

function createUtcDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`)
}

function formatHorizonsDate(date: Date): string {
  const year = date.getUTCFullYear()
  const month = monthNames[date.getUTCMonth()]!
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function wait(duration: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, duration))
}

function errorToMessage(error: unknown): string {
  if (error instanceof Error)
    return error.message

  return String(error)
}
