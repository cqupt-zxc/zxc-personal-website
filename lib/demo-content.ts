import type { SiteContent } from "@/lib/types";

export const demoContent: SiteContent = {
  name: "张轩诚",
  role: "研究者 · 独立开发者",
  location: "Shanghai, China",
  intro:
    "我在技术、研究与真实世界的问题之间工作。这里记录正在构建的项目、走过的学习路径，以及一些值得被好好保存的日常。",
  email: "hello@example.com",
  projects: [
    {
      name: "SmartBin-AI-Pi4B",
      description: "使用树莓派 4B、USB 摄像头与 AI API 构建的智能垃圾分类系统。",
      url: "https://github.com/cqupt-zxc/SmartBin-AI-Pi4B",
      language: "HTML",
    },
    {
      name: "PreSchedule",
      description: "基于 Vue 3 与 Flask 的预排课系统，用于高效管理课程与教师信息。",
      url: "https://github.com/cqupt-zxc/PreSchedule",
      language: "Vue",
    },
    {
      name: "Minist",
      description: "基于 TensorFlow 的 MNIST 手写数字识别项目，包含训练、预测与可视化。",
      url: "https://github.com/cqupt-zxc/Minist",
      language: "Python",
    },
  ],
  honors: [
    { year: "2025", title: "此处添加个人荣誉", issuer: "在管理后台维护" },
  ],
  education: [
    {
      period: "2024 — 至今",
      degree: "研究生学习",
      school: "你的学校",
      detail: "研究方向、课题与重要项目将在后台更新。",
    },
    {
      period: "2020 — 2024",
      degree: "本科阶段",
      school: "你的学校",
      detail: "课程、研究经历与项目实践。",
    },
  ],
  timeline: [
    { date: "2025.01", city: "上海", note: "一段公开的、轻轻带过的共同记忆。" },
  ],
};
