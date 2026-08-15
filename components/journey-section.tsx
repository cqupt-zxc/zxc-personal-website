import type { Education } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";

export function JourneySection({ education }: { education: Education[] }) {
  if (!education.length) return null;
  return <section className="journey-section" id="journey">
    <FadeIn><div className="journey-heading"><p>LEARNING, RESEARCH &amp; PRACTICE</p><h2>JOURNEY</h2></div></FadeIn>
    <div className="journey-list">
      {education.map((item, index) => <FadeIn delay={index * 0.1} key={`${item.period}-${item.school}`}>
        <article className="journey-item">
          <span className="journey-number">{String(index + 1).padStart(2, "0")}</span>
          <div><p className="journey-period">{item.period}</p><h3>{item.degree}<span>{item.school}</span></h3><p className="journey-detail">{item.detail}</p></div>
        </article>
      </FadeIn>)}
    </div>
  </section>;
}
