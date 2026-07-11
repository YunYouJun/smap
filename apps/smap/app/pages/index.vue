<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  void navigateTo('/tabs/map', { replace: true })
})
</script>

<template>
  <ion-page>
    <ion-content class="smap-ion-content" />
  </ion-page>
</template>
