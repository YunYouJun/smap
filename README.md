# SMAP

SMAP 是一个“星际导航地图”实验项目：用接近移动地图应用的交互方式，展示星际路线规划、路线偏好、打车、附近探索和 YunLeFun 账号能力。

项目已经从 VitePress 演示中拆出独立的 Nuxt + Ionic 子应用，VitePress 继续承担文档、设计沉淀和演示入口。

## 功能定位

- 类移动地图 App 的导航首页：路线搜索浮层、地图控件、底部路线方案 sheet。
- Ionic 移动端应用壳：底部 Tab、路由容器、移动端页面结构。
- 星际出行玩法：航线规划、实时路况、风险提醒、补给点、星际打车。
- YunLeFun 登录预留：账号入口集中在“我的”页，后续同步收藏、订单与偏好。
- 静态托管优先：Nuxt 子应用可生成静态产物，适配 EdgeOne Pages / Cloudflare Pages。

## 项目结构

```text
smap/
├── apps/smap/              # Nuxt + Ionic 子应用，承载真实产品运行时
│   ├── app/components/smap # 地图、路线、打车、账号等核心 UI
│   ├── app/pages/tabs      # Ionic Tab 页面
│   └── public              # App 图标与出行图片资源
├── docs/                   # VitePress 文档与演示站
│   ├── design/             # 产品与 UI/UX 设计沉淀
│   ├── guide/              # 使用、开发、配置说明
│   └── .vitepress          # 文档站主题和导航配置
├── packages/               # 共享包区域，保留 monorepo 扩展空间
│   └── smap-sdk            # 第三方接入用 TypeScript SDK
└── pnpm-workspace.yaml
```

## 开发

环境要求：

```text
Node.js >= 22.13
pnpm 11.9.0
```

安装依赖：

```bash
pnpm install
```

启动 Nuxt/Ionic 子应用：

```bash
pnpm app:dev
```

启动文档站：

```bash
pnpm docs:dev
```

常用检查：

```bash
pnpm app:typecheck
pnpm typecheck
pnpm lint
```

## 静态部署

生成 SMAP 子应用静态产物：

```bash
pnpm app:generate
```

部署目录：

```text
apps/smap/.output/public
```

推荐 Pages 配置：

```text
Build command: pnpm app:generate
Output directory: apps/smap/.output/public
Node.js version: 22
```

文档站构建：

```bash
pnpm docs:build
```

## 文档

- [项目介绍](./docs/guide/what-is.md)
- [快速开始](./docs/guide/getting-started.md)
- [配置与部署](./docs/guide/configuration.md)
- [设计沉淀](./docs/design/index.md)
- [子应用说明](./apps/smap/README.md)
- [地图 SDK](./packages/smap-sdk/README.md)

## 设计原则

- 移动端优先模拟真实地图应用的信息层级，而不是营销页或游戏面板。
- 不使用高德品牌、商标、专有素材或完全一致的视觉资产，只借鉴通用地图 App 交互模式。
- 地图页优先展示路线与决策，账号、订单、收藏等服务集中到“我的”页。
- UI 支持系统明暗模式，关键触控目标保持 44px 以上。

## License

[MIT](./LICENSE) License © [YunYouJun](https://github.com/YunYouJun)
