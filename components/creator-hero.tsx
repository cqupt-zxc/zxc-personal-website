"use client";

import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { Magnet } from "@/components/motion/magnet";
import { ContactButton } from "@/components/contact-button";

type Props = { name: string; role: string; email: string; hasAbout: boolean; hasJourney: boolean; hasProjects: boolean };

export function CreatorHero({ name, role, email, hasAbout, hasJourney, hasProjects }: Props) {
  const hasEmail = Boolean(email);
  return <section className="creator-hero" id="top">
    <div className="hero-glow" aria-hidden="true" />
    <FadeIn delay={0} y={-20} className="creator-nav-wrap">
      <nav aria-label="首页章节导航" className="creator-nav">
        {hasAbout && <a href="#about">关于</a>}
        {hasJourney && <a href="#journey">经历</a>}
        {hasProjects && <a href="#projects">项目</a>}
        {hasEmail && <a href={`mailto:${email}`}>联系</a>}
      </nav>
    </FadeIn>
    <FadeIn className="hero-type-wrap" delay={0.15} y={40}>
      <h1 className="hero-heading">HI, I&apos;M <span>{name}</span></h1>
    </FadeIn>
    <div className="hero-person">
      <FadeIn className="hero-person-motion" delay={0.6} duration={0.8} y={30}>
        <Magnet>
          <Image alt={`${name}的半写实 3D 数字分身`} className="hero-portrait" height={1664} priority src="/images/zhang-xuancheng-3d-hero.png" width={944} />
        </Magnet>
      </FadeIn>
    </div>
    <div className="hero-bottom">
      <FadeIn delay={0.35} y={20}>
        <div className="hero-identity">
          <strong>{name}</strong>
          <p className="hero-role">{role}</p>
        </div>
      </FadeIn>
      {hasEmail && <FadeIn delay={0.5} y={20}><ContactButton email={email} /></FadeIn>}
    </div>
  </section>;
}
