<script setup lang="ts">
import type { HazardZone, RouteOption, TelemetryMetric, Waypoint } from './types'

interface Props {
  hazards: HazardZone[]
  metrics: TelemetryMetric[]
  route: RouteOption
  progress: number
  selectedWaypoint: Waypoint
}

defineProps<Props>()

function hazardLevelClass(hazard: HazardZone) {
  return [
    'telemetry-panel__level',
    `telemetry-panel__level--${hazard.tone}`,
  ]
}
</script>

<template>
  <aside class="telemetry-panel" aria-label="航线遥测">
    <section class="telemetry-panel__section">
      <h2 class="telemetry-panel__title">航行 telemetry</h2>
      <div class="telemetry-panel__metrics">
        <div v-for="metric in metrics" :key="metric.id" class="telemetry-panel__metric">
          <span class="telemetry-panel__metric-icon" :data-icon="metric.icon" aria-hidden="true"></span>
          <span class="telemetry-panel__metric-label">{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
          <span class="telemetry-panel__meter">
            <span :style="{ width: `${metric.level}%` }"></span>
          </span>
        </div>
      </div>
    </section>

    <section class="telemetry-panel__section">
      <h3 class="telemetry-panel__subtitle">航线风险</h3>
      <div class="telemetry-panel__hazards">
        <div v-for="hazard in hazards" :key="hazard.id" class="telemetry-panel__hazard">
          <span class="telemetry-panel__hazard-icon" aria-hidden="true">✦</span>
          <span>{{ hazard.label }}</span>
          <strong :class="hazardLevelClass(hazard)">{{ hazard.level }}</strong>
        </div>
      </div>
    </section>

    <section class="telemetry-panel__section telemetry-panel__section--summary">
      <h3 class="telemetry-panel__eta">预计 {{ route.duration }}</h3>
      <p class="telemetry-panel__copy">{{ route.stops }} 个跃迁点 · 当前锁定 {{ selectedWaypoint.label }}</p>
      <div class="telemetry-panel__progress" aria-label="航线进度">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
      <div class="telemetry-panel__chips">
        <span v-for="alert in route.alerts" :key="alert">{{ alert }}</span>
      </div>
      <button type="button">
        查看航线详情
        <span aria-hidden="true">›</span>
      </button>
    </section>
  </aside>
</template>

<style scoped>
.telemetry-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding: 16px;
  border-left: 1px solid rgba(114, 234, 233, 0.15);
  background: linear-gradient(180deg, rgba(7, 26, 33, 0.93), rgba(6, 18, 24, 0.93));
}

.telemetry-panel__section {
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(164, 221, 231, 0.12);
}

.telemetry-panel__section + .telemetry-panel__section {
  padding-top: 18px;
}

.telemetry-panel__section--summary {
  display: grid;
  gap: 12px;
  border-bottom: 0;
}

.telemetry-panel__title,
.telemetry-panel__subtitle,
.telemetry-panel__eta {
  margin: 0;
  color: #f4fbff;
  line-height: 1.2;
}

.telemetry-panel__title {
  font-size: 18px;
  font-weight: 760;
}

.telemetry-panel__subtitle {
  font-size: 16px;
  font-weight: 720;
}

.telemetry-panel__eta {
  font-size: 20px;
  font-weight: 760;
}

.telemetry-panel__metrics {
  display: grid;
  gap: 15px;
  margin-top: 18px;
}

.telemetry-panel__metric {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  gap: 9px;
  align-items: center;
}

.telemetry-panel__metric-icon {
  width: 20px;
  height: 20px;
  color: #9cb7c1;
}

.telemetry-panel__metric-icon::before {
  display: block;
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-radius: 5px;
  content: "";
}

.telemetry-panel__metric-icon[data-icon="bolt"]::before {
  border: 0;
  background: currentColor;
  clip-path: polygon(48% 0, 88% 0, 62% 42%, 92% 42%, 34% 100%, 46% 56%, 18% 56%);
}

.telemetry-panel__metric-icon[data-icon="shield"]::before,
.telemetry-panel__metric-icon[data-icon="ship"]::before {
  border: 0;
  background: currentColor;
  clip-path: polygon(50% 4%, 88% 21%, 78% 73%, 50% 96%, 22% 73%, 12% 21%);
}

.telemetry-panel__metric-icon[data-icon="speed"]::before {
  border-radius: 50%;
}

.telemetry-panel__metric-label {
  color: #a9c0c8;
  font-size: 13px;
  font-weight: 620;
}

.telemetry-panel__metric strong {
  color: #dceef4;
  font-size: 14px;
  font-weight: 650;
}

.telemetry-panel__meter {
  grid-column: 2 / 4;
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(180, 209, 217, 0.16);
}

.telemetry-panel__meter span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2bf4ef, #44e6ce);
}

.telemetry-panel__hazards {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.telemetry-panel__hazard {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  gap: 8px;
  align-items: center;
  min-height: 26px;
  color: #b8cbd3;
  font-size: 13px;
}

.telemetry-panel__hazard-icon {
  color: #9eb6bf;
}

.telemetry-panel__level {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  min-height: 24px;
  border: 1px solid currentColor;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 760;
}

.telemetry-panel__level--amber {
  color: #ffbd4a;
  background: rgba(255, 173, 47, 0.1);
}

.telemetry-panel__level--magenta {
  color: #ff6fae;
  background: rgba(255, 78, 160, 0.1);
}

.telemetry-panel__level--cyan {
  color: #2bf4ef;
  background: rgba(43, 244, 239, 0.1);
}

.telemetry-panel__copy {
  margin: -4px 0 0;
  color: #92aab4;
  font-size: 13px;
}

.telemetry-panel__progress {
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: repeating-linear-gradient(90deg, rgba(180, 209, 217, 0.2) 0 24px, rgba(180, 209, 217, 0.08) 24px 34px);
}

.telemetry-panel__progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2bf4ef, #ffad2f);
}

.telemetry-panel__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.telemetry-panel__chips span {
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid rgba(43, 244, 239, 0.28);
  border-radius: 5px;
  color: #c6f8f7;
  background: rgba(43, 244, 239, 0.08);
  font-size: 12px;
  line-height: 22px;
}

.telemetry-panel button {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  margin-top: 4px;
  border: 1px solid rgba(170, 218, 228, 0.18);
  border-radius: 8px;
  color: #d9edf3;
  background: rgba(10, 30, 38, 0.8);
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;
}

@media (max-width: 1120px) {
  .telemetry-panel {
    border-left: 0;
    border-top: 1px solid rgba(114, 234, 233, 0.15);
    overflow: visible;
  }
}
</style>
