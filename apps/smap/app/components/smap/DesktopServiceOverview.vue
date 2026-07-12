<script setup lang="ts">
import { computed } from 'vue'
import type { ExploreSpot, MapTool, MobileService, RideOption, RoutePlace, Waypoint } from './types'
import { formatRideCtaDetail, formatRideCtaLabel } from './ridePresentation'

type DesktopService = Extract<MobileService, 'explore' | 'ride-hailing'>

interface Props {
  activeService: DesktopService
  destination: RoutePlace
  enabledMapToolIds: readonly string[]
  exploreSpots: ExploreSpot[]
  isRideRequested: boolean
  mapTools: MapTool[]
  origin: RoutePlace
  rideOption: RideOption
  selectedWaypoint: Waypoint
}

interface Emits {
  toggleRideRequest: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const rideCtaLabel = computed(() => formatRideCtaLabel(props.rideOption, props.isRideRequested))
const rideCtaDetail = computed(() => formatRideCtaDetail(
  props.rideOption,
  props.isRideRequested,
  props.origin.label,
))

const selectedSpot = computed(() => {
  return props.exploreSpots.find(spot => spot.waypointId === props.selectedWaypoint.id)
})
</script>

<template>
  <aside class="desktop-service-overview" :aria-label="activeService === 'explore' ? '探索详情' : '接驾状态'">
    <template v-if="activeService === 'explore'">
      <section class="desktop-service-overview__hero desktop-service-overview__hero--explore">
        <span class="desktop-service-overview__eyebrow">SELECTED LOCATION</span>
        <span class="desktop-service-overview__orbit" aria-hidden="true">◎</span>
        <h2>探索详情</h2>
        <strong>{{ selectedWaypoint.label }}</strong>
        <p>{{ selectedWaypoint.note ?? '已在星图中锁定该地点' }}</p>
      </section>

      <section class="desktop-service-overview__stats" aria-label="探索地点信息">
        <div>
          <small>航行时间</small>
          <strong>{{ selectedWaypoint.time }}</strong>
        </div>
        <div>
          <small>地点类型</small>
          <strong>{{ selectedSpot?.category ?? '导航节点' }}</strong>
        </div>
        <div>
          <small>距当前路线</small>
          <strong>{{ selectedSpot?.distance ?? '已锁定' }}</strong>
        </div>
        <div>
          <small>推荐信息</small>
          <strong>{{ selectedSpot?.popularity ?? '星图推荐' }}</strong>
        </div>
      </section>

      <section class="desktop-service-overview__section">
        <div class="desktop-service-overview__section-head">
          <h3>图层状态</h3>
          <span>{{ enabledMapToolIds.length }} 项运行中</span>
        </div>
        <ul class="desktop-service-overview__layer-list">
          <li v-for="tool in mapTools" :key="tool.id" :class="{ 'is-active': enabledMapToolIds.includes(tool.id) }">
            <i aria-hidden="true"></i>
            <span>{{ tool.label }}</span>
            <strong>{{ enabledMapToolIds.includes(tool.id) ? '开启' : '关闭' }}</strong>
          </li>
        </ul>
      </section>

      <p class="desktop-service-overview__hint">从左侧选择地点可同步更新星图焦点和这里的详情。</p>
    </template>

    <template v-else>
      <section class="desktop-service-overview__hero desktop-service-overview__hero--ride">
        <span class="desktop-service-overview__eyebrow">RIDE STATUS</span>
        <span class="desktop-service-overview__orbit" aria-hidden="true">✦</span>
        <h2>接驾状态</h2>
        <strong>{{ isRideRequested ? '快船正在前往上船点' : '等待确认快船' }}</strong>
        <p>{{ isRideRequested ? `${rideOption.eta} · 船长已确认订单` : '确认后将锁定报价并通知附近船长' }}</p>
      </section>

      <section class="desktop-service-overview__ride-card">
        <span class="desktop-service-overview__ride-badge">{{ rideOption.badge ?? '已选择' }}</span>
        <h3>{{ rideOption.label }}</h3>
        <p>{{ rideOption.description }}</p>
        <div class="desktop-service-overview__ride-price">
          <strong>{{ rideOption.price.replace(' 星币', '') }}</strong>
          <span>星币</span>
        </div>
        <dl>
          <div>
            <dt>接驾</dt>
            <dd>{{ rideOption.eta }}</dd>
          </div>
          <div>
            <dt>送达</dt>
            <dd>{{ rideOption.duration }}</dd>
          </div>
        </dl>
      </section>

      <section class="desktop-service-overview__trip" aria-label="当前行程">
        <h3>当前行程</h3>
        <div>
          <i class="desktop-service-overview__trip-dot desktop-service-overview__trip-dot--origin" aria-hidden="true"></i>
          <span><small>上船点</small><strong>{{ origin.label }}</strong></span>
        </div>
        <div>
          <i class="desktop-service-overview__trip-dot desktop-service-overview__trip-dot--destination" aria-hidden="true"></i>
          <span><small>目的地</small><strong>{{ destination.label }}</strong></span>
        </div>
      </section>

      <button
        class="desktop-service-overview__ride-cta"
        :class="{ 'desktop-service-overview__ride-cta--requested': isRideRequested }"
        type="button"
        @click="emit('toggleRideRequest')"
      >
        <strong>{{ rideCtaLabel }}</strong>
        <span>{{ rideCtaDetail }}</span>
      </button>
    </template>
  </aside>
</template>

<style scoped>
.desktop-service-overview {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding: 16px;
  border-left: 1px solid rgba(114, 234, 233, 0.15);
  color: #d9edf3;
  background: linear-gradient(180deg, rgba(7, 26, 33, 0.95), rgba(6, 18, 24, 0.95));
}

.desktop-service-overview h2,
.desktop-service-overview h3,
.desktop-service-overview p {
  margin: 0;
}

.desktop-service-overview__hero {
  position: relative;
  overflow: hidden;
  min-height: 152px;
  padding: 16px;
  border: 1px solid rgba(43, 244, 239, 0.18);
  border-radius: 12px;
  background:
    radial-gradient(circle at 90% 14%, rgba(43, 244, 239, 0.14), transparent 32%),
    rgba(11, 31, 39, 0.76);
}

.desktop-service-overview__hero--ride {
  border-color: rgba(255, 154, 61, 0.2);
  background:
    radial-gradient(circle at 90% 14%, rgba(255, 154, 61, 0.16), transparent 32%),
    rgba(24, 27, 30, 0.8);
}

.desktop-service-overview__eyebrow {
  color: #42eee8;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.desktop-service-overview__hero--ride .desktop-service-overview__eyebrow {
  color: #ffb66c;
}

.desktop-service-overview__orbit {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(43, 244, 239, 0.24);
  border-radius: 50%;
  color: #41eee8;
  font-size: 24px;
  box-shadow: 0 0 28px rgba(43, 244, 239, 0.12);
}

.desktop-service-overview__hero--ride .desktop-service-overview__orbit {
  border-color: rgba(255, 154, 61, 0.26);
  color: #ffb66c;
  box-shadow: 0 0 28px rgba(255, 154, 61, 0.12);
}

.desktop-service-overview__hero h2 {
  margin-top: 14px;
  color: #8aa3ad;
  font-size: 12px;
  font-weight: 620;
}

.desktop-service-overview__hero > strong {
  display: block;
  max-width: 210px;
  margin-top: 5px;
  color: #f3fbfd;
  font-size: 18px;
  line-height: 1.25;
}

.desktop-service-overview__hero p {
  display: -webkit-box;
  margin-top: 8px;
  overflow: hidden;
  color: #88a1aa;
  font-size: 11px;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.desktop-service-overview__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
}

.desktop-service-overview__stats > div {
  display: grid;
  min-width: 0;
  min-height: 64px;
  padding: 10px;
  border: 1px solid rgba(161, 213, 223, 0.12);
  border-radius: 9px;
  background: rgba(8, 25, 32, 0.74);
}

.desktop-service-overview__stats small,
.desktop-service-overview__trip small {
  color: #718b95;
  font-size: 9px;
}

.desktop-service-overview__stats strong {
  align-self: end;
  overflow: hidden;
  color: #ddecf1;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desktop-service-overview__section {
  margin-top: 18px;
}

.desktop-service-overview__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.desktop-service-overview__section-head h3,
.desktop-service-overview__trip h3 {
  color: #dfeef3;
  font-size: 13px;
}

.desktop-service-overview__section-head > span {
  color: #718b95;
  font-size: 9px;
}

.desktop-service-overview__layer-list {
  display: grid;
  gap: 8px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.desktop-service-overview__layer-list li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
  min-height: 30px;
  color: #7f98a2;
  font-size: 11px;
}

.desktop-service-overview__layer-list i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #435761;
}

.desktop-service-overview__layer-list strong {
  color: #657e88;
  font-size: 9px;
}

.desktop-service-overview__layer-list .is-active i {
  background: #2bf4ef;
  box-shadow: 0 0 8px rgba(43, 244, 239, 0.72);
}

.desktop-service-overview__layer-list .is-active strong {
  color: #45e7df;
}

.desktop-service-overview__hint {
  margin-top: auto !important;
  padding-top: 14px;
  border-top: 1px solid rgba(164, 221, 231, 0.1);
  color: #708994;
  font-size: 10px;
  line-height: 1.5;
}

.desktop-service-overview__ride-card {
  position: relative;
  margin-top: 12px;
  padding: 14px;
  border: 1px solid rgba(255, 154, 61, 0.2);
  border-radius: 11px;
  background: rgba(72, 45, 25, 0.18);
}

.desktop-service-overview__ride-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 3px 6px;
  border-radius: 999px;
  color: #ffc382;
  background: rgba(255, 154, 61, 0.14);
  font-size: 8px;
  font-weight: 750;
}

.desktop-service-overview__ride-card h3 {
  color: #edf7fa;
  font-size: 14px;
}

.desktop-service-overview__ride-card > p {
  margin-top: 3px;
  color: #8098a1;
  font-size: 10px;
}

.desktop-service-overview__ride-price {
  display: flex;
  gap: 4px;
  align-items: baseline;
  margin-top: 12px;
  color: #ffbc73;
}

.desktop-service-overview__ride-price strong {
  font-size: 28px;
}

.desktop-service-overview__ride-price span {
  font-size: 10px;
}

.desktop-service-overview__ride-card dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 12px 0 0;
}

.desktop-service-overview__ride-card dl > div {
  display: grid;
  gap: 3px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 199, 137, 0.12);
}

.desktop-service-overview__ride-card dt {
  color: #708993;
  font-size: 8px;
}

.desktop-service-overview__ride-card dd {
  margin: 0;
  color: #dceaf0;
  font-size: 9px;
}

.desktop-service-overview__trip {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.desktop-service-overview__trip > div {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 9px;
  align-items: center;
}

.desktop-service-overview__trip > div > span {
  display: grid;
  min-width: 0;
}

.desktop-service-overview__trip strong {
  overflow: hidden;
  color: #dcebf0;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desktop-service-overview__trip-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #39dca2;
  box-shadow: 0 0 9px rgba(57, 220, 162, 0.66);
}

.desktop-service-overview__trip-dot--destination {
  background: #ff9a3d;
  box-shadow: 0 0 9px rgba(255, 154, 61, 0.66);
}

.desktop-service-overview__ride-cta {
  display: grid;
  gap: 3px;
  margin-top: auto;
  min-height: 58px;
  padding: 9px 12px;
  border: 0;
  border-radius: 10px;
  color: #211207;
  background: linear-gradient(135deg, #ffb85c, #ff7a00);
  box-shadow: 0 10px 24px rgba(255, 122, 0, 0.22);
  font: inherit;
  cursor: pointer;
}

.desktop-service-overview__ride-cta strong,
.desktop-service-overview__ride-cta span {
  display: block;
}

.desktop-service-overview__ride-cta strong {
  font-size: 14px;
}

.desktop-service-overview__ride-cta span {
  font-size: 9px;
}

.desktop-service-overview__ride-cta--requested {
  color: #062016;
  background: linear-gradient(135deg, #78f0c3, #39dca2);
  box-shadow: 0 10px 24px rgba(57, 220, 162, 0.18);
}

@media (max-width: 760px) {
  .desktop-service-overview {
    display: none;
  }
}
</style>
