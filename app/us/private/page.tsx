import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isEnvironmentConfigurationError } from "@/lib/env/public";
import { requirePrivateArchiveConfig } from "@/lib/env/server";
import {
  createPrivateAccessToken,
  privateCookieName,
  verifyPrivateAccessToken,
} from "@/lib/site-logic";

type PrivateArchivePageProps = {
  searchParams: Promise<{ error?: string }>;
};

function PrivateArchiveUnavailable() {
  return <main className="shell private-gate"><p className="eyebrow">仅限两人</p><h1>私密档案暂不可用</h1><p>此功能尚未完成所需的服务配置，请稍后再试。</p></main>;
}

async function unlock(formData: FormData) {
  "use server";
  let configuration: ReturnType<typeof requirePrivateArchiveConfig>;

  try {
    configuration = requirePrivateArchiveConfig();
  } catch (error) {
    if (isEnvironmentConfigurationError(error)) redirect("/us/private?error=configuration");
    throw error;
  }

  if (formData.get("password") !== configuration.password) redirect("/us/private?error=invalid-password");

  const store = await cookies();
  store.set(privateCookieName, createPrivateAccessToken(configuration.password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  redirect("/us/private");
}

export default async function PrivateArchive({ searchParams }: PrivateArchivePageProps) {
  let configuration: ReturnType<typeof requirePrivateArchiveConfig>;

  try {
    configuration = requirePrivateArchiveConfig();
  } catch (error) {
    if (isEnvironmentConfigurationError(error)) return <PrivateArchiveUnavailable />;
    throw error;
  }

  const token = (await cookies()).get(privateCookieName)?.value;
  const granted = verifyPrivateAccessToken(token, configuration.password);

  if (!granted) {
    const { error } = await searchParams;
    return (
      <main className="shell private-gate">
        <p className="eyebrow">仅限两人</p>
        <h1>私密档案</h1>
        <p>请输入专属密码。内容与照片受服务端访问控制，不会提交至 GitHub。</p>
        {error === "invalid-password" && <p role="alert">密码错误，请重试。</p>}
        <form action={unlock}>
          <input name="password" type="password" required placeholder="专属密码" />
          <button>进入档案 →</button>
        </form>
      </main>
    );
  }

  return (
    <main className="shell private-gate">
      <p className="eyebrow">私密档案</p>
      <h1>只属于我们的页面。</h1>
      <p>请在 Supabase 私有 Storage 中保存图片，并通过受保护的服务端接口生成短时签名 URL。</p>
    </main>
  );
}
