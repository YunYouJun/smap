import { describe, expect, it } from 'vitest'
import {
  calculateDistance,
  createMemoryDataSource,
  createSmapClient,
  createStaticSmapDataProvider,
} from '../src/index'

describe('@yunyoujun/smap-sdk', () => {
  it('plans a recommended route with alternatives', () => {
    const client = createSmapClient()

    const result = client.planRoute({
      originId: 'earth-port',
      destinationId: 'mars-relay',
      strategy: 'fastest',
    })

    expect(result.recommended.id).toBe('wormhole')
    expect(result.alternatives.map(route => route.id)).toContain('low-radiation')
  })

  it('plans route segments between intermediate waypoints', () => {
    const client = createSmapClient()

    const result = client.planRoute({
      originId: 'sirius-jump',
      destinationId: 'centauri-jump',
      strategy: 'fastest',
    })

    expect(result.recommended.id).toBe('wormhole-sirius-jump-centauri-jump')
    expect(result.recommended.waypointIds).toEqual([
      'sirius-jump',
      'xuanyuan-station',
      'centauri-jump',
    ])
    expect(result.recommended.duration).toBeLessThan(3.7)
  })

  it('supports solar-system route planning', () => {
    const client = createSmapClient()

    const result = client.planRoute({
      originId: 'earth-port',
      destinationId: 'neptune-port',
      strategy: 'fastest',
    })

    expect(result.recommended.id).toContain('solar-grand-tour')
    expect(result.recommended.waypointIds).toEqual([
      'earth-port',
      'moon-gateway',
      'mars-relay',
      'asteroid-belt-hub',
      'jupiter-gateway',
      'saturn-ringport',
      'uranus-relay',
      'neptune-port',
    ])
  })

  it('supports galaxy-scale route planning', () => {
    const client = createSmapClient()

    const result = client.planRoute({
      originId: 'earth-port',
      destinationId: 'galactic-core-beacon',
      strategy: 'fastest',
    })

    expect(result.recommended.id).toContain('galaxy-core-express')
    expect(result.alternatives.map(route => route.id).join(' ')).toContain('galaxy-orion-spur')
  })

  it('supports reverse route segments', () => {
    const client = createSmapClient()

    const result = client.planRoute({
      originId: 'galactic-core-beacon',
      destinationId: 'earth-port',
      strategy: 'fastest',
    })

    expect(result.recommended.waypointIds[0]).toBe('galactic-core-beacon')
    expect(result.recommended.waypointIds.at(-1)).toBe('earth-port')
    expect(result.recommended.id).not.toBe('galactic-core-beacon-earth-port-direct')
  })

  it('supports POI search by tag and category', () => {
    const client = createSmapClient()

    expect(client.searchPois({ tag: 'repair' }).map(poi => poi.id)).toEqual(['venus-dock'])
    expect(client.searchPois({ category: '住宿休息' }).map(poi => poi.id)).toEqual(['mars-hotel'])
    expect(client.searchPois({ query: '银河' }).map(poi => poi.id)).toContain('galactic-core-array')
  })

  it('emits layer change events', () => {
    const client = createSmapClient()
    const changedLayers: string[] = []

    const off = client.on('layer:changed', (layer) => {
      changedLayers.push(`${layer.id}:${layer.visible}`)
    })

    client.setLayerVisible('favorite', true)
    off()
    client.setLayerVisible('favorite', false)

    expect(changedLayers).toEqual(['favorite:true'])
  })

  it('accepts custom memory data sources', () => {
    const dataSource = createMemoryDataSource({
      waypoints: [
        {
          id: 'a',
          label: 'A',
          coordinate: { x: 0, y: 0 },
        },
        {
          id: 'b',
          label: 'B',
          coordinate: { x: 3, y: 4 },
        },
      ],
      routes: [],
      pois: [],
      layers: [],
    })

    const client = createSmapClient({ dataSource })
    const result = client.planRoute({ originId: 'a', destinationId: 'b' })

    expect(result.recommended.id).toBe('a-b-direct')
    expect(calculateDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
  })

  it('creates static data provider snapshots', async () => {
    const provider = createStaticSmapDataProvider({
      waypoints: [
        {
          id: 'a',
          label: 'A',
          coordinate: { x: 0, y: 0 },
        },
      ],
      routes: [],
      pois: [],
      layers: [],
    }, {
      label: 'Fallback',
      source: 'fixture',
    })

    const snapshot = await provider.getSnapshot({
      now: new Date('2026-07-08T00:00:00.000Z'),
    })

    expect(snapshot.status).toBe('static')
    expect(snapshot.source).toBe('fixture')
    expect(snapshot.label).toBe('Fallback')
    expect(snapshot.updatedAt).toBe('2026-07-08T00:00:00.000Z')
    expect(snapshot.dataSource.listWaypoints().map(waypoint => waypoint.id)).toEqual(['a'])
  })
})
