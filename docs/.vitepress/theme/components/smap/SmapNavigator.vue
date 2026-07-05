<script setup lang="ts">
import MobileNavigationSheet from './MobileNavigationSheet.vue'
import RoutePlannerPanel from './RoutePlannerPanel.vue'
import RouteTimeline from './RouteTimeline.vue'
import SmapTopBar from './SmapTopBar.vue'
import StarMapCanvas from './StarMapCanvas.vue'
import TelemetryPanel from './TelemetryPanel.vue'
import { useSmapNavigation } from './useSmapNavigation'

const {
  activeMode,
  activeModeId,
  activeRoute,
  activeRouteId,
  activeRoutePoints,
  activeRouteWaypoints,
  alternativeRoutePoints,
  hazardZones,
  isNavigating,
  routeOptions,
  routeProgress,
  selectMode,
  selectRoute,
  selectWaypoint,
  selectedWaypoint,
  selectedWaypointId,
  telemetryMetrics,
  toggleNavigation,
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
    <SmapTopBar :is-navigating="isNavigating" />

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
      :active-route-id="activeRouteId"
      :is-navigating="isNavigating"
      :route="activeRoute"
      :routes="routeOptions"
      @select-route="selectRoute"
      @toggle-navigation="toggleNavigation"
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
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  border: 1px solid rgba(122, 239, 236, 0.14);
  color: #d9edf3;
  background: #051118;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
