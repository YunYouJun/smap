<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItemIndicator,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import type { SmapLocale } from '~/i18n/messages'
import SmapIcon from './SmapIcon.vue'

const { locale, localeLabel, setLocale, t } = useSmapI18n()

const localeOptions: ReadonlyArray<{ value: SmapLocale, labelKey: 'locale.zhCN' | 'locale.en' }> = [
  { value: 'zh-CN', labelKey: 'locale.zhCN' },
  { value: 'en', labelKey: 'locale.en' },
]

function handleLocaleChange(value: unknown): void {
  if (value === 'zh-CN' || value === 'en')
    setLocale(value)
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger class="smap-locale-menu__trigger" :aria-label="t('locale.switch')">
      <SmapIcon name="languages" :size="17" />
      <span>{{ localeLabel }}</span>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent class="smap-locale-menu__content" align="end" :side-offset="8">
        <div class="smap-locale-menu__label">
          {{ t('locale.label') }}
        </div>
        <DropdownMenuRadioGroup :model-value="locale" @update:model-value="handleLocaleChange">
          <DropdownMenuRadioItem
            v-for="option in localeOptions"
            :key="option.value"
            class="smap-locale-menu__item"
            :value="option.value"
          >
            <DropdownMenuItemIndicator class="smap-locale-menu__indicator">
              <SmapIcon name="check" :size="15" :stroke-width="2.4" />
            </DropdownMenuItemIndicator>
            <span>{{ t(option.labelKey) }}</span>
            <small>{{ option.value }}</small>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style scoped>
.smap-locale-menu__trigger {
  display: inline-flex;
  min-width: 58px;
  height: 36px;
  gap: 7px;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border: 1px solid rgba(154, 220, 230, 0.22);
  border-radius: 8px;
  color: #c8dce4;
  background: rgba(12, 29, 38, 0.86);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.smap-locale-menu__trigger:hover,
.smap-locale-menu__trigger:focus-visible,
.smap-locale-menu__trigger[data-state="open"] {
  border-color: rgba(92, 239, 231, 0.56);
  outline: none;
  color: #f3ffff;
  background: rgba(22, 55, 64, 0.96);
}
</style>

<style>
.smap-locale-menu__content {
  z-index: 80;
  min-width: 210px;
  padding: 8px;
  border: 1px solid rgba(154, 220, 230, 0.24);
  border-radius: 10px;
  color: #eaf8fb;
  background: rgba(7, 22, 30, 0.98);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.34);
}

.smap-locale-menu__label {
  padding: 6px 9px 8px;
  color: #86a5af;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.smap-locale-menu__item {
  position: relative;
  display: grid;
  grid-template-columns: 20px 1fr auto;
  gap: 8px;
  align-items: center;
  min-height: 38px;
  padding: 0 9px;
  border-radius: 7px;
  outline: none;
  color: #eaf8fb;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}

.smap-locale-menu__item[data-highlighted] {
  background: rgba(75, 219, 212, 0.13);
}

.smap-locale-menu__item small {
  color: #76939d;
  font-size: 10px;
  font-weight: 700;
}

.smap-locale-menu__indicator {
  display: grid;
  color: #5cefe7;
  place-items: center;
}
</style>
