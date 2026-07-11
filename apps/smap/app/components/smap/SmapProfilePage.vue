<script setup lang="ts">
import SmapAccountStatus from './SmapAccountStatus.vue'

const smapFallbackAvatar = '/smap/avatar-fallback.svg'

interface ProfileShortcut {
  id: string
  label: string
  value: string
  icon: 'footprint' | 'orders' | 'favorite' | 'settings'
}

interface ProfileAsset {
  id: string
  label: string
  value: string
  tone: 'blue' | 'green' | 'orange'
}

interface ProfileService {
  id: string
  label: string
  description: string
  icon: 'address' | 'vehicle' | 'offline' | 'security' | 'invoice' | 'feedback'
  badge?: string
}

interface ProfileTrip {
  id: string
  route: string
  meta: string
  status: string
}

const shortcuts: ProfileShortcut[] = [
  {
    id: 'footprints',
    label: '足迹',
    value: '128',
    icon: 'footprint',
  },
  {
    id: 'orders',
    label: '订单',
    value: '3',
    icon: 'orders',
  },
  {
    id: 'favorites',
    label: '收藏',
    value: '12',
    icon: 'favorite',
  },
  {
    id: 'settings',
    label: '设置',
    value: '偏好',
    icon: 'settings',
  },
]

const assets: ProfileAsset[] = [
  {
    id: 'coupon',
    label: '出行券',
    value: '6 张',
    tone: 'orange',
  },
  {
    id: 'points',
    label: '积分',
    value: '2,480',
    tone: 'blue',
  },
  {
    id: 'carbon',
    label: '绿色里程',
    value: '46.8',
    tone: 'green',
  },
]

const services: ProfileService[] = [
  {
    id: 'address',
    label: '常用地址',
    description: '家、公司和常去地点',
    icon: 'address',
  },
  {
    id: 'vehicle',
    label: '我的载具',
    description: '车牌、能源和通行证',
    icon: 'vehicle',
  },
  {
    id: 'offline',
    label: '离线地图',
    description: '下载常用星域地图',
    icon: 'offline',
    badge: '更新',
  },
  {
    id: 'security',
    label: '安全中心',
    description: '紧急联系人与行程守护',
    icon: 'security',
  },
  {
    id: 'invoice',
    label: '发票助手',
    description: '订单抬头和开票记录',
    icon: 'invoice',
  },
  {
    id: 'feedback',
    label: '反馈与帮助',
    description: '路线纠错、客服和建议',
    icon: 'feedback',
  },
]

const recentTrips: ProfileTrip[] = [
  {
    id: 'earth-mars',
    route: '地球轨道港 → 火星中继站',
    meta: '今天 09:32 · 智能推荐',
    status: '已完成',
  },
  {
    id: 'vega',
    route: '织女星域补给港 → 女神星监测站',
    meta: '昨天 21:08 · 少拥堵',
    status: '已收藏',
  },
]
</script>

<template>
  <main class="profile-page" aria-label="我的">
    <header class="profile-page__topbar">
      <h1 class="profile-page__title">我的</h1>
      <button class="profile-page__settings" type="button" aria-label="打开设置">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 8.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z" />
          <path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.05.05a2.1 2.1 0 0 1-2.97 2.97l-.05-.05a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.08 1.65V21a2.1 2.1 0 0 1-4.2 0v-.08a1.8 1.8 0 0 0-1.08-1.65 1.8 1.8 0 0 0-2 .36l-.05.05a2.1 2.1 0 0 1-2.97-2.97l.05-.05a1.8 1.8 0 0 0 .36-2A1.8 1.8 0 0 0 2.1 13H2a2.1 2.1 0 0 1 0-4.2h.08A1.8 1.8 0 0 0 3.73 7.7a1.8 1.8 0 0 0-.36-2l-.05-.05a2.1 2.1 0 0 1 2.97-2.97l.05.05a1.8 1.8 0 0 0 2 .36A1.8 1.8 0 0 0 9.43 1.5V1.4a2.1 2.1 0 0 1 4.2 0v.08a1.8 1.8 0 0 0 1.08 1.65 1.8 1.8 0 0 0 2-.36l.05-.05a2.1 2.1 0 0 1 2.97 2.97l-.05.05a1.8 1.8 0 0 0-.36 2 1.8 1.8 0 0 0 1.65 1.08H21a2.1 2.1 0 0 1 0 4.2h-.08A1.8 1.8 0 0 0 19.4 15Z" />
        </svg>
      </button>
    </header>

    <section class="profile-page__account-card" aria-label="账号信息">
      <div class="profile-page__orbit" aria-hidden="true">
        <img class="profile-page__orbit-core" :src="smapFallbackAvatar" alt="">
      </div>
      <div class="profile-page__account-copy">
        <span class="profile-page__eyebrow">SMAP 账号</span>
        <h2 class="profile-page__account-title">同步出行、订单与收藏</h2>
        <div class="profile-page__account-status">
          <SmapAccountStatus variant="profile" />
        </div>
      </div>
    </section>

    <section class="profile-page__shortcuts" aria-label="常用入口">
      <button
        v-for="shortcut in shortcuts"
        :key="shortcut.id"
        class="profile-page__shortcut"
        type="button"
        :aria-label="`${shortcut.label}：${shortcut.value}`"
      >
        <span class="profile-page__shortcut-icon" :data-icon="shortcut.icon" aria-hidden="true">
          <svg v-if="shortcut.icon === 'footprint'" viewBox="0 0 24 24">
            <path d="M7.6 13.6c1.8 0 3.2 1.3 3.2 3s-1.4 3-3.2 3-3.2-1.3-3.2-3 1.4-3 3.2-3Z" />
            <path d="M15.7 4.4c2 0 3.7 1.5 3.7 3.4s-1.7 3.4-3.7 3.4S12 9.7 12 7.8s1.7-3.4 3.7-3.4Z" />
            <path d="M6.3 6.8c.9-.6 2.1-.3 2.8.7s.5 2.3-.4 2.9-2.1.3-2.8-.7-.5-2.2.4-2.9Z" />
            <path d="M14.2 14.2c.8-.8 2.2-.8 3.1 0s.9 2.1 0 2.9-2.2.8-3.1 0-.9-2.1 0-2.9Z" />
          </svg>
          <svg v-else-if="shortcut.icon === 'orders'" viewBox="0 0 24 24">
            <path d="M7 3h10l3 4v14H4V7l3-4Z" />
            <path d="M8 11h8M8 15h8M8 19h5" />
          </svg>
          <svg v-else-if="shortcut.icon === 'favorite'" viewBox="0 0 24 24">
            <path d="m12 4 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 4Z" />
          </svg>
          <svg v-else viewBox="0 0 24 24">
            <path d="M12 8.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z" />
            <path d="M4.8 12H2.6M21.4 12h-2.2M12 4.8V2.6M12 21.4v-2.2M6.9 6.9 5.3 5.3M18.7 18.7l-1.6-1.6M17.1 6.9l1.6-1.6M5.3 18.7l1.6-1.6" />
          </svg>
        </span>
        <strong>{{ shortcut.value }}</strong>
        <span>{{ shortcut.label }}</span>
      </button>
    </section>

    <section class="profile-page__travel-card" aria-label="足迹摘要">
      <div class="profile-page__section-head">
        <div>
          <span class="profile-page__eyebrow">足迹</span>
          <h2 class="profile-page__section-title">本月星际出行</h2>
        </div>
        <button class="profile-page__link-button" type="button" aria-label="查看全部足迹">全部</button>
      </div>
      <div class="profile-page__travel-summary">
        <div class="profile-page__travel-ring" aria-hidden="true">
          <span>16</span>
        </div>
        <div class="profile-page__travel-copy">
          <strong>16 次导航 · 46.8 光里</strong>
          <span>最常去：火星中继站 · 平均提前 8 分钟抵达</span>
        </div>
      </div>
    </section>

    <section class="profile-page__assets" aria-label="出行资产">
      <button
        v-for="asset in assets"
        :key="asset.id"
        class="profile-page__asset"
        :data-tone="asset.tone"
        type="button"
        :aria-label="`${asset.label}：${asset.value}`"
      >
        <strong>{{ asset.value }}</strong>
        <span>{{ asset.label }}</span>
      </button>
    </section>

    <section class="profile-page__panel" aria-label="最近行程">
      <div class="profile-page__section-head">
        <div>
          <span class="profile-page__eyebrow">订单</span>
          <h2 class="profile-page__section-title">最近行程</h2>
        </div>
        <button class="profile-page__link-button" type="button" aria-label="查看全部订单">订单</button>
      </div>
      <div class="profile-page__trip-list">
        <button
          v-for="trip in recentTrips"
          :key="trip.id"
          class="profile-page__trip"
          type="button"
          :aria-label="`${trip.route}，${trip.meta}，${trip.status}`"
        >
          <span class="profile-page__trip-marker" aria-hidden="true"></span>
          <span class="profile-page__trip-copy">
            <strong>{{ trip.route }}</strong>
            <small>{{ trip.meta }}</small>
          </span>
          <span class="profile-page__trip-status">{{ trip.status }}</span>
        </button>
      </div>
    </section>

    <section class="profile-page__panel" aria-label="更多服务">
      <div class="profile-page__section-head">
        <div>
          <span class="profile-page__eyebrow">服务</span>
          <h2 class="profile-page__section-title">地图与账号设置</h2>
        </div>
      </div>
      <div class="profile-page__service-grid">
        <button
          v-for="service in services"
          :key="service.id"
          class="profile-page__service"
          type="button"
          :aria-label="`${service.label}，${service.description}`"
        >
          <span class="profile-page__service-icon" :data-icon="service.icon" aria-hidden="true">
            <svg v-if="service.icon === 'address'" viewBox="0 0 24 24">
              <path d="M12 21s6-5.3 6-11a6 6 0 0 0-12 0c0 5.7 6 11 6 11Z" />
              <circle cx="12" cy="10" r="2.3" />
            </svg>
            <svg v-else-if="service.icon === 'vehicle'" viewBox="0 0 24 24">
              <path d="M5.2 11h13.6l-2-5.1H7.2L5.2 11Z" />
              <path d="M6.3 11v6.7M17.7 11v6.7M7.6 17.7h8.8" />
              <path d="M8.5 14.5h.01M15.5 14.5h.01" />
            </svg>
            <svg v-else-if="service.icon === 'offline'" viewBox="0 0 24 24">
              <path d="M4 6.5 9 4l6 2.5 5-2.5v13.5L15 20l-6-2.5L4 20V6.5Z" />
              <path d="M9 4v13.5M15 6.5V20" />
            </svg>
            <svg v-else-if="service.icon === 'security'" viewBox="0 0 24 24">
              <path d="M12 3 5 6v5c0 4.6 2.9 8.6 7 10 4.1-1.4 7-5.4 7-10V6l-7-3Z" />
              <path d="m8.5 12 2.2 2.2 4.8-5" />
            </svg>
            <svg v-else-if="service.icon === 'invoice'" viewBox="0 0 24 24">
              <path d="M7 3h10l2 3v15l-3-1.6-3 1.6-3-1.6L7 21V3Z" />
              <path d="M9 8h6M9 12h6M9 16h4" />
            </svg>
            <svg v-else viewBox="0 0 24 24">
              <path d="M5 18.5V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-4 2.5Z" />
              <path d="M9 8h6M9 12h4" />
            </svg>
          </span>
          <span class="profile-page__service-copy">
            <strong>{{ service.label }}</strong>
            <small>{{ service.description }}</small>
          </span>
          <span v-if="service.badge" class="profile-page__service-badge">{{ service.badge }}</span>
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile-page {
  --profile-primary: #236ff1;
  --profile-primary-strong: #0e51ce;
  --profile-primary-soft: #edf4ff;
  --profile-success: #168b61;
  --profile-success-soft: #e9f8f2;
  --profile-accent: #e76316;
  --profile-accent-soft: #fff3e8;
  --profile-bg: #f3f5f7;
  --profile-bg-start: #eef7ff;
  --profile-surface: #fff;
  --profile-surface-soft: #fafcfd;
  --profile-surface-pressed: #f4f8fc;
  --profile-border: #e0e6ed;
  --profile-border-soft: #eef2f5;
  --profile-text: #13202a;
  --profile-text-strong: #111a22;
  --profile-text-muted: #63717d;
  --profile-text-soft: #6b7a86;
  --profile-radius: 8px;
  --profile-gutter: 16px;
  --profile-space-1: 8px;
  --profile-space-2: 12px;
  --profile-space-3: 16px;
  --profile-card-shadow: 0 8px 20px rgba(39, 59, 86, 0.06);
  --profile-hero-shadow: 0 14px 32px rgba(39, 59, 86, 0.1);

  width: 100%;
  max-width: 100vw;
  min-height: 100%;
  padding: calc(var(--profile-space-3) + env(safe-area-inset-top)) var(--profile-gutter) calc(var(--smap-mobile-tabbar-offset) + 24px);
  overflow-x: hidden;
  color: var(--profile-text);
  background:
    linear-gradient(180deg, var(--profile-bg-start) 0%, #f7f9fb 34%, var(--profile-bg) 100%);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  overscroll-behavior-x: contain;
}

.profile-page__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 520px;
  margin: 0 auto var(--profile-space-3);
}

.profile-page__title {
  margin: 0;
  color: var(--profile-text-strong);
  font-size: 26px;
  font-weight: 760;
  line-height: 1.1;
}

.profile-page__settings,
.profile-page__link-button {
  border: 0;
  color: var(--profile-primary);
  background: transparent;
}

.profile-page__settings {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 8px 20px rgba(46, 76, 118, 0.1);
}

.profile-page__settings svg {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.profile-page__account-card,
.profile-page__shortcuts,
.profile-page__travel-card,
.profile-page__assets,
.profile-page__panel {
  width: 100%;
  max-width: 520px;
  margin-right: auto;
  margin-left: auto;
}

.profile-page__account-card {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--profile-space-3);
  align-items: center;
  min-height: 152px;
  padding: var(--profile-space-3);
  overflow: hidden;
  border: 1px solid rgba(41, 111, 244, 0.1);
  border-radius: var(--profile-radius);
  background:
    radial-gradient(circle at 88% 0%, rgba(255, 132, 48, 0.16), transparent 26%),
    linear-gradient(135deg, #fff 0%, #f7fbff 56%, #eff7ff 100%);
  box-shadow: var(--profile-hero-shadow);
}

.profile-page__account-card::after {
  position: absolute;
  right: -48px;
  bottom: -74px;
  width: 180px;
  height: 180px;
  content: "";
  border: 22px solid rgba(35, 111, 241, 0.07);
  border-radius: 50%;
}

.profile-page__orbit {
  position: relative;
  display: grid;
  width: 76px;
  height: 76px;
  place-items: center;
  border: 1px solid rgba(42, 109, 244, 0.16);
  border-radius: 50%;
  background:
    conic-gradient(from 30deg, var(--profile-primary) 0 28%, #1fbf83 28% 48%, #ff8a2b 48% 62%, rgba(35, 111, 241, 0.16) 62% 100%);
  box-shadow: inset 0 0 0 10px var(--profile-surface);
}

.profile-page__orbit::before,
.profile-page__orbit::after {
  position: absolute;
  content: "";
  border-radius: 50%;
}

.profile-page__orbit::before {
  inset: 10px;
  background: var(--profile-surface);
}

.profile-page__orbit::after {
  top: 10px;
  right: 7px;
  width: 12px;
  height: 12px;
  background: #ff8a2b;
  box-shadow: 0 0 0 4px var(--profile-surface);
}

.profile-page__orbit-core {
  position: relative;
  z-index: 1;
  display: block;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(135deg, var(--profile-primary), var(--profile-primary-strong));
  object-fit: cover;
}

.profile-page__account-copy {
  position: relative;
  z-index: 1;
  display: grid;
  min-width: 0;
  gap: var(--profile-space-1);
}

.profile-page__eyebrow {
  display: block;
  color: var(--profile-text-muted);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
}

.profile-page__account-title,
.profile-page__section-title {
  margin: 0;
  color: var(--profile-text);
  line-height: 1.2;
}

.profile-page__account-title {
  font-size: 19px;
  font-weight: 800;
}

.profile-page__account-status {
  min-width: 0;
}

.profile-page__account-status :deep(.smap-account--profile) {
  width: 100%;
  min-height: 44px;
  justify-content: flex-start;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.profile-page__account-status :deep(.smap-account--profile .smap-account__avatar),
.profile-page__account-status :deep(.smap-account--profile .smap-account__icon) {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--profile-primary);
  background: var(--profile-primary-soft);
}

.profile-page__account-status :deep(.smap-account--profile .smap-account__avatar) {
  color: #fff;
  background: var(--profile-primary);
}

.profile-page__account-status :deep(.smap-account--profile .smap-account__name) {
  color: var(--profile-text);
  font-size: 14px;
  font-weight: 760;
}

.profile-page__account-status :deep(.smap-account--profile .smap-account__hint) {
  color: var(--profile-text-muted);
}

.profile-page__shortcuts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--profile-space-2);
  margin-top: var(--profile-space-2);
}

.profile-page__shortcut {
  display: grid;
  min-width: 0;
  min-height: 90px;
  padding: 10px 6px;
  place-items: center;
  border: 1px solid rgba(224, 230, 237, 0.94);
  border-radius: var(--profile-radius);
  color: var(--profile-text);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: var(--profile-card-shadow);
}

.profile-page__shortcut-icon,
.profile-page__service-icon {
  display: grid;
  place-items: center;
  border-radius: 50%;
}

.profile-page__shortcut-icon {
  width: 34px;
  height: 34px;
  color: var(--profile-primary);
  background: #eef5ff;
}

.profile-page__shortcut-icon[data-icon="footprint"] {
  color: var(--profile-success);
  background: var(--profile-success-soft);
}

.profile-page__shortcut-icon[data-icon="orders"] {
  color: var(--profile-primary);
  background: var(--profile-primary-soft);
}

.profile-page__shortcut-icon[data-icon="favorite"] {
  color: #ff7a1a;
  background: var(--profile-accent-soft);
}

.profile-page__shortcut-icon[data-icon="settings"] {
  color: #576574;
  background: #f1f4f7;
}

.profile-page__shortcut-icon svg,
.profile-page__service-icon svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.profile-page__shortcut strong {
  max-width: 100%;
  overflow: hidden;
  color: var(--profile-text-strong);
  font-size: 17px;
  font-weight: 790;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-page__shortcut span:last-child {
  color: var(--profile-text-muted);
  font-size: 12px;
  font-weight: 620;
}

.profile-page__travel-card,
.profile-page__panel {
  padding: 14px;
  border: 1px solid rgba(224, 230, 237, 0.94);
  border-radius: var(--profile-radius);
  background: rgba(255, 255, 255, 0.97);
  box-shadow: var(--profile-card-shadow);
}

.profile-page__travel-card {
  margin-top: var(--profile-space-2);
}

.profile-page__section-head {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.profile-page__section-title {
  margin-top: 3px;
  font-size: 17px;
  font-weight: 790;
}

.profile-page__link-button {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 44px;
  min-height: 44px;
  padding: 0 2px 0 12px;
  font-size: 13px;
  font-weight: 700;
}

.profile-page__travel-summary {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--profile-space-2);
  align-items: center;
  margin-top: 14px;
}

.profile-page__travel-ring {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 50%;
  background:
    radial-gradient(circle, #fff 0 50%, transparent 51%),
    conic-gradient(#236ff1 0 68%, #1fbf83 68% 82%, #e5ebf1 82% 100%);
}

.profile-page__travel-ring span {
  color: var(--profile-primary);
  font-size: 20px;
  font-weight: 840;
}

.profile-page__travel-copy {
  display: grid;
  min-width: 0;
  gap: 5px;
}

.profile-page__travel-copy strong {
  color: var(--profile-text);
  font-size: 15px;
  font-weight: 760;
}

.profile-page__travel-copy span {
  color: var(--profile-text-muted);
  font-size: 13px;
  line-height: 1.45;
}

.profile-page__assets {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--profile-space-2);
  margin-top: var(--profile-space-2);
}

.profile-page__asset {
  display: grid;
  min-height: 66px;
  min-width: 0;
  gap: 6px;
  align-content: center;
  padding: 13px 10px;
  border: 1px solid rgba(224, 230, 237, 0.94);
  border-radius: var(--profile-radius);
  background: var(--profile-surface);
  text-align: left;
}

.profile-page__asset strong {
  overflow: hidden;
  color: var(--profile-text);
  font-size: 17px;
  font-weight: 820;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-page__asset span {
  color: var(--profile-text-muted);
  font-size: 12px;
  font-weight: 640;
}

.profile-page__asset[data-tone="blue"] strong {
  color: var(--profile-primary);
}

.profile-page__asset[data-tone="green"] strong {
  color: var(--profile-success);
}

.profile-page__asset[data-tone="orange"] strong {
  color: var(--profile-accent);
}

.profile-page__panel {
  margin-top: var(--profile-space-2);
}

.profile-page__trip-list,
.profile-page__service-grid {
  display: grid;
  margin-top: 12px;
}

.profile-page__trip-list {
  gap: 8px;
}

.profile-page__trip {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  width: 100%;
  min-height: 58px;
  padding: 10px;
  border: 1px solid #eef2f5;
  border-radius: 8px;
  color: var(--profile-text);
  background: var(--profile-surface-soft);
  text-align: left;
}

.profile-page__trip-marker {
  width: 10px;
  height: 34px;
  border-radius: 999px;
  background: linear-gradient(180deg, #1fbf83, var(--profile-primary));
}

.profile-page__trip-copy {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.profile-page__trip-copy strong,
.profile-page__service-copy strong {
  overflow: hidden;
  color: var(--profile-text);
  font-size: 14px;
  font-weight: 720;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-page__trip-copy small,
.profile-page__service-copy small {
  overflow: hidden;
  color: var(--profile-text-soft);
  font-size: 12px;
  font-weight: 520;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-page__trip-status,
.profile-page__service-badge {
  border-radius: 999px;
  color: var(--profile-primary);
  background: var(--profile-primary-soft);
  font-size: 11px;
  font-weight: 720;
  white-space: nowrap;
}

.profile-page__trip-status {
  padding: 5px 7px;
}

.profile-page__service-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.profile-page__service {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-width: 0;
  min-height: 72px;
  padding: 12px 10px;
  border: 1px solid #eef2f5;
  border-radius: 8px;
  color: var(--profile-text);
  background: var(--profile-surface-soft);
  text-align: left;
}

.profile-page__service-icon {
  width: 36px;
  height: 36px;
  color: var(--profile-primary);
  background: var(--profile-primary-soft);
}

.profile-page__service-icon[data-icon="address"] {
  color: var(--profile-success);
  background: var(--profile-success-soft);
}

.profile-page__service-icon[data-icon="vehicle"],
.profile-page__service-icon[data-icon="invoice"] {
  color: #ff7a1a;
  background: var(--profile-accent-soft);
}

.profile-page__service-icon[data-icon="security"] {
  color: var(--profile-primary);
  background: var(--profile-primary-soft);
}

.profile-page__service-icon[data-icon="feedback"],
.profile-page__service-icon[data-icon="offline"] {
  color: #5b6874;
  background: #f1f4f7;
}

.profile-page__service-copy {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.profile-page__service-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 6px;
}

.profile-page button:focus-visible {
  outline: 2px solid var(--profile-primary);
  outline-offset: 2px;
}

.profile-page button {
  touch-action: manipulation;
}

.profile-page__settings,
.profile-page__link-button,
.profile-page__shortcut,
.profile-page__asset,
.profile-page__trip,
.profile-page__service,
.profile-page__account-status :deep(.smap-account) {
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease,
    opacity 180ms ease;
}

.profile-page__settings:active,
.profile-page__shortcut:active,
.profile-page__asset:active,
.profile-page__trip:active,
.profile-page__service:active {
  border-color: var(--profile-border);
  background: var(--profile-surface-pressed);
  box-shadow: 0 4px 12px rgba(39, 59, 86, 0.08);
}

.profile-page__link-button:active,
.profile-page__account-status :deep(.smap-account:active) {
  opacity: 0.72;
}

@media (max-width: 360px) {
  .profile-page {
    --profile-gutter: 12px;
  }

  .profile-page__account-card {
    grid-template-columns: 1fr;
  }

  .profile-page__orbit {
    width: 66px;
    height: 66px;
  }

  .profile-page__shortcuts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .profile-page__service-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 761px) {
  .profile-page {
    display: block;
    min-height: 100vh;
    padding-bottom: 36px;
  }
}
</style>
