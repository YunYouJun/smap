<script setup lang="ts">
import type { RideOption, RoutePlace } from './types'

interface Props {
  activeRideOptionId: string
  destination: RoutePlace
  origin: RoutePlace
  rideOptions: RideOption[]
}

interface Emits {
  selectRideOption: [optionId: string]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function vehicleSymbol(vehicle: RideOption['vehicle']): string {
  if (vehicle === 'warp')
    return '✦'

  if (vehicle === 'shared')
    return '⌁'

  return '◈'
}
</script>

<template>
  <aside class="desktop-ride-panel" aria-label="星际打车">
    <header class="desktop-ride-panel__header">
      <div>
        <span class="desktop-ride-panel__eyebrow">RIDE HAILING</span>
        <h2>星际打车</h2>
      </div>
      <span class="desktop-ride-panel__availability"><i></i> 3 艘可响应</span>
    </header>

    <p class="desktop-ride-panel__intro">已匹配附近快船，并自动避开辐射带与拥堵跃迁口。</p>

    <section class="desktop-ride-panel__route" aria-label="打车路线">
      <div class="desktop-ride-panel__route-line desktop-ride-panel__route-line--origin">
        <i aria-hidden="true"></i>
        <span>
          <small>上船点</small>
          <strong>{{ origin.label }}</strong>
          <em>{{ origin.category }} · {{ origin.description }}</em>
        </span>
      </div>
      <div class="desktop-ride-panel__route-line desktop-ride-panel__route-line--destination">
        <i aria-hidden="true"></i>
        <span>
          <small>目的地</small>
          <strong>{{ destination.label }}</strong>
          <em>{{ destination.category }} · {{ destination.description }}</em>
        </span>
      </div>
    </section>

    <section class="desktop-ride-panel__options" aria-labelledby="desktop-ride-options-title">
      <div class="desktop-ride-panel__section-head">
        <h3 id="desktop-ride-options-title">选择快船</h3>
        <span>预估价格</span>
      </div>

      <button
        v-for="option in rideOptions"
        :key="option.id"
        class="desktop-ride-panel__option"
        :class="{ 'desktop-ride-panel__option--active': option.id === activeRideOptionId }"
        type="button"
        :aria-pressed="option.id === activeRideOptionId"
        @click="emit('selectRideOption', option.id)"
      >
        <span class="desktop-ride-panel__vehicle" :data-vehicle="option.vehicle" aria-hidden="true">
          {{ vehicleSymbol(option.vehicle) }}
        </span>
        <span class="desktop-ride-panel__option-copy">
          <span class="desktop-ride-panel__option-name">
            <strong>{{ option.label }}</strong>
            <small v-if="option.badge">{{ option.badge }}</small>
          </span>
          <span>{{ option.description }}</span>
          <em>{{ option.eta }} · {{ option.duration }}</em>
        </span>
        <span class="desktop-ride-panel__price">{{ option.price }}</span>
        <i class="desktop-ride-panel__check" aria-hidden="true">✓</i>
      </button>
    </section>

    <p class="desktop-ride-panel__fee-note">
      <span aria-hidden="true">◇</span>
      价格包含保险及基础服务费，响应前可免费取消
    </p>
  </aside>
</template>

<style scoped>
.desktop-ride-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding: 18px 16px 16px;
  border-right: 1px solid rgba(114, 234, 233, 0.15);
  color: #d9edf3;
  background: linear-gradient(180deg, rgba(14, 24, 33, 0.97), rgba(10, 21, 28, 0.94));
}

.desktop-ride-panel__header,
.desktop-ride-panel__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.desktop-ride-panel__eyebrow {
  color: #ffad57;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.desktop-ride-panel h2,
.desktop-ride-panel h3,
.desktop-ride-panel p {
  margin: 0;
}

.desktop-ride-panel h2 {
  margin-top: 4px;
  color: #f4fbff;
  font-size: 20px;
}

.desktop-ride-panel__availability {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  color: #65e8b5;
  font-size: 10px;
  font-weight: 700;
}

.desktop-ride-panel__availability i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #39dca2;
  box-shadow: 0 0 9px rgba(57, 220, 162, 0.82);
}

.desktop-ride-panel__intro {
  margin-top: 12px !important;
  color: #8fa8b2;
  font-size: 12px;
  line-height: 1.6;
}

.desktop-ride-panel__route {
  position: relative;
  display: grid;
  gap: 8px;
  margin-top: 18px;
  padding: 12px;
  border: 1px solid rgba(172, 218, 227, 0.14);
  border-radius: 10px;
  background: rgba(7, 22, 29, 0.78);
}

.desktop-ride-panel__route::before {
  position: absolute;
  top: 36px;
  bottom: 36px;
  left: 18px;
  width: 1px;
  background: rgba(177, 211, 219, 0.26);
  content: "";
}

.desktop-ride-panel__route-line {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.desktop-ride-panel__route-line > i {
  z-index: 1;
  width: 11px;
  height: 11px;
  border: 2px solid #0d2028;
  border-radius: 50%;
  background: #39dca2;
  box-shadow: 0 0 10px rgba(57, 220, 162, 0.62);
}

.desktop-ride-panel__route-line--destination > i {
  background: #ff9a3d;
  box-shadow: 0 0 10px rgba(255, 154, 61, 0.62);
}

.desktop-ride-panel__route-line > span {
  display: grid;
  min-width: 0;
}

.desktop-ride-panel__route-line small {
  color: #718b95;
  font-size: 9px;
}

.desktop-ride-panel__route-line strong,
.desktop-ride-panel__route-line em {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desktop-ride-panel__route-line strong {
  margin-top: 1px;
  color: #e5f1f5;
  font-size: 12px;
}

.desktop-ride-panel__route-line em {
  margin-top: 2px;
  color: #78909a;
  font-size: 9px;
  font-style: normal;
}

.desktop-ride-panel__options {
  display: grid;
  gap: 8px;
  margin-top: 18px;
}

.desktop-ride-panel__section-head h3 {
  color: #dfeef3;
  font-size: 13px;
}

.desktop-ride-panel__section-head span {
  color: #718c96;
  font-size: 10px;
}

.desktop-ride-panel__option {
  position: relative;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  min-width: 0;
  min-height: 78px;
  padding: 10px;
  border: 1px solid rgba(167, 211, 221, 0.14);
  border-radius: 10px;
  color: #a7bdc5;
  background: rgba(8, 26, 33, 0.76);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.desktop-ride-panel__option:hover,
.desktop-ride-panel__option:focus-visible,
.desktop-ride-panel__option--active {
  outline: 0;
  border-color: rgba(255, 154, 61, 0.5);
  background: rgba(92, 55, 27, 0.24);
}

.desktop-ride-panel__vehicle {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 173, 87, 0.34);
  border-radius: 12px;
  color: #ffc27d;
  background: rgba(255, 154, 61, 0.1);
  font-size: 20px;
}

.desktop-ride-panel__vehicle[data-vehicle="warp"] {
  color: #8cdfff;
  border-color: rgba(76, 185, 255, 0.34);
  background: rgba(75, 155, 255, 0.1);
}

.desktop-ride-panel__vehicle[data-vehicle="shared"] {
  color: #8cebc5;
  border-color: rgba(57, 220, 162, 0.34);
  background: rgba(57, 220, 162, 0.1);
}

.desktop-ride-panel__option-copy {
  display: grid;
  min-width: 0;
  gap: 3px;
  font-size: 9px;
}

.desktop-ride-panel__option-name {
  display: flex;
  gap: 6px;
  align-items: center;
}

.desktop-ride-panel__option-name strong {
  color: #eaf4f7;
  font-size: 12px;
}

.desktop-ride-panel__option-name small {
  padding: 2px 5px;
  border-radius: 999px;
  color: #ffc17b;
  background: rgba(255, 154, 61, 0.14);
  font-size: 8px;
}

.desktop-ride-panel__option-copy > span,
.desktop-ride-panel__option-copy > em {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desktop-ride-panel__option-copy > em {
  color: #78909a;
  font-style: normal;
}

.desktop-ride-panel__price {
  color: #f5fbfd;
  font-size: 11px;
  font-weight: 750;
  white-space: nowrap;
}

.desktop-ride-panel__check {
  position: absolute;
  top: 7px;
  right: 7px;
  display: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  color: #07151b;
  background: #ff9a3d;
  font-size: 10px;
  font-style: normal;
  font-weight: 900;
  line-height: 16px;
  text-align: center;
}

.desktop-ride-panel__option--active .desktop-ride-panel__check {
  display: block;
}

.desktop-ride-panel__fee-note {
  display: flex;
  gap: 7px;
  align-items: center;
  margin-top: auto !important;
  padding-top: 14px;
  color: #79919b;
  font-size: 10px;
}

.desktop-ride-panel__fee-note span {
  color: #63d9ad;
}

@media (max-width: 760px) {
  .desktop-ride-panel {
    display: none;
  }
}
</style>
