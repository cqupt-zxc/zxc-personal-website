"use client";

import { BrainCircuit, CodeXml, Orbit, Sparkles } from "lucide-react";
import { AnimatedText } from "@/components/motion/animated-text";
import { ContactButton } from "@/components/contact-button";
import { FadeIn } from "@/components/motion/fade-in";

export function AnimatedAbout({ intro, email }: { intro: string; email: string }) {
  return <section className="creator-about" id="about">
    <FadeIn className="about-orbit about-orbit--one" x={-80} y={0}><Orbit aria-hidden="true" /></FadeIn>
    <FadeIn className="about-orbit about-orbit--two" delay={0.15} x={80} y={0}><BrainCircuit aria-hidden="true" /></FadeIn>
    <FadeIn className="about-orbit about-orbit--three" delay={0.25} x={-80} y={0}><CodeXml aria-hidden="true" /></FadeIn>
    <FadeIn className="about-orbit about-orbit--four" delay={0.3} x={80} y={0}><Sparkles aria-hidden="true" /></FadeIn>
    <FadeIn><h2 className="display-heading">ABOUT ME</h2></FadeIn>
    <div className="about-copy">
      <AnimatedText className="animated-intro" text={intro} />
      <ContactButton email={email} label="和我聊聊" />
    </div>
  </section>;
}
