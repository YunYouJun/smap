<script setup lang="ts">
import { computed } from 'vue'
import type { MobileService, RideOption, RouteOption } from './types'

interface Props {
  activeRideOptionId: string
  activeRouteId: string
  activeService: MobileService
  isNavigating: boolean
  isRideRequested: boolean
  rideOption: RideOption
  rideOptions: RideOption[]
  route: RouteOption
  routes: RouteOption[]
}

interface Emits {
  selectRideOption: [optionId: string]
  selectRoute: [routeId: string]
  selectService: [service: MobileService]
  toggleNavigation: []
  toggleRideRequest: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const rideCtaLabel = computed(() => {
  if (props.isRideRequested)
    return `${props.rideOption.label}已响应`

  return `呼叫${props.rideOption.label}`
})

const rideCtaDetail = computed(() => {
  if (props.isRideRequested)
    return `${props.rideOption.eta} · 前往地球轨道港`

  return `${props.rideOption.eta} · ${props.rideOption.duration}`
})
</script>

<template>
  <aside class="mobile-sheet" aria-label="移动端星际路线方案">
    <span class="mobile-sheet__handle" aria-hidden="true"></span>

    <div
      v-show="activeService === 'navigation'"
      class="mobile-sheet__panel mobile-sheet__panel--navigation"
      role="tabpanel"
      aria-label="驾船路线方案"
    >
      <div class="mobile-sheet__warning">
        <span class="mobile-sheet__warning-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3 2.8 20h18.4L12 3Z" />
            <path d="M12 8v5M12 17h.01" />
          </svg>
        </span>
        <span>星际风暴提醒：前方 1 处建议减速避让</span>
      </div>

      <div class="mobile-sheet__route-cards" aria-label="路线方案">
        <button
          v-for="candidate in routes"
          :key="candidate.id"
          class="mobile-sheet__route-card"
          :class="{ 'mobile-sheet__route-card--active': candidate.id === activeRouteId }"
          type="button"
          @click="emit('selectRoute', candidate.id)"
        >
          <span class="mobile-sheet__route-label">{{ candidate.label }}</span>
          <strong class="mobile-sheet__route-duration">{{ candidate.duration }}</strong>
          <span class="mobile-sheet__route-meta">{{ candidate.stops }} 个跃迁点</span>
        </button>

        <button
          class="mobile-sheet__route-card mobile-sheet__route-card--taxi"
          type="button"
          @click="emit('selectService', 'ride-hailing')"
        >
          <span class="mobile-sheet__route-label">打车</span>
          <strong class="mobile-sheet__route-duration mobile-sheet__route-duration--price">
            {{ rideOption.price }}
          </strong>
          <span class="mobile-sheet__route-meta">{{ rideOption.eta }}</span>
        </button>
      </div>

      <div class="mobile-sheet__summary">
        <div class="mobile-sheet__summary-copy">
          <span class="mobile-sheet__eyebrow">推荐路线</span>
          <h2 class="mobile-sheet__summary-title">
            预计
            <strong class="mobile-sheet__summary-value">{{ route.duration.replace(' 光时', '') }}</strong>
            光时
          </h2>
          <p class="mobile-sheet__summary-meta">
            {{ route.mode }} · {{ route.stops }} 个跃迁点 · 实时规避星际拥堵
          </p>
        </div>
      </div>

      <button class="mobile-sheet__start" type="button" @click="emit('toggleNavigation')">
        <span class="mobile-sheet__start-icon" aria-hidden="true">
          <svg v-if="isNavigating" viewBox="0 0 24 24">
            <path d="M8 5v14M16 5v14" />
          </svg>
          <svg v-else viewBox="0 0 24 24">
            <path d="m8 5 11 7-11 7V5Z" />
          </svg>
        </span>
        {{ isNavigating ? '暂停导航' : '开始导航' }}
      </button>
    </div>

    <div
      v-show="activeService === 'ride-hailing'"
      class="mobile-sheet__panel mobile-sheet__panel--ride"
      role="tabpanel"
      aria-label="星际打车"
    >
      <div class="mobile-sheet__ride-head">
        <div class="mobile-sheet__ride-copy">
          <h2 class="mobile-sheet__ride-title">星际打车</h2>
          <p class="mobile-sheet__ride-meta">附近 3 艘快船可响应 · 已避开辐射带</p>
        </div>
        <button class="mobile-sheet__back-to-route" type="button" @click="emit('selectService', 'navigation')">
          看路线
        </button>
      </div>

      <div class="mobile-sheet__addresses" aria-label="打车路线">
        <div class="mobile-sheet__address mobile-sheet__address--origin">
          <span class="mobile-sheet__address-dot" aria-hidden="true"></span>
          <div class="mobile-sheet__address-copy">
            <strong class="mobile-sheet__address-title">地球轨道港</strong>
            <span class="mobile-sheet__address-meta">地球同步轨道 · 出发层 A</span>
          </div>
        </div>
        <div class="mobile-sheet__address mobile-sheet__address--destination">
          <span class="mobile-sheet__address-dot" aria-hidden="true"></span>
          <div class="mobile-sheet__address-copy">
            <strong class="mobile-sheet__address-title">火星中继站</strong>
            <span class="mobile-sheet__address-meta">火星轨道 · 中继站停靠区</span>
          </div>
        </div>
      </div>

      <div class="mobile-sheet__ride-options" aria-label="打车车型">
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
              {{ option.label }}
              <small v-if="option.badge" class="mobile-sheet__badge">{{ option.badge }}</small>
            </span>
            <span class="mobile-sheet__ride-eta">{{ option.eta }} · {{ option.duration }}</span>
          </span>
          <span class="mobile-sheet__price">
            <strong class="mobile-sheet__price-value">{{ option.price.replace(' 星币', '') }}</strong>
            <span class="mobile-sheet__price-unit">星币</span>
          </span>
          <span class="mobile-sheet__select" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m6 12 4 4 8-8" />
            </svg>
          </span>
        </button>
      </div>

      <p class="mobile-sheet__fee-note">
        <span class="mobile-sheet__fee-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3 5 6v5c0 4.6 2.9 8.6 7 10 4.1-1.4 7-5.4 7-10V6l-7-3Z" />
            <path d="m8.5 12 2.2 2.2 4.8-5" />
          </svg>
        </span>
        价格包含保险及基础服务费
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
    bottom: 0;
    left: 0;
    display: grid;
    max-height: calc(100dvh - 214px);
    gap: 10px;
    padding: 10px 13px max(14px, env(safe-area-inset-bottom));
    overflow-y: auto;
    border: 1px solid var(--smap-ui-border-strong);
    border-bottom: 0;
    border-radius: 20px 20px 0 0;
    color: var(--smap-ui-text);
    background: var(--smap-ui-surface);
    box-shadow: var(--smap-ui-sheet-shadow);
    backdrop-filter: blur(18px);
    scrollbar-width: none;
  }

  .mobile-sheet::-webkit-scrollbar {
    display: none;
  }

  .mobile-sheet__handle {
    justify-self: center;
    width: 52px;
    height: 5px;
    border-radius: 999px;
    background: var(--smap-ui-handle);
  }

  .mobile-sheet__panel {
    display: grid;
    gap: 10px;
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

  .mobile-sheet__route-cards {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }

  .mobile-sheet__route-card {
    display: grid;
    gap: 4px;
    align-content: center;
    min-width: 0;
    min-height: 78px;
    padding: 9px 8px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 13px;
    color: var(--smap-ui-text-soft);
    background: var(--smap-ui-card);
    font: inherit;
    text-align: left;
  }

  .mobile-sheet__route-card--active {
    border-color: var(--smap-primary);
    color: var(--smap-primary-strong);
    background: var(--smap-primary-soft);
    box-shadow: inset 0 0 0 1px rgba(22, 119, 255, 0.1);
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

  .mobile-sheet__start {
    display: inline-flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    min-height: 54px;
    border: 0;
    border-radius: 14px;
    color: var(--smap-on-primary);
    background: linear-gradient(180deg, #2689ff, var(--smap-primary));
    box-shadow: 0 16px 30px rgba(22, 119, 255, 0.28);
    font: inherit;
    font-size: 22px;
    font-weight: 860;
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
    font-size: 27px;
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
    border-radius: 15px;
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
    border-radius: 14px;
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
    border-radius: 14px;
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
    max-height: calc(100dvh - 178px);
  }

  .mobile-sheet__summary {
    display: none;
  }

  .mobile-sheet__ride-option {
    min-height: 62px;
  }
}
</style>
