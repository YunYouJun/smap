<script setup lang="ts">
import type { RouteOption, Waypoint } from './types'

interface Props {
  isNavigating: boolean
  route: RouteOption
  waypoints: Waypoint[]
}

defineProps<Props>()
</script>

<template>
  <footer class="route-timeline" aria-label="航线时间轴">
    <div class="route-timeline__heading">
      <h2>航线时间轴（{{ route.stops }} 个跃迁点）</h2>
      <span>{{ isNavigating ? '导航中' : '待启动' }}</span>
    </div>

    <div class="route-timeline__track">
      <article
        v-for="(waypoint, index) in waypoints"
        :key="waypoint.id"
        class="route-timeline__stop"
        :class="{
          'route-timeline__stop--origin': waypoint.role === 'origin',
          'route-timeline__stop--destination': waypoint.role === 'destination',
        }"
      >
        <span class="route-timeline__node">{{ waypoint.role === 'origin' ? '◎' : index }}</span>
        <div>
          <strong>{{ waypoint.label }}</strong>
          <span>{{ waypoint.time }}</span>
        </div>
      </article>
    </div>
  </footer>
</template>

<style scoped>
.route-timeline {
  display: grid;
  gap: 12px;
  min-width: 0;
  padding: 12px 16px 16px;
  border-top: 1px solid rgba(114, 234, 233, 0.15);
  background: linear-gradient(180deg, rgba(7, 24, 31, 0.96), rgba(5, 18, 24, 0.98));
}

.route-timeline__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.route-timeline__heading h2 {
  margin: 0;
  color: #f0fbff;
  font-size: 16px;
  font-weight: 730;
}

.route-timeline__heading span {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 10px;
  border: 1px solid rgba(164, 221, 231, 0.16);
  border-radius: 6px;
  color: #a9c2cb;
  font-size: 12px;
}

.route-timeline__track {
  display: grid;
  grid-template-columns: repeat(7, minmax(136px, 1fr));
  gap: 12px;
  min-width: 0;
  overflow-x: auto;
}

.route-timeline__stop {
  position: relative;
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 10px;
  align-items: center;
  min-height: 68px;
  padding: 10px;
  border: 1px solid rgba(164, 221, 231, 0.15);
  border-radius: 8px;
  color: #d9edf3;
  background: rgba(9, 28, 36, 0.72);
}

.route-timeline__stop:not(:last-child)::after {
  position: absolute;
  top: 50%;
  right: -14px;
  width: 16px;
  height: 2px;
  background: #2af2ed;
  box-shadow: 0 0 12px rgba(42, 242, 237, 0.72);
  content: "";
}

.route-timeline__node {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(42, 242, 237, 0.72);
  border-radius: 50%;
  color: #dfffff;
  background: rgba(42, 242, 237, 0.12);
  font-size: 14px;
  font-weight: 760;
}

.route-timeline__stop--destination .route-timeline__node {
  border-color: rgba(255, 173, 47, 0.88);
  color: #fff3ce;
  background: rgba(255, 173, 47, 0.16);
}

.route-timeline__stop strong,
.route-timeline__stop span:not(.route-timeline__node) {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-timeline__stop strong {
  color: #f0fbff;
  font-size: 13px;
  font-weight: 720;
}

.route-timeline__stop span:not(.route-timeline__node) {
  margin-top: 5px;
  color: #8fa8b1;
  font-size: 12px;
}

@media (max-width: 760px) {
  .route-timeline__heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .route-timeline__track {
    grid-template-columns: repeat(7, minmax(150px, 1fr));
  }
}
</style>
