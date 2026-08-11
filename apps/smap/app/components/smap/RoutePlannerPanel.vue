<script setup lang="ts">
import { computed } from 'vue'
import type { SmapIconName } from './iconTypes'
import type { NavigationStatus } from './navigationSimulation'
import type { RouteEndpointRole, RouteOption, RoutePlace, TravelMode } from './types'
import SmapIcon from './SmapIcon.vue'

interface Props {
  activeModeId: string
  activeRouteId: string
  activeSearchRole: RouteEndpointRole | null
  destination: RoutePlace
  navigationStatus: NavigationStatus
  origin: RoutePlace
  routes: RouteOption[]
  modes: TravelMode[]
}

interface Emits {
  endNavigation: []
  focusRouteSearch: [role: RouteEndpointRole]
  resetRouteEndpoint: [role: RouteEndpointRole]
  selectMode: [modeId: string]
  selectRoute: [routeId: string]
  swapRouteEndpoints: []
  toggleNavigation: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t, td } = useSmapI18n()

const navigationActionLabel = computed(() => {
  if (props.navigationStatus === 'navigating')
    return t('route.pause')

  if (props.navigationStatus === 'paused')
    return t('route.resume')

  if (props.navigationStatus === 'arrived')
    return t('route.restart')

  return t('route.start')
})

const navigationActionIcon = computed<SmapIconName>(() => {
  if (props.navigationStatus === 'navigating')
    return 'pause'

  if (props.navigationStatus === 'arrived')
    return 'route'

  return 'play'
})

const canEndNavigation = computed(() => {
  return props.navigationStatus === 'navigating' || props.navigationStatus === 'paused'
})
</script>

<template>
  <aside class="route-panel" :aria-label="t('route.planner')">
    <div class="route-panel__heading">
      <h2 class="route-panel__title">{{ t('route.planner') }}</h2>
      <button class="route-panel__tool" type="button" :aria-label="t('route.filter')">
        <SmapIcon name="filter" :size="20" />
      </button>
    </div>

    <div class="route-panel__inputs" :aria-label="t('route.endpoints')">
      <div
        class="route-panel__input-row"
        :class="{ 'route-panel__input-row--active': activeSearchRole === 'origin' }"
      >
        <button class="route-panel__input-main" type="button" @click="emit('focusRouteSearch', 'origin')">
          <span class="route-panel__dot route-panel__dot--origin"></span>
          <span class="route-panel__input-copy">
            <span class="route-panel__input-text">{{ td(origin.label) }}</span>
            <small>{{ td(origin.category) }} · {{ td(origin.description) }}</small>
          </span>
        </button>
        <button type="button" :aria-label="t('route.resetOrigin')" @click="emit('resetRouteEndpoint', 'origin')">
          <SmapIcon name="close" :size="18" />
        </button>
      </div>
      <div class="route-panel__connector"></div>
      <div
        class="route-panel__input-row"
        :class="{ 'route-panel__input-row--active': activeSearchRole === 'destination' }"
      >
        <button class="route-panel__input-main" type="button" @click="emit('focusRouteSearch', 'destination')">
          <span class="route-panel__dot route-panel__dot--destination"></span>
          <span class="route-panel__input-copy">
            <span class="route-panel__input-text">{{ td(destination.label) }}</span>
            <small>{{ td(destination.category) }} · {{ td(destination.description) }}</small>
          </span>
        </button>
        <button type="button" :aria-label="t('route.resetDestination')" @click="emit('resetRouteEndpoint', 'destination')">
          <SmapIcon name="close" :size="18" />
        </button>
      </div>
      <button class="route-panel__add-stop" type="button" @click="emit('swapRouteEndpoints')">
        <SmapIcon name="arrow-up-down" :size="17" />
        {{ t('search.swap') }}
      </button>
    </div>

    <section class="route-panel__section" :aria-label="t('route.modes')">
      <h3 class="route-panel__section-title">{{ t('route.modes') }}</h3>
      <div class="route-panel__modes">
        <button
          v-for="mode in modes"
          :key="mode.id"
          class="route-panel__mode"
          :class="{ 'route-panel__mode--active': mode.id === activeModeId }"
          type="button"
          @click="emit('selectMode', mode.id)"
        >
          <span class="route-panel__mode-icon" aria-hidden="true">
            <SmapIcon :name="mode.icon" :size="22" />
          </span>
          <span>{{ td(mode.label) }}</span>
          <small>{{ td(mode.description) }}</small>
        </button>
      </div>
    </section>

    <section class="route-panel__section route-panel__section--routes" :aria-label="t('route.recommended')">
      <h3 class="route-panel__section-title">{{ t('route.recommended') }}</h3>
      <button
        v-for="route in routes"
        :key="route.id"
        class="route-panel__route"
        :class="[
          `route-panel__route--${route.risk}`,
          { 'route-panel__route--active': route.id === activeRouteId },
        ]"
        type="button"
        @click="emit('selectRoute', route.id)"
      >
        <span class="route-panel__route-label">{{ td(route.label) }}</span>
        <span class="route-panel__route-mode">{{ td(route.mode) }}</span>
        <strong>{{ t('route.estimate', { duration: td(route.duration) }) }}</strong>
        <span class="route-panel__route-meta">{{ t('route.stops', { count: route.stops }) }}</span>
        <span class="route-panel__route-icons" aria-hidden="true">
          <span v-for="alert in route.alerts.slice(0, 2)" :key="alert">{{ td(alert) }}</span>
        </span>
      </button>
    </section>

    <div class="route-panel__navigation-actions">
      <button class="route-panel__start" type="button" @click="emit('toggleNavigation')">
        <SmapIcon :name="navigationActionIcon" :size="18" />
        {{ navigationActionLabel }}
      </button>
      <button
        v-if="canEndNavigation"
        class="route-panel__end"
        type="button"
        @click="emit('endNavigation')"
      >
        {{ t('route.end') }}
      </button>
    </div>
  </aside>
</template>

<style scoped>
.route-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding: 14px 16px 16px;
  border-right: 1px solid rgba(114, 234, 233, 0.15);
  background: linear-gradient(180deg, rgba(6, 25, 32, 0.94), rgba(8, 22, 27, 0.9));
}

.route-panel__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.route-panel__title {
  margin: 0;
  color: #f3fbff;
  font-size: 18px;
  font-weight: 720;
  line-height: 1.2;
}

.route-panel__tool,
.route-panel__input-row > button:not(.route-panel__input-main) {
  display: inline-grid;
  place-items: center;
  border: 0;
  color: #b6ced6;
  background: transparent;
  cursor: pointer;
}

.route-panel__tool {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

.route-panel__tool:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.07);
}

.route-panel__inputs {
  position: relative;
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}

.route-panel__connector {
  position: absolute;
  top: 30px;
  left: 17px;
  width: 1px;
  height: 46px;
  background: rgba(185, 220, 229, 0.28);
}

.route-panel__input-row {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  min-height: 42px;
  padding: 0 8px 0 12px;
  border: 1px solid rgba(171, 220, 229, 0.16);
  border-radius: 8px;
  background: rgba(7, 24, 31, 0.85);
}

.route-panel__input-row--active {
  border-color: rgba(40, 242, 237, 0.72);
  box-shadow: 0 0 0 1px rgba(40, 242, 237, 0.1);
}

.route-panel__input-main {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  min-width: 0;
  min-height: 42px;
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.route-panel__dot {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-radius: 50%;
  box-shadow: 0 0 14px currentColor;
}

.route-panel__dot--origin {
  color: #28f0ee;
}

.route-panel__dot--destination {
  color: #ffad2f;
}

.route-panel__input-text {
  overflow: hidden;
  color: #dcebf0;
  font-size: 15px;
  font-weight: 620;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-panel__input-copy {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.route-panel__input-copy small {
  overflow: hidden;
  color: #86a0aa;
  font-size: 11px;
  font-weight: 520;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-panel__input-row > button:not(.route-panel__input-main) {
  width: 28px;
  height: 28px;
  border-radius: 5px;
  font-size: 20px;
  line-height: 1;
}

.route-panel__add-stop {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  border: 1px solid rgba(171, 220, 229, 0.16);
  border-radius: 8px;
  color: #9fb6be;
  background: rgba(8, 27, 36, 0.72);
  font-size: 14px;
  cursor: pointer;
}

.route-panel__section {
  display: grid;
  gap: 10px;
  margin-top: 4px;
}

.route-panel__section--routes {
  min-height: 0;
  margin-top: 14px;
  overflow: auto;
}

.route-panel__section-title {
  margin: 0;
  color: #b9ced6;
  font-size: 13px;
  font-weight: 650;
}

.route-panel__modes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.route-panel__mode {
  display: grid;
  gap: 6px;
  place-items: center;
  min-width: 0;
  min-height: 76px;
  padding: 8px 6px;
  border: 1px solid rgba(171, 220, 229, 0.16);
  border-radius: 8px;
  color: #bcd2da;
  background: rgba(12, 31, 39, 0.8);
  cursor: pointer;
}

.route-panel__mode--active {
  border-color: rgba(40, 242, 237, 0.82);
  color: #31fff6;
  background: linear-gradient(180deg, rgba(19, 100, 103, 0.55), rgba(9, 41, 50, 0.85));
}

.route-panel__mode-icon {
  display: grid;
  width: 22px;
  height: 22px;
  opacity: 0.94;
  place-items: center;
}

.route-panel__mode span:not(.route-panel__mode-icon) {
  display: -webkit-box;
  max-width: 100%;
  overflow: hidden;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.18;
  text-align: center;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.route-panel__mode small {
  color: rgba(211, 231, 237, 0.58);
  font-size: 11px;
}

.route-panel__route {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto);
  gap: 7px 8px;
  align-items: center;
  min-height: 86px;
  padding: 10px 12px;
  overflow: hidden;
  border: 1px solid rgba(171, 220, 229, 0.16);
  border-radius: 8px;
  color: #d9ebf0;
  background: rgba(8, 25, 31, 0.76);
  text-align: left;
  cursor: pointer;
}

.route-panel__route--active {
  border-color: rgba(40, 242, 237, 0.86);
  background: linear-gradient(140deg, rgba(13, 93, 96, 0.74), rgba(6, 30, 38, 0.9));
  box-shadow: 0 0 0 1px rgba(40, 242, 237, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.route-panel__route--medium:not(.route-panel__route--active) {
  border-color: rgba(255, 173, 47, 0.36);
}

.route-panel__route-label {
  display: inline-grid;
  place-items: center;
  min-width: 42px;
  max-width: 92px;
  min-height: 22px;
  padding: 0 6px;
  overflow: hidden;
  border-radius: 5px;
  color: #07151a;
  background: #28f2ed;
  font-size: 11px;
  font-weight: 820;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-panel__route--medium .route-panel__route-label {
  background: #ffad2f;
}

.route-panel__route-mode {
  min-width: 0;
  overflow: hidden;
  color: #89dce0;
  font-size: 13px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-panel__route strong {
  grid-column: 1 / -1;
  color: #f4fbff;
  font-size: 20px;
  font-weight: 760;
  line-height: 1.2;
}

.route-panel__route-meta {
  grid-column: 1 / 3;
  color: #9db5bd;
  font-size: 13px;
}

.route-panel__route-icons {
  display: flex;
  grid-column: 3;
  gap: 5px;
  justify-content: flex-end;
  min-width: 0;
  max-width: 136px;
  overflow: hidden;
}

.route-panel__route-icons span {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  min-height: 22px;
  padding: 0 6px;
  border: 1px solid rgba(40, 242, 237, 0.35);
  border-radius: 5px;
  color: #35f3ef;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-panel__navigation-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  margin-top: 12px;
}

.route-panel__start,
.route-panel__end {
  display: inline-flex;
  gap: 9px;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  border: 1px solid rgba(40, 242, 237, 0.62);
  border-radius: 8px;
  color: #efffff;
  background: linear-gradient(180deg, #1ec7c8, #128b93);
  box-shadow: 0 16px 34px rgba(11, 157, 164, 0.28);
  font-size: 16px;
  font-weight: 780;
  cursor: pointer;
}

.route-panel__end {
  min-width: 58px;
  border-color: rgba(171, 220, 229, 0.2);
  color: #b9ced6;
  background: rgba(8, 27, 36, 0.82);
  box-shadow: none;
  font-size: 14px;
  font-weight: 680;
}

@media (max-width: 1120px) {
  .route-panel {
    border-right: 0;
    border-bottom: 1px solid rgba(114, 234, 233, 0.15);
    overflow: visible;
  }
}
</style>
