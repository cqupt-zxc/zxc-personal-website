# 张轩诚的 3D 创作者个人网站

这是一个中文优先的个人网站新版本，以「研究者 · 独立开发者」为身份主线，采用深色 3D 创作者官网风格、分幕式滚动和克制的动态效果。

## 页面与功能

- `/`：3D 数字分身首屏、个人介绍、学习旅程、精选项目、荣誉横向滚动和生活入口。
- `/admin`：管理员内容管理入口，支持邮箱密码与 GitHub OAuth；`ADMIN_EMAILS` 仅用于应用层入口检查，内容写权限还必须由数据库 RLS 的管理员 membership 决定。
- `/us`：公开的情侣时间线、城市和公开图片。
- `/us/private`：专属密码保护的私密档案；图片通过服务端生成短时签名 URL。
- 项目可手工选择 3–6 个仓库，并由 GitHub 元数据补充语言、描述和链接。

## 本地运行

要求 Node.js 20 或更高版本。

```bash
npm install
copy .env.example .env.local
npm run dev -- -p 3001
```

打开 [http://localhost:3001](http://localhost:3001)。后台登录地址是 [http://localhost:3001/admin/login](http://localhost:3001/admin/login)。

没有配置 Supabase 时，公开首页会使用项目内的演示内容；管理后台、登录和私密档案需要按下方步骤配置服务。

### 环境模式与 Production 预检

- **Local/demo**：可以不配置 Supabase；`/` 和 `/us` 使用演示内容，管理、登录和私密档案会显示“服务暂不可用”。普通 `npm run build` 保持支持该工作流。
- **Preview**：可按需要配置 Supabase；GitHub enrichment 仍可关闭。默认不启用 GitHub OAuth，若启用则使用受控且稳定的 preview origin。
- **Production**：必须配置 `NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`ADMIN_EMAILS`、`PRIVATE_ARCHIVE_PASSWORD` 和 `SUPABASE_SERVICE_ROLE_KEY`。`GITHUB_USERNAME` 与 `GITHUB_TOKEN` 保持可选。

在部署前执行：

```bash
npm run validate:production-env
npm run build:production
```

`validate:production-env` 只输出缺失或非法的变量名，不会输出变量值。未来配置 Vercel Production Build Command 时应使用 `npm run build:production`；本仓库不会自动修改现有 Vercel 项目配置。

## Supabase 与登录配置

先创建数据库与 Storage，再分别配置 GitHub OAuth App、Supabase Auth URL Configuration 和应用回跳地址。这四类 URL 不是同一个概念，不能互相替代。

1. 在新项目的 Supabase SQL Editor 执行 `supabase/schema.sql`；既有项目必须先审阅并通过受控路径执行对应 migration。
2. 在 Storage 创建名为 `private-archive` 的私有 Bucket。
3. 在 Supabase Auth 启用 Email 和 GitHub Provider。

### GitHub OAuth App：provider callback

在 GitHub OAuth App 的 **Authorization callback URL** 中填写 Supabase 提供的 provider callback，而不是网站路由：

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

GitHub 将授权结果先交回 Supabase Auth；GitHub Client ID 和 Client Secret 只在 Supabase 的 GitHub Provider 配置中保存，绝不写入本仓库或 `NEXT_PUBLIC_` 环境变量。

### Supabase Auth：Site URL 与 Redirect URLs

在 Supabase Auth 的 URL Configuration 中设置：

- **Site URL**：正式网站 origin，例如 `https://<production-domain>`。
- **Redirect URLs**：精确加入应用完成 OAuth 后需要接收 code 的地址：

```text
http://localhost:3001/auth/callback
https://<production-domain>/auth/callback
```

Preview 默认不启用 GitHub OAuth。若确实需要在 Preview 验证 OAuth，应先为受控分支分配稳定的 preview 域名（例如 `https://preview.<production-domain>`），并额外精确加入 `https://preview.<production-domain>/auth/callback`。不要默认把所有临时 Vercel Preview URL 加入 allowlist；若未来采用 Supabase 支持的 Vercel wildcard 规则，必须限定到本团队的域名后缀并单独完成安全审查。

### 应用：`NEXT_PUBLIC_SITE_URL` 与 `/auth/callback`

将应用当前运行的 site origin 写入 `NEXT_PUBLIC_SITE_URL`：本地开发使用 `http://localhost:3001`，Production 使用 `https://<production-domain>`，受控 preview 则使用其稳定 preview origin。`app/admin/login/page.tsx` 会把该 origin 加上 `/auth/callback` 作为 `signInWithOAuth` 的 `redirectTo`；应用自己的 `/auth/callback` route 再交换 Supabase 返回的 code 并建立 session。这个应用回跳地址不是 GitHub OAuth App 的 callback。

将允许进入后台的邮箱写入 `ADMIN_EMAILS`，多个邮箱用英文逗号分隔。它仅用于应用层登录后检查；数据库写授权必须继续由 `auth.uid()` 对应的 RLS 管理员 membership 执行，不能只依赖邮箱白名单。

复制 `.env.example` 后，仅在 `.env.local` 或 Vercel Environment Variables 中填写真实值。不要把 `.env.local`、密码、令牌、真实私密内容或私密图片提交到 GitHub。

## 内容与媒体规则

- 荣誉、教育经历、项目补充字段、公开情侣时间线、城市和公开图片可由后台更新，保存后公开页面即时读取。
- 项目支持封面 URL 与最多三张画廊图片 URL；荣誉支持证书图片 URL 与补充说明。
- 可公开的媒体必须使用公开资源地址。
- 私密情侣图片只能放在 Supabase 私有 Bucket 中，经 `/api/private/media` 验证专属密码 Cookie 后返回短时签名 URL。
- 项目内的 3D 数字分身与社交分享图位于 `public/images/`，不包含私密档案内容。

## 验证与部署

```bash
npm test
npm run build
```

推送到 GitHub 后可导入 Vercel，并把 `.env.example` 中列出的变量添加到项目环境变量。`SUPABASE_SERVICE_ROLE_KEY` 只能在服务端使用，绝不能添加 `NEXT_PUBLIC_` 前缀。

正式部署时请设置：

```env
NEXT_PUBLIC_SITE_URL=https://<production-domain>
```

Vercel 会根据 GitHub 分支自动构建和部署；真实密钥只保存在 Vercel 与 Supabase 控制台中。
