<script setup lang="ts">
import {
  profileAssets,
  profileServices,
  profileShortcuts,
  profileTrips,
} from './profileData'
import SmapProfileAccountSummary from './SmapProfileAccountSummary.vue'
import SmapProfileActivity from './SmapProfileActivity.vue'
import SmapProfileHeader from './SmapProfileHeader.vue'
import SmapProfileServices from './SmapProfileServices.vue'
import SmapProfileTrips from './SmapProfileTrips.vue'
import SmapSettingsDialog from './SmapSettingsDialog.vue'

const { t } = useSmapI18n()
</script>

<template>
  <div class="profile-shell">
    <SmapProfileHeader />

    <main class="profile-page" :aria-label="t('profile.title')">
      <header class="profile-page__heading">
        <div class="profile-page__heading-copy">
          <span class="profile-page__eyebrow">{{ t('profile.accountEyebrow') }}</span>
          <h1>{{ t('profile.title') }}</h1>
          <p>{{ t('profile.subtitle') }}</p>
        </div>
        <div class="profile-page__mobile-settings">
          <SmapSettingsDialog />
        </div>
      </header>

      <div class="profile-page__overview">
        <SmapProfileAccountSummary :shortcuts="profileShortcuts" />
        <SmapProfileActivity :assets="profileAssets" />
      </div>

      <div class="profile-page__details">
        <SmapProfileTrips :trips="profileTrips" />
        <SmapProfileServices :services="profileServices" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.profile-shell {
  --profile-primary: var(--smap-orbit);
  --profile-primary-strong: var(--smap-orbit-strong);
  --smap-focus-ring: var(--smap-orbit);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: 100%;
  height: 100%;
  min-height: 0;
  background: var(--smap-cloud);
}

.profile-page {
  width: 100%;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  padding: 30px clamp(18px, 3vw, 48px) 48px;
  color: var(--smap-text);
  background:
    radial-gradient(circle at 18% 0%, rgba(70, 159, 255, 0.12), transparent 28%),
    linear-gradient(180deg, #eef7ff 0%, #f7f9fb 28%, #f3f5f7 100%);
  font-family: var(--smap-font-body);
  scrollbar-gutter: stable;
}

.profile-page__heading,
.profile-page__overview,
.profile-page__details {
  width: min(1180px, 100%);
  margin-right: auto;
  margin-left: auto;
}

.profile-page__heading {
  display: flex;
  gap: 24px;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 22px;
}

.profile-page__heading-copy {
  min-width: 0;
}

.profile-page__eyebrow {
  display: block;
  margin-bottom: 5px;
  color: var(--smap-orbit);
  font-size: 11px;
  font-weight: 820;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.profile-page__heading h1 {
  margin: 0;
  color: #111a22;
  font-family: var(--smap-font-display);
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 830;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.profile-page__heading p {
  max-width: 620px;
  margin: 9px 0 0;
  color: var(--smap-text-muted);
  font-size: 13px;
  line-height: 1.55;
}

.profile-page__mobile-settings {
  display: none;
}

.profile-page__overview {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(360px, 0.88fr);
  gap: 18px;
  align-items: stretch;
}

.profile-page__details {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 18px;
  align-items: start;
  margin-top: 18px;
}

@media (max-width: 980px) {
  .profile-page__overview,
  .profile-page__details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .profile-page {
    padding: max(18px, env(safe-area-inset-top)) 14px calc(var(--smap-mobile-tabbar-offset, 0px) + 28px);
  }

  .profile-page__mobile-settings {
    display: block;
  }

  .profile-page__heading {
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .profile-page__heading h1 {
    font-size: 27px;
  }
}
</style>
