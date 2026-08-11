<script setup lang="ts">
import type { ProfileShortcut } from './profileData'
import SmapAccountStatus from './SmapAccountStatus.vue'
import SmapIcon from './SmapIcon.vue'

interface Props {
  shortcuts: ProfileShortcut[]
}

defineProps<Props>()

const smapFallbackAvatar = '/smap/avatar-fallback.svg'
const { t } = useSmapI18n()
</script>

<template>
  <div class="profile-account-summary">
    <section class="profile-account-summary__card" :aria-label="t('profile.accountRegion')">
      <div class="profile-account-summary__orbit" aria-hidden="true">
        <img :src="smapFallbackAvatar" alt="">
      </div>
      <div class="profile-account-summary__copy">
        <span class="profile-account-summary__eyebrow">{{ t('profile.accountEyebrow') }}</span>
        <h2>{{ t('profile.accountTitle') }}</h2>
        <SmapAccountStatus variant="profile" />
      </div>
    </section>

    <section class="profile-account-summary__shortcuts" :aria-label="t('profile.shortcutsRegion')">
      <button
        v-for="shortcut in shortcuts"
        :key="shortcut.id"
        class="profile-account-summary__shortcut"
        :data-tone="shortcut.tone"
        type="button"
        :aria-label="`${t(shortcut.labelKey)}：${t(shortcut.valueKey)}`"
      >
        <span class="profile-account-summary__shortcut-icon" aria-hidden="true">
          <SmapIcon :name="shortcut.icon" :size="19" />
        </span>
        <strong>{{ t(shortcut.valueKey) }}</strong>
        <span>{{ t(shortcut.labelKey) }}</span>
      </button>
    </section>
  </div>
</template>

<style scoped>
.profile-account-summary {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.profile-account-summary__card {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 22px;
  align-items: center;
  min-height: 208px;
  padding: 28px;
  overflow: hidden;
  border: 1px solid rgba(41, 111, 244, 0.12);
  border-radius: var(--smap-radius-lg);
  background:
    radial-gradient(circle at 88% 0%, rgba(255, 132, 48, 0.17), transparent 28%),
    linear-gradient(135deg, #fff 0%, #f7fbff 54%, #edf6ff 100%);
  box-shadow: var(--smap-shadow-card);
}

.profile-account-summary__card::after {
  position: absolute;
  right: -60px;
  bottom: -104px;
  width: 250px;
  height: 250px;
  content: '';
  border: 30px solid rgba(35, 111, 241, 0.07);
  border-radius: 50%;
}

.profile-account-summary__orbit {
  position: relative;
  z-index: 1;
  display: grid;
  width: 96px;
  height: 96px;
  padding: 8px;
  border: 1px solid rgba(42, 109, 244, 0.18);
  border-radius: 50%;
  background: conic-gradient(from 30deg, #236ff1 0 28%, #1fbf83 28% 48%, #ff8a2b 48% 62%, rgba(35, 111, 241, 0.16) 62% 100%);
  box-shadow: inset 0 0 0 10px #fff;
  place-items: center;
}

.profile-account-summary__orbit img {
  width: 62px;
  height: 62px;
  border-radius: 50%;
}

.profile-account-summary__copy {
  position: relative;
  z-index: 1;
  display: grid;
  min-width: 0;
  gap: 9px;
}

.profile-account-summary__eyebrow {
  color: var(--smap-text-muted);
  font-size: 12px;
  font-weight: 760;
}

.profile-account-summary__copy h2 {
  margin: 0;
  color: var(--smap-text);
  font-family: var(--smap-font-display);
  font-size: clamp(20px, 2vw, 27px);
  font-weight: 820;
  line-height: 1.2;
}

.profile-account-summary__copy :deep(.smap-account--profile) {
  width: auto;
  min-height: 44px;
  justify-content: flex-start;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.profile-account-summary__shortcuts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.profile-account-summary__shortcut {
  display: grid;
  min-width: 0;
  min-height: 104px;
  gap: 5px;
  padding: 12px 8px;
  border: 1px solid var(--smap-border);
  border-radius: var(--smap-radius-md);
  color: var(--smap-text);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--smap-shadow-card);
  font: inherit;
  cursor: pointer;
  place-items: center;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.profile-account-summary__shortcut:hover,
.profile-account-summary__shortcut:focus-visible {
  border-color: rgba(35, 111, 241, 0.28);
  box-shadow: 0 12px 28px rgba(35, 111, 241, 0.1);
  transform: translateY(-1px);
}

.profile-account-summary__shortcut-icon {
  display: grid;
  width: 36px;
  height: 36px;
  border-radius: var(--smap-radius-md);
  color: var(--smap-orbit);
  background: #edf4ff;
  place-items: center;
}

.profile-account-summary__shortcut[data-tone="green"] .profile-account-summary__shortcut-icon {
  color: #168b61;
  background: #e9f8f2;
}

.profile-account-summary__shortcut[data-tone="orange"] .profile-account-summary__shortcut-icon {
  color: #e76316;
  background: #fff3e8;
}

.profile-account-summary__shortcut[data-tone="slate"] .profile-account-summary__shortcut-icon {
  color: #576574;
  background: #f1f4f7;
}

.profile-account-summary__shortcut strong {
  max-width: 100%;
  overflow: hidden;
  font-size: 17px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-account-summary__shortcut > span:last-child {
  color: var(--smap-text-muted);
  font-size: 12px;
  font-weight: 650;
}

@media (max-width: 620px) {
  .profile-account-summary__card {
    grid-template-columns: 1fr;
    gap: 16px;
    min-height: 0;
    padding: 20px;
  }

  .profile-account-summary__orbit {
    width: 78px;
    height: 78px;
  }

  .profile-account-summary__orbit img {
    width: 50px;
    height: 50px;
  }

  .profile-account-summary__shortcuts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
