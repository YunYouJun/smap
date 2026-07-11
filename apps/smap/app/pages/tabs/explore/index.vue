<script setup lang="ts">
import SmapNavigator from '~/components/smap/SmapNavigator.vue'
</script>

<template>
  <ion-page>
    <ion-content class="smap-ion-content" fullscreen :scroll-y="false">
      <SmapNavigator initial-service="explore" />
    </ion-content>
  </ion-page>
</template>
