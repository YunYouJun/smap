<script setup lang="ts">
import type { MessageKey } from '~/i18n/messages'
import type { SmapIconName } from './iconTypes'
import type { MobileService, MobileServiceItem } from './types'
import SmapIcon from './SmapIcon.vue'

interface Props {
  activeService: MobileService
  services: MobileServiceItem[]
}

interface Emits {
  selectService: [service: MobileService]
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useSmapI18n()

const serviceLabelKeys: Record<MobileService, MessageKey> = {
  navigation: 'nav.navigation',
  explore: 'nav.explore',
  'ride-hailing': 'nav.rideHailing',
  profile: 'nav.profile',
}

function serviceIcon(icon: MobileServiceItem['icon']): SmapIconName {
  if (icon === 'taxi')
    return 'car'

  if (icon === 'compass')
    return 'map-pin'

  return icon
}
</script>

<template>
  <nav class="smap-service-navigation" :aria-label="t('topbar.primaryServices')">
    <button
      v-for="service in services"
      :key="service.id"
      class="smap-service-navigation__button"
      :class="{ 'smap-service-navigation__button--active': activeService === service.id }"
      type="button"
      :aria-current="activeService === service.id ? 'page' : undefined"
      @click="emit('selectService', service.id)"
    >
      <SmapIcon :name="serviceIcon(service.icon)" :size="16" />
      <span>{{ t(serviceLabelKeys[service.id]) }}</span>
    </button>
  </nav>
</template>

<style scoped>
.smap-service-navigation {
  display: flex;
  min-width: 0;
  gap: var(--smap-space-1);
  justify-content: center;
}

.smap-service-navigation__button {
  position: relative;
  display: inline-flex;
  min-width: 76px;
  height: 38px;
  gap: 7px;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border: 0;
  color: #b8c9d2;
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: 590;
  cursor: pointer;
}

.smap-service-navigation__button::after {
  position: absolute;
  right: 10px;
  bottom: 0;
  left: 10px;
  height: 2px;
  content: '';
  border-radius: var(--smap-radius-pill);
  background: transparent;
}

.smap-service-navigation__button:hover {
  color: #efffff;
}

.smap-service-navigation__button--active {
  color: #efffff;
}

.smap-service-navigation__button--active::after {
  background: var(--smap-ion);
  box-shadow: 0 0 12px rgba(40, 243, 236, 0.52);
}

@media (max-width: 980px) {
  .smap-service-navigation__button {
    min-width: 66px;
    padding: 0 7px;
  }
}
</style>
