<script setup lang="ts">
import SmapIcon from '~/components/smap/SmapIcon.vue'

const { t } = useSmapI18n()
</script>

<template>
  <div class="smap-app-shell">
    <main class="smap-tabs-content">
      <NuxtPage />
    </main>

    <nav class="smap-tabbar" :aria-label="t('topbar.primaryServices')">
      <NuxtLink class="smap-tab-button" to="/tabs/map">
        <span class="smap-tab-icon" aria-hidden="true">
          <SmapIcon name="navigate" :size="21" />
        </span>
        <span class="smap-tab-label">{{ t('nav.home') }}</span>
      </NuxtLink>

      <NuxtLink class="smap-tab-button" to="/tabs/explore">
        <span class="smap-tab-icon" aria-hidden="true">
          <SmapIcon name="map-pin" :size="21" />
        </span>
        <span class="smap-tab-label">{{ t('nav.explore') }}</span>
      </NuxtLink>

      <NuxtLink class="smap-tab-button" to="/tabs/ride">
        <span class="smap-tab-icon" aria-hidden="true">
          <SmapIcon name="car" :size="21" />
        </span>
        <span class="smap-tab-label">{{ t('nav.rideHailing') }}</span>
      </NuxtLink>

      <NuxtLink class="smap-tab-button" to="/tabs/profile">
        <span class="smap-tab-icon" aria-hidden="true">
          <SmapIcon name="user" :size="21" />
        </span>
        <span class="smap-tab-label">{{ t('nav.profile') }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>
