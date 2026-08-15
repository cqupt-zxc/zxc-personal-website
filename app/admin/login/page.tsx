import { redirect } from "next/navigation";
import { isEnvironmentConfigurationError, requirePublicSupabaseConfig, requireSiteOrigin } from "@/lib/env/public";
import { requireAdminEmailAllowlist } from "@/lib/env/server";
import { isAdminEmail } from "@/lib/site-logic";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getAdminLoginConfiguration() {
  requirePublicSupabaseConfig();
  return { siteOrigin: requireSiteOrigin(), adminEmails: requireAdminEmailAllowlist() };
}

function AdminLoginUnavailable() {
  return <main className="shell private-gate"><p className="eyebrow">内容管理</p><h1>管理员服务暂不可用</h1><p>登录功能尚未完成所需的服务配置，请稍后再试。</p></main>;
}

async function passwordLogin(formData: FormData) {
  "use server";
  let configuration: ReturnType<typeof getAdminLoginConfiguration>;

  try {
    configuration = getAdminLoginConfiguration();
  } catch (error) {
    if (isEnvironmentConfigurationError(error)) redirect("/admin/login?error=configuration");
    throw error;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.signInWithPassword({ email: String(formData.get("email")), password: String(formData.get("password")) });
  if (data.user && !isAdminEmail(data.user.email, configuration.adminEmails)) await supabase.auth.signOut();
  redirect("/admin");
}

async function githubLogin() {
  "use server";
  let configuration: ReturnType<typeof getAdminLoginConfiguration>;

  try {
    configuration = getAdminLoginConfiguration();
  } catch (error) {
    if (isEnvironmentConfigurationError(error)) redirect("/admin/login?error=configuration");
    throw error;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo: `${configuration.siteOrigin}/auth/callback` } });
  if (data.url) redirect(data.url);
}

export default function AdminLogin() {
  try {
    getAdminLoginConfiguration();
  } catch (error) {
    if (isEnvironmentConfigurationError(error)) return <AdminLoginUnavailable />;
    throw error;
  }

  return <main className="shell private-gate"><p className="eyebrow">内容管理</p><h1>管理员登录</h1><p>仅在 ADMIN_EMAILS 白名单内的 GitHub 或邮箱密码账户可以进入。</p><form action={passwordLogin}><input name="email" type="email" placeholder="邮箱" required /><input name="password" type="password" placeholder="密码" required /><button>邮箱登录 →</button></form><form action={githubLogin}><button className="oauth">使用 GitHub 登录 →</button></form></main>;
}
