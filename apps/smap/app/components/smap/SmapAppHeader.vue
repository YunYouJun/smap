<script setup lang="ts">
import type { MobileService, MobileServiceItem } from './types'
import SmapHeaderBrand from './SmapHeaderBrand.vue'
import SmapServiceNavigation from './SmapServiceNavigation.vue'

interface Props {
  activeService: MobileService
  mobileMode: 'hidden' | 'navigation'
  services: MobileServiceItem[]
  sticky?: boolean
}

interface Emits {
  selectService: [service: MobileService]
}

withDefaults(defineProps<Props>(), {
  sticky: false,
})

const emit = defineEmits<Emits>()

defineSlots<{
  actions?: () => unknown
  context?: () => unknown
  overlay?: () => unknown
}>()
</script>

<template>
  <header
    class="smap-app-header"
    :class="[
      `smap-app-header--mobile-${mobileMode}`,
      { 'smap-app-header--sticky': sticky },
    ]"
  >
    <SmapHeaderBrand class="smap-app-header__brand" />

    <div class="smap-app-header__context">
      <slot name="context" />
    </div>

    <SmapServiceNavigation
      class="smap-app-header__navigation"
      :active-service="activeService"
      :services="services"
      @select-service="emit('selectService', $event)"
    />

    <div class="smap-app-header__actions">
      <slot name="actions" />
    </div>

    <slot name="overlay" />
  </header>
</template>

<style scoped>
.smap-app-header {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-areas: "brand context navigation actions";
  grid-template-columns: auto clamp(220px, 24vw, 420px) minmax(280px, 1fr) 240px;
  min-height: 56px;
  gap: var(--smap-space-4);
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(112, 236, 232, 0.16);
  background: linear-gradient(180deg, rgba(4, 15, 21, 0.98), rgba(5, 18, 25, 0.92));
}

.smap-app-header--sticky {
  position: sticky;
  z-index: 20;
  top: 0;
}

.smap-app-header__brand {
  grid-area: brand;
}

.smap-app-header__context {
  grid-area: context;
  min-width: 0;
  min-height: 36px;
}

.smap-app-header__navigation {
  grid-area: navigation;
}

.smap-app-header__actions {
  display: flex;
  grid-area: actions;
  min-width: 0;
  gap: var(--smap-space-2);
  align-items: center;
  justify-content: flex-end;
}

@media (max-width: 1180px) {
  .smap-app-header {
    grid-template-areas:
      "brand context actions"
      "navigation navigation navigation";
    grid-template-columns: auto minmax(240px, 1fr) 240px;
  }
}

@media (max-width: 760px) {
  .smap-app-header--mobile-hidden {
    display: none;
  }

  .smap-app-header--mobile-navigation {
    position: absolute;
    z-index: 9;
    inset: 0 0 auto;
    grid-template-areas: "context";
    grid-template-columns: 1fr;
    gap: var(--smap-space-2);
    min-height: 0;
    padding: max(12px, env(safe-area-inset-top)) 12px 0;
    border-bottom: 0;
    background:
      linear-gradient(180deg, rgba(238, 244, 246, 0.98), rgba(238, 244, 246, 0.76) 62%, transparent),
      transparent;
  }

  .smap-app-header--mobile-navigation .smap-app-header__brand,
  .smap-app-header--mobile-navigation .smap-app-header__navigation {
    display: none;
  }

  .smap-app-header--mobile-navigation .smap-app-header__context {
    min-height: 0;
  }

  .smap-app-header--mobile-navigation .smap-app-header__actions {
    position: absolute;
    top: 116px;
    right: 12px;
  }
}

@media (prefers-color-scheme: dark) and (max-width: 760px) {
  .smap-app-header--mobile-navigation {
    background:
      linear-gradient(180deg, rgba(16, 23, 29, 0.96), rgba(16, 23, 29, 0.68) 62%, transparent),
      transparent;
  }
}
</style>
