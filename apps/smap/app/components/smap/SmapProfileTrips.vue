<script setup lang="ts">
import type { ProfileTrip } from './profileData'
import SmapIcon from './SmapIcon.vue'

interface Props {
  trips: ProfileTrip[]
}

defineProps<Props>()
const { t } = useSmapI18n()
</script>

<template>
  <section class="profile-trips" :aria-label="t('profile.tripsRegion')">
    <header class="profile-trips__head">
      <div>
        <span>{{ t('profile.tripsEyebrow') }}</span>
        <h2>{{ t('profile.tripsTitle') }}</h2>
      </div>
      <button type="button" :aria-label="t('profile.tripsAll')">{{ t('common.orders') }}</button>
    </header>

    <div class="profile-trips__list">
      <button
        v-for="trip in trips"
        :key="trip.id"
        class="profile-trips__item"
        type="button"
        :aria-label="`${t(trip.routeKey)}，${t(trip.metaKey)}，${t(trip.statusKey)}`"
      >
        <span class="profile-trips__icon" aria-hidden="true">
          <SmapIcon name="route" :size="19" />
        </span>
        <span class="profile-trips__copy">
          <strong>{{ t(trip.routeKey) }}</strong>
          <small>{{ t(trip.metaKey) }}</small>
        </span>
        <span class="profile-trips__status">{{ t(trip.statusKey) }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.profile-trips {
  min-width: 0;
  padding: 22px;
  border: 1px solid var(--smap-border);
  border-radius: var(--smap-radius-lg);
  background: #fff;
  box-shadow: var(--smap-shadow-card);
}

.profile-trips__head {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.profile-trips__head span {
  color: var(--smap-text-muted);
  font-size: 12px;
  font-weight: 720;
}

.profile-trips__head h2 {
  margin: 4px 0 0;
  color: var(--smap-text);
  font-family: var(--smap-font-display);
  font-size: 20px;
  font-weight: 810;
}

.profile-trips__head button {
  min-width: 52px;
  min-height: 40px;
  border: 0;
  color: var(--smap-orbit);
  background: transparent;
  font: inherit;
  font-size: 13px;
  font-weight: 720;
  cursor: pointer;
}

.profile-trips__list {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.profile-trips__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 13px;
  align-items: center;
  min-width: 0;
  min-height: 72px;
  padding: 12px;
  border: 1px solid #edf1f4;
  border-radius: var(--smap-radius-md);
  color: var(--smap-text);
  background: #fafcfd;
  text-align: left;
  cursor: pointer;
  transition: border-color 160ms ease, background-color 160ms ease;
}

.profile-trips__item:hover,
.profile-trips__item:focus-visible {
  border-color: rgba(35, 111, 241, 0.26);
  background: #f5f9ff;
}

.profile-trips__icon {
  display: grid;
  width: 38px;
  height: 38px;
  border-radius: var(--smap-radius-md);
  color: var(--smap-orbit);
  background: #edf4ff;
  place-items: center;
}

.profile-trips__copy {
  display: grid;
  min-width: 0;
  gap: 5px;
}

.profile-trips__copy strong,
.profile-trips__copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-trips__copy strong {
  font-size: 14px;
  font-weight: 760;
}

.profile-trips__copy small {
  color: var(--smap-text-muted);
  font-size: 12px;
}

.profile-trips__status {
  color: var(--smap-orbit);
  font-size: 11px;
  font-weight: 720;
  white-space: nowrap;
}

@media (max-width: 520px) {
  .profile-trips {
    padding: 18px;
  }

  .profile-trips__item {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .profile-trips__status {
    grid-column: 2;
  }
}
</style>
