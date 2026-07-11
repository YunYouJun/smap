<script setup lang="ts">
import MobileNavigationSheet from './MobileNavigationSheet.vue'
import RoutePlannerPanel from './RoutePlannerPanel.vue'
import RouteTimeline from './RouteTimeline.vue'
import SmapTopBar from './SmapTopBar.vue'
import StarMapCanvas from './StarMapCanvas.vue'
import TelemetryPanel from './TelemetryPanel.vue'
import { useSmapNavigation } from './useSmapNavigation'

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
  alternativeRoutePoints,
  hazardZones,
  isNavigating,
  isRideRequested,
  rideOptions,
  routeOptions,
  routeProgress,
  selectMobileService,
  selectMode,
  selectRideOption,
  selectRoute,
  selectWaypoint,
  selectedWaypoint,
  selectedWaypointId,
  telemetryMetrics,
  toggleNavigation,
  toggleRideRequest,
  travelModes,
  waypoints,
  zoomIn,
  zoomLevel,
  zoomOut,
  resetZoom,
} = useSmapNavigation()
</script>

<template>
  <div class="smap-navigator">
    <SmapTopBar
      :active-service="activeMobileService"
      :is-navigating="isNavigating"
      @select-service="selectMobileService"
    />

    <main class="smap-navigator__workspace">
      <RoutePlannerPanel
        :active-mode-id="activeModeId"
        :active-route-id="activeRouteId"
        :is-navigating="isNavigating"
        :modes="travelModes"
        :routes="routeOptions"
        @select-mode="selectMode"
        @select-route="selectRoute"
        @toggle-navigation="toggleNavigation"
      />

      <StarMapCanvas
        :active-route-color="activeRoute.color"
        :active-route-points="activeRoutePoints"
        :alternative-route-points="alternativeRoutePoints"
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
      :is-navigating="isNavigating"
      :is-ride-requested="isRideRequested"
      :ride-option="activeRideOption"
      :ride-options="rideOptions"
      :route="activeRoute"
      :routes="routeOptions"
      @select-ride-option="selectRideOption"
      @select-route="selectRoute"
      @select-service="selectMobileService"
      @toggle-navigation="toggleNavigation"
      @toggle-ride-request="toggleRideRequest"
    />

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
    position: relative;
    display: block;
    height: 100dvh;
    min-height: 100vh;
    overflow: hidden;
    border: 0;
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
</style>
