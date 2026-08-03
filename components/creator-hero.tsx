"use client";

import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { Magnet } from "@/components/motion/magnet";
import { ContactButton } from "@/components/contact-button";

type Props = { name: string; role: string; location: string; email: string };

export function CreatorHero({ name, role, location, email }: Props) {
  return <section className="creator-hero" id="top">
    <div className="hero-glow" aria-hidden="true" />
    <FadeIn delay={0} y={-20} className="creator-nav-wrap">
      <nav aria-label="首页章节导航" className="creator-nav">
        <a href="#about">关于</a><a href="#journey">经历</a><a href="#projects">项目</a><a href={`mailto:${email}`}>联系</a>
      </nav>
    </FadeIn>
    <FadeIn className="hero-type-wrap" delay={0.15} y={40}>
      <h1 className="hero-heading">HI, I&apos;M <span>{name}</span></h1>
    </FadeIn>
    <FadeIn className="hero-person" delay={0.6} duration={0.8} y={30}>
      <Magnet>
        <Image alt={`${name}的半写实 3D 数字分身`} className="hero-portrait" height={1664} priority src="/images/zhang-xuancheng-3d-hero.png" width={944} />
      </Magnet>
    </FadeIn>
    <div className="hero-bottom">
      <FadeIn delay={0.35} y={20}>
        <div className="hero-identity">
          <strong>{name}</strong>
          <p className="hero-role">{role}<span>{location}</span></p>
        </div>
      </FadeIn>
      <FadeIn delay={0.5} y={20}><ContactButton email={email} /></FadeIn>
    </div>
    <a aria-label="向下浏览精选项目" className="hero-scroll" href="#selected-work"><span>SCROLL TO EXPLORE</span><i /></a>
  </section>;
}
