import { ArrowUpRight } from "lucide-react";

export function BeyondWork({ name }: { name: string }) {
  return <section className="beyond-work" id="beyond">
    <div><p>BEYOND WORK</p><h2>工作之外，<br />也有值得保存的日子。</h2></div>
    <a href="/us">进入公开记录 <ArrowUpRight aria-hidden="true" /></a>
    <footer><span>© {new Date().getFullYear()} {name}</span></footer>
  </section>;
}
