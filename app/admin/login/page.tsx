import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/site-logic";

async function passwordLogin(formData: FormData) { "use server"; const supabase = await createSupabaseServerClient(); const { data } = await supabase.auth.signInWithPassword({ email: String(formData.get("email")), password: String(formData.get("password")) }); if (data.user && !isAdminEmail(data.user.email, process.env.ADMIN_EMAILS)) await supabase.auth.signOut(); redirect("/admin"); }
async function githubLogin() { "use server"; const supabase = await createSupabaseServerClient(); const { data } = await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` } }); if (data.url) redirect(data.url); }
export default function AdminLogin() { return <main className="shell private-gate"><p className="eyebrow">内容管理</p><h1>管理员登录</h1><p>仅在 ADMIN_EMAILS 白名单内的 GitHub 或邮箱密码账户可以进入。</p><form action={passwordLogin}><input name="email" type="email" placeholder="邮箱" required /><input name="password" type="password" placeholder="密码" required /><button>邮箱登录 →</button></form><form action={githubLogin}><button className="oauth">使用 GitHub 登录 →</button></form></main>; }
