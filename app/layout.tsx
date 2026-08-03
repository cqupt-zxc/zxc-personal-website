import type { Metadata } from "next";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";
import "./motion.css";
import "./admin-fixes.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "张轩诚 — 研究者 · 独立开发者",
  description:
    "张轩诚的个人网站，记录研究、独立开发项目、学习经历与阶段性收获。",
  openGraph: {
    title: "张轩诚 — 研究者 · 独立开发者",
    description: "研究、独立开发项目、学习经历与阶段性收获。",
    images: ["/images/zhang-xuancheng-og.png"],
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
