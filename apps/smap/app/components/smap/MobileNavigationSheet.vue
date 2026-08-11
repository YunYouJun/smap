<script setup lang="ts">
import { computed } from 'vue'
import type { SmapIconName } from './iconTypes'
import type {
  NavigationEvent,
  NavigationLeg,
  NavigationSpeed,
  NavigationStatus,
  NavigationSummary,
} from './navigationSimulation'
import { navigationStatusLabel } from './navigationSimulation'
import type {
  ExploreSpot,
  MapTool,
  MobileService,
  ProfileAction,
  RideOption,
  RouteOption,
  RoutePlace,
} from './types'
import SmapIcon from './SmapIcon.vue'

interface Props {
  activeRideOptionId: string
  activeRouteId: string
  activeService: MobileService
  destination: RoutePlace
  enabledMapToolIds: readonly string[]
  exploreSpots: ExploreSpot[]
  isRideRequested: boolean
  currentNavigationLeg?: NavigationLeg
  latestNavigationEvent?: NavigationEvent
  mapTools: MapTool[]
  navigationProgress: number
  navigationSpeed: NavigationSpeed
  navigationStatus: NavigationStatus
  navigationSummary?: NavigationSummary
  profileActions: ProfileAction[]
  remainingDuration: string
  rideOption: RideOption
  rideOptions: RideOption[]
  origin: RoutePlace
  route: RouteOption
  routes: RouteOption[]
  selectedWaypointId: string
}

interface Emits {
  endNavigation: []
  selectRideOption: [optionId: string]
  selectRoute: [routeId: string]
  selectService: [service: MobileService]
  selectWaypoint: [waypointId: string]
  setNavigationSpeed: [speed: NavigationSpeed]
  toggleMapTool: [toolId: string]
  toggleNavigation: []
  toggleRideRequest: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const slots = defineSlots<{
  'profile-account'?: () => unknown
}>()
const { t, td } = useSmapI18n()

const smapFallbackAvatar = '/smap/avatar-fallback.svg'
const speedOptions: NavigationSpeed[] = [1, 2, 4]

const rideCtaLabel = computed(() => t(
  props.isRideRequested ? 'ride.responded' : 'ride.call',
  { vehicle: td(props.rideOption.label) },
))
const rideCtaDetail = computed(() => t(
  props.isRideRequested ? 'ride.enRouteDetail' : 'ride.callDetail',
  { eta: td(props.rideOption.eta), origin: td(props.origin.label) },
))

const navigationNotice = computed(() => {
  if (props.latestNavigationEvent)
    return `${td(props.latestNavigationEvent.title)}：${td(props.latestNavigationEvent.detail)}`

  return t('mobile.localNotice')
})

const navigationActionLabel = computed(() => {
  if (props.navigationStatus === 'navigating')
    return t('route.pause')

  if (props.navigationStatus === 'paused')
    return t('route.resume')

  if (props.navigationStatus === 'arrived')
    return t('route.restart')

  return t('route.start')
})
const navigationActionIcon = computed<SmapIconName>(() => props.navigationStatus === 'navigating' ? 'pause' : 'play')

const canEndNavigation = computed(() => {
  return props.navigationStatus === 'navigating' || props.navigationStatus === 'paused'
})

const navigationLegLabel = computed(() => {
  if (props.navigationStatus === 'arrived')
    return t('mobile.tripCompleted')

  if (props.currentNavigationLeg)
    return `${td(props.currentNavigationLeg.fromLabel)} → ${td(props.currentNavigationLeg.toLabel)}`

  return `${td(props.origin.label)} → ${td(props.destination.label)}`
})

function isMapToolEnabled(toolId: string): boolean {
  return props.enabledMapToolIds.includes(toolId)
}

function selectExploreSpot(spot: ExploreSpot): void {
  emit('selectWaypoint', spot.waypointId)
}

function mapToolIcon(icon: MapTool['icon']): SmapIconName {
  return icon === 'safety' ? 'shield' : icon
}
</script>

<template>
  <aside class="mobile-sheet" :aria-label="t('mobile.sheet')">
    <span class="mobile-sheet__handle" aria-hidden="true"></span>

    <div
      v-show="activeService === 'navigation'"
      class="mobile-sheet__panel mobile-sheet__panel--navigation"
      role="tabpanel"
      :aria-label="t('mobile.navigationPanel')"
    >
      <div class="mobile-sheet__warning">
        <span class="mobile-sheet__warning-icon" aria-hidden="true">
          <SmapIcon name="triangle-alert" :size="20" />
        </span>
        <span>{{ navigationNotice }}</span>
      </div>

      <div class="mobile-sheet__route-preferences" :aria-label="t('mobile.routePreferences')">
        <span class="mobile-sheet__preference-label">{{ t('mobile.routePreferences') }}</span>
        <button class="mobile-sheet__preference mobile-sheet__preference--active" type="button">
          {{ t('mobile.smartRecommendation') }}
        </button>
        <button class="mobile-sheet__preference" type="button">
          {{ t('mobile.lowCongestion') }}
        </button>
        <button class="mobile-sheet__preference" type="button">
          {{ t('mobile.fewerJumps') }}
        </button>
      </div>

      <div class="mobile-sheet__route-cards" :aria-label="t('mobile.routeOptions')">
        <button
          v-for="candidate in routes"
          :key="candidate.id"
          class="mobile-sheet__route-card"
          :class="{ 'mobile-sheet__route-card--active': candidate.id === activeRouteId }"
          type="button"
          @click="emit('selectRoute', candidate.id)"
        >
          <span class="mobile-sheet__route-label">{{ td(candidate.label) }}</span>
          <strong class="mobile-sheet__route-duration">{{ td(candidate.duration) }}</strong>
          <span class="mobile-sheet__route-meta">{{ t('route.stops', { count: candidate.stops }) }}</span>
        </button>

        <button
          class="mobile-sheet__route-card mobile-sheet__route-card--taxi"
          type="button"
          @click="emit('selectService', 'ride-hailing')"
        >
          <span class="mobile-sheet__route-label">{{ t('nav.rideHailing') }}</span>
          <strong class="mobile-sheet__route-duration mobile-sheet__route-duration--price">
            {{ td(rideOption.price) }}
          </strong>
          <span class="mobile-sheet__route-meta">{{ td(rideOption.eta) }}</span>
        </button>
      </div>

      <div class="mobile-sheet__summary">
        <div class="mobile-sheet__summary-copy">
          <span class="mobile-sheet__eyebrow">{{ td(navigationStatusLabel(navigationStatus)) }}</span>
          <h2 class="mobile-sheet__summary-title">
            <template v-if="navigationStatus === 'arrived'">
              {{ t('mobile.arrived') }}
            </template>
            <template v-else>
              {{ navigationStatus === 'idle' ? t('mobile.estimate') : t('mobile.remaining') }}
              <strong class="mobile-sheet__summary-value">
                {{ td(navigationStatus === 'idle' ? route.duration : remainingDuration) }}
              </strong>
            </template>
          </h2>
          <p class="mobile-sheet__summary-meta">
            {{ navigationLegLabel }} · {{ td(route.mode) }}
          </p>
          <div class="mobile-sheet__navigation-progress" :aria-label="t('mobile.progress', { progress: navigationProgress })">
            <span :style="{ width: `${navigationProgress}%` }"></span>
          </div>
          <div class="mobile-sheet__simulation-speed" :aria-label="t('mobile.demoSpeed')">
            <span>{{ t('mobile.speed') }}</span>
            <button
              v-for="speed in speedOptions"
              :key="speed"
              type="button"
              :aria-pressed="navigationSpeed === speed"
              :class="{ 'mobile-sheet__simulation-speed--active': navigationSpeed === speed }"
              @click="emit('setNavigationSpeed', speed)"
            >
              {{ speed }}×
            </button>
            <strong>{{ navigationProgress }}%</strong>
          </div>
          <p v-if="navigationSummary" class="mobile-sheet__arrival-summary">
            {{ t('telemetry.summaryCounts', { legs: navigationSummary.completedLegs, events: navigationSummary.completedEvents }) }}
          </p>
        </div>
      </div>

      <div class="mobile-sheet__navigation-actions">
        <button class="mobile-sheet__start" type="button" @click="emit('toggleNavigation')">
          <span class="mobile-sheet__start-icon" aria-hidden="true">
            <SmapIcon :name="navigationActionIcon" :size="20" />
          </span>
          {{ navigationActionLabel }}
        </button>
        <button
          v-if="canEndNavigation"
          class="mobile-sheet__end-navigation"
          type="button"
          @click="emit('endNavigation')"
        >
          {{ t('route.end') }}
        </button>
      </div>
    </div>

    <div
      v-show="activeService === 'ride-hailing'"
      class="mobile-sheet__panel mobile-sheet__panel--ride"
      role="tabpanel"
      :aria-label="t('ride.title')"
    >
      <div class="mobile-sheet__ride-head">
        <div class="mobile-sheet__ride-copy">
          <h2 class="mobile-sheet__ride-title">{{ t('ride.title') }}</h2>
          <p class="mobile-sheet__ride-meta">{{ t('mobile.rideMeta') }}</p>
        </div>
        <button class="mobile-sheet__back-to-route" type="button" @click="emit('selectService', 'navigation')">
          {{ t('mobile.viewRoute') }}
        </button>
      </div>

      <div class="mobile-sheet__addresses" :aria-label="t('ride.route')">
        <div class="mobile-sheet__address mobile-sheet__address--origin">
          <span class="mobile-sheet__address-dot" aria-hidden="true"></span>
          <div class="mobile-sheet__address-copy">
            <strong class="mobile-sheet__address-title">{{ td(origin.label) }}</strong>
            <span class="mobile-sheet__address-meta">{{ td(origin.category) }} · {{ td(origin.description) }}</span>
          </div>
        </div>
        <div class="mobile-sheet__address mobile-sheet__address--destination">
          <span class="mobile-sheet__address-dot" aria-hidden="true"></span>
          <div class="mobile-sheet__address-copy">
            <strong class="mobile-sheet__address-title">{{ td(destination.label) }}</strong>
            <span class="mobile-sheet__address-meta">{{ td(destination.category) }} · {{ td(destination.description) }}</span>
          </div>
        </div>
      </div>

      <div class="mobile-sheet__ride-options" :aria-label="t('mobile.rideTypes')">
        <button
          v-for="option in rideOptions"
          :key="option.id"
          class="mobile-sheet__ride-option"
          :class="{ 'mobile-sheet__ride-option--active': option.id === activeRideOptionId }"
          type="button"
          @click="emit('selectRideOption', option.id)"
        >
          <span
            class="mobile-sheet__vehicle"
            :class="`mobile-sheet__vehicle--${option.vehicle}`"
            aria-hidden="true"
          ></span>
          <span class="mobile-sheet__ride-detail">
            <span class="mobile-sheet__ride-name">
              {{ td(option.label) }}
              <small v-if="option.badge" class="mobile-sheet__badge">{{ td(option.badge) }}</small>
            </span>
            <span class="mobile-sheet__ride-eta">{{ td(option.eta) }} · {{ td(option.duration) }}</span>
          </span>
          <span class="mobile-sheet__price">
            <strong class="mobile-sheet__price-value">{{ option.price.replace(' 星币', '') }}</strong>
            <span class="mobile-sheet__price-unit">{{ t('ride.credits') }}</span>
          </span>
          <span class="mobile-sheet__select" aria-hidden="true">
            <SmapIcon name="check" :size="18" :stroke-width="2.3" />
          </span>
        </button>
      </div>

      <p class="mobile-sheet__fee-note">
        <span class="mobile-sheet__fee-icon" aria-hidden="true">
          <SmapIcon name="shield" :size="19" />
        </span>
        {{ t('mobile.feeNote') }}
      </p>

      <button
        class="mobile-sheet__ride-cta"
        :class="{ 'mobile-sheet__ride-cta--requested': isRideRequested }"
        type="button"
        @click="emit('toggleRideRequest')"
      >
        <strong class="mobile-sheet__ride-cta-label">{{ rideCtaLabel }}</strong>
        <span class="mobile-sheet__ride-cta-detail">{{ rideCtaDetail }}</span>
      </button>
    </div>

    <div
      v-show="activeService === 'explore'"
      class="mobile-sheet__panel mobile-sheet__panel--explore"
      role="tabpanel"
      :aria-label="t('mobile.explorePanel')"
    >
      <div class="mobile-sheet__section-head">
        <div>
          <h2 class="mobile-sheet__section-title">{{ t('explore.title') }}</h2>
          <p class="mobile-sheet__section-meta">{{ t('mobile.exploreMeta') }}</p>
        </div>
        <button class="mobile-sheet__small-action" type="button" @click="emit('selectService', 'navigation')">
          {{ t('mobile.backToRoute') }}
        </button>
      </div>

      <div class="mobile-sheet__tool-grid" :aria-label="t('explore.tools')">
        <button
          v-for="tool in mapTools"
          :key="tool.id"
          class="mobile-sheet__tool"
          :class="{ 'mobile-sheet__tool--active': isMapToolEnabled(tool.id) }"
          type="button"
          :aria-pressed="isMapToolEnabled(tool.id)"
          @click="emit('toggleMapTool', tool.id)"
        >
          <span class="mobile-sheet__tool-icon" :class="`mobile-sheet__tool-icon--${tool.icon}`" aria-hidden="true">
            <SmapIcon :name="mapToolIcon(tool.icon)" :size="20" />
          </span>
          <span class="mobile-sheet__tool-copy">
            <strong>{{ td(tool.label) }}</strong>
            <small>{{ td(tool.description) }}</small>
          </span>
        </button>
      </div>

      <div class="mobile-sheet__spot-list" :aria-label="t('explore.nearby')">
        <button
          v-for="spot in exploreSpots"
          :key="spot.id"
          class="mobile-sheet__spot"
          :class="[
            `mobile-sheet__spot--${spot.tone}`,
            { 'mobile-sheet__spot--active': spot.waypointId === selectedWaypointId },
          ]"
          type="button"
          :aria-current="spot.waypointId === selectedWaypointId ? 'location' : undefined"
          @click="selectExploreSpot(spot)"
        >
          <span class="mobile-sheet__spot-pin" aria-hidden="true"></span>
          <span class="mobile-sheet__spot-copy">
            <strong>{{ td(spot.title) }}</strong>
            <span>{{ td(spot.category) }} · {{ td(spot.distance) }} · {{ td(spot.eta) }}</span>
          </span>
          <span class="mobile-sheet__spot-popularity">{{ td(spot.popularity) }}</span>
        </button>
      </div>
    </div>

    <div
      v-show="activeService === 'profile'"
      class="mobile-sheet__panel mobile-sheet__panel--profile"
      role="tabpanel"
      :aria-label="t('mobile.profilePanel')"
    >
      <div class="mobile-sheet__profile-card">
        <img class="mobile-sheet__profile-avatar" :src="smapFallbackAvatar" alt="" aria-hidden="true">
        <div class="mobile-sheet__profile-copy">
          <h2 class="mobile-sheet__section-title">{{ t('mobile.profileTitle') }}</h2>
          <p class="mobile-sheet__section-meta">{{ t('mobile.profileMeta') }}</p>
        </div>
        <div
          v-if="activeService === 'profile' && slots['profile-account']"
          class="mobile-sheet__profile-account"
        >
          <slot name="profile-account"></slot>
        </div>
      </div>

      <div class="mobile-sheet__profile-stats" :aria-label="t('mobile.accountOverview')">
        <span class="mobile-sheet__profile-stat">
          <strong>12</strong>
          <small>{{ t('mobile.favorites') }}</small>
        </span>
        <span class="mobile-sheet__profile-stat">
          <strong>3</strong>
          <small>{{ t('common.orders') }}</small>
        </span>
        <span class="mobile-sheet__profile-stat">
          <strong>5</strong>
          <small>{{ t('mobile.preferences') }}</small>
        </span>
      </div>

      <div class="mobile-sheet__profile-actions" :aria-label="t('mobile.profileServices')">
        <button
          v-for="action in profileActions"
          :key="action.id"
          class="mobile-sheet__profile-action"
          type="button"
        >
          <span class="mobile-sheet__profile-icon" :class="`mobile-sheet__profile-icon--${action.icon}`" aria-hidden="true">
            <SmapIcon :name="action.icon" :size="20" />
          </span>
          <span class="mobile-sheet__profile-action-copy">
            <strong>
              {{ td(action.label) }}
              <small v-if="action.badge">{{ td(action.badge) }}</small>
            </strong>
            <span>{{ td(action.description) }}</span>
          </span>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.mobile-sheet {
  display: none;
}

@media (max-width: 760px) {
  .mobile-sheet {
    position: absolute;
    z-index: 8;
    right: 0;
    bottom: var(--smap-mobile-tabbar-offset, 0px);
    left: 0;
    display: grid;
    max-height: calc(100dvh - 226px - var(--smap-mobile-tabbar-offset, 0px));
    gap: 8px;
    padding: 8px 12px max(12px, env(safe-area-inset-bottom));
    overflow-y: auto;
    border: 1px solid var(--smap-ui-border-strong);
    border-bottom: 0;
    border-radius: 18px 18px 0 0;
    color: var(--smap-ui-text);
    background: var(--smap-ui-surface);
    box-shadow: var(--smap-ui-sheet-shadow);
    scrollbar-width: none;
  }

  .mobile-sheet::-webkit-scrollbar {
    display: none;
  }

  .mobile-sheet__handle {
    justify-self: center;
    width: 44px;
    height: 4px;
    border-radius: 999px;
    background: var(--smap-ui-handle);
  }

  .mobile-sheet__panel {
    display: grid;
    gap: 9px;
  }

  .mobile-sheet__warning {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    min-height: 36px;
    padding: 0 11px;
    border-radius: 10px;
    color: var(--smap-orange-text);
    background: var(--smap-orange-soft);
    font-size: 13px;
    font-weight: 690;
  }

  .mobile-sheet__warning-icon {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    color: var(--smap-orange);
  }

  .mobile-sheet__warning-icon svg,
  .mobile-sheet__start-icon svg,
  .mobile-sheet__fee-icon svg,
  .mobile-sheet__select svg {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .mobile-sheet__warning-icon svg {
    stroke-width: 2.2;
  }

  .mobile-sheet__route-preferences {
    display: flex;
    gap: 7px;
    align-items: center;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .mobile-sheet__route-preferences::-webkit-scrollbar {
    display: none;
  }

  .mobile-sheet__preference-label {
    flex: 0 0 auto;
    color: var(--smap-ui-muted);
    font-size: 12px;
    font-weight: 760;
  }

  .mobile-sheet__preference {
    flex: 0 0 auto;
    min-height: 28px;
    padding: 0 10px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 999px;
    color: var(--smap-ui-text-soft);
    background: var(--smap-ui-card);
    font: inherit;
    font-size: 12px;
    font-weight: 740;
    white-space: nowrap;
  }

  .mobile-sheet__preference--active {
    border-color: rgba(22, 119, 255, 0.18);
    color: var(--smap-primary);
    background: var(--smap-primary-soft);
  }

  .mobile-sheet__route-cards {
    display: flex;
    gap: 8px;
    min-width: 0;
    padding-bottom: 1px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .mobile-sheet__route-cards::-webkit-scrollbar {
    display: none;
  }

  .mobile-sheet__route-card {
    display: grid;
    flex: 0 0 96px;
    gap: 4px;
    align-content: center;
    min-width: 0;
    min-height: 72px;
    padding: 9px 8px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 12px;
    color: var(--smap-ui-text-soft);
    background: var(--smap-ui-surface-soft);
    font: inherit;
    scroll-snap-align: start;
    text-align: left;
  }

  .mobile-sheet__route-card--active {
    border-color: var(--smap-primary);
    color: var(--smap-primary-strong);
    background: var(--smap-ui-card);
    box-shadow: inset 0 0 0 1px rgba(22, 119, 255, 0.14), 0 8px 18px rgba(22, 119, 255, 0.08);
  }

  .mobile-sheet__route-card--taxi {
    border-color: var(--smap-orange-border);
    background: var(--smap-orange-card);
  }

  .mobile-sheet__route-label {
    color: var(--smap-ui-muted);
    font-size: 12px;
    font-weight: 720;
  }

  .mobile-sheet__route-duration {
    overflow: hidden;
    color: currentColor;
    font-size: 17px;
    font-weight: 850;
    line-height: 1.08;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-sheet__route-duration--price {
    color: var(--smap-orange);
  }

  .mobile-sheet__route-meta {
    overflow: hidden;
    color: var(--smap-ui-subtle);
    font-size: 11px;
    font-weight: 620;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-sheet__summary {
    display: grid;
    align-items: center;
    padding: 1px 2px 0;
  }

  .mobile-sheet__summary-copy,
  .mobile-sheet__ride-copy {
    min-width: 0;
  }

  .mobile-sheet__eyebrow {
    display: block;
    margin-bottom: 2px;
    color: var(--smap-primary);
    font-size: 13px;
    font-weight: 760;
  }

  .mobile-sheet__summary-title {
    margin: 0;
    color: var(--smap-ui-text);
    font-size: 21px;
    font-weight: 820;
    line-height: 1.1;
  }

  .mobile-sheet__summary-value {
    color: var(--smap-green);
    font-size: 38px;
    font-weight: 880;
  }

  .mobile-sheet__summary-meta,
  .mobile-sheet__ride-meta {
    margin: 4px 0 0;
    overflow: hidden;
    color: var(--smap-ui-muted);
    font-size: 13px;
    font-weight: 620;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-sheet__navigation-progress {
    height: 6px;
    margin-top: 10px;
    overflow: hidden;
    border-radius: 999px;
    background: var(--smap-ui-surface-soft);
  }

  .mobile-sheet__navigation-progress span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--smap-primary), var(--smap-green));
    transition: width 300ms ease;
  }

  .mobile-sheet__simulation-speed {
    display: grid;
    grid-template-columns: 1fr repeat(3, 42px) auto;
    gap: 6px;
    align-items: center;
    margin-top: 8px;
    color: var(--smap-ui-muted);
    font-size: 12px;
  }

  .mobile-sheet__simulation-speed button {
    min-height: 28px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 999px;
    color: var(--smap-ui-muted);
    background: var(--smap-ui-card);
    font: inherit;
    font-weight: 760;
  }

  .mobile-sheet__simulation-speed button.mobile-sheet__simulation-speed--active {
    border-color: var(--smap-primary);
    color: var(--smap-primary);
    background: var(--smap-primary-soft);
  }

  .mobile-sheet__simulation-speed strong {
    color: var(--smap-primary);
    font-size: 13px;
  }

  .mobile-sheet__arrival-summary {
    margin: 7px 0 0;
    color: var(--smap-green);
    font-size: 12px;
    font-weight: 720;
  }

  .mobile-sheet__navigation-actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
  }

  .mobile-sheet__start {
    display: inline-flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    min-height: 54px;
    border: 0;
    border-radius: 999px;
    color: var(--smap-on-primary);
    background: linear-gradient(180deg, #2689ff, var(--smap-primary));
    box-shadow: 0 16px 30px rgba(22, 119, 255, 0.28);
    font: inherit;
    font-size: 22px;
    font-weight: 860;
  }

  .mobile-sheet__end-navigation {
    min-width: 62px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 999px;
    color: var(--smap-ui-muted);
    background: var(--smap-ui-card);
    font: inherit;
    font-size: 14px;
    font-weight: 760;
  }

  .mobile-sheet__start-icon {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
  }

  .mobile-sheet__start-icon svg {
    stroke-width: 2.6;
  }

  .mobile-sheet__ride-head {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: center;
  }

  .mobile-sheet__ride-title {
    margin: 0;
    color: var(--smap-ui-text);
    font-size: 24px;
    font-weight: 860;
    line-height: 1.05;
  }

  .mobile-sheet__back-to-route {
    min-width: 68px;
    min-height: 34px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 999px;
    color: var(--smap-primary);
    background: var(--smap-ui-card);
    font: inherit;
    font-size: 13px;
    font-weight: 760;
  }

  .mobile-sheet__addresses {
    position: relative;
    display: grid;
    gap: 13px;
    padding: 14px 14px 14px 42px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 13px;
    background: var(--smap-ui-card);
  }

  .mobile-sheet__addresses::before {
    position: absolute;
    top: 25px;
    bottom: 25px;
    left: 22px;
    width: 1px;
    border-left: 2px dashed var(--smap-ui-divider);
    content: "";
  }

  .mobile-sheet__address {
    position: relative;
    display: grid;
    min-width: 0;
  }

  .mobile-sheet__address-dot {
    position: absolute;
    top: 5px;
    left: -29px;
    width: 13px;
    height: 13px;
    border: 3px solid var(--smap-ui-card);
    border-radius: 50%;
    background: var(--smap-green);
    box-shadow: 0 0 0 2px var(--smap-green);
  }

  .mobile-sheet__address--destination .mobile-sheet__address-dot {
    background: var(--smap-orange);
    box-shadow: 0 0 0 2px var(--smap-orange);
  }

  .mobile-sheet__address-title {
    display: block;
    overflow: hidden;
    color: var(--smap-ui-text);
    font-size: 17px;
    font-weight: 780;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-sheet__address-meta {
    display: block;
    overflow: hidden;
    margin-top: 4px;
    color: var(--smap-ui-muted);
    font-size: 12px;
    font-weight: 590;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-sheet__ride-options {
    display: grid;
    gap: 8px;
  }

  .mobile-sheet__ride-option {
    display: grid;
    grid-template-columns: 60px minmax(0, 1fr) auto 28px;
    gap: 9px;
    align-items: center;
    min-height: 68px;
    padding: 7px 10px 7px 7px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 12px;
    color: var(--smap-ui-text);
    background: var(--smap-ui-card);
    font: inherit;
    text-align: left;
  }

  .mobile-sheet__ride-option--active {
    border-color: var(--smap-primary);
    background: var(--smap-primary-soft);
    box-shadow: inset 0 0 0 1px rgba(22, 119, 255, 0.1);
  }

  .mobile-sheet__vehicle {
    width: 60px;
    height: 52px;
    overflow: hidden;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .mobile-sheet__vehicle--orbital {
    background-image: url("/smap/ride-orbital.png");
  }

  .mobile-sheet__vehicle--warp {
    background-image: url("/smap/ride-warp.png");
  }

  .mobile-sheet__vehicle--shared {
    background-image: url("/smap/ride-shared.png");
  }

  .mobile-sheet__ride-detail {
    display: grid;
    min-width: 0;
    gap: 3px;
  }

  .mobile-sheet__ride-name {
    display: flex;
    gap: 7px;
    align-items: center;
    min-width: 0;
    color: var(--smap-ui-text);
    font-size: 17px;
    font-weight: 820;
  }

  .mobile-sheet__badge {
    display: inline-flex;
    align-items: center;
    min-height: 20px;
    padding: 0 6px;
    border-radius: 6px;
    color: var(--smap-green);
    background: var(--smap-green-soft);
    font-size: 11px;
    font-weight: 760;
  }

  .mobile-sheet__ride-eta {
    overflow: hidden;
    color: var(--smap-ui-muted);
    font-size: 12px;
    font-weight: 590;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-sheet__price {
    display: inline-flex;
    gap: 3px;
    align-items: baseline;
    color: var(--smap-orange);
    white-space: nowrap;
  }

  .mobile-sheet__price-value {
    font-size: 24px;
    font-weight: 860;
    line-height: 1;
  }

  .mobile-sheet__price-unit {
    color: var(--smap-ui-muted);
    font-size: 12px;
    font-weight: 650;
  }

  .mobile-sheet__select {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border: 2px solid var(--smap-ui-divider);
    border-radius: 50%;
    color: transparent;
  }

  .mobile-sheet__select svg {
    stroke-width: 3;
  }

  .mobile-sheet__ride-option--active .mobile-sheet__select {
    border-color: var(--smap-primary);
    color: var(--smap-on-primary);
    background: var(--smap-primary);
  }

  .mobile-sheet__fee-note {
    display: inline-flex;
    gap: 7px;
    align-items: center;
    margin: 0;
    color: var(--smap-ui-muted);
    font-size: 13px;
    font-weight: 610;
  }

  .mobile-sheet__fee-icon {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    color: var(--smap-green);
  }

  .mobile-sheet__fee-icon svg {
    stroke-width: 2;
  }

  .mobile-sheet__ride-cta {
    display: grid;
    place-items: center;
    min-height: 54px;
    border: 0;
    border-radius: 999px;
    color: var(--smap-on-primary);
    background: linear-gradient(180deg, #2689ff, var(--smap-primary));
    box-shadow: 0 16px 30px rgba(22, 119, 255, 0.28);
    font: inherit;
  }

  .mobile-sheet__ride-cta--requested {
    background: linear-gradient(180deg, #ff9d42, var(--smap-orange));
    box-shadow: 0 16px 30px rgba(255, 122, 0, 0.24);
  }

  .mobile-sheet__ride-cta-label {
    font-size: 21px;
    font-weight: 880;
    line-height: 1.1;
  }

  .mobile-sheet__ride-cta-detail {
    margin-top: 2px;
    font-size: 13px;
    font-weight: 650;
  }

  .mobile-sheet__section-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
  }

  .mobile-sheet__section-title {
    margin: 0;
    color: var(--smap-ui-text);
    font-size: 24px;
    font-weight: 860;
    line-height: 1.08;
  }

  .mobile-sheet__section-meta {
    margin: 4px 0 0;
    overflow: hidden;
    color: var(--smap-ui-muted);
    font-size: 13px;
    font-weight: 620;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-sheet__small-action {
    min-width: 68px;
    min-height: 34px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 999px;
    color: var(--smap-primary);
    background: var(--smap-ui-card);
    font: inherit;
    font-size: 13px;
    font-weight: 760;
  }

  .mobile-sheet__tool-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .mobile-sheet__tool {
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr);
    gap: 9px;
    align-items: center;
    min-height: 70px;
    padding: 10px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 14px;
    color: var(--smap-ui-text);
    background: var(--smap-ui-card);
    font: inherit;
    text-align: left;
  }

  .mobile-sheet__tool--active {
    border-color: var(--smap-primary);
    color: var(--smap-primary-strong);
    background: var(--smap-primary-soft);
  }

  .mobile-sheet__tool-icon,
  .mobile-sheet__profile-icon {
    display: grid;
    place-items: center;
    color: currentColor;
  }

  .mobile-sheet__tool-icon {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    color: var(--smap-primary);
    background: var(--smap-primary-soft);
  }

  .mobile-sheet__tool-icon--favorite,
  .mobile-sheet__tool-icon--safety {
    color: var(--smap-green);
    background: var(--smap-green-soft);
  }

  .mobile-sheet__tool-icon svg,
  .mobile-sheet__profile-icon svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
  }

  .mobile-sheet__tool-copy {
    display: grid;
    min-width: 0;
    gap: 3px;
  }

  .mobile-sheet__tool-copy strong,
  .mobile-sheet__profile-action-copy strong {
    overflow: hidden;
    color: var(--smap-ui-text);
    font-size: 15px;
    font-weight: 800;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-sheet__tool-copy small,
  .mobile-sheet__profile-action-copy span {
    overflow: hidden;
    color: var(--smap-ui-muted);
    font-size: 12px;
    font-weight: 590;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-sheet__spot-list,
  .mobile-sheet__profile-actions {
    display: grid;
    gap: 8px;
  }

  .mobile-sheet__spot {
    display: grid;
    grid-template-columns: 18px minmax(0, 1fr) auto;
    gap: 10px;
    align-items: center;
    min-height: 62px;
    padding: 10px 11px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 14px;
    color: var(--smap-ui-text);
    background: var(--smap-ui-card);
    font: inherit;
    text-align: left;
  }

  .mobile-sheet__spot--active {
    border-color: var(--smap-primary);
    background: var(--smap-primary-soft);
    box-shadow: inset 3px 0 0 var(--smap-primary);
  }

  .mobile-sheet__spot-pin {
    width: 14px;
    height: 14px;
    border-radius: 50% 50% 50% 3px;
    background: var(--smap-primary);
    transform: rotate(-45deg);
  }

  .mobile-sheet__spot--cyan .mobile-sheet__spot-pin {
    background: var(--smap-green);
  }

  .mobile-sheet__spot--orange .mobile-sheet__spot-pin {
    background: var(--smap-orange);
  }

  .mobile-sheet__spot-copy {
    display: grid;
    min-width: 0;
    gap: 4px;
  }

  .mobile-sheet__spot-copy strong {
    overflow: hidden;
    color: var(--smap-ui-text);
    font-size: 16px;
    font-weight: 820;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-sheet__spot-copy span {
    overflow: hidden;
    color: var(--smap-ui-muted);
    font-size: 12px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-sheet__spot-popularity {
    max-width: 86px;
    overflow: hidden;
    color: var(--smap-primary);
    font-size: 12px;
    font-weight: 740;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-sheet__profile-card {
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr);
    gap: 12px;
    align-items: center;
    min-height: 78px;
    padding: 13px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 16px;
    background: var(--smap-ui-card);
  }

  .mobile-sheet__profile-avatar {
    display: block;
    width: 48px;
    height: 48px;
    border-radius: 16px;
    color: #041914;
    background: linear-gradient(135deg, var(--smap-route-origin), var(--smap-green));
    object-fit: cover;
  }

  .mobile-sheet__profile-copy {
    min-width: 0;
  }

  .mobile-sheet__profile-account {
    grid-column: 1 / -1;
    min-width: 0;
  }

  .mobile-sheet__profile-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    overflow: hidden;
    border: 1px solid var(--smap-ui-border);
    border-radius: 14px;
    background: var(--smap-ui-border);
  }

  .mobile-sheet__profile-stat {
    display: grid;
    min-width: 0;
    min-height: 58px;
    place-items: center;
    background: var(--smap-ui-card);
  }

  .mobile-sheet__profile-stat strong {
    color: var(--smap-ui-text);
    font-size: 20px;
    font-weight: 860;
    line-height: 1;
  }

  .mobile-sheet__profile-stat small {
    margin-top: 5px;
    color: var(--smap-ui-muted);
    font-size: 12px;
    font-weight: 650;
  }

  .mobile-sheet__profile-action {
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 10px;
    align-items: center;
    min-height: 60px;
    padding: 10px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 14px;
    color: var(--smap-ui-text);
    background: var(--smap-ui-card);
    font: inherit;
    text-align: left;
  }

  .mobile-sheet__profile-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    color: var(--smap-primary);
    background: var(--smap-primary-soft);
  }

  .mobile-sheet__profile-icon--favorite,
  .mobile-sheet__profile-icon--settings {
    color: var(--smap-green);
    background: var(--smap-green-soft);
  }

  .mobile-sheet__profile-action-copy {
    display: grid;
    min-width: 0;
    gap: 3px;
  }

  .mobile-sheet__profile-action-copy strong {
    display: inline-flex;
    gap: 7px;
    align-items: center;
  }

  .mobile-sheet__profile-action-copy small {
    flex: 0 0 auto;
    padding: 3px 5px;
    border-radius: 5px;
    color: var(--smap-orange-text);
    background: var(--smap-orange-soft);
    font-size: 10px;
    font-weight: 760;
  }

}

@media (max-width: 390px) {
  .mobile-sheet__route-cards {
    gap: 6px;
  }

  .mobile-sheet__route-card {
    min-height: 72px;
    padding-right: 6px;
    padding-left: 6px;
  }

  .mobile-sheet__route-duration {
    font-size: 15px;
  }

  .mobile-sheet__ride-option {
    grid-template-columns: 54px minmax(0, 1fr) auto 26px;
    gap: 8px;
  }

  .mobile-sheet__vehicle {
    width: 54px;
    height: 48px;
  }

  .mobile-sheet__price-value {
    font-size: 22px;
  }
}

@media (max-height: 760px) and (max-width: 760px) {
  .mobile-sheet {
    max-height: calc(100dvh - 178px - var(--smap-mobile-tabbar-offset, 0px));
  }

  .mobile-sheet__summary {
    display: none;
  }

  .mobile-sheet__ride-option {
    min-height: 62px;
  }
}
</style>
