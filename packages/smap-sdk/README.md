# @yunyoujun/smap-sdk

TypeScript SDK for integrating SMAP map data, route planning, POI search, layer state, and event subscriptions.

## Install

```bash
pnpm add @yunyoujun/smap-sdk
```

## Usage

```ts
import { createSmapClient } from '@yunyoujun/smap-sdk'

const smap = createSmapClient()

const result = smap.planRoute({
  originId: 'earth-port',
  destinationId: 'mars-relay',
  strategy: 'fastest',
})

smap.selectRoute(result.recommended.id)
smap.setLayerVisible('traffic', true)
```

## Integration Surface

- `createSmapClient()` creates an in-memory SDK client.
- `planRoute()` returns a recommended route and alternatives.
- `searchPois()` supports query, category, tag, and limit filters.
- `setLayerVisible()` toggles SDK layer state.
- `on()` / `off()` provide typed event subscriptions.
- `createMemoryDataSource()` lets third parties inject their own waypoints, routes, POIs, and layers.

## License

[MIT](./LICENSE) License © [YunYouJun](https://github.com/YunYouJun)
