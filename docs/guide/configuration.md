# 配置与部署

## Monorepo

项目使用 pnpm workspace 管理：

```yaml
packages:
  - apps/*
  - playground
  - docs
  - packages/*
  - examples/*
```

当前最重要的 workspace 是 `apps/smap` 和 `docs`。

## 地图 SDK

第三方接入能力沉淀在 `packages/smap-sdk`：

```text
packages/smap-sdk/
├── src/index.ts        # SDK 类型、默认数据、client 和工具函数
├── test/index.test.ts  # SDK 行为测试
└── build.config.ts     # unbuild 配置
```

包名：

```text
@yunyoujun/smap-sdk
```

这个包提供无运行时依赖的 TypeScript API，包括路线规划、POI 查询、图层状态和事件订阅。`apps/smap` 已通过 `app/components/smap/smapData.ts` 消费这套 SDK，并在适配层把 SDK 数据转换为移动端 UI 需要的 view model。

## Nuxt/Ionic 子应用

子应用位于 `apps/smap`，使用 Nuxt 4 + Ionic：

```text
apps/smap/
├── app/app.vue              # ion-app + ion-router-outlet
├── app/pages/tabs.vue       # ion-tabs + ion-tab-bar
├── app/pages/tabs/*         # map / ride / explore / profile
├── app/components/smap      # 产品 UI 组件
└── nuxt.config.ts
```

关键配置：

- `ssr: false`：保持为 SPA，便于 YunLeFun SSO 和 CloudBase auth 在浏览器端运行。
- `@nuxtjs/ionic`：提供 Ionic 组件、Tab 和移动端路由体验。
- `app:generate`：生成静态托管产物。

## YunLeFun 登录

本地需要覆盖环境变量时复制：

```bash
cp apps/smap/.env.example apps/smap/.env
```

公开运行时变量：

```bash
NUXT_PUBLIC_YUNLEFUN_CLOUDBASE_ENV=yunlefun-8g7ybcxc7345c490
NUXT_PUBLIC_YUNLEFUN_SSO_ORIGIN=https://www.yunle.fun
```

登录入口放在“我的”页。地图导航第一屏不展示账号按钮，避免干扰路线决策。

## 静态部署

生成子应用静态产物：

```bash
pnpm app:generate
```

部署目录：

```text
apps/smap/dist
```

推荐 EdgeOne Pages / Cloudflare Pages 配置：

```text
Build command: pnpm app:generate
Output directory: apps/smap/dist
Node.js version: 22
```

## 文档站

文档站位于 `docs`，使用 VitePress：

```bash
pnpm docs:dev
pnpm docs:build
pnpm docs:preview
```

VitePress 配置入口：

```text
docs/.vitepress/config/index.ts
```

产品和 UI/UX 设计沉淀放在：

```text
docs/design/
```

## API 文档

仓库保留 TypeDoc 流程，配置在 `typedoc.json`。当前 API 文档聚焦 `@yunyoujun/smap-sdk`。

```bash
pnpm predocs
```

## 检查命令

```bash
pnpm app:typecheck
pnpm app:generate
pnpm typecheck
pnpm lint
pnpm docs:build
```

当前 Nuxt 构建可能出现 sourcemap 和大 chunk warning，主要来自 Nuxt/Ionic/CloudBase/SSO 运行时依赖；这是优化项，不阻塞静态部署。
