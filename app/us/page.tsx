import "./us.css";
import { getPublicContent } from "@/lib/content";

export default async function UsPage() {
  const { timeline } = await getPublicContent();
  return <main className="us-page">
    <section className="us-scenery"><div className="shell"><nav className="nav"><a className="wordmark" href="/">← 返回</a><a href="/us/private">私密档案</a></nav><p className="eyebrow">公开记录</p><h1>一些城市，<br />一些普通却珍贵的日子。</h1></div></section>
    <section className="shell us-timeline"><div className="timeline">{timeline.map((item) => <article key={`${item.date}-${item.city}`}><span>{item.date}</span><div><h2>{item.city}</h2><p>{item.note}</p>{item.imageUrl && <img src={item.imageUrl} alt={`${item.city} 的记录`} />}</div></article>)}</div></section>
  </main>;
}
