<script setup lang="ts">
import { computed } from 'vue'
import { ConfigProvider } from 'reka-ui'

const { t } = useSmapI18n()

useHead({
  title: computed(() => t('app.title')),
})
</script>

<template>
  <ConfigProvider dir="ltr">
    <NuxtPage />
  </ConfigProvider>
</template>
