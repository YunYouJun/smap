<script setup lang="ts">
import { mobileServices } from './smapData'
import SmapAppHeader from './SmapAppHeader.vue'
import SmapLocaleMenu from './SmapLocaleMenu.vue'
import SmapSettingsDialog from './SmapSettingsDialog.vue'
import { useSmapServiceRouter } from './useSmapServiceRouter'

const { goToService } = useSmapServiceRouter()
</script>

<template>
  <SmapAppHeader
    active-service="profile"
    mobile-mode="hidden"
    sticky
    :services="mobileServices"
    @select-service="goToService"
  >
    <template #actions>
      <SmapLocaleMenu />
      <SmapSettingsDialog variant="dark" />
    </template>
  </SmapAppHeader>
</template>
