"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/types";

type Props = { initialContent: SiteContent; action: (formData: FormData) => void | Promise<void> };
const emptyProject = { name: "", description: "", url: "https://github.com/", language: "", stars: undefined, coverImageUrl: "", galleryImageUrls: [] as string[] };
const emptyHonor = { year: "", title: "", issuer: "", description: "", imageUrl: "" };
const emptyEducation = { period: "", degree: "", school: "", detail: "" };
const emptyTimeline = { date: "", city: "", note: "", imageUrl: "" };

export function AdminContentForm({ initialContent, action }: Props) {
  const [content, setContent] = useState(initialContent);
  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => setContent((current) => ({ ...current, [key]: value }));
  const updateItem = <K extends "projects" | "honors" | "education" | "timeline">(key: K, index: number, field: string, value: string) => {
    const items = [...content[key]] as Array<Record<string, unknown>>;
    items[index] = { ...items[index], [field]: value };
    update(key, items as SiteContent[K]);
  };
  const remove = <K extends "projects" | "honors" | "education" | "timeline">(key: K, index: number) => update(key, content[key].filter((_, itemIndex) => itemIndex !== index) as SiteContent[K]);
  const updateProjectGallery = (index: number, value: string) => {
    const projects = [...content.projects];
    projects[index] = { ...projects[index], galleryImageUrls: value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean).slice(0, 3) };
    update("projects", projects);
  };
  return <form action={action} className="content-form">
    <input type="hidden" name="content" value={JSON.stringify(content)} readOnly />
    <section><p className="eyebrow">01 · 个人档案</p><div className="form-grid">
      {([ ["name", "姓名"], ["role", "身份 / 职业"], ["location", "所在地"], ["email", "公开邮箱"] ] as const).map(([key, label]) => <label key={key}>{label}<input value={content[key]} onChange={(event) => update(key, event.target.value)} /></label>)}
      <label className="wide">个人介绍<textarea value={content.intro} onChange={(event) => update("intro", event.target.value)} /></label>
    </div></section>
    <Collection title="02 · 精选项目" add={() => update("projects", [...content.projects, emptyProject])}>{content.projects.map((item, index) => <article className="form-card" key={index}><button type="button" onClick={() => remove("projects", index)}>移除</button><div className="form-grid">{([ ["name", "项目名称"], ["url", "GitHub / 项目链接"], ["language", "技术标签"], ["stars", "星标（可留空）"], ["coverImageUrl", "公开封面图片 URL"] ] as const).map(([field, label]) => <label key={field}>{label}<input value={String(item[field] ?? "")} onChange={(event) => updateItem("projects", index, field, event.target.value)} /></label>)}<label className="wide">中文简介<textarea value={item.description} onChange={(event) => updateItem("projects", index, "description", event.target.value)} /></label><label className="wide">补充图片 URL（最多三张，每行一张）<textarea value={(item.galleryImageUrls ?? []).join("\n")} onChange={(event) => updateProjectGallery(index, event.target.value)} /></label></div></article>)}</Collection>
    <Collection title="03 · 荣誉" add={() => update("honors", [...content.honors, emptyHonor])}>{content.honors.map((item, index) => <article className="form-card" key={index}><button type="button" onClick={() => remove("honors", index)}>移除</button><div className="form-grid">{([ ["year", "年份"], ["title", "荣誉名称"], ["issuer", "授予单位"], ["imageUrl", "公开证书图片 URL"] ] as const).map(([field, label]) => <label key={field}>{label}<input value={item[field] ?? ""} onChange={(event) => updateItem("honors", index, field, event.target.value)} /></label>)}<label className="wide">荣誉说明<textarea value={item.description ?? ""} onChange={(event) => updateItem("honors", index, "description", event.target.value)} /></label></div></article>)}</Collection>
    <Collection title="04 · 学习经历" add={() => update("education", [...content.education, emptyEducation])}>{content.education.map((item, index) => <article className="form-card" key={index}><button type="button" onClick={() => remove("education", index)}>移除</button><div className="form-grid">{([ ["period", "时间"], ["degree", "学位 / 阶段"], ["school", "学校"] ] as const).map(([field, label]) => <label key={field}>{label}<input value={item[field]} onChange={(event) => updateItem("education", index, field, event.target.value)} /></label>)}<label className="wide">课程、课题或项目<textarea value={item.detail} onChange={(event) => updateItem("education", index, "detail", event.target.value)} /></label></div></article>)}</Collection>
    <Collection title="05 · 公开情侣记录" add={() => update("timeline", [...content.timeline, emptyTimeline])}>{content.timeline.map((item, index) => <article className="form-card" key={index}><button type="button" onClick={() => remove("timeline", index)}>移除</button><div className="form-grid">{([ ["date", "日期"], ["city", "城市"], ["imageUrl", "公开图片 URL（可留空）"] ] as const).map(([field, label]) => <label key={field}>{label}<input value={item[field] || ""} onChange={(event) => updateItem("timeline", index, field, event.target.value)} /></label>)}<label className="wide">文字记录<textarea value={item.note} onChange={(event) => updateItem("timeline", index, "note", event.target.value)} /></label></div></article>)}</Collection>
    <button className="publish" type="submit">保存并发布 →</button>
  </form>;
}

function Collection({ title, add, children }: { title: string; add: () => void; children: React.ReactNode }) { return <section><div className="collection-heading"><p className="eyebrow">{title}</p><button type="button" onClick={add}>+ 添加</button></div>{children}</section>; }
