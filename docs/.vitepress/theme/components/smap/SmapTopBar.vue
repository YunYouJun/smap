<script setup lang="ts">
interface Props {
  isNavigating: boolean
}

defineProps<Props>()
</script>

<template>
  <header class="smap-topbar">
    <div class="smap-topbar__brand">
      <span class="smap-topbar__mark">SMAP</span>
      <span class="smap-topbar__divider"></span>
      <span class="smap-topbar__title">星际导航</span>
    </div>

    <label class="smap-topbar__search">
      <span class="smap-topbar__search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="10.8" cy="10.8" r="6.2" />
          <path d="m16 16 4.2 4.2" />
        </svg>
      </span>
      <input class="smap-topbar__desktop-query" value="搜索星系、星域、天体或坐标" aria-label="搜索星系、星域、天体或坐标">
      <span class="smap-topbar__mobile-route" aria-hidden="true">
        <strong>地球轨道港</strong>
        <i>→</i>
        <strong>火星中继站</strong>
      </span>
      <kbd class="smap-topbar__desktop-key">/</kbd>
      <span class="smap-topbar__mobile-swap" aria-hidden="true">↕</span>
    </label>

    <nav class="smap-topbar__nav" aria-label="星际导航视图">
      <button class="smap-topbar__nav-button" type="button">
        <span aria-hidden="true">◎</span>
        星图
      </button>
      <button class="smap-topbar__nav-button smap-topbar__nav-button--active" type="button">
        <span aria-hidden="true">⌁</span>
        航线
      </button>
      <button class="smap-topbar__nav-button" type="button">
        <span aria-hidden="true">✣</span>
        天体
      </button>
      <button class="smap-topbar__nav-button" type="button">
        <span aria-hidden="true">⌾</span>
        探索
      </button>
    </nav>

    <div class="smap-topbar__status" :class="{ 'smap-topbar__status--active': isNavigating }">
      <span class="smap-topbar__pulse"></span>
      {{ isNavigating ? '自动导航中' : '导航系统正常' }}
    </div>
  </header>
</template>

<style scoped>
.smap-topbar {
  display: grid;
  grid-template-columns: auto minmax(240px, 420px) minmax(280px, 1fr) auto;
  gap: 16px;
  align-items: center;
  min-height: 56px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(112, 236, 232, 0.16);
  background: linear-gradient(180deg, rgba(4, 15, 21, 0.98), rgba(5, 18, 25, 0.92));
}

.smap-topbar__brand {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.smap-topbar__mark {
  color: #f4fbff;
  font-size: 28px;
  font-weight: 760;
  line-height: 1;
}

.smap-topbar__divider {
  width: 1px;
  height: 24px;
  background: rgba(208, 237, 244, 0.24);
}

.smap-topbar__title {
  color: #28f3ec;
  font-size: 18px;
  font-weight: 650;
  white-space: nowrap;
}

.smap-topbar__search {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  min-width: 0;
  height: 36px;
  padding: 0 10px;
  border: 1px solid rgba(154, 220, 230, 0.22);
  border-radius: 8px;
  background: rgba(12, 29, 38, 0.86);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.smap-topbar__search-icon {
  width: 18px;
  height: 18px;
  color: #9db7c0;
}

.smap-topbar__search-icon svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 2;
}

.smap-topbar__search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: #c8dce4;
  background: transparent;
  font: inherit;
  font-size: 13px;
}

.smap-topbar__mobile-route,
.smap-topbar__mobile-swap {
  display: none;
}

.smap-topbar__search kbd {
  min-width: 22px;
  height: 22px;
  border: 1px solid rgba(199, 225, 231, 0.18);
  border-radius: 5px;
  color: #b8c8d0;
  background: rgba(255, 255, 255, 0.06);
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}

.smap-topbar__nav {
  display: flex;
  justify-content: center;
  gap: 4px;
  min-width: 0;
}

.smap-topbar__nav-button {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  justify-content: center;
  min-width: 76px;
  height: 38px;
  border: 0;
  border-bottom: 2px solid transparent;
  color: #b8c9d2;
  background: transparent;
  font-size: 14px;
  font-weight: 560;
  cursor: pointer;
}

.smap-topbar__nav-button--active {
  border-bottom-color: #26f2ed;
  color: #efffff;
}

.smap-topbar__status {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  color: #d6e8ed;
  font-size: 13px;
  white-space: nowrap;
}

.smap-topbar__pulse {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #28e68c;
  box-shadow: 0 0 14px rgba(40, 230, 140, 0.9);
}

.smap-topbar__status--active .smap-topbar__pulse {
  background: #ffad2f;
  box-shadow: 0 0 14px rgba(255, 173, 47, 0.9);
}

@media (max-width: 1180px) {
  .smap-topbar {
    grid-template-columns: auto 1fr auto;
  }

  .smap-topbar__nav {
    grid-column: 1 / -1;
    justify-content: flex-start;
    overflow-x: auto;
  }
}

@media (max-width: 760px) {
  .smap-topbar {
    position: absolute;
    z-index: 9;
    inset: 0 0 auto;
    grid-template-columns: 1fr auto;
    gap: 12px;
    min-height: 0;
    padding: 16px 12px 0;
    border-bottom: 0;
    background:
      linear-gradient(180deg, rgba(2, 8, 13, 0.88), rgba(2, 8, 13, 0.42) 68%, transparent),
      transparent;
  }

  .smap-topbar__brand {
    justify-content: flex-start;
  }

  .smap-topbar__status {
    justify-content: center;
    min-height: 36px;
    padding: 0 10px;
    border: 1px solid rgba(40, 242, 237, 0.36);
    border-radius: 8px;
    color: #30f5ee;
    background: rgba(17, 78, 81, 0.42);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.24);
    font-size: 12px;
  }

  .smap-topbar__mark {
    font-size: 24px;
  }

  .smap-topbar__title {
    font-size: 18px;
  }

  .smap-topbar__search {
    grid-column: 1 / -1;
    grid-template-columns: auto 1fr auto;
    height: 64px;
    padding: 0 13px;
    border-color: rgba(168, 202, 216, 0.24);
    background: rgba(13, 23, 34, 0.88);
    box-shadow: 0 18px 34px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(16px);
  }

  .smap-topbar__search-icon {
    width: 28px;
    height: 28px;
  }

  .smap-topbar__desktop-query,
  .smap-topbar__desktop-key,
  .smap-topbar__nav {
    display: none;
  }

  .smap-topbar__mobile-route {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: 12px;
    align-items: center;
    min-width: 0;
    color: #f3fbff;
    font-size: 18px;
    font-weight: 760;
  }

  .smap-topbar__mobile-route strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .smap-topbar__mobile-route i {
    color: #31f5ef;
    font-size: 28px;
    font-style: normal;
    line-height: 1;
  }

  .smap-topbar__mobile-swap {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 7px;
    color: #d8edf3;
    background: rgba(255, 255, 255, 0.06);
    font-size: 22px;
  }

  .smap-topbar__nav-button {
    min-width: 72px;
  }
}
</style>
