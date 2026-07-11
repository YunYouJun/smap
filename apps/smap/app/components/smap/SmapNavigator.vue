<script setup lang="ts">
import type { MobileService } from './types'
import MobileNavigationSheet from './MobileNavigationSheet.vue'
import RoutePlannerPanel from './RoutePlannerPanel.vue'
import RouteTimeline from './RouteTimeline.vue'
import SmapAccountStatus from './SmapAccountStatus.vue'
import SmapTopBar from './SmapTopBar.vue'
import StarMapCanvas from './StarMapCanvas.vue'
import TelemetryPanel from './TelemetryPanel.vue'
import { useSmapNavigation } from './useSmapNavigation'

interface Props {
  initialService?: MobileService
}

const props = withDefaults(defineProps<Props>(), {
  initialService: 'navigation',
})

const {
  activeMobileService,
  activeMode,
  activeModeId,
  activeRideOption,
  activeRideOptionId,
  activeRoute,
  activeRouteId,
  activeRoutePoints,
  activeRouteWaypoints,
  activeSearchRole,
  alternativeRoutePoints,
  destination,
  enabledMapToolIds,
  ephemerisState,
  exploreSpots,
  hazardZones,
  isNavigating,
  isRideRequested,
  mapTools,
  mobileServices,
  origin,
  profileActions,
  rideOptions,
  routeOptions,
  routeProgress,
  routeSearchQuery,
  routeSearchResults,
  clearRouteSearch,
  focusRouteSearch,
  resetRouteEndpoint,
  selectMobileService,
  selectMode,
  selectRideOption,
  selectRoute,
  selectRouteSearchResult,
  selectWaypoint,
  selectedWaypoint,
  selectedWaypointId,
  submitRouteSearch,
  swapRouteEndpoints,
  telemetryMetrics,
  toggleMapTool,
  toggleNavigation,
  toggleRideRequest,
  travelModes,
  updateRouteSearchQuery,
  waypoints,
  zoomIn,
  zoomLevel,
  zoomOut,
  resetZoom,
} = useSmapNavigation(props.initialService)
</script>

<template>
  <div class="smap-navigator">
    <SmapTopBar
      :active-service="activeMobileService"
      :active-search-role="activeSearchRole"
      :destination="destination"
      :is-navigating="isNavigating"
      :origin="origin"
      :search-query="routeSearchQuery"
      :search-results="routeSearchResults"
      :services="mobileServices"
      @clear-route-search="clearRouteSearch"
      @focus-route-search="focusRouteSearch"
      @select-service="selectMobileService"
      @select-route-search-result="selectRouteSearchResult"
      @submit-route-search="submitRouteSearch"
      @swap-route-endpoints="swapRouteEndpoints"
      @update-route-search-query="updateRouteSearchQuery"
    />

    <main class="smap-navigator__workspace">
      <RoutePlannerPanel
        :active-mode-id="activeModeId"
        :active-route-id="activeRouteId"
        :active-search-role="activeSearchRole"
        :destination="destination"
        :is-navigating="isNavigating"
        :modes="travelModes"
        :origin="origin"
        :routes="routeOptions"
        @focus-route-search="focusRouteSearch"
        @reset-route-endpoint="resetRouteEndpoint"
        @select-mode="selectMode"
        @select-route="selectRoute"
        @swap-route-endpoints="swapRouteEndpoints"
        @toggle-navigation="toggleNavigation"
      />

      <StarMapCanvas
        :active-route-color="activeRoute.color"
        :active-route-points="activeRoutePoints"
        :alternative-route-points="alternativeRoutePoints"
        :data-source-body-count="ephemerisState.bodies.length"
        :data-source-label="ephemerisState.sourceLabel"
        :data-source-status="ephemerisState.status"
        :data-source-updated-at="ephemerisState.updatedAt"
        :enabled-map-tool-ids="enabledMapToolIds"
        :hazards="hazardZones"
        :selected-waypoint-id="selectedWaypointId"
        :waypoints="waypoints"
        :zoom-level="zoomLevel"
        @reset-zoom="resetZoom"
        @select-waypoint="selectWaypoint"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
      />

      <TelemetryPanel
        :hazards="hazardZones"
        :metrics="telemetryMetrics"
        :progress="routeProgress"
        :route="activeRoute"
        :selected-waypoint="selectedWaypoint"
      />
    </main>

    <MobileNavigationSheet
      :active-ride-option-id="activeRideOptionId"
      :active-route-id="activeRouteId"
      :active-service="activeMobileService"
      :enabled-map-tool-ids="enabledMapToolIds"
      :explore-spots="exploreSpots"
      :is-navigating="isNavigating"
      :is-ride-requested="isRideRequested"
      :map-tools="mapTools"
      :profile-actions="profileActions"
      :ride-option="activeRideOption"
      :ride-options="rideOptions"
      :destination="destination"
      :origin="origin"
      :route="activeRoute"
      :routes="routeOptions"
      @select-ride-option="selectRideOption"
      @select-route="selectRoute"
      @select-service="selectMobileService"
      @select-waypoint="selectWaypoint"
      @toggle-map-tool="toggleMapTool"
      @toggle-navigation="toggleNavigation"
      @toggle-ride-request="toggleRideRequest"
    >
      <template #profile-account>
        <SmapAccountStatus variant="profile" />
      </template>
    </MobileNavigationSheet>

    <RouteTimeline
      :is-navigating="isNavigating"
      :route="activeRoute"
      :waypoints="activeRouteWaypoints"
    />

    <p class="smap-navigator__mode-note">
      当前策略：{{ activeMode.label }} · {{ activeMode.description }}
    </p>
  </div>
</template>

<style scoped>
.smap-navigator {
  --smap-panel-width: 338px;
  --smap-telemetry-width: 304px;
  --smap-ui-surface: rgba(248, 251, 255, 0.98);
  --smap-ui-surface-raised: rgba(248, 251, 255, 0.96);
  --smap-ui-surface-soft: #eef3f6;
  --smap-ui-card: #fff;
  --smap-ui-card-active: #f0f7ff;
  --smap-ui-card-taxi: #fff8f0;
  --smap-ui-border: #dbe5eb;
  --smap-ui-border-strong: rgba(210, 223, 231, 0.94);
  --smap-ui-text: #17252d;
  --smap-ui-text-soft: #26343d;
  --smap-ui-muted: #667682;
  --smap-ui-subtle: #7b8a95;
  --smap-ui-handle: #c8d4dc;
  --smap-ui-divider: #aebec8;
  --smap-ui-shadow: 0 18px 34px rgba(0, 0, 0, 0.18);
  --smap-ui-sheet-shadow: 0 -20px 44px rgba(5, 14, 21, 0.22);
  --smap-primary: #1677ff;
  --smap-primary-strong: #0b58d6;
  --smap-primary-soft: #f0f7ff;
  --smap-green: #00a870;
  --smap-green-soft: #e6f8f1;
  --smap-route-origin: #59e8bd;
  --smap-orange: #ff7a00;
  --smap-orange-text: #a24500;
  --smap-orange-soft: #fff3e1;
  --smap-orange-card: #fff8f0;
  --smap-orange-border: #f5d2b1;
  --smap-on-primary: #fff;
  --smap-page-bg: #051118;
  color-scheme: light;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  border: 1px solid rgba(122, 239, 236, 0.14);
  color: #d9edf3;
  background: var(--smap-page-bg);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

@media (prefers-color-scheme: dark) {
  .smap-navigator {
    --smap-ui-surface: rgba(15, 24, 33, 0.98);
    --smap-ui-surface-raised: rgba(18, 29, 39, 0.95);
    --smap-ui-surface-soft: #172432;
    --smap-ui-card: #101c27;
    --smap-ui-card-active: #102842;
    --smap-ui-card-taxi: #251d16;
    --smap-ui-border: #263847;
    --smap-ui-border-strong: rgba(54, 73, 88, 0.92);
    --smap-ui-text: #eef7fb;
    --smap-ui-text-soft: #d8e6ed;
    --smap-ui-muted: #98aab6;
    --smap-ui-subtle: #8597a3;
    --smap-ui-handle: #536574;
    --smap-ui-divider: #607584;
    --smap-ui-shadow: 0 18px 34px rgba(0, 0, 0, 0.34);
    --smap-ui-sheet-shadow: 0 -22px 48px rgba(0, 0, 0, 0.46);
    --smap-primary: #4b9bff;
    --smap-primary-strong: #90c2ff;
    --smap-primary-soft: rgba(54, 139, 255, 0.16);
    --smap-green: #39dca2;
    --smap-green-soft: rgba(57, 220, 162, 0.14);
    --smap-route-origin: #59e8bd;
    --smap-orange: #ff9a3d;
    --smap-orange-text: #ffd4a7;
    --smap-orange-soft: rgba(255, 154, 61, 0.16);
    --smap-orange-card: rgba(255, 154, 61, 0.1);
    --smap-orange-border: rgba(255, 154, 61, 0.36);
    --smap-page-bg: #051118;
    color-scheme: dark;
  }
}

:global(.dark) .smap-navigator {
  --smap-ui-surface: rgba(15, 24, 33, 0.98);
  --smap-ui-surface-raised: rgba(18, 29, 39, 0.95);
  --smap-ui-surface-soft: #172432;
  --smap-ui-card: #101c27;
  --smap-ui-card-active: #102842;
  --smap-ui-card-taxi: #251d16;
  --smap-ui-border: #263847;
  --smap-ui-border-strong: rgba(54, 73, 88, 0.92);
  --smap-ui-text: #eef7fb;
  --smap-ui-text-soft: #d8e6ed;
  --smap-ui-muted: #98aab6;
  --smap-ui-subtle: #8597a3;
  --smap-ui-handle: #536574;
  --smap-ui-divider: #607584;
  --smap-ui-shadow: 0 18px 34px rgba(0, 0, 0, 0.34);
  --smap-ui-sheet-shadow: 0 -22px 48px rgba(0, 0, 0, 0.46);
  --smap-primary: #4b9bff;
  --smap-primary-strong: #90c2ff;
  --smap-primary-soft: rgba(54, 139, 255, 0.16);
  --smap-green: #39dca2;
  --smap-green-soft: rgba(57, 220, 162, 0.14);
  --smap-route-origin: #59e8bd;
  --smap-orange: #ff9a3d;
  --smap-orange-text: #ffd4a7;
  --smap-orange-soft: rgba(255, 154, 61, 0.16);
  --smap-orange-card: rgba(255, 154, 61, 0.1);
  --smap-orange-border: rgba(255, 154, 61, 0.36);
  --smap-page-bg: #051118;
  color-scheme: dark;
}

.smap-navigator__workspace {
  display: grid;
  grid-template-columns: var(--smap-panel-width) minmax(420px, 1fr) var(--smap-telemetry-width);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.smap-navigator__mode-note {
  position: absolute;
  overflow: hidden;
  width: 1px;
  height: 1px;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

@media (max-width: 1120px) {
  .smap-navigator {
    height: auto;
    overflow: visible;
  }

  .smap-navigator__workspace {
    grid-template-columns: 1fr;
    overflow: visible;
  }
}

@media (max-width: 760px) {
  .smap-navigator {
    --smap-ui-surface: rgba(255, 255, 255, 0.98);
    --smap-ui-surface-raised: #fff;
    --smap-ui-surface-soft: #f4f7f9;
    --smap-ui-card: #fff;
    --smap-ui-card-active: #f0f7ff;
    --smap-ui-card-taxi: #fff8f0;
    --smap-ui-border: #dce5eb;
    --smap-ui-border-strong: rgba(207, 219, 226, 0.94);
    --smap-ui-text: #182730;
    --smap-ui-text-soft: #273842;
    --smap-ui-muted: #667782;
    --smap-ui-subtle: #7b8b95;
    --smap-ui-handle: #c6d1d8;
    --smap-ui-divider: #cdd8df;
    --smap-ui-shadow: 0 12px 28px rgba(32, 45, 54, 0.16);
    --smap-ui-sheet-shadow: 0 -18px 38px rgba(31, 44, 54, 0.18);
    --smap-primary: #1677ff;
    --smap-primary-strong: #0b58d6;
    --smap-primary-soft: #f0f7ff;
    --smap-green: #00a870;
    --smap-green-soft: #e7f7f0;
    --smap-route-origin: #00b578;
    --smap-orange: #ff7a00;
    --smap-orange-text: #a24500;
    --smap-orange-soft: #fff3e1;
    --smap-orange-card: #fff8f0;
    --smap-orange-border: #f5d2b1;
    --smap-page-bg: #edf4f2;
    color-scheme: light;
    position: relative;
    display: block;
    height: 100dvh;
    min-height: 100vh;
    overflow: hidden;
    border: 0;
    color: var(--smap-ui-text);
    background: var(--smap-page-bg);
  }

  .smap-navigator__workspace {
    position: absolute;
    inset: 0;
    display: block;
    overflow: hidden;
  }

  .smap-navigator__workspace :deep(.star-map) {
    width: 100%;
    height: 100%;
  }

  .smap-navigator__workspace :deep(.route-panel) {
    display: none;
  }

  .smap-navigator__workspace :deep(.telemetry-panel) {
    display: none;
  }

  .smap-navigator :deep(.route-timeline) {
    display: none;
  }
}

@media (prefers-color-scheme: dark) and (max-width: 760px) {
  .smap-navigator {
    --smap-ui-surface: rgba(19, 27, 34, 0.98);
    --smap-ui-surface-raised: rgba(24, 34, 42, 0.98);
    --smap-ui-surface-soft: #202c35;
    --smap-ui-card: #17222b;
    --smap-ui-card-active: #102842;
    --smap-ui-card-taxi: #251d16;
    --smap-ui-border: #2b3b47;
    --smap-ui-border-strong: rgba(55, 72, 84, 0.94);
    --smap-ui-text: #eef7fb;
    --smap-ui-text-soft: #dce9ee;
    --smap-ui-muted: #9dafba;
    --smap-ui-subtle: #8797a2;
    --smap-ui-handle: #566875;
    --smap-ui-divider: #536675;
    --smap-ui-shadow: 0 14px 30px rgba(0, 0, 0, 0.3);
    --smap-ui-sheet-shadow: 0 -20px 42px rgba(0, 0, 0, 0.42);
    --smap-primary: #4b9bff;
    --smap-primary-strong: #90c2ff;
    --smap-primary-soft: rgba(54, 139, 255, 0.16);
    --smap-green: #39dca2;
    --smap-green-soft: rgba(57, 220, 162, 0.14);
    --smap-route-origin: #39dca2;
    --smap-orange: #ff9a3d;
    --smap-orange-text: #ffd4a7;
    --smap-orange-soft: rgba(255, 154, 61, 0.16);
    --smap-orange-card: rgba(255, 154, 61, 0.1);
    --smap-orange-border: rgba(255, 154, 61, 0.36);
    --smap-page-bg: #111a20;
    color-scheme: dark;
  }
}
</style>
