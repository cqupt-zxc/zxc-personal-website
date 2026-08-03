"use client";

import { useState } from "react";

export function ProjectVisual({ src, title, language, className = "" }: { src?: string; title: string; language?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div aria-label={`${title}的渐变封面`} className={`project-fallback ${className}`} data-language={language || "Code"}><span>{language || "INDEPENDENT WORK"}</span><strong>{title}</strong></div>;
  return <img alt={`${title}项目预览`} className={className} loading="lazy" onError={() => setFailed(true)} src={src} />;
}
