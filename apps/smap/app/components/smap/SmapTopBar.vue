<script setup lang="ts">
import { computed } from 'vue'
import type { MobileService, MobileServiceItem, RouteEndpointRole, RoutePlace } from './types'
import SmapLogo from './SmapLogo.vue'

interface Props {
  activeService: MobileService
  activeSearchRole: RouteEndpointRole | null
  destination: RoutePlace
  isNavigating: boolean
  origin: RoutePlace
  searchQuery: string
  searchResults: RoutePlace[]
  services: MobileServiceItem[]
}

interface Emits {
  clearRouteSearch: []
  focusRouteSearch: [role: RouteEndpointRole]
  selectService: [service: MobileService]
  selectRouteSearchResult: [role: RouteEndpointRole, placeId: string]
  submitRouteSearch: []
  swapRouteEndpoints: []
  updateRouteSearchQuery: [query: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isSearchOpen = computed(() => props.activeSearchRole !== null)
const activeSearchLabel = computed(() => props.activeSearchRole === 'origin' ? '起点' : '终点')
const searchPlaceholder = computed(() => `搜索${activeSearchLabel.value}`)

function updateSearchQuery(event: Event): void {
  emit('updateRouteSearchQuery', (event.target as HTMLInputElement).value)
}

function focusRouteSearch(role: RouteEndpointRole): void {
  emit('focusRouteSearch', role)
}

function selectSearchResult(placeId: string): void {
  emit('selectRouteSearchResult', props.activeSearchRole ?? 'destination', placeId)
}

function serviceSymbol(icon: MobileServiceItem['icon']): string {
  if (icon === 'taxi')
    return '⌁'

  if (icon === 'compass')
    return '⌾'

  if (icon === 'user')
    return '◉'

  return '◎'
}
</script>

<template>
  <header class="smap-topbar">
    <div class="smap-topbar__brand">
      <SmapLogo class="smap-topbar__logo" />
      <span class="smap-topbar__mark">SMAP</span>
      <span class="smap-topbar__divider"></span>
      <span class="smap-topbar__title">星际导航</span>
    </div>

    <form class="smap-topbar__search" role="search" @submit.prevent="emit('submitRouteSearch')">
      <span class="smap-topbar__search-icon smap-topbar__search-icon--desktop" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="10.8" cy="10.8" r="6.2" />
          <path d="m16 16 4.2 4.2" />
        </svg>
      </span>
      <button
        class="smap-topbar__mobile-back"
        type="button"
        :aria-label="isSearchOpen ? '关闭地点搜索' : '打开起点搜索'"
        @click="isSearchOpen ? emit('clearRouteSearch') : focusRouteSearch('origin')"
      >
        <svg viewBox="0 0 24 24">
          <path d="m15 5-7 7 7 7" />
        </svg>
      </button>
      <input
        class="smap-topbar__desktop-query"
        :value="searchQuery"
        :placeholder="searchPlaceholder"
        aria-label="搜索地点"
        autocomplete="off"
        @focus="focusRouteSearch('destination')"
        @input="updateSearchQuery"
      >
      <div class="smap-topbar__mobile-route">
        <button
          class="smap-topbar__route-line"
          :class="{ 'smap-topbar__route-line--active': activeSearchRole === 'origin' }"
          type="button"
          @click="focusRouteSearch('origin')"
        >
          <i class="smap-topbar__route-dot smap-topbar__route-dot--origin"></i>
          <span>{{ origin.label }}</span>
        </button>
        <button
          class="smap-topbar__route-line"
          :class="{ 'smap-topbar__route-line--active': activeSearchRole === 'destination' }"
          type="button"
          @click="focusRouteSearch('destination')"
        >
          <i class="smap-topbar__route-dot smap-topbar__route-dot--destination"></i>
          <span>{{ destination.label }}</span>
        </button>
      </div>
      <kbd class="smap-topbar__desktop-key">/</kbd>
      <button class="smap-topbar__mobile-swap" type="button" aria-label="交换起终点" @click="emit('swapRouteEndpoints')">
        <svg viewBox="0 0 24 24">
          <path d="M7 7h10l-3-3M17 17H7l3 3" />
          <path d="M17 4v7M7 13v7" />
        </svg>
      </button>
    </form>

    <div v-if="isSearchOpen" class="smap-topbar__suggestions">
      <label class="smap-topbar__suggestion-search">
        <span class="smap-topbar__suggestion-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="10.8" cy="10.8" r="6.2" />
            <path d="m16 16 4.2 4.2" />
          </svg>
        </span>
        <input
          :value="searchQuery"
          :placeholder="searchPlaceholder"
          :aria-label="searchPlaceholder"
          autocomplete="off"
          autofocus
          @input="updateSearchQuery"
          @keydown.enter.prevent="emit('submitRouteSearch')"
        >
      </label>

      <div class="smap-topbar__suggestion-list" role="listbox" :aria-label="`${activeSearchLabel}候选地点`">
        <button
          v-for="place in searchResults"
          :key="place.id"
          class="smap-topbar__suggestion"
          type="button"
          role="option"
          @click="selectSearchResult(place.id)"
        >
          <span class="smap-topbar__suggestion-pin" :data-source="place.source" aria-hidden="true"></span>
          <span class="smap-topbar__suggestion-copy">
            <strong>{{ place.label }}</strong>
            <small>{{ place.category }} · {{ place.description }}</small>
          </span>
          <span class="smap-topbar__suggestion-action">设为{{ activeSearchLabel }}</span>
        </button>
        <p v-if="searchResults.length === 0" class="smap-topbar__empty">未找到地点</p>
      </div>
    </div>

    <div class="smap-topbar__mobile-tabs" role="tablist" aria-label="移动端出行方式">
      <button
        v-for="service in services"
        :key="service.id"
        class="smap-topbar__mobile-tab"
        :class="{ 'smap-topbar__mobile-tab--active': activeService === service.id }"
        type="button"
        role="tab"
        :aria-selected="activeService === service.id"
        @click="emit('selectService', service.id)"
      >
        {{ service.label }}
      </button>
    </div>

    <nav class="smap-topbar__nav" aria-label="主要服务">
      <button
        v-for="service in services"
        :key="service.id"
        class="smap-topbar__nav-button"
        :class="{ 'smap-topbar__nav-button--active': activeService === service.id }"
        type="button"
        :aria-current="activeService === service.id ? 'page' : undefined"
        @click="emit('selectService', service.id)"
      >
        <span aria-hidden="true">{{ serviceSymbol(service.icon) }}</span>
        {{ service.label }}
      </button>
    </nav>

    <div class="smap-topbar__account">
      <slot name="account">
        <div class="smap-topbar__status" :class="{ 'smap-topbar__status--active': isNavigating }">
          <span class="smap-topbar__pulse"></span>
          {{ isNavigating ? '自动导航中' : '导航系统正常' }}
        </div>
      </slot>
    </div>
  </header>
</template>

<style scoped>
.smap-topbar {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(240px, 420px) minmax(280px, 1fr) auto;
  gap: 16px;
  align-items: center;
  min-height: 56px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(112, 236, 232, 0.16);
  background: linear-gradient(180deg, rgba(4, 15, 21, 0.98), rgba(5, 18, 25, 0.92));
}

.smap-topbar__brand {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.smap-topbar__logo {
  width: 32px;
  height: 32px;
  filter: drop-shadow(0 0 12px rgba(33, 243, 233, 0.28));
}

.smap-topbar__mark {
  color: #f4fbff;
  font-size: 28px;
  font-weight: 760;
  line-height: 1;
}

.smap-topbar__divider {
  width: 1px;
  height: 24px;
  background: rgba(208, 237, 244, 0.24);
}

.smap-topbar__title {
  color: #28f3ec;
  font-size: 18px;
  font-weight: 650;
  white-space: nowrap;
}

.smap-topbar__search {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  min-width: 0;
  height: 36px;
  padding: 0 10px;
  border: 1px solid rgba(154, 220, 230, 0.22);
  border-radius: 8px;
  background: rgba(12, 29, 38, 0.86);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.smap-topbar__search button {
  border: 0;
  font: inherit;
  cursor: pointer;
}

.smap-topbar__search-icon {
  width: 18px;
  height: 18px;
  color: #9db7c0;
}

.smap-topbar__search-icon svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 2;
}

.smap-topbar__search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: #c8dce4;
  background: transparent;
  font: inherit;
  font-size: 13px;
}

.smap-topbar__suggestions {
  position: absolute;
  z-index: 12;
  top: 58px;
  left: min(316px, 30vw);
  display: grid;
  width: min(420px, calc(100vw - 32px));
  padding: 8px;
  border: 1px solid rgba(154, 220, 230, 0.22);
  border-radius: 10px;
  background: rgba(12, 29, 38, 0.98);
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.24);
}

.smap-topbar__suggestion-search {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
  min-height: 38px;
  padding: 0 10px;
  border: 1px solid rgba(154, 220, 230, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.smap-topbar__suggestion-icon {
  display: grid;
  width: 17px;
  height: 17px;
  color: #9db7c0;
}

.smap-topbar__suggestion-icon svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 2;
}

.smap-topbar__suggestion-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: #eff9fc;
  background: transparent;
  font: inherit;
  font-size: 14px;
}

.smap-topbar__suggestion-list {
  display: grid;
  gap: 4px;
  max-height: 300px;
  margin-top: 7px;
  overflow-y: auto;
}

.smap-topbar__suggestion {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 9px;
  align-items: center;
  min-width: 0;
  min-height: 52px;
  padding: 8px 9px;
  border: 0;
  border-radius: 8px;
  color: #d8eaf0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.smap-topbar__suggestion:hover,
.smap-topbar__suggestion:focus-visible {
  outline: 0;
  background: rgba(255, 255, 255, 0.07);
}

.smap-topbar__suggestion-pin {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #28f0ee;
  box-shadow: 0 0 12px rgba(40, 240, 238, 0.64);
}

.smap-topbar__suggestion-pin[data-source="poi"] {
  background: #ffad2f;
  box-shadow: 0 0 12px rgba(255, 173, 47, 0.58);
}

.smap-topbar__suggestion-copy {
  display: grid;
  min-width: 0;
}

.smap-topbar__suggestion-copy strong,
.smap-topbar__suggestion-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.smap-topbar__suggestion-copy strong {
  color: #f4fbff;
  font-size: 14px;
  font-weight: 680;
}

.smap-topbar__suggestion-copy small {
  color: #91a8b1;
  font-size: 12px;
}

.smap-topbar__suggestion-action {
  color: #34f2ed;
  font-size: 12px;
  font-weight: 720;
  white-space: nowrap;
}

.smap-topbar__empty {
  margin: 0;
  padding: 14px 10px 10px;
  color: #9db5bd;
  font-size: 13px;
  text-align: center;
}

.smap-topbar__mobile-route,
.smap-topbar__mobile-back,
.smap-topbar__mobile-swap,
.smap-topbar__mobile-tabs {
  display: none;
}

.smap-topbar__search kbd {
  min-width: 22px;
  height: 22px;
  border: 1px solid rgba(199, 225, 231, 0.18);
  border-radius: 5px;
  color: #b8c8d0;
  background: rgba(255, 255, 255, 0.06);
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}

.smap-topbar__nav {
  display: flex;
  justify-content: center;
  gap: 4px;
  min-width: 0;
}

.smap-topbar__nav-button {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  justify-content: center;
  min-width: 76px;
  height: 38px;
  border: 0;
  border-bottom: 2px solid transparent;
  color: #b8c9d2;
  background: transparent;
  font-size: 14px;
  font-weight: 560;
  cursor: pointer;
}

.smap-topbar__nav-button--active {
  border-bottom-color: #26f2ed;
  color: #efffff;
}

.smap-topbar__status {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  color: #d6e8ed;
  font-size: 13px;
  white-space: nowrap;
}

.smap-topbar__account {
  display: flex;
  justify-content: flex-end;
  min-width: 0;
}

.smap-topbar__pulse {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #28e68c;
  box-shadow: 0 0 14px rgba(40, 230, 140, 0.9);
}

.smap-topbar__status--active .smap-topbar__pulse {
  background: #ffad2f;
  box-shadow: 0 0 14px rgba(255, 173, 47, 0.9);
}

@media (max-width: 1180px) {
  .smap-topbar {
    grid-template-columns: auto 1fr auto;
  }

  .smap-topbar__nav {
    grid-column: 1 / -1;
    justify-content: flex-start;
    overflow-x: auto;
  }
}

@media (max-width: 760px) {
  .smap-topbar {
    position: absolute;
    z-index: 9;
    inset: 0 0 auto;
    grid-template-columns: 1fr;
    gap: 8px;
    min-height: 0;
    padding: max(12px, env(safe-area-inset-top)) 12px 0;
    border-bottom: 0;
    background:
      linear-gradient(180deg, rgba(238, 244, 246, 0.98), rgba(238, 244, 246, 0.76) 62%, transparent),
      transparent;
  }

  .smap-topbar__brand,
  .smap-topbar__status {
    display: none;
  }

  .smap-topbar__account {
    position: absolute;
    top: 116px;
    right: 12px;
  }

  .smap-topbar__search {
    grid-column: auto;
    grid-template-columns: auto 1fr auto;
    height: 88px;
    padding: 0 12px;
    border-color: var(--smap-ui-border-strong);
    border-radius: 16px;
    color: var(--smap-ui-text);
    background: var(--smap-ui-surface-raised);
    box-shadow: 0 12px 28px rgba(32, 45, 54, 0.16);
  }

  .smap-topbar__mobile-back {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    color: var(--smap-ui-text);
    background: transparent;
  }

  .smap-topbar__mobile-back svg {
    width: 32px;
    height: 32px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2.5;
  }

  .smap-topbar__desktop-query,
  .smap-topbar__desktop-key,
  .smap-topbar__search-icon--desktop,
  .smap-topbar__nav {
    display: none;
  }

  .smap-topbar__mobile-route {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: center;
    min-width: 0;
    color: var(--smap-ui-text);
    font-size: 15px;
    font-weight: 760;
  }

  .smap-topbar__mobile-route::before {
    position: absolute;
    top: 18px;
    bottom: 18px;
    left: 4px;
    width: 1px;
    background: var(--smap-ui-divider);
    content: "";
  }

  .smap-topbar__route-line {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    width: 100%;
    min-width: 0;
    min-height: 24px;
    padding: 0;
    border: 0;
    color: inherit;
    background: transparent;
    text-align: left;
  }

  .smap-topbar__route-line span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .smap-topbar__route-line--active span {
    color: var(--smap-primary);
  }

  .smap-topbar__route-dot {
    flex: 0 0 auto;
    position: relative;
    z-index: 1;
    width: 9px;
    height: 9px;
    border: 2px solid var(--smap-ui-surface-raised);
    border-radius: 50%;
  }

  .smap-topbar__route-dot--origin {
    background: var(--smap-route-origin);
    box-shadow: 0 0 12px rgba(89, 232, 189, 0.7);
  }

  .smap-topbar__route-dot--destination {
    background: var(--smap-orange);
    box-shadow: 0 0 12px rgba(255, 156, 69, 0.62);
  }

  .smap-topbar__mobile-swap {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 50%;
    color: var(--smap-ui-text);
    background: var(--smap-ui-surface-soft);
  }

  .smap-topbar__mobile-swap svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2.1;
  }

  .smap-topbar__mobile-tabs {
    display: none;
    gap: 8px;
    align-items: center;
    width: max-content;
    max-width: 100%;
    min-height: 38px;
    padding: 4px;
    overflow-x: auto;
    border-radius: 999px;
    background: var(--smap-ui-surface-raised);
    box-shadow: var(--smap-ui-shadow);
    scrollbar-width: none;
  }

  .smap-topbar__mobile-tabs::-webkit-scrollbar {
    display: none;
  }

  .smap-topbar__mobile-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 62px;
    height: 30px;
    border: 0;
    border-radius: 999px;
    color: var(--smap-ui-muted);
    background: transparent;
    font: inherit;
    font-size: 14px;
    font-weight: 760;
    white-space: nowrap;
  }

  .smap-topbar__mobile-tab--active {
    color: var(--smap-on-primary);
    background: var(--smap-primary);
    box-shadow: 0 8px 18px rgba(22, 119, 255, 0.28);
  }

  .smap-topbar__suggestions {
    top: calc(max(12px, env(safe-area-inset-top)) + 96px);
    right: 12px;
    left: 12px;
    width: auto;
    padding: 8px;
    border-color: var(--smap-ui-border-strong);
    border-radius: 14px;
    background: var(--smap-ui-surface-raised);
    box-shadow: 0 14px 30px rgba(32, 45, 54, 0.16);
  }

  .smap-topbar__suggestion-search {
    border-color: var(--smap-ui-border);
    background: var(--smap-ui-surface-soft);
  }

  .smap-topbar__suggestion-search input {
    color: var(--smap-ui-text);
  }

  .smap-topbar__suggestion-list {
    max-height: min(304px, calc(100dvh - 250px - var(--smap-mobile-tabbar-offset, 0px)));
  }

  .smap-topbar__suggestion {
    color: var(--smap-ui-text);
  }

  .smap-topbar__suggestion:hover,
  .smap-topbar__suggestion:focus-visible {
    background: var(--smap-primary-soft);
  }

  .smap-topbar__suggestion-copy strong {
    color: var(--smap-ui-text);
  }

  .smap-topbar__suggestion-copy small,
  .smap-topbar__empty {
    color: var(--smap-ui-muted);
  }

  .smap-topbar__suggestion-action {
    color: var(--smap-primary);
  }

  .smap-topbar__nav-button {
    min-width: 72px;
  }
}

@media (prefers-color-scheme: dark) and (max-width: 760px) {
  .smap-topbar {
    background:
      linear-gradient(180deg, rgba(16, 23, 29, 0.96), rgba(16, 23, 29, 0.68) 62%, transparent),
      transparent;
  }

  .smap-topbar__search {
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.3);
  }
}
</style>
