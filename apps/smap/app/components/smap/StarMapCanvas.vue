<script setup lang="ts">
import { computed } from 'vue'
import type { NavigationPosition, NavigationStatus } from './navigationSimulation'
import type { SmapEphemerisStatus } from './smapProviders'
import { starField } from './smapData'
import type { HazardZone, Waypoint } from './types'

interface AlternativeRoute {
  id: string
  color: string
  points: string
}

interface Props {
  activeRouteColor: string
  activeRoutePoints: string
  alternativeRoutePoints: AlternativeRoute[]
  dataSourceBodyCount: number
  dataSourceLabel: string
  dataSourceStatus: SmapEphemerisStatus
  dataSourceUpdatedAt: string
  enabledMapToolIds: readonly string[]
  hazards: HazardZone[]
  navigationPosition?: NavigationPosition
  navigationStatus: NavigationStatus
  selectedWaypointId: string
  waypoints: Waypoint[]
  zoomLevel: number
}

interface Emits {
  selectWaypoint: [waypointId: string]
  zoomIn: []
  zoomOut: []
  resetZoom: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const mapScaleStyle = computed(() => ({
  transform: `scale(${props.zoomLevel})`,
}))

const dataSourceTime = computed(() => formatDataSourceTime(props.dataSourceUpdatedAt))
const dataSourceTitle = computed(() => {
  const time = dataSourceTime.value
  const bodyCount = `${props.dataSourceBodyCount} 体`

  return time
    ? `${props.dataSourceLabel} · ${time} · ${bodyCount}`
    : `${props.dataSourceLabel} · ${bodyCount}`
})
const showFavorites = computed(() => props.enabledMapToolIds.includes('favorite'))
const showHazards = computed(() => props.enabledMapToolIds.includes('safety'))
const showLayers = computed(() => props.enabledMapToolIds.includes('layers'))
const showTraffic = computed(() => props.enabledMapToolIds.includes('traffic'))

function formatDataSourceTime(updatedAt: string): string {
  const date = new Date(updatedAt)

  if (Number.isNaN(date.getTime()))
    return ''

  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function hazardClass(hazard: HazardZone) {
  return [
    'star-map__hazard',
    `star-map__hazard--${hazard.tone}`,
  ]
}
</script>

<template>
  <section class="star-map" aria-label="星际地图">
    <div class="star-map__toolbar">
      <button class="star-map__view-select" type="button">
        <span aria-hidden="true">⌘</span>
        <span class="star-map__view-copy star-map__view-copy--desktop">星域视图</span>
        <span class="star-map__view-copy star-map__view-copy--mobile">标准地图</span>
        <span aria-hidden="true">⌄</span>
      </button>
      <div
        class="star-map__source-badge"
        :data-status="dataSourceStatus"
        :title="dataSourceTitle"
      >
        <span class="star-map__source-dot" aria-hidden="true"></span>
        <span>{{ dataSourceLabel }}</span>
        <span class="star-map__source-time">{{ dataSourceTime }}</span>
      </div>
    </div>

    <svg class="star-map__canvas" viewBox="0 0 1000 640" role="img" aria-label="从地球轨道港到火星中继站的星际航线图">
      <defs>
        <radialGradient id="smapGlowCyan" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ecffff" />
          <stop offset="38%" stop-color="#25f5f2" stop-opacity="0.92" />
          <stop offset="100%" stop-color="#25f5f2" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="smapGlowAmber" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff4d4" />
          <stop offset="42%" stop-color="#ffad2f" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#ffad2f" stop-opacity="0" />
        </radialGradient>
        <filter id="smapRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g class="star-map__scaled" :style="mapScaleStyle">
        <rect class="star-map__space" width="1000" height="640" />
        <g class="star-map__grid">
          <path d="M0 94 C180 36 335 36 500 94 S814 156 1000 82" />
          <path d="M0 242 C176 186 304 232 500 210 S790 108 1000 172" />
          <path d="M0 408 C185 360 292 420 500 386 S815 336 1000 390" />
          <path d="M0 572 C164 492 342 548 500 520 S782 472 1000 552" />
          <path d="M92 0 C126 175 126 408 88 640" />
          <path d="M298 0 C268 206 318 420 270 640" />
          <path d="M508 0 C490 214 528 402 506 640" />
          <path d="M720 0 C680 185 746 410 710 640" />
          <path d="M912 0 C880 228 936 405 900 640" />
        </g>

        <g class="star-map__stars">
          <circle
            v-for="star in starField"
            :key="`${star[0]}-${star[1]}`"
            :cx="star[0]"
            :cy="star[1]"
            :r="star[2]"
          />
        </g>

        <g class="star-map__regions">
          <text x="178" y="168">织女星域</text>
          <text x="418" y="358">猎户座旋臂</text>
          <text x="198" y="550">船底座星域</text>
          <text x="640" y="540">天炉座星云</text>
          <text x="800" y="350">女神星监测站</text>
        </g>

        <g v-if="showLayers" class="star-map__orbits">
          <circle cx="146" cy="405" r="46" />
          <circle cx="146" cy="405" r="72" />
          <circle cx="780" cy="274" r="48" />
          <circle cx="780" cy="274" r="74" />
          <circle cx="430" cy="250" r="84" />
          <circle cx="514" cy="168" r="72" />
        </g>

        <g v-if="showHazards" class="star-map__hazards">
          <g v-for="hazard in hazards" :key="hazard.id" :class="hazardClass(hazard)">
            <circle :cx="hazard.x" :cy="hazard.y" :r="hazard.radius" />
            <circle :cx="hazard.x" :cy="hazard.y" :r="hazard.radius * 0.58" />
            <text :x="hazard.x + 18" :y="hazard.y - 12">{{ hazard.label }}</text>
          </g>
        </g>

        <g class="star-map__routes star-map__routes--alternative">
          <polyline
            v-for="route in alternativeRoutePoints"
            :key="route.id"
            :points="route.points"
            :stroke="route.color"
          />
        </g>

        <g class="star-map__routes">
          <polyline class="star-map__route-glow" :points="activeRoutePoints" :stroke="activeRouteColor" />
          <polyline class="star-map__route-active" :points="activeRoutePoints" :stroke="activeRouteColor" />
          <polyline
            v-if="showTraffic"
            class="star-map__route-traffic"
            points="146,405 205,332 326,320"
          />
        </g>

        <g
          v-if="navigationPosition && navigationStatus !== 'idle'"
          class="star-map__vessel"
          :class="`star-map__vessel--${navigationStatus}`"
          :transform="`translate(${navigationPosition.x} ${navigationPosition.y})`"
          aria-label="当前航行位置"
        >
          <circle class="star-map__vessel-pulse" r="24" />
          <circle class="star-map__vessel-ring" r="14" />
          <path d="M0-12 8 10 0 6-8 10Z" />
        </g>

        <g v-if="showFavorites" class="star-map__favorites">
          <g transform="translate(326 320)">
            <path d="m0-19 4.6 9.3 10.2 1.5-7.4 7.2 1.7 10.1L0 4.3l-9.1 4.8L-7.4-1l-7.4-7.2 10.2-1.5L0-19Z" />
          </g>
          <g transform="translate(780 274)">
            <path d="m0-19 4.6 9.3 10.2 1.5-7.4 7.2 1.7 10.1L0 4.3l-9.1 4.8L-7.4-1l-7.4-7.2 10.2-1.5L0-19Z" />
          </g>
        </g>

        <g class="star-map__waypoints">
          <g
            v-for="waypoint in waypoints"
            :key="waypoint.id"
            class="star-map__waypoint"
            role="button"
            tabindex="0"
            :aria-label="`选择地点：${waypoint.label}`"
            :aria-pressed="waypoint.id === selectedWaypointId"
            :class="{
              'star-map__waypoint--selected': waypoint.id === selectedWaypointId,
              [`star-map__waypoint--${waypoint.role}`]: true,
            }"
            :transform="`translate(${waypoint.x} ${waypoint.y})`"
            @click="emit('selectWaypoint', waypoint.id)"
            @keydown.enter="emit('selectWaypoint', waypoint.id)"
            @keydown.space.prevent="emit('selectWaypoint', waypoint.id)"
          >
            <circle
              class="star-map__waypoint-ring"
              :r="waypoint.role === 'origin' || waypoint.role === 'destination' ? 20 : 16"
            />
            <circle
              class="star-map__waypoint-core"
              :r="waypoint.role === 'origin' || waypoint.role === 'destination' ? 11 : 8"
            />
            <rect class="star-map__waypoint-label-bg" x="15" y="-15" width="126" height="30" rx="6" />
            <text class="star-map__waypoint-label" x="28" y="5">{{ waypoint.label }}</text>
          </g>
        </g>
      </g>
    </svg>

    <div class="star-map__controls" aria-label="地图控件">
      <button class="star-map__control" type="button" aria-label="定位当前位置" @click="emit('resetZoom')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
        <span class="star-map__control-label">定位</span>
      </button>
      <button class="star-map__control" type="button" aria-label="放大" @click="emit('zoomIn')">
        <span class="star-map__control-symbol" aria-hidden="true">＋</span>
        <span class="star-map__control-label">放大</span>
      </button>
      <button class="star-map__control" type="button" aria-label="缩小" @click="emit('zoomOut')">
        <span class="star-map__control-symbol" aria-hidden="true">－</span>
        <span class="star-map__control-label">缩小</span>
      </button>
      <button class="star-map__control" type="button" aria-label="图层">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 3 8 4-8 4-8-4 8-4Z" />
          <path d="m4 12 8 4 8-4" />
          <path d="m4 17 8 4 8-4" />
        </svg>
        <span class="star-map__control-label">图层</span>
      </button>
    </div>

    <div class="star-map__compass" aria-label="指南针">
      <span>N</span>
      <i></i>
    </div>
  </section>
</template>

<style scoped>
.star-map {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 62%, rgba(39, 245, 242, 0.18), transparent 18%),
    radial-gradient(circle at 78% 48%, rgba(255, 173, 47, 0.13), transparent 18%),
    linear-gradient(160deg, #06131b 0%, #071b23 48%, #0a121b 100%);
}

.star-map__toolbar {
  position: absolute;
  z-index: 3;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.star-map__view-select {
  display: inline-flex;
  gap: 9px;
  align-items: center;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(164, 221, 231, 0.2);
  border-radius: 8px;
  color: #d3e6ec;
  background: rgba(7, 24, 31, 0.82);
  backdrop-filter: blur(12px);
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
}

.star-map__view-copy--mobile {
  display: none;
}

.star-map__source-badge {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  min-height: 36px;
  max-width: 240px;
  padding: 0 11px;
  border: 1px solid rgba(164, 221, 231, 0.18);
  border-radius: 8px;
  color: #d3e6ec;
  background: rgba(7, 24, 31, 0.78);
  backdrop-filter: blur(12px);
  font-size: 12px;
  font-weight: 680;
  line-height: 1;
  white-space: nowrap;
}

.star-map__source-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #99a9b1;
}

.star-map__source-badge[data-status="live"] .star-map__source-dot {
  background: #23d18b;
  box-shadow: 0 0 10px rgba(35, 209, 139, 0.8);
}

.star-map__source-badge[data-status="static"] .star-map__source-dot {
  background: #ffad2f;
  box-shadow: 0 0 10px rgba(255, 173, 47, 0.68);
}

.star-map__source-badge[data-status="error"] .star-map__source-dot {
  background: #f25545;
  box-shadow: 0 0 10px rgba(242, 85, 69, 0.72);
}

.star-map__source-time {
  overflow: hidden;
  max-width: 74px;
  color: rgba(211, 230, 236, 0.66);
  text-overflow: ellipsis;
}

.star-map__canvas {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 520px;
}

.star-map__scaled {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  transition: transform 220ms ease;
}

.star-map__space {
  fill: transparent;
}

.star-map__grid path {
  fill: none;
  stroke: rgba(160, 218, 229, 0.12);
  stroke-width: 1;
}

.star-map__stars circle {
  fill: #d9fbff;
  opacity: 0.88;
}

.star-map__stars circle:nth-child(3n) {
  fill: #ffcc75;
}

.star-map__stars circle:nth-child(4n) {
  fill: #31f0ee;
}

.star-map__regions text {
  fill: rgba(200, 224, 232, 0.42);
  font-size: 18px;
  font-weight: 620;
}

.star-map__orbits circle {
  fill: none;
  stroke: rgba(48, 229, 230, 0.22);
  stroke-dasharray: 4 8;
  stroke-width: 1.3;
}

.star-map__vessel {
  color: #fff;
  filter: drop-shadow(0 0 8px rgba(43, 244, 239, 0.9));
  pointer-events: none;
}

.star-map__vessel-pulse {
  fill: rgba(43, 244, 239, 0.08);
  stroke: rgba(43, 244, 239, 0.36);
  stroke-width: 1.5;
  transform-origin: center;
  animation: smap-vessel-pulse 1.8s ease-out infinite;
}

.star-map__vessel-ring {
  fill: rgba(5, 24, 31, 0.9);
  stroke: #2bf4ef;
  stroke-width: 2;
}

.star-map__vessel path {
  fill: currentColor;
  stroke: #0c5d63;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.star-map__vessel--paused {
  color: #ffcf76;
  filter: drop-shadow(0 0 8px rgba(255, 173, 47, 0.78));
}

.star-map__vessel--paused .star-map__vessel-pulse {
  animation-play-state: paused;
  stroke: rgba(255, 173, 47, 0.52);
}

.star-map__vessel--arrived {
  color: #6dffc9;
}

@keyframes smap-vessel-pulse {
  0% {
    opacity: 0.9;
    transform: scale(0.6);
  }

  100% {
    opacity: 0;
    transform: scale(1.25);
  }
}

@media (prefers-reduced-motion: reduce) {
  .star-map__vessel-pulse {
    animation: none;
  }
}

.star-map__hazard circle {
  fill: rgba(255, 173, 47, 0.06);
  stroke: #ffad2f;
  stroke-dasharray: 7 8;
  stroke-width: 2;
}

.star-map__hazard text {
  font-size: 16px;
  font-weight: 760;
}

.star-map__hazard--amber text {
  fill: #ffad2f;
}

.star-map__hazard--magenta circle {
  fill: rgba(255, 78, 160, 0.07);
  stroke: #ff4ea0;
}

.star-map__hazard--magenta text {
  fill: #ff6fae;
}

.star-map__hazard--cyan circle {
  fill: rgba(39, 245, 242, 0.06);
  stroke: #27f5f2;
}

.star-map__hazard--cyan text {
  fill: #28f5f1;
}

.star-map__routes polyline {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.star-map__routes--alternative polyline {
  stroke-dasharray: 10 12;
  stroke-width: 4;
  opacity: 0.72;
}

.star-map__route-glow {
  filter: url(#smapRouteGlow);
  opacity: 0.74;
  stroke-width: 11;
}

.star-map__route-active {
  stroke-width: 4.5;
}

.star-map__route-traffic {
  stroke: #ff7a00;
  stroke-dasharray: 2 12;
  stroke-width: 7;
  opacity: 0.92;
}

.star-map__favorites path {
  fill: #ffad2f;
  stroke: #fff1be;
  stroke-width: 2;
  filter: drop-shadow(0 0 10px rgba(255, 173, 47, 0.76));
}

.star-map__waypoint {
  color: #d9fbff;
  cursor: pointer;
  outline: none;
}

.star-map__waypoint-core {
  fill: #06313a;
  stroke: #dbffff;
  stroke-width: 3;
  filter: drop-shadow(0 0 9px rgba(39, 245, 242, 0.95));
}

.star-map__waypoint-ring {
  fill: rgba(39, 245, 242, 0.11);
  stroke: rgba(39, 245, 242, 0.42);
  stroke-width: 2;
}

.star-map__waypoint--origin .star-map__waypoint-core {
  fill: #27f5f2;
}

.star-map__waypoint--destination .star-map__waypoint-core {
  fill: #ffad2f;
  stroke: #ffe2a5;
  filter: drop-shadow(0 0 12px rgba(255, 173, 47, 0.95));
}

.star-map__waypoint--destination .star-map__waypoint-ring {
  fill: rgba(255, 173, 47, 0.13);
  stroke: rgba(255, 173, 47, 0.48);
}

.star-map__waypoint-label-bg {
  fill: rgba(5, 19, 25, 0.84);
  stroke: rgba(164, 221, 231, 0.22);
  stroke-width: 1;
}

.star-map__waypoint-label {
  fill: #dff6fb;
  font-size: 13px;
  font-weight: 650;
  pointer-events: none;
}

.star-map__waypoint--selected .star-map__waypoint-label-bg,
.star-map__waypoint:focus-visible .star-map__waypoint-label-bg {
  stroke: rgba(255, 173, 47, 0.84);
}

.star-map__waypoint--selected .star-map__waypoint-label {
  fill: #fff2cf;
}

.star-map__controls {
  position: absolute;
  z-index: 4;
  right: 14px;
  top: 150px;
  display: grid;
  overflow: hidden;
  border: 1px solid rgba(164, 221, 231, 0.18);
  border-radius: 8px;
  background: rgba(8, 25, 32, 0.82);
  backdrop-filter: blur(12px);
}

.star-map__controls button {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 0;
  border-bottom: 1px solid rgba(164, 221, 231, 0.14);
  color: #d8edf3;
  background: transparent;
  font-size: 25px;
  font-weight: 520;
  cursor: pointer;
}

.star-map__controls button:last-child {
  border-bottom: 0;
}

.star-map__controls button:hover {
  color: #27f5f2;
  background: rgba(39, 245, 242, 0.09);
}

.star-map__control-label {
  display: none;
}

.star-map__control-symbol {
  line-height: 1;
}

.star-map__controls svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.star-map__compass {
  position: absolute;
  z-index: 3;
  top: 22px;
  right: 20px;
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border: 1px solid rgba(190, 226, 234, 0.26);
  border-radius: 50%;
  color: #f6fbff;
  background: rgba(6, 21, 28, 0.76);
  font-size: 11px;
  font-weight: 780;
}

.star-map__compass i {
  position: absolute;
  top: 18px;
  width: 0;
  height: 0;
  border-right: 6px solid transparent;
  border-bottom: 20px solid #f04d41;
  border-left: 6px solid transparent;
  transform: rotate(15deg);
}

@media (max-width: 1120px) {
  .star-map__canvas {
    min-height: 560px;
  }
}

@media (max-width: 760px) {
  .star-map {
    height: 100%;
    background:
      linear-gradient(90deg, rgba(111, 158, 132, 0.18) 1px, transparent 1px),
      linear-gradient(0deg, rgba(111, 158, 132, 0.18) 1px, transparent 1px),
      radial-gradient(circle at 24% 34%, rgba(255, 255, 255, 0.9), transparent 18%),
      linear-gradient(135deg, #e8f1ec 0%, #edf3f2 52%, #e2edf1 100%);
    background-size: 74px 74px, 74px 74px, auto, auto;
  }

  .star-map__toolbar {
    top: 128px;
    left: 16px;
  }

  .star-map__view-select {
    border-color: var(--smap-ui-border-strong);
    color: var(--smap-ui-text);
    background: var(--smap-ui-surface-raised);
    box-shadow: 0 10px 24px rgba(32, 45, 54, 0.14);
  }

  .star-map__source-badge {
    min-height: 36px;
    max-width: 132px;
    padding: 0 10px;
    border-color: var(--smap-ui-border-strong);
    color: var(--smap-ui-text);
    background: var(--smap-ui-surface-raised);
    box-shadow: 0 10px 24px rgba(32, 45, 54, 0.14);
    font-size: 12px;
  }

  .star-map__source-time {
    display: none;
  }

  .star-map__view-copy--desktop {
    display: none;
  }

  .star-map__view-copy--mobile {
    display: inline;
  }

  .star-map__grid path {
    stroke: rgba(80, 137, 110, 0.28);
    stroke-width: 2.2;
  }

  .star-map__stars circle {
    fill: #6d8794;
    opacity: 0.18;
  }

  .star-map__stars circle:nth-child(3n),
  .star-map__stars circle:nth-child(4n) {
    fill: #6d8794;
  }

  .star-map__regions text {
    fill: rgba(67, 88, 102, 0.42);
    font-size: 20px;
    font-weight: 760;
  }

  .star-map__orbits circle {
    stroke: rgba(69, 132, 103, 0.34);
    stroke-dasharray: 8 8;
    stroke-width: 2;
  }

  .star-map__hazard circle {
    fill: rgba(255, 122, 0, 0.08);
    stroke: rgba(255, 122, 0, 0.82);
    stroke-width: 2.4;
  }

  .star-map__hazard--magenta circle {
    fill: rgba(242, 85, 69, 0.08);
    stroke: rgba(242, 85, 69, 0.82);
  }

  .star-map__hazard--cyan circle {
    fill: rgba(22, 119, 255, 0.08);
    stroke: rgba(22, 119, 255, 0.78);
  }

  .star-map__hazard text {
    fill: rgba(74, 88, 98, 0.82);
    font-size: 15px;
    paint-order: stroke;
    stroke: rgba(255, 255, 255, 0.9);
    stroke-width: 4px;
  }

  .star-map__routes--alternative polyline {
    stroke-width: 6;
    opacity: 0.52;
  }

  .star-map__route-glow {
    filter: none;
    opacity: 0.2;
    stroke: var(--smap-primary);
    stroke-width: 13;
  }

  .star-map__route-active {
    stroke: var(--smap-primary);
    stroke-width: 7;
  }

  .star-map__route-traffic {
    stroke: #f25545;
    stroke-dasharray: 18 12;
    stroke-width: 8;
    opacity: 0.9;
  }

  .star-map__favorites path {
    fill: #ff8f1f;
    filter: none;
    stroke: #fff;
    stroke-width: 3;
  }

  .star-map__waypoint-core {
    fill: #fff;
    filter: none;
    stroke: var(--smap-primary);
    stroke-width: 4;
  }

  .star-map__waypoint-ring {
    fill: rgba(22, 119, 255, 0.12);
    stroke: rgba(22, 119, 255, 0.34);
    stroke-width: 3;
  }

  .star-map__waypoint--origin .star-map__waypoint-core {
    fill: var(--smap-route-origin);
    stroke: #fff;
  }

  .star-map__waypoint--origin .star-map__waypoint-ring {
    fill: rgba(0, 181, 120, 0.14);
    stroke: rgba(0, 181, 120, 0.36);
  }

  .star-map__waypoint--destination .star-map__waypoint-core {
    fill: var(--smap-orange);
    filter: none;
    stroke: #fff;
  }

  .star-map__waypoint--destination .star-map__waypoint-ring {
    fill: rgba(255, 122, 0, 0.14);
    stroke: rgba(255, 122, 0, 0.38);
  }

  .star-map__waypoint-label-bg {
    fill: rgba(255, 255, 255, 0.96);
    stroke: rgba(199, 214, 222, 0.92);
    stroke-width: 1.2;
  }

  .star-map__waypoint-label {
    fill: #26343d;
    font-size: 12px;
    font-weight: 760;
  }

  .star-map__waypoint--selected .star-map__waypoint-label-bg,
  .star-map__waypoint:focus-visible .star-map__waypoint-label-bg {
    stroke: var(--smap-primary);
  }

  .star-map__waypoint--selected .star-map__waypoint-label {
    fill: var(--smap-primary);
  }

  .star-map__canvas {
    position: absolute;
    top: 0;
    left: 50%;
    width: calc(100dvh * 1.5625);
    max-width: none;
    height: 100dvh;
    min-height: 100dvh;
    transform: translateX(-50%);
  }

  .star-map__controls {
    top: 202px;
    right: 12px;
    bottom: auto;
    grid-template-columns: 54px;
    transform: none;
    border-color: var(--smap-ui-border-strong);
    border-radius: 14px;
    color: var(--smap-ui-text);
    background: var(--smap-ui-surface-raised);
    box-shadow: 0 10px 24px rgba(32, 45, 54, 0.14);
  }

  .star-map__controls button {
    display: grid;
    place-items: center;
    width: 54px;
    height: 56px;
    border-right: 0;
    border-bottom: 1px solid var(--smap-ui-border);
    color: var(--smap-ui-text);
    font-size: 22px;
  }

  .star-map__controls button:last-child {
    border-bottom: 0;
  }

  .star-map__controls button:hover {
    color: var(--smap-primary);
    background: rgba(22, 119, 255, 0.08);
  }

  .star-map__control-label {
    display: block;
    margin-top: 3px;
    color: var(--smap-ui-muted);
    font-size: 11px;
    font-weight: 690;
    line-height: 1;
  }

  .star-map__controls svg {
    width: 21px;
    height: 21px;
    stroke-width: 2;
  }

  .star-map__compass {
    top: 140px;
    right: 20px;
    width: 58px;
    height: 58px;
    border-color: var(--smap-ui-border-strong);
    color: var(--smap-ui-text);
    background: var(--smap-ui-surface-raised);
    box-shadow: 0 10px 24px rgba(32, 45, 54, 0.14);
  }

  .star-map__waypoint-label {
    font-size: 12px;
  }
}

@media (prefers-color-scheme: dark) and (max-width: 760px) {
  .star-map {
    background:
      linear-gradient(90deg, rgba(114, 146, 132, 0.12) 1px, transparent 1px),
      linear-gradient(0deg, rgba(114, 146, 132, 0.12) 1px, transparent 1px),
      linear-gradient(135deg, #111a20 0%, #141f26 54%, #10171d 100%);
    background-size: 74px 74px, 74px 74px, auto;
  }

  .star-map__view-select,
  .star-map__source-badge,
  .star-map__controls,
  .star-map__compass {
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.3);
  }

  .star-map__grid path {
    stroke: rgba(124, 160, 143, 0.18);
  }

  .star-map__regions text {
    fill: rgba(173, 193, 204, 0.32);
  }

  .star-map__stars circle,
  .star-map__stars circle:nth-child(3n),
  .star-map__stars circle:nth-child(4n) {
    fill: #a9bfca;
    opacity: 0.12;
  }

  .star-map__hazard text {
    fill: rgba(220, 233, 238, 0.82);
    stroke: rgba(17, 26, 32, 0.9);
  }

  .star-map__waypoint-label-bg {
    fill: rgba(24, 34, 42, 0.96);
    stroke: rgba(55, 72, 84, 0.94);
  }

  .star-map__waypoint-label {
    fill: #eef7fb;
  }

  .star-map__waypoint-core {
    fill: #17222b;
  }
}
</style>
