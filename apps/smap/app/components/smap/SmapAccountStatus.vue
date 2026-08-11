<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import SmapIcon from './SmapIcon.vue'

interface Props {
  variant?: 'compact' | 'profile'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'compact',
})
const { t } = useSmapI18n()

const smapFallbackAvatar = '/smap/avatar-fallback.svg'

const {
  account,
  displayName,
  errorMessage,
  inNativeApp,
  initialize,
  isAuthenticated,
  sessionMode,
  signIn,
  status,
} = useYunlefunAuth()

const isLoading = computed(() => status.value === 'checking' || status.value === 'signing-in')

const failedAvatarUrl = ref<string | null>(null)

const accountAvatarSrc = computed(() => {
  const avatarUrl = account.value?.avatarUrl?.trim()
  if (!avatarUrl || avatarUrl === failedAvatarUrl.value)
    return smapFallbackAvatar

  return avatarUrl
})

const buttonLabel = computed(() => {
  if (isLoading.value)
    return t('auth.signingIn')

  return t('auth.signIn')
})

const accountHint = computed(() => {
  if (errorMessage.value)
    return errorMessage.value

  if (isAuthenticated.value) {
    if (sessionMode.value === 'browser')
      return inNativeApp.value ? t('auth.nativeVerifiedBrowser') : t('auth.verifiedBrowser')

    return inNativeApp.value ? t('auth.syncedNative') : t('auth.serverSession')
  }

  return sessionMode.value === 'browser'
    ? t('auth.redirectBrowser')
    : t('auth.redirectServer')
})

const accountClasses = computed(() => ({
  'smap-account': true,
  [`smap-account--${props.variant}`]: true,
  'smap-account--signed-in': isAuthenticated.value,
  'smap-account--error': !isAuthenticated.value && !!errorMessage.value,
}))

watch(() => account.value?.avatarUrl, () => {
  failedAvatarUrl.value = null
})

onMounted(async () => {
  await initialize()
})

function useFallbackAvatar(event: Event): void {
  const image = event.currentTarget as HTMLImageElement
  if (image.getAttribute('src') === smapFallbackAvatar)
    return

  failedAvatarUrl.value = account.value?.avatarUrl?.trim() ?? smapFallbackAvatar
}

async function login(): Promise<void> {
  await signIn()
}
</script>

<template>
  <a
    v-if="isAuthenticated"
    :class="accountClasses"
    href="https://yunle.fun/settings"
    rel="noreferrer"
    target="_blank"
    :aria-label="t('auth.openSettings', { name: displayName })"
    :title="t('auth.openSettingsTitle')"
  >
    <span class="smap-account__avatar" aria-hidden="true">
      <img :src="accountAvatarSrc" alt="" @error="useFallbackAvatar">
    </span>
    <span class="smap-account__content">
      <span class="smap-account__name">{{ displayName }}</span>
      <span v-if="props.variant === 'profile'" class="smap-account__hint">{{ accountHint }}</span>
    </span>
    <span v-if="inNativeApp" class="smap-account__native">App</span>
  </a>

  <button
    v-else
    :class="accountClasses"
    type="button"
    :disabled="isLoading"
    :aria-label="buttonLabel"
    :title="errorMessage || t('auth.signInTitle')"
    @click="login"
  >
    <span class="smap-account__icon" aria-hidden="true">
      <SmapIcon name="login" :size="19" :stroke-width="2.1" />
    </span>
    <span class="smap-account__content">
      <span class="smap-account__name">{{ buttonLabel }}</span>
      <span v-if="props.variant === 'profile'" class="smap-account__hint">{{ accountHint }}</span>
    </span>
  </button>
</template>

<style scoped>
.smap-account {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  justify-content: center;
  max-width: 172px;
  min-height: 34px;
  padding: 0 11px;
  border: 1px solid rgba(167, 197, 207, 0.24);
  border-radius: 10px;
  color: #dceff4;
  background: rgba(255, 255, 255, 0.07);
  font-size: 12px;
  font-weight: 720;
  line-height: 1;
  text-decoration: none;
}

.smap-account:disabled {
  cursor: progress;
  opacity: 0.74;
}

.smap-account--signed-in {
  border-color: rgba(89, 232, 189, 0.36);
  color: #eafff9;
  background: rgba(57, 220, 162, 0.14);
}

.smap-account--error {
  border-color: rgba(255, 126, 126, 0.42);
  background: rgba(255, 96, 96, 0.14);
}

.smap-account__avatar {
  display: grid;
  flex: 0 0 auto;
  width: 21px;
  height: 21px;
  place-items: center;
  border-radius: 50%;
  color: #06151a;
  background: #59e8bd;
  font-size: 11px;
  font-weight: 860;
  overflow: hidden;
}

.smap-account__avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.smap-account__icon {
  display: grid;
  flex: 0 0 auto;
  width: 17px;
  height: 17px;
  place-items: center;
}

.smap-account__name {
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.smap-account__content {
  display: grid;
  min-width: 0;
  gap: 3px;
  text-align: left;
}

.smap-account__hint {
  display: block;
  min-width: 0;
  overflow: hidden;
  color: var(--smap-ui-muted, #98aab6);
  font-size: 12px;
  font-weight: 590;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.smap-account__native {
  flex: 0 0 auto;
  padding: 3px 5px;
  border-radius: 5px;
  color: #041914;
  background: #59e8bd;
  font-size: 10px;
  font-weight: 820;
}

@media (max-width: 760px) {
  .smap-account {
    max-width: 136px;
    min-height: 34px;
    border-color: var(--smap-ui-border-strong);
    color: var(--smap-ui-text);
    background: var(--smap-ui-surface-raised);
    box-shadow: var(--smap-ui-shadow);
  }

  .smap-account--signed-in {
    color: var(--smap-ui-text);
    background: var(--smap-green-soft);
  }
}

.smap-account--profile {
  width: 100%;
  max-width: none;
  min-height: 54px;
  justify-content: flex-start;
  padding: 8px 12px;
  border-color: var(--smap-ui-border, rgba(167, 197, 207, 0.24));
  border-radius: 12px;
  color: var(--smap-ui-text, #17252d);
  background: var(--smap-ui-surface-soft, rgba(255, 255, 255, 0.07));
  box-shadow: none;
}

.smap-account--profile .smap-account__avatar,
.smap-account--profile .smap-account__icon {
  width: 34px;
  height: 34px;
}

.smap-account--profile .smap-account__avatar {
  color: #fff;
  background: var(--smap-primary, #1677ff);
  font-size: 15px;
}

.smap-account--profile .smap-account__name {
  color: var(--smap-ui-text, #17252d);
  font-size: 15px;
  font-weight: 820;
}

.smap-account--profile.smap-account--signed-in {
  background: var(--smap-primary-soft, #f0f7ff);
}

.smap-account--profile.smap-account--error {
  color: #c24136;
  background: rgba(242, 85, 69, 0.1);
}
</style>
