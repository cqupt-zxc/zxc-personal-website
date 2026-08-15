import { redirect } from "next/navigation";
import { AdminContentForm } from "@/components/admin-content-form";
import { contentFromFormValues } from "@/lib/admin-content";
import { getPublicContent } from "@/lib/content";
import { isEnvironmentConfigurationError, requirePublicSupabaseConfig } from "@/lib/env/public";
import { requireAdminEmailAllowlist } from "@/lib/env/server";
import { isAdminEmail } from "@/lib/site-logic";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import "./admin.css";

function getAdminConfiguration() {
  requirePublicSupabaseConfig();
  return requireAdminEmailAllowlist();
}

function AdminUnavailable() {
  return <main className="shell admin"><p className="eyebrow">内容管理</p><h1>管理员服务暂不可用</h1><p>此功能尚未完成所需的服务配置，请稍后再试。</p></main>;
}

async function saveContent(formData: FormData) {
  "use server";
  let adminEmails: string[];

  try {
    adminEmails = getAdminConfiguration();
  } catch (error) {
    if (isEnvironmentConfigurationError(error)) redirect("/admin?error=configuration");
    throw error;
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email, adminEmails)) redirect("/admin/login");

  try {
    const content = contentFromFormValues(JSON.parse(String(formData.get("content"))));
    await supabase.from("site_content").upsert({ id: 1, content, updated_at: new Date().toISOString() });
  } catch {
    return;
  }
  redirect("/admin?saved=1");
}

export default async function Admin() {
  let adminEmails: string[];

  try {
    adminEmails = getAdminConfiguration();
  } catch (error) {
    if (isEnvironmentConfigurationError(error)) return <AdminUnavailable />;
    throw error;
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email, adminEmails)) redirect("/admin/login");
  const content = await getPublicContent();
  return <main className="shell admin">
    <nav className="nav"><a className="wordmark" href="/">← 查看网站</a><span>{user?.email}</span></nav>
    <p className="eyebrow">内容管理</p>
    <h1>编辑公开内容</h1>
    <p>每个区块独立维护；公开信息保存后将直接展示。私密原始图片仅上传到 Supabase 的 private-archive 私有 Bucket。</p>
    <AdminContentForm initialContent={content} action={saveContent} />
  </main>;
}
