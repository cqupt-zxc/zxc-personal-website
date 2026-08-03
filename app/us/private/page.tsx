import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createPrivateAccessToken,
  privateCookieName,
  verifyPrivateAccessToken,
} from "@/lib/site-logic";

async function unlock(formData: FormData) {
  "use server";
  const secret = process.env.PRIVATE_ARCHIVE_PASSWORD;
  if (!secret || formData.get("password") !== secret) return;

  const store = await cookies();
  store.set(privateCookieName, createPrivateAccessToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  redirect("/us/private");
}

export default async function PrivateArchive() {
  const token = (await cookies()).get(privateCookieName)?.value;
  const granted = verifyPrivateAccessToken(token, process.env.PRIVATE_ARCHIVE_PASSWORD);

  if (!granted) {
    return (
      <main className="shell private-gate">
        <p className="eyebrow">仅限两人</p>
        <h1>私密档案</h1>
        <p>请输入专属密码。内容与照片受服务端访问控制，不会提交至 GitHub。</p>
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
