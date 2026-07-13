# SMAP App

SMAP is the standalone Nuxt SPA for the interstellar navigation experience. The VitePress site keeps the documentation and demo entry, while this app owns product runtime concerns such as YunLeFun login, account state, mobile tab routing, and static Pages deployment.

Product and UI decisions are documented in `docs/design/index.md`.

The app consumes `@yunyoujun/smap-sdk` through `app/components/smap/smapData.ts`. The SDK owns route, waypoint, POI, layer, and event data, while the app adapter keeps UI-only labels, mobile service cards, ride-hailing options, and profile actions.

## App Routes

The lightweight app shell uses nested Nuxt pages, semantic navigation links, and CSS safe-area handling. It avoids loading a full mobile component runtime for the custom map interface.

```text
/tabs/map       Navigation map
/tabs/ride      Ride hailing
/tabs/explore   Nearby exploration
/tabs/profile   YunLeFun account services
```

## Development

Run from the repository root:

```bash
pnpm app:dev
```

Use the app-specific script when multiple apps need to be explicit:

```bash
pnpm smap:dev
```

Or run inside this app directory:

```bash
pnpm dev
```

The local dev server uses port `5174`.

## YunLeFun Auth

Copy `.env.example` to `.env` when local overrides are needed:

```bash
cp apps/smap/.env.example apps/smap/.env
```

Public runtime variables:

```bash
NUXT_PUBLIC_SMAP_EPHEMERIS_API=
NUXT_PUBLIC_YUNLEFUN_CLOUDBASE_ENV=yunlefun-8g7ybcxc7345c490
NUXT_PUBLIC_YUNLEFUN_SSO_ORIGIN=https://www.yunle.fun
```

Leave `NUXT_PUBLIC_SMAP_EPHEMERIS_API` empty for static Pages deployments. The app will use its bundled ephemeris data without issuing a missing `/api` request. Set it to an absolute URL, or `/api/smap/horizons` for a Nuxt server deployment, to enable the live JPL Horizons provider.

The app runs with `ssr: false`, so YunLeFun SSO and CloudBase auth stay browser-side.

## Static Deployment

Generate static assets from the repository root:

```bash
pnpm app:generate
```

Deploy this output directory to EdgeOne Pages or Cloudflare Pages:

```text
apps/smap/dist
```

Recommended Pages settings:

```text
Build command: pnpm app:generate
Output directory: apps/smap/dist
Node.js version: 22
```

## Checks

```bash
pnpm app:typecheck
pnpm app:generate
pnpm lint
```
