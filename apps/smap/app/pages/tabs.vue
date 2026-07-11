<template>
  <ion-page>
    <ion-content class="smap-tabs-content" fullscreen>
      <ion-tabs>
        <ion-router-outlet />

        <ion-tab-bar class="smap-ion-tabbar" slot="bottom" mode="ios">
          <ion-tab-button tab="map" href="/tabs/map">
            <span class="smap-ion-tab-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="m4 11.3 8-7.1 8 7.1" />
                <path d="M6.7 10.2V20h10.6v-9.8" />
                <path d="M9.6 20v-5.4h4.8V20" />
              </svg>
            </span>
            <ion-label>首页</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="explore" href="/tabs/explore">
            <span class="smap-ion-tab-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 21s6-5.3 6-11a6 6 0 0 0-12 0c0 5.7 6 11 6 11Z" />
                <circle cx="12" cy="10" r="2.3" />
              </svg>
            </span>
            <ion-label>探索</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="ride" href="/tabs/ride">
            <span class="smap-ion-tab-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5.2 11h13.6l-2-5.1H7.2L5.2 11Z" />
                <path d="M6.3 11v6.7M17.7 11v6.7M7.6 17.7h8.8" />
                <path d="M8.5 14.5h.01M15.5 14.5h.01" />
              </svg>
            </span>
            <ion-label>打车</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="profile" href="/tabs/profile">
            <span class="smap-ion-tab-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
              </svg>
            </span>
            <ion-label>我的</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>
