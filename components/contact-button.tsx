import { ArrowUpRight } from "lucide-react";

export function ContactButton({ email, label = "联系我" }: { email: string; label?: string }) {
  return <a className="contact-pill" href={`mailto:${email}`}>
    <span>{label}</span><ArrowUpRight aria-hidden="true" size={18} />
  </a>;
}
