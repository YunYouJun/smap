<script setup lang="ts">
import SmapProfilePage from '~/components/smap/SmapProfilePage.vue'
</script>

<template>
  <ion-page>
    <ion-content class="smap-profile-ion-content" fullscreen>
      <SmapProfilePage />
    </ion-content>
  </ion-page>
</template>

<style scoped>
.smap-profile-ion-content {
  --background: #f3f5f7;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
}
</style>
