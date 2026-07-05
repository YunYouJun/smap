<script setup lang="ts">
import type { RouteOption } from './types'

interface Props {
  activeRouteId: string
  isNavigating: boolean
  route: RouteOption
  routes: RouteOption[]
}

interface Emits {
  selectRoute: [routeId: string]
  toggleNavigation: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <aside class="mobile-sheet" aria-label="移动端航线导航面板">
    <span class="mobile-sheet__handle" aria-hidden="true"></span>

    <div class="mobile-sheet__summary">
      <div>
        <h2>
          预计
          <strong>{{ route.duration.replace(' 光时', '') }}</strong>
          光时
        </h2>
        <p>{{ route.stops }} 个跃迁点</p>
      </div>

      <button class="mobile-sheet__strategy" type="button">
        {{ route.mode }}
        <span aria-hidden="true">⌄</span>
      </button>
    </div>

    <div class="mobile-sheet__chips" aria-label="航线状态">
      <span>低辐射</span>
      <span>补给站</span>
      <span>
        航线风险
        <strong>中等</strong>
      </span>
    </div>

    <div class="mobile-sheet__routes" aria-label="可选航线">
      <button
        v-for="(candidate, index) in routes"
        :key="candidate.id"
        class="mobile-sheet__route"
        :class="{ 'mobile-sheet__route--active': candidate.id === activeRouteId }"
        type="button"
        @click="emit('selectRoute', candidate.id)"
      >
        <span class="mobile-sheet__rank">{{ index + 1 }}</span>
        <span class="mobile-sheet__line" aria-hidden="true">
          <i v-for="step in 6" :key="step"></i>
        </span>
        <strong>{{ candidate.duration }}</strong>
        <span aria-hidden="true">›</span>
      </button>
    </div>

    <button class="mobile-sheet__start" type="button" @click="emit('toggleNavigation')">
      <span aria-hidden="true">{{ isNavigating ? 'Ⅱ' : '➤' }}</span>
      {{ isNavigating ? '暂停导航' : '开始导航' }}
    </button>
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
    gap: 12px;
    padding: 10px 16px 16px;
    border: 1px solid rgba(138, 210, 226, 0.2);
    border-bottom: 0;
    border-radius: 14px 14px 0 0;
    background:
      linear-gradient(180deg, rgba(17, 31, 42, 0.96), rgba(6, 15, 22, 0.98)),
      rgba(6, 15, 22, 0.98);
    box-shadow: 0 -24px 48px rgba(0, 0, 0, 0.42);
    backdrop-filter: blur(18px);
  }

  .mobile-sheet__handle {
    justify-self: center;
    width: 56px;
    height: 5px;
    border-radius: 999px;
    background: rgba(196, 214, 226, 0.66);
  }

  .mobile-sheet__summary {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: center;
  }

  .mobile-sheet__summary h2 {
    margin: 0;
    color: #f4fbff;
    font-size: 24px;
    font-weight: 820;
    line-height: 1.1;
  }

  .mobile-sheet__summary h2 strong {
    color: #2ef7f1;
    font-size: 42px;
    font-weight: 860;
  }

  .mobile-sheet__summary p {
    margin: 4px 0 0;
    color: #92a9b5;
    font-size: 14px;
    font-weight: 620;
  }

  .mobile-sheet__strategy {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    min-width: 124px;
    min-height: 44px;
    border: 1px solid rgba(44, 244, 239, 0.36);
    border-radius: 8px;
    color: #30f5ee;
    background: rgba(38, 213, 210, 0.11);
    font-size: 16px;
    font-weight: 760;
  }

  .mobile-sheet__chips {
    display: grid;
    grid-template-columns: 1fr 1fr 1.35fr;
    gap: 8px;
  }

  .mobile-sheet__chips span {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    min-width: 0;
    border: 1px solid rgba(168, 202, 216, 0.18);
    border-radius: 8px;
    color: #d8e9ef;
    background: rgba(255, 255, 255, 0.055);
    font-size: 14px;
    font-weight: 690;
    white-space: nowrap;
  }

  .mobile-sheet__chips strong {
    color: #ffbd4a;
    font-weight: 820;
  }

  .mobile-sheet__routes {
    display: grid;
    gap: 8px;
  }

  .mobile-sheet__route {
    display: grid;
    grid-template-columns: 34px 1fr auto auto;
    gap: 10px;
    align-items: center;
    min-height: 56px;
    padding: 0 12px;
    border: 1px solid rgba(168, 202, 216, 0.14);
    border-radius: 8px;
    color: #b7c7cf;
    background: rgba(4, 14, 20, 0.64);
    font: inherit;
  }

  .mobile-sheet__route--active {
    border-color: rgba(46, 247, 241, 0.88);
    color: #efffff;
    background: rgba(23, 88, 94, 0.42);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .mobile-sheet__rank {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: #06151a;
    background: #ffbd4a;
    font-size: 16px;
    font-weight: 860;
  }

  .mobile-sheet__route--active .mobile-sheet__rank {
    background: #2ef7f1;
  }

  .mobile-sheet__line {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
    align-items: center;
    min-width: 0;
  }

  .mobile-sheet__line i {
    height: 6px;
    border-radius: 999px;
    background: currentColor;
    opacity: 0.78;
  }

  .mobile-sheet__route strong {
    color: currentColor;
    font-size: 18px;
    font-weight: 780;
    white-space: nowrap;
  }

  .mobile-sheet__start {
    display: inline-flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    min-height: 58px;
    border: 0;
    border-radius: 8px;
    color: #031419;
    background: linear-gradient(180deg, #32f3f6, #19cbd2);
    box-shadow: 0 18px 36px rgba(23, 213, 220, 0.28);
    font-size: 24px;
    font-weight: 860;
  }
}

@media (max-width: 390px) {
  .mobile-sheet {
    gap: 10px;
    padding: 9px 12px 14px;
  }

  .mobile-sheet__summary h2 {
    font-size: 22px;
  }

  .mobile-sheet__summary h2 strong {
    font-size: 38px;
  }

  .mobile-sheet__chips span {
    font-size: 13px;
  }
}
</style>
