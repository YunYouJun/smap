<script setup lang="ts">
import type { ProfileService } from './profileData'
import SmapIcon from './SmapIcon.vue'

interface Props {
  services: ProfileService[]
}

defineProps<Props>()
const { t } = useSmapI18n()
</script>

<template>
  <section class="profile-services" :aria-label="t('profile.servicesRegion')">
    <header class="profile-services__head">
      <span>{{ t('profile.servicesEyebrow') }}</span>
      <h2>{{ t('profile.servicesTitle') }}</h2>
    </header>

    <div class="profile-services__grid">
      <button
        v-for="service in services"
        :key="service.id"
        class="profile-services__item"
        type="button"
        :aria-label="`${t(service.labelKey)}，${t(service.descriptionKey)}`"
      >
        <span class="profile-services__icon" aria-hidden="true">
          <SmapIcon :name="service.icon" :size="19" />
        </span>
        <span class="profile-services__copy">
          <strong>{{ t(service.labelKey) }}</strong>
          <small>{{ t(service.descriptionKey) }}</small>
        </span>
        <span v-if="service.badgeKey" class="profile-services__badge">{{ t(service.badgeKey) }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.profile-services {
  min-width: 0;
  padding: 22px;
  border: 1px solid var(--smap-border);
  border-radius: var(--smap-radius-lg);
  background: #fff;
  box-shadow: var(--smap-shadow-card);
}

.profile-services__head span {
  color: var(--smap-text-muted);
  font-size: 12px;
  font-weight: 720;
}

.profile-services__head h2 {
  margin: 4px 0 0;
  color: var(--smap-text);
  font-family: var(--smap-font-display);
  font-size: 20px;
  font-weight: 810;
}

.profile-services__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.profile-services__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 11px;
  align-items: center;
  min-width: 0;
  min-height: 82px;
  padding: 12px;
  border: 1px solid #edf1f4;
  border-radius: var(--smap-radius-md);
  color: var(--smap-text);
  background: #fafcfd;
  text-align: left;
  cursor: pointer;
  transition: border-color 160ms ease, background-color 160ms ease;
}

.profile-services__item:hover,
.profile-services__item:focus-visible {
  border-color: rgba(35, 111, 241, 0.26);
  background: #f5f9ff;
}

.profile-services__icon {
  display: grid;
  width: 38px;
  height: 38px;
  border-radius: var(--smap-radius-md);
  color: var(--smap-orbit);
  background: #edf4ff;
  place-items: center;
}

.profile-services__copy {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.profile-services__copy strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-services__copy strong {
  font-size: 14px;
  font-weight: 760;
}

.profile-services__copy small {
  display: -webkit-box;
  overflow: hidden;
  color: var(--smap-text-muted);
  font-size: 11px;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.profile-services__badge {
  color: var(--smap-orbit);
  font-size: 10px;
  font-weight: 730;
  white-space: nowrap;
}

@media (max-width: 620px) {
  .profile-services {
    padding: 18px;
  }

  .profile-services__grid {
    grid-template-columns: 1fr;
  }
}
</style>
