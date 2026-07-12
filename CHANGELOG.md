# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/zh-CN/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/).

## [Unreleased]

### Added

- Desktop exploration and ride-hailing workspaces with shared map and service state

### Changed

- Align desktop service navigation, routes, map tools, place selection, ride options, and response feedback with mobile
- Preserve route, layer, place, ride, and navigation state while switching between app services

### Fixed

- Keep the active service, top navigation, bottom tabs, and URL in sync across viewport sizes

### Removed

## [0.1.0] - 2026-07-13

### Added

- Standalone Nuxt interstellar navigation application
- Mobile map, route planning, exploration, ride-hailing, and profile flows
- `@yunyoujun/smap-sdk` with typed routes, layers, POIs, events, and data providers
- YunLeFun SSO and CloudBase account integration
- Optional JPL Horizons ephemeris provider with static fallback data
- VitePress and TypeDoc documentation
- Playwright desktop and mobile application smoke tests

### Changed

- Default Pages deployment to an explicit static ephemeris mode
- Limit npm publication to `@yunyoujun/smap-sdk`
- Add release checks, public package metadata, provenance, and CI application type checking

### Fixed

- Avoid requesting an unavailable Nitro API from static deployments
- Hide silent authentication timeouts and translate interactive failures into user-facing messages
- Align EdgeOne output and Node.js configuration with the generated static application

### Removed

- Starter-template `pkg-placeholder` package and its workspace references

## [0.0.0] - 2025-01-03

### Added

- Initial release
