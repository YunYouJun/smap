<script setup lang="ts">
import type { ProfileAsset } from './profileData'

interface Props {
  assets: ProfileAsset[]
}

defineProps<Props>()

const { t } = useSmapI18n()
</script>

<template>
  <section class="profile-activity" :aria-label="t('profile.travelRegion')">
    <div class="profile-activity__head">
      <div>
        <span>{{ t('profile.travelEyebrow') }}</span>
        <h2>{{ t('profile.travelTitle') }}</h2>
      </div>
      <button type="button" :aria-label="t('profile.travelAll')">
        {{ t('common.all') }}
      </button>
    </div>

    <div class="profile-activity__summary">
      <div class="profile-activity__ring" aria-hidden="true">
        <span>16</span>
      </div>
      <div class="profile-activity__copy">
        <strong>{{ t('profile.travelSummary') }}</strong>
        <p>{{ t('profile.travelDetail') }}</p>
      </div>
    </div>

    <div class="profile-activity__assets" :aria-label="t('profile.assetsRegion')">
      <button
        v-for="asset in assets"
        :key="asset.id"
        type="button"
        :data-tone="asset.tone"
        :aria-label="`${t(asset.labelKey)}：${t(asset.valueKey)}`"
      >
        <strong>{{ t(asset.valueKey) }}</strong>
        <span>{{ t(asset.labelKey) }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.profile-activity {
  display: grid;
  min-width: 0;
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--smap-border);
  border-radius: var(--smap-radius-lg);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--smap-shadow-card);
}

.profile-activity__head {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.profile-activity__head span {
  color: var(--smap-text-muted);
  font-size: 12px;
  font-weight: 720;
}

.profile-activity__head h2 {
  margin: 4px 0 0;
  color: var(--smap-text);
  font-family: var(--smap-font-display);
  font-size: 20px;
  font-weight: 810;
}

.profile-activity__head button {
  min-width: 64px;
  min-height: 40px;
  border: 0;
  color: var(--smap-orbit);
  background: transparent;
  font: inherit;
  font-size: 13px;
  font-weight: 720;
  cursor: pointer;
}

.profile-activity__summary {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  min-height: 118px;
  padding: 18px;
  border-radius: var(--smap-radius-md);
  background: linear-gradient(135deg, #f4f9ff, #f9fcfd);
}

.profile-activity__ring {
  display: grid;
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background:
    radial-gradient(circle, #fff 0 50%, transparent 51%),
    conic-gradient(#236ff1 0 68%, #1fbf83 68% 82%, #e5ebf1 82% 100%);
  place-items: center;
}

.profile-activity__ring span {
  color: var(--smap-orbit);
  font-family: var(--smap-font-data);
  font-size: 22px;
  font-weight: 840;
}

.profile-activity__copy {
  min-width: 0;
}

.profile-activity__copy strong {
  color: var(--smap-text);
  font-size: 16px;
  font-weight: 780;
}

.profile-activity__copy p {
  margin: 7px 0 0;
  color: var(--smap-text-muted);
  font-size: 13px;
  line-height: 1.5;
}

.profile-activity__assets {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.profile-activity__assets button {
  display: grid;
  min-width: 0;
  min-height: 76px;
  gap: 7px;
  align-content: center;
  padding: 12px;
  border: 1px solid #e5ebf0;
  border-radius: var(--smap-radius-md);
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: border-color 160ms ease, background-color 160ms ease;
}

.profile-activity__assets button:hover,
.profile-activity__assets button:focus-visible {
  border-color: rgba(35, 111, 241, 0.26);
  background: #f5f9ff;
}

.profile-activity__assets strong {
  overflow: hidden;
  color: var(--smap-text);
  font-family: var(--smap-font-data);
  font-size: 18px;
  font-weight: 820;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-activity__assets button[data-tone="blue"] strong {
  color: var(--smap-orbit);
}

.profile-activity__assets button[data-tone="green"] strong {
  color: #168b61;
}

.profile-activity__assets button[data-tone="orange"] strong {
  color: #e76316;
}

.profile-activity__assets span {
  color: var(--smap-text-muted);
  font-size: 12px;
  font-weight: 640;
}

@media (max-width: 520px) {
  .profile-activity {
    padding: 18px;
  }

  .profile-activity__summary {
    grid-template-columns: 1fr;
  }

  .profile-activity__assets {
    grid-template-columns: 1fr;
  }
}
</style>
