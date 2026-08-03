# 张轩诚的 3D 创作者个人网站

这是一个中文优先的个人网站新版本，以「研究者 · 独立开发者」为身份主线，采用深色 3D 创作者官网风格、分幕式滚动和克制的动态效果。它作为独立子项目保存在 `creator-portfolio-v2/`，不会覆盖工作区根目录中的原网站。

## 页面与功能

- `/`：3D 数字分身首屏、个人介绍、学习旅程、精选项目、荣誉横向滚动和生活入口。
- `/admin`：管理员内容管理入口，支持邮箱密码与 GitHub OAuth；最终权限仍由 `ADMIN_EMAILS` 白名单决定。
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

## Supabase 与登录配置

1. 在 Supabase SQL Editor 执行 `supabase/schema.sql`。
2. 在 Storage 创建名为 `private-archive` 的私有 Bucket。
3. 在 Supabase Auth 启用 Email 和 GitHub Provider。
4. GitHub OAuth 本地回调地址设为 `http://localhost:3001/auth/callback`；线上替换成正式域名。
5. 在 Supabase 的 Site URL / Redirect URLs 中加入本地与正式地址。
6. 将允许进入后台的邮箱写入 `ADMIN_EMAILS`，多个邮箱用英文逗号分隔。

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
NEXT_PUBLIC_SITE_URL=https://你的域名
```

Vercel 会根据 GitHub 分支自动构建和部署；真实密钥只保存在 Vercel 与 Supabase 控制台中。
