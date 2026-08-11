<script setup lang="ts">
import { navigateTo, useRoute } from '#imports'
import type { MobileService } from './types'
import { mobileServices } from './smapData'
import SmapHeaderBrand from './SmapHeaderBrand.vue'
import SmapLocaleMenu from './SmapLocaleMenu.vue'
import SmapServiceNavigation from './SmapServiceNavigation.vue'
import SmapSettingsDialog from './SmapSettingsDialog.vue'

const route = useRoute()

const serviceRoutes: Record<MobileService, string> = {
  navigation: '/tabs/map',
  explore: '/tabs/explore',
  'ride-hailing': '/tabs/ride',
  profile: '/tabs/profile',
}

function goToService(service: MobileService): void {
  const targetRoute = serviceRoutes[service]

  if (route.path !== targetRoute)
    void navigateTo(targetRoute)
}
</script>

<template>
  <header class="smap-profile-header">
    <SmapHeaderBrand compact />
    <SmapServiceNavigation
      active-service="profile"
      :services="mobileServices"
      @select-service="goToService"
    />
    <div class="smap-profile-header__actions">
      <SmapLocaleMenu />
      <SmapSettingsDialog variant="dark" />
    </div>
  </header>
</template>

<style scoped>
.smap-profile-header {
  position: sticky;
  z-index: 20;
  top: 0;
  display: grid;
  grid-template-columns: auto minmax(320px, 1fr) auto;
  min-height: 58px;
  gap: var(--smap-space-4);
  align-items: center;
  padding: 9px 14px;
  border-bottom: 1px solid rgba(112, 236, 232, 0.17);
  background:
    radial-gradient(circle at 20% -120%, rgba(40, 243, 236, 0.17), transparent 42%),
    linear-gradient(180deg, rgba(4, 15, 21, 0.99), rgba(5, 18, 25, 0.97));
  box-shadow: 0 14px 34px rgba(5, 17, 24, 0.18);
}

.smap-profile-header__actions {
  display: flex;
  gap: var(--smap-space-2);
  align-items: center;
  justify-content: flex-end;
}

@media (max-width: 760px) {
  .smap-profile-header {
    display: none;
  }
}
</style>
