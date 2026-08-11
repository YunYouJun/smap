<script setup lang="ts">
import SmapLogo from './SmapLogo.vue'

interface Props {
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  compact: false,
})

const { t } = useSmapI18n()
</script>

<template>
  <NuxtLink class="smap-header-brand" :class="{ 'smap-header-brand--compact': compact }" to="/tabs/map">
    <SmapLogo class="smap-header-brand__logo" />
    <span class="smap-header-brand__mark">SMAP</span>
    <span class="smap-header-brand__divider" aria-hidden="true"></span>
    <span class="smap-header-brand__title">{{ t('app.subtitle') }}</span>
  </NuxtLink>
</template>

<style scoped>
.smap-header-brand {
  display: flex;
  min-width: 0;
  gap: var(--smap-space-3);
  align-items: center;
  color: inherit;
  text-decoration: none;
}

.smap-header-brand__logo {
  width: 32px;
  height: 32px;
  filter: drop-shadow(0 0 12px rgba(40, 243, 236, 0.28));
}

.smap-header-brand__mark {
  color: var(--smap-text-on-space);
  font-family: var(--smap-font-display);
  font-size: 28px;
  font-weight: 760;
  letter-spacing: -0.04em;
  line-height: 1;
}

.smap-header-brand__divider {
  width: 1px;
  height: 24px;
  background: rgba(208, 237, 244, 0.24);
}

.smap-header-brand__title {
  overflow: hidden;
  color: var(--smap-ion);
  font-family: var(--smap-font-display);
  font-size: 18px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.smap-header-brand--compact .smap-header-brand__logo {
  width: 28px;
  height: 28px;
}

.smap-header-brand--compact .smap-header-brand__mark {
  font-size: 24px;
}

.smap-header-brand--compact .smap-header-brand__title {
  font-size: 15px;
}

@media (max-width: 980px) {
  .smap-header-brand__divider,
  .smap-header-brand__title {
    display: none;
  }
}
</style>
