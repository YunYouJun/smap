<script setup lang="ts">
import SmapProfilePage from '~/components/smap/SmapProfilePage.vue'
</script>

<template>
  <div class="smap-profile-page">
    <SmapProfilePage />
  </div>
</template>

<style scoped>
.smap-profile-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--smap-cloud);
}
</style>
