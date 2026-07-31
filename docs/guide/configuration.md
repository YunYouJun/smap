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

## Nuxt 子应用

子应用位于 `apps/smap`，使用 Nuxt 4 和原生语义化导航：

```text
apps/smap/
├── app/app.vue              # Nuxt 页面入口
├── app/pages/tabs.vue       # 嵌套路由 + 移动端 Tab 导航
├── app/pages/tabs/*         # map / ride / explore / profile
├── app/components/smap      # 产品 UI 组件
└── nuxt.config.ts
```

关键配置：

- `ssr: false`：保持为 SPA；YunLeFun SSO v3 使用顶层重定向，静态模式采用标签页会话，BFF 模式仅以内存临时身份生成 proof。
- 原生 Nuxt 路由：按页面拆包，避免为自定义地图 UI 加载完整移动组件运行时。
- `app:generate`：生成静态托管产物。

## YunLeFun 登录

本地需要覆盖环境变量时复制：

```bash
cp apps/smap/.env.example apps/smap/.env
```

公开运行时变量：

```bash
NUXT_PUBLIC_SMAP_EPHEMERIS_API=
NUXT_PUBLIC_YUNLEFUN_CLOUDBASE_ENV=yunlefun-8g7ybcxc7345c490
NUXT_PUBLIC_YUNLEFUN_SSO_CLIENT_ID=smap-web
NUXT_PUBLIC_YUNLEFUN_SSO_EXCHANGE_URL=https://api.yunle.fun/sso-ticket
NUXT_PUBLIC_YUNLEFUN_SSO_ORIGIN=https://www.yunle.fun
NUXT_PUBLIC_YUNLEFUN_SSO_REDIRECT_URI=https://smap.yunle.fun/tabs/profile
NUXT_PUBLIC_YUNLEFUN_SSO_SCOPE=identity:bootstrap
NUXT_PUBLIC_YUNLEFUN_SSO_SESSION_MODE=browser
```

登录入口放在“我的”页。地图导航第一屏不展示账号按钮，避免干扰路线决策。

SSO v3 不再使用隐藏 iframe 或 popup。`smap-web` 必须在服务端 Client Registry 中绑定精确的 production issuer、HTTPS Origin、回跳 URI 和 scope。本地联调也必须使用已登记的 HTTPS 地址；默认的 `http://127.0.0.1` 只展示配置提示，不会发起降级登录。

应用按会话职责提供两种模式：

| 模式 | SDK 接口 | CloudBase persistence | 适用场景 |
| --- | --- | --- | --- |
| `browser` | `adoptSsoCode()` | `session` | 纯静态 SPA，身份在当前标签页会话内有效 |
| `bff` | `adoptSsoIdentityProof()` | `none` | 同源 BFF，以双证明换取 host-only opaque cookie |

`browser` 是默认模式，不要求 SMAP 自建 BFF，可在 CloudBase 安全规则约束下直接访问属于当前身份的数据；它不提供设备管理、服务端撤销或跨浏览器长期会话。

启用 BFF 时增加：

```bash
NUXT_PUBLIC_YUNLEFUN_SSO_SESSION_MODE=bff
NUXT_PUBLIC_YUNLEFUN_SSO_SESSION_ENDPOINT=/api/session
```

SMAP 约定该同源端点使用 `GET` 恢复账号、`POST` 接收 SSO identity proof 并创建会话、`DELETE` 退出会话。临时 CloudBase 身份在 proof 交换后立即清除。

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

纯静态部署应让 `NUXT_PUBLIC_SMAP_EPHEMERIS_API` 保持为空，此时应用直接使用 SDK 内置的静态星历，不会访问 `/api/smap/horizons`。如果已经部署 Nuxt 服务端或独立代理，可将它设置为对应的 API 地址以启用实时 JPL Horizons 数据：

```bash
NUXT_PUBLIC_SMAP_EPHEMERIS_API=https://example.com/api/smap/horizons
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
pnpm test:e2e
```

CloudBase 认证 SDK 只在账号组件挂载后按需加载，不进入地图首屏资源。

## 发布 SDK

`@yunyoujun/smap-sdk` 是仓库唯一发布到 npm 的包。发布前执行：

```bash
pnpm release:check
pnpm release
```

发布前先在三个 `package.json` 中同步版本并更新 Changelog，提交这些改动后运行 `pnpm release`。脚本只允许从干净的 `main` 创建当前版本的 `v*` 标签，并会在创建标签前确认仓库已经配置 `NPM_TOKEN`；GitHub Release workflow 随后发布带 provenance 的公开 npm 包。首次发布需要具有 public publish 权限且可绕过自动化 2FA 的 granular access token：

```bash
gh secret set NPM_TOKEN
```
