<script setup lang="ts">
import type { MobileService } from './types'

interface Props {
  activeService: MobileService
  isNavigating: boolean
}

interface Emits {
  selectService: [service: MobileService]
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <header class="smap-topbar">
    <div class="smap-topbar__brand">
      <span class="smap-topbar__mark">SMAP</span>
      <span class="smap-topbar__divider"></span>
      <span class="smap-topbar__title">星际导航</span>
    </div>

    <label class="smap-topbar__search">
      <span class="smap-topbar__search-icon smap-topbar__search-icon--desktop" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="10.8" cy="10.8" r="6.2" />
          <path d="m16 16 4.2 4.2" />
        </svg>
      </span>
      <span class="smap-topbar__mobile-back" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="m15 5-7 7 7 7" />
        </svg>
      </span>
      <input class="smap-topbar__desktop-query" value="搜索星系、星域、天体或坐标" aria-label="搜索星系、星域、天体或坐标">
      <span class="smap-topbar__mobile-route" aria-hidden="true">
        <strong>
          <i class="smap-topbar__route-dot smap-topbar__route-dot--origin"></i>
          地球轨道港
        </strong>
        <strong>
          <i class="smap-topbar__route-dot smap-topbar__route-dot--destination"></i>
          火星中继站
        </strong>
      </span>
      <kbd class="smap-topbar__desktop-key">/</kbd>
      <span class="smap-topbar__mobile-swap" aria-hidden="true">1L</span>
    </label>

    <div class="smap-topbar__mobile-tabs" role="tablist" aria-label="移动端出行方式">
      <button
        class="smap-topbar__mobile-tab"
        :class="{ 'smap-topbar__mobile-tab--active': activeService === 'navigation' }"
        type="button"
        role="tab"
        :aria-selected="activeService === 'navigation'"
        @click="emit('selectService', 'navigation')"
      >
        驾船
      </button>
      <button
        class="smap-topbar__mobile-tab"
        :class="{ 'smap-topbar__mobile-tab--active': activeService === 'ride-hailing' }"
        type="button"
        role="tab"
        :aria-selected="activeService === 'ride-hailing'"
        @click="emit('selectService', 'ride-hailing')"
      >
        打车
      </button>
    </div>

    <nav class="smap-topbar__nav" aria-label="星际导航视图">
      <button class="smap-topbar__nav-button" type="button">
        <span aria-hidden="true">◎</span>
        星图
      </button>
      <button class="smap-topbar__nav-button smap-topbar__nav-button--active" type="button">
        <span aria-hidden="true">⌁</span>
        航线
      </button>
      <button class="smap-topbar__nav-button" type="button">
        <span aria-hidden="true">✣</span>
        天体
      </button>
      <button class="smap-topbar__nav-button" type="button">
        <span aria-hidden="true">⌾</span>
        探索
      </button>
    </nav>

    <div class="smap-topbar__status" :class="{ 'smap-topbar__status--active': isNavigating }">
      <span class="smap-topbar__pulse"></span>
      {{ isNavigating ? '自动导航中' : '导航系统正常' }}
    </div>
  </header>
</template>

<style scoped>
.smap-topbar {
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
  gap: 12px;
  align-items: center;
  min-width: 0;
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
    padding: 16px 12px 0;
    border-bottom: 0;
    background:
      linear-gradient(180deg, rgba(2, 8, 13, 0.88), rgba(2, 8, 13, 0.42) 68%, transparent),
      transparent;
  }

  .smap-topbar__brand,
  .smap-topbar__status {
    display: none;
  }

  .smap-topbar__search {
    grid-column: auto;
    grid-template-columns: auto 1fr auto;
    height: 82px;
    padding: 0 13px;
    border-color: var(--smap-ui-border-strong);
    border-radius: 18px;
    color: var(--smap-ui-text);
    background: var(--smap-ui-surface-raised);
    box-shadow: var(--smap-ui-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.22);
    backdrop-filter: blur(16px);
  }

  .smap-topbar__mobile-back {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    color: var(--smap-ui-text);
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
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    align-items: center;
    min-width: 0;
    color: var(--smap-ui-text);
    font-size: 16px;
    font-weight: 760;
  }

  .smap-topbar__mobile-route strong {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .smap-topbar__route-dot {
    flex: 0 0 auto;
    width: 10px;
    height: 10px;
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
    width: 38px;
    height: 34px;
    border: 1px solid var(--smap-ui-border);
    border-radius: 10px;
    color: var(--smap-ui-text);
    background: var(--smap-ui-surface-soft);
    font-size: 16px;
    font-weight: 780;
  }

  .smap-topbar__mobile-tabs {
    display: inline-flex;
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

  .smap-topbar__nav-button {
    min-width: 72px;
  }
}
</style>
