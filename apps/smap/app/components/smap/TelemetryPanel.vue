<script setup lang="ts">
import { computed } from 'vue'
import type {
  NavigationEvent,
  NavigationLeg,
  NavigationSpeed,
  NavigationStatus,
  NavigationSummary,
} from './navigationSimulation'
import { navigationStatusLabel } from './navigationSimulation'
import SmapIcon from './SmapIcon.vue'
import type { HazardZone, RouteOption, TelemetryMetric, Waypoint } from './types'

interface Props {
  currentLeg?: NavigationLeg
  events: NavigationEvent[]
  hazards: HazardZone[]
  metrics: TelemetryMetric[]
  navigationSpeed: NavigationSpeed
  navigationStatus: NavigationStatus
  remainingDuration: string
  route: RouteOption
  progress: number
  selectedWaypoint: Waypoint
  summary?: NavigationSummary
}

interface Emits {
  setNavigationSpeed: [speed: NavigationSpeed]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t, td } = useSmapI18n()
const speedOptions: NavigationSpeed[] = [1, 2, 4]
const recentEvents = computed(() => props.events.slice(-3).reverse())

const routeEtaTitle = computed(() => {
  if (props.navigationStatus === 'arrived')
    return t('telemetry.arrived')

  if (props.navigationStatus === 'idle')
    return t('telemetry.estimate', { duration: td(props.route.duration) })

  return t('telemetry.remaining', { duration: td(props.remainingDuration) })
})

const routeDetail = computed(() => {
  if (props.currentLeg && props.navigationStatus !== 'arrived')
    return `${td(props.currentLeg.fromLabel)} → ${td(props.currentLeg.toLabel)}`

  if (props.navigationStatus === 'arrived')
    return t('telemetry.routeCompleted', { route: td(props.route.label) })

  return t('telemetry.locked', { count: props.route.stops, name: td(props.selectedWaypoint.label) })
})

function hazardLevelClass(hazard: HazardZone) {
  return [
    'telemetry-panel__level',
    `telemetry-panel__level--${hazard.tone}`,
  ]
}

function eventClass(event: NavigationEvent): string {
  return `telemetry-panel__event--${event.kind}`
}
</script>

<template>
  <aside class="telemetry-panel" :aria-label="t('telemetry.label')">
    <section class="telemetry-panel__section">
      <h2 class="telemetry-panel__title">{{ t('telemetry.title') }}</h2>
      <div class="telemetry-panel__metrics">
        <div v-for="metric in metrics" :key="metric.id" class="telemetry-panel__metric">
          <span class="telemetry-panel__metric-icon" aria-hidden="true"><SmapIcon :name="metric.icon" :size="18" /></span>
          <span class="telemetry-panel__metric-label">{{ td(metric.label) }}</span>
          <strong>{{ metric.value }}</strong>
          <span class="telemetry-panel__meter">
            <span :style="{ width: `${metric.level}%` }"></span>
          </span>
        </div>
      </div>
    </section>

    <section class="telemetry-panel__section">
      <h3 class="telemetry-panel__subtitle">{{ t('telemetry.hazards') }}</h3>
      <div class="telemetry-panel__hazards">
        <div v-for="hazard in hazards" :key="hazard.id" class="telemetry-panel__hazard">
          <span class="telemetry-panel__hazard-icon" aria-hidden="true"><SmapIcon name="triangle-alert" :size="15" /></span>
          <span>{{ td(hazard.label) }}</span>
          <strong :class="hazardLevelClass(hazard)">{{ td(hazard.level) }}</strong>
        </div>
      </div>
    </section>

    <section class="telemetry-panel__section telemetry-panel__section--summary">
      <div class="telemetry-panel__navigation-head">
        <div>
          <span class="telemetry-panel__status">{{ td(navigationStatusLabel(navigationStatus)) }}</span>
          <h3 class="telemetry-panel__eta">{{ routeEtaTitle }}</h3>
        </div>
        <strong>{{ progress }}%</strong>
      </div>
      <p class="telemetry-panel__copy">{{ routeDetail }}</p>
      <div class="telemetry-panel__progress" :aria-label="t('telemetry.progress', { progress })">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
      <div class="telemetry-panel__speed" :aria-label="t('telemetry.speed')">
        <span>{{ t('telemetry.speed') }}</span>
        <button
          v-for="speed in speedOptions"
          :key="speed"
          type="button"
          :aria-pressed="navigationSpeed === speed"
          :class="{ 'telemetry-panel__speed-button--active': navigationSpeed === speed }"
          @click="emit('setNavigationSpeed', speed)"
        >
          {{ speed }}×
        </button>
      </div>
      <div class="telemetry-panel__chips">
        <span v-for="alert in route.alerts" :key="alert">{{ td(alert) }}</span>
      </div>
      <div v-if="recentEvents.length > 0" class="telemetry-panel__events" :aria-label="t('telemetry.recentEvents')">
        <article
          v-for="event in recentEvents"
          :key="event.id"
          class="telemetry-panel__event"
          :class="eventClass(event)"
        >
          <span>{{ event.progress }}%</span>
          <div>
            <strong>{{ td(event.title) }}</strong>
            <small>{{ td(event.detail) }}</small>
          </div>
        </article>
      </div>
      <div v-if="summary" class="telemetry-panel__arrival" :aria-label="t('telemetry.tripSummary')">
        <strong>{{ t('telemetry.summaryCompleted') }}</strong>
        <span>{{ t('telemetry.summaryCounts', { legs: summary.completedLegs, events: summary.completedEvents }) }}</span>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.telemetry-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 16px;
  border-left: 1px solid rgba(114, 234, 233, 0.15);
  background: linear-gradient(180deg, rgba(7, 26, 33, 0.93), rgba(6, 18, 24, 0.93));
}

.telemetry-panel__section {
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(164, 221, 231, 0.12);
}

.telemetry-panel__section + .telemetry-panel__section {
  padding-top: 18px;
}

.telemetry-panel__section--summary {
  display: grid;
  gap: 12px;
  border-bottom: 0;
}

.telemetry-panel__title,
.telemetry-panel__subtitle,
.telemetry-panel__eta {
  margin: 0;
  color: #f4fbff;
  line-height: 1.2;
}

.telemetry-panel__title {
  font-size: 18px;
  font-weight: 760;
}

.telemetry-panel__subtitle {
  font-size: 16px;
  font-weight: 720;
}

.telemetry-panel__eta {
  font-size: 20px;
  font-weight: 760;
}

.telemetry-panel__metrics {
  display: grid;
  gap: 15px;
  margin-top: 18px;
}

.telemetry-panel__metric {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  gap: 9px;
  align-items: center;
}

.telemetry-panel__metric-icon {
  display: grid;
  width: 20px;
  height: 20px;
  color: #9cb7c1;
  place-items: center;
}

.telemetry-panel__metric-label {
  color: #a9c0c8;
  font-size: 13px;
  font-weight: 620;
}

.telemetry-panel__metric strong {
  color: #dceef4;
  font-size: 14px;
  font-weight: 650;
}

.telemetry-panel__meter {
  grid-column: 2 / 4;
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(180, 209, 217, 0.16);
}

.telemetry-panel__meter span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2bf4ef, #44e6ce);
}

.telemetry-panel__hazards {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.telemetry-panel__hazard {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  gap: 8px;
  align-items: center;
  min-height: 26px;
  color: #b8cbd3;
  font-size: 13px;
}

.telemetry-panel__hazard-icon {
  color: #9eb6bf;
}

.telemetry-panel__level {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  min-height: 24px;
  border: 1px solid currentColor;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 760;
}

.telemetry-panel__level--amber {
  color: #ffbd4a;
  background: rgba(255, 173, 47, 0.1);
}

.telemetry-panel__level--magenta {
  color: #ff6fae;
  background: rgba(255, 78, 160, 0.1);
}

.telemetry-panel__level--cyan {
  color: #2bf4ef;
  background: rgba(43, 244, 239, 0.1);
}

.telemetry-panel__copy {
  margin: -4px 0 0;
  color: #92aab4;
  font-size: 13px;
}

.telemetry-panel__navigation-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.telemetry-panel__navigation-head > strong {
  color: #2bf4ef;
  font-size: 22px;
  font-weight: 820;
}

.telemetry-panel__status {
  display: block;
  margin-bottom: 4px;
  color: #89a5af;
  font-size: 11px;
  font-weight: 720;
}

.telemetry-panel__progress {
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: repeating-linear-gradient(90deg, rgba(180, 209, 217, 0.2) 0 24px, rgba(180, 209, 217, 0.08) 24px 34px);
}

.telemetry-panel__progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2bf4ef, #ffad2f);
}

.telemetry-panel__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.telemetry-panel__chips span {
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid rgba(43, 244, 239, 0.28);
  border-radius: 5px;
  color: #c6f8f7;
  background: rgba(43, 244, 239, 0.08);
  font-size: 12px;
  line-height: 22px;
}

.telemetry-panel__speed {
  display: grid;
  grid-template-columns: 1fr repeat(3, 38px);
  gap: 6px;
  align-items: center;
}

.telemetry-panel__speed > span {
  color: #8fa8b1;
  font-size: 12px;
}

.telemetry-panel__speed button {
  min-height: 28px;
  border: 1px solid rgba(170, 218, 228, 0.18);
  border-radius: 6px;
  color: #9fb7c0;
  background: rgba(10, 30, 38, 0.72);
  font: inherit;
  font-size: 12px;
  font-weight: 720;
  cursor: pointer;
}

.telemetry-panel__speed button.telemetry-panel__speed-button--active {
  border-color: rgba(43, 244, 239, 0.58);
  color: #e8ffff;
  background: rgba(43, 244, 239, 0.16);
}

.telemetry-panel__events {
  display: grid;
  gap: 7px;
}

.telemetry-panel__event {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  padding: 8px;
  border-left: 2px solid #73929c;
  border-radius: 5px;
  background: rgba(9, 29, 37, 0.72);
}

.telemetry-panel__event > span {
  color: #8ba5ae;
  font-size: 11px;
  font-weight: 760;
}

.telemetry-panel__event > div {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.telemetry-panel__event strong,
.telemetry-panel__event small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.telemetry-panel__event strong {
  color: #dceef4;
  font-size: 12px;
}

.telemetry-panel__event small {
  color: #829ca6;
  font-size: 10px;
}

.telemetry-panel__event--risk {
  border-left-color: #ffad2f;
}

.telemetry-panel__event--service {
  border-left-color: #39dca2;
}

.telemetry-panel__event--arrival {
  border-left-color: #2bf4ef;
}

.telemetry-panel__arrival {
  display: grid;
  gap: 3px;
  padding: 10px;
  border: 1px solid rgba(57, 220, 162, 0.3);
  border-radius: 7px;
  color: #dffff3;
  background: rgba(57, 220, 162, 0.1);
}

.telemetry-panel__arrival strong {
  font-size: 13px;
}

.telemetry-panel__arrival span {
  color: #91baaa;
  font-size: 11px;
}

@media (max-width: 1120px) {
  .telemetry-panel {
    border-left: 0;
    border-top: 1px solid rgba(114, 234, 233, 0.15);
    overflow: visible;
  }
}
</style>
