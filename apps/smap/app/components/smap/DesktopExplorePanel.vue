<script setup lang="ts">
import type { SmapIconName } from './iconTypes'
import type { ExploreSpot, MapTool } from './types'
import SmapIcon from './SmapIcon.vue'

interface Props {
  enabledMapToolIds: readonly string[]
  exploreSpots: ExploreSpot[]
  mapTools: MapTool[]
  selectedWaypointId: string
}

interface Emits {
  selectWaypoint: [waypointId: string]
  toggleMapTool: [toolId: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t, td } = useSmapI18n()

function isMapToolEnabled(toolId: string): boolean {
  return props.enabledMapToolIds.includes(toolId)
}

function mapToolIcon(icon: MapTool['icon']): SmapIconName {
  return icon === 'safety' ? 'shield' : icon
}
</script>

<template>
  <aside class="desktop-explore-panel" :aria-label="t('explore.title')">
    <header class="desktop-explore-panel__header">
      <div>
        <span class="desktop-explore-panel__eyebrow">EXPLORE</span>
        <h2>{{ t('explore.title') }}</h2>
      </div>
      <span class="desktop-explore-panel__count">{{ t('explore.count', { count: exploreSpots.length }) }}</span>
    </header>

    <p class="desktop-explore-panel__intro">{{ t('explore.intro') }}</p>

    <section class="desktop-explore-panel__section" aria-labelledby="desktop-map-tools-title">
      <div class="desktop-explore-panel__section-head">
        <h3 id="desktop-map-tools-title">{{ t('explore.tools') }}</h3>
        <span>{{ t('explore.enabled', { active: enabledMapToolIds.length, total: mapTools.length }) }}</span>
      </div>

      <div class="desktop-explore-panel__tools">
        <button
          v-for="tool in mapTools"
          :key="tool.id"
          class="desktop-explore-panel__tool"
          :class="{ 'desktop-explore-panel__tool--active': isMapToolEnabled(tool.id) }"
          type="button"
          :aria-pressed="isMapToolEnabled(tool.id)"
          @click="emit('toggleMapTool', tool.id)"
        >
          <span class="desktop-explore-panel__tool-icon" aria-hidden="true"><SmapIcon :name="mapToolIcon(tool.icon)" :size="17" /></span>
          <span>
            <strong>{{ td(tool.label) }}</strong>
            <small>{{ td(tool.description) }}</small>
          </span>
          <i aria-hidden="true"></i>
        </button>
      </div>
    </section>

    <section class="desktop-explore-panel__section desktop-explore-panel__section--spots" aria-labelledby="desktop-nearby-title">
      <div class="desktop-explore-panel__section-head">
        <h3 id="desktop-nearby-title">{{ t('explore.nearby') }}</h3>
        <span>{{ t('explore.sort') }}</span>
      </div>

      <div class="desktop-explore-panel__spots">
        <button
          v-for="spot in exploreSpots"
          :key="spot.id"
          class="desktop-explore-panel__spot"
          :class="[
            `desktop-explore-panel__spot--${spot.tone}`,
            { 'desktop-explore-panel__spot--active': spot.waypointId === selectedWaypointId },
          ]"
          type="button"
          @click="emit('selectWaypoint', spot.waypointId)"
        >
          <span class="desktop-explore-panel__spot-pin" aria-hidden="true"></span>
          <span class="desktop-explore-panel__spot-copy">
            <strong>{{ td(spot.title) }}</strong>
            <small>{{ td(spot.category) }} · {{ td(spot.distance) }}</small>
            <small>{{ td(spot.eta) }}</small>
          </span>
          <span class="desktop-explore-panel__spot-score">{{ td(spot.popularity) }}</span>
        </button>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.desktop-explore-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding: 18px 16px 16px;
  border-right: 1px solid rgba(114, 234, 233, 0.15);
  color: #d9edf3;
  background: linear-gradient(180deg, rgba(6, 25, 32, 0.96), rgba(8, 22, 27, 0.92));
}

.desktop-explore-panel__header,
.desktop-explore-panel__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.desktop-explore-panel__eyebrow {
  color: #28f3ec;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.desktop-explore-panel h2,
.desktop-explore-panel h3,
.desktop-explore-panel p {
  margin: 0;
}

.desktop-explore-panel h2 {
  margin-top: 4px;
  color: #f4fbff;
  font-size: 20px;
}

.desktop-explore-panel__count {
  padding: 5px 8px;
  border: 1px solid rgba(43, 244, 239, 0.24);
  border-radius: 999px;
  color: #65f6f0;
  background: rgba(43, 244, 239, 0.08);
  font-size: 11px;
  font-weight: 700;
}

.desktop-explore-panel__intro {
  margin-top: 12px !important;
  color: #8fa8b2;
  font-size: 12px;
  line-height: 1.6;
}

.desktop-explore-panel__section {
  margin-top: 18px;
}

.desktop-explore-panel__section--spots {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.desktop-explore-panel__section-head h3 {
  color: #dfeef3;
  font-size: 13px;
}

.desktop-explore-panel__section-head span {
  color: #718c96;
  font-size: 10px;
}

.desktop-explore-panel__tools {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

.desktop-explore-panel button {
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.desktop-explore-panel__tool {
  position: relative;
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 8px;
  min-width: 0;
  min-height: 68px;
  padding: 10px;
  border: 1px solid rgba(161, 213, 223, 0.14);
  border-radius: 9px;
  color: #9eb6bf;
  background: rgba(11, 32, 40, 0.8);
}

.desktop-explore-panel__tool:hover,
.desktop-explore-panel__tool:focus-visible {
  outline: 0;
  border-color: rgba(43, 244, 239, 0.42);
}

.desktop-explore-panel__tool--active {
  border-color: rgba(43, 244, 239, 0.38);
  color: #36f1eb;
  background: rgba(24, 91, 96, 0.24);
}

.desktop-explore-panel__tool strong,
.desktop-explore-panel__tool small {
  display: block;
}

.desktop-explore-panel__tool strong {
  color: #dcecf1;
  font-size: 12px;
}

.desktop-explore-panel__tool small {
  display: -webkit-box;
  margin-top: 3px;
  overflow: hidden;
  color: #79929c;
  font-size: 9px;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.desktop-explore-panel__tool i {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #465b64;
}

.desktop-explore-panel__tool--active i {
  background: #2bf4ef;
  box-shadow: 0 0 8px rgba(43, 244, 239, 0.8);
}

.desktop-explore-panel__tool-icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 1px solid currentColor;
  border-radius: 7px;
}

.desktop-explore-panel__spots {
  display: grid;
  gap: 7px;
  margin-top: 10px;
  padding-right: 3px;
  overflow-y: auto;
}

.desktop-explore-panel__spot {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 9px;
  align-items: center;
  min-width: 0;
  min-height: 62px;
  padding: 9px 10px;
  border: 1px solid rgba(161, 213, 223, 0.12);
  border-radius: 9px;
  color: #b7cbd2;
  background: rgba(8, 28, 35, 0.76);
}

.desktop-explore-panel__spot:hover,
.desktop-explore-panel__spot:focus-visible,
.desktop-explore-panel__spot--active {
  outline: 0;
  border-color: rgba(43, 244, 239, 0.48);
  background: rgba(19, 70, 75, 0.32);
}

.desktop-explore-panel__spot-pin {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2bf4ef;
  box-shadow: 0 0 10px rgba(43, 244, 239, 0.64);
}

.desktop-explore-panel__spot--orange .desktop-explore-panel__spot-pin {
  background: #ffad2f;
  box-shadow: 0 0 10px rgba(255, 173, 47, 0.64);
}

.desktop-explore-panel__spot--blue .desktop-explore-panel__spot-pin {
  background: #4b9bff;
  box-shadow: 0 0 10px rgba(75, 155, 255, 0.64);
}

.desktop-explore-panel__spot-copy {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.desktop-explore-panel__spot-copy strong,
.desktop-explore-panel__spot-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desktop-explore-panel__spot-copy strong {
  color: #e5f2f6;
  font-size: 12px;
}

.desktop-explore-panel__spot-copy small {
  color: #7f98a2;
  font-size: 10px;
}

.desktop-explore-panel__spot-score {
  max-width: 72px;
  color: #8da6af;
  font-size: 9px;
  text-align: right;
}

@media (max-width: 760px) {
  .desktop-explore-panel {
    display: none;
  }
}
</style>
