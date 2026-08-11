<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import type { SmapLocale } from '~/i18n/messages'
import SmapIcon from './SmapIcon.vue'

interface Props {
  variant?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'light',
})

const { locale, setLocale, t } = useSmapI18n()

const localeOptions: ReadonlyArray<{ value: SmapLocale, labelKey: 'locale.zhCN' | 'locale.en' }> = [
  { value: 'zh-CN', labelKey: 'locale.zhCN' },
  { value: 'en', labelKey: 'locale.en' },
]
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <button
        class="smap-settings__trigger"
        :class="`smap-settings__trigger--${props.variant}`"
        type="button"
        :aria-label="t('profile.openSettings')"
      >
        <SmapIcon name="settings" :size="21" />
      </button>
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay class="smap-settings__overlay" />
      <DialogContent class="smap-settings__content">
        <div class="smap-settings__head">
          <div>
            <DialogTitle class="smap-settings__title">
              {{ t('settings.title') }}
            </DialogTitle>
            <DialogDescription class="smap-settings__description">
              {{ t('settings.description') }}
            </DialogDescription>
          </div>
          <DialogClose class="smap-settings__close" :aria-label="t('common.close')">
            <SmapIcon name="close" :size="19" />
          </DialogClose>
        </div>

        <section class="smap-settings__section" :aria-label="t('settings.languageTitle')">
          <div class="smap-settings__section-copy">
            <SmapIcon name="languages" :size="20" />
            <div>
              <strong>{{ t('settings.languageTitle') }}</strong>
              <p>{{ t('settings.languageDescription') }}</p>
            </div>
          </div>
          <div class="smap-settings__locale-grid">
            <button
              v-for="option in localeOptions"
              :key="option.value"
              class="smap-settings__locale"
              :class="{ 'smap-settings__locale--active': locale === option.value }"
              type="button"
              :aria-pressed="locale === option.value"
              @click="setLocale(option.value)"
            >
              <span>{{ t(option.labelKey) }}</span>
              <SmapIcon v-if="locale === option.value" name="check" :size="16" :stroke-width="2.4" />
            </button>
          </div>
        </section>

        <section class="smap-settings__section smap-settings__section--row" :aria-label="t('settings.appearanceTitle')">
          <div class="smap-settings__section-copy">
            <SmapIcon name="orbit" :size="20" />
            <strong>{{ t('settings.appearanceTitle') }}</strong>
          </div>
          <span>{{ t('settings.appearanceValue') }}</span>
        </section>

        <footer class="smap-settings__footer">
          {{ t('settings.storageNote') }}
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.smap-settings__trigger {
  display: grid;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: var(--profile-primary, #236ff1);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 20px rgba(46, 76, 118, 0.1);
  cursor: pointer;
  place-items: center;
}

.smap-settings__trigger--dark {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(154, 220, 230, 0.22);
  border-radius: var(--smap-radius-sm);
  color: #c8dce4;
  background: rgba(12, 29, 38, 0.86);
  box-shadow: none;
}

.smap-settings__trigger:hover,
.smap-settings__trigger:focus-visible {
  color: var(--profile-primary-strong, #0e51ce);
}

.smap-settings__trigger--dark:hover,
.smap-settings__trigger--dark:focus-visible {
  border-color: rgba(92, 239, 231, 0.56);
  color: #f3ffff;
  background: rgba(22, 55, 64, 0.96);
}
</style>

<style>
.smap-settings__overlay {
  position: fixed;
  z-index: 90;
  inset: 0;
  background: rgba(10, 20, 30, 0.48);
  backdrop-filter: blur(8px);
}

.smap-settings__content {
  position: fixed;
  z-index: 91;
  top: 50%;
  left: 50%;
  width: min(520px, calc(100vw - 32px));
  max-height: calc(100dvh - 40px);
  padding: 22px;
  overflow-y: auto;
  border: 1px solid rgba(215, 225, 235, 0.96);
  border-radius: 16px;
  outline: none;
  color: #13202a;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 28px 80px rgba(20, 42, 70, 0.24);
  transform: translate(-50%, -50%);
}

.smap-settings__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  align-items: start;
}

.smap-settings__title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
}

.smap-settings__description {
  max-width: 420px;
  margin: 8px 0 0;
  color: #667782;
  font-size: 13px;
  line-height: 1.55;
}

.smap-settings__close {
  display: grid;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 9px;
  color: #63717d;
  background: #f1f5f8;
  cursor: pointer;
  place-items: center;
}

.smap-settings__section {
  display: grid;
  gap: 16px;
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #e3eaf0;
  border-radius: 12px;
  background: #f9fbfc;
}

.smap-settings__section--row {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.smap-settings__section--row > span {
  color: #236ff1;
  font-size: 13px;
  font-weight: 700;
}

.smap-settings__section-copy {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  color: #236ff1;
}

.smap-settings__section-copy strong {
  color: #13202a;
  font-size: 14px;
}

.smap-settings__section-copy p {
  margin: 4px 0 0;
  color: #667782;
  font-size: 12px;
  line-height: 1.45;
}

.smap-settings__locale-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.smap-settings__locale {
  display: flex;
  min-height: 44px;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 0 13px;
  border: 1px solid #dce5ec;
  border-radius: 9px;
  color: #374955;
  background: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.smap-settings__locale--active {
  border-color: #236ff1;
  color: #0e51ce;
  background: #edf4ff;
}

.smap-settings__footer {
  margin-top: 18px;
  color: #7a8994;
  font-size: 11px;
  text-align: center;
}

@media (max-width: 520px) {
  .smap-settings__content {
    padding: 18px;
    border-radius: 14px;
  }

  .smap-settings__locale-grid {
    grid-template-columns: 1fr;
  }
}
</style>
