# 快速开始

## 环境要求

- Node.js >= 22.13
- pnpm 11.9.0

## 安装

```bash
git clone git@github.com:YunYouJun/smap.git
cd smap
pnpm install
```

## 启动子应用

SMAP 的移动端产品运行在 `apps/smap`：

```bash
pnpm app:dev
```

默认开发端口是 `5174`。

常用路由：

```text
/tabs/map       导航地图
/tabs/ride      星际打车
/tabs/explore   附近探索
/tabs/profile   我的
```

## 启动文档站

```bash
pnpm docs:dev
```

文档站用于查看项目介绍、设计沉淀和 VitePress 演示入口。

## 项目结构

```text
smap/
├── apps/smap/
│   ├── app/app.vue
│   ├── app/components/smap/
│   ├── app/composables/useYunlefunAuth.ts
│   ├── app/pages/tabs/
│   ├── nuxt.config.ts
│   └── public/
├── docs/
│   ├── design/
│   ├── guide/
│   └── .vitepress/
├── packages/
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

## 常用命令

```bash
pnpm app:dev        # 启动 Nuxt/Ionic 子应用
pnpm app:generate   # 生成子应用静态产物
pnpm app:typecheck  # 子应用类型检查
pnpm docs:dev       # 启动 VitePress 文档站
pnpm docs:build     # 构建文档站
pnpm typecheck      # 根 TypeScript 检查
pnpm lint           # ESLint 检查
```

## 开发入口

- 想调整真实移动端体验：优先改 `apps/smap/app/components/smap/`。
- 想调整 Ionic Tab 页面：查看 `apps/smap/app/pages/tabs/`。
- 想调整 YunLeFun 登录：查看 `apps/smap/app/composables/useYunlefunAuth.ts` 和 `SmapAccountStatus.vue`。
- 想沉淀产品设计：更新 `docs/design/`。

## 下一步

- 阅读 [配置与部署](/guide/configuration)。
- 阅读 [设计沉淀](/design/)。
- 查看 [子应用说明](https://github.com/YunYouJun/smap/blob/main/apps/smap/README.md)。
