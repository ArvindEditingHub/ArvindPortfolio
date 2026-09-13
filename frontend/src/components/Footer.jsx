import { Instagram, Youtube, Linkedin, Dribbble, ArrowUpRight, Mail, Phone } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToSection } from "./Nav";

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/arvindrajputvideoediting/" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@arvindrajputvideoediting" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Dribbble, label: "Dribbble", href: "https://dribbble.com" },
];

const NAV = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Work", id: "work" },
  { label: "Contact", id: "contact" },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const go = (id) => {
    if (location.pathname !== "/") navigate("/", { state: { scrollTo: id } });
    else scrollToSection(id);
  };

  return (
    <footer className="relative bg-ink pt-24 pb-10 overflow-hidden" data-testid="footer">
      <div className="max-w-[90rem] mx-auto px-6 md:px-10">
        <button
          onClick={() => go("contact")}
          className="group block w-full text-left mb-20"
          data-testid="footer-cta"
        >
          <span className="block font-display font-extrabold uppercase leading-[0.9] tracking-tight text-[13vw] lg:text-[9rem]">
            <span className="text-stroke-bone group-hover:text-bone group-hover:[-webkit-text-stroke:0px] transition-all duration-500">Let's work</span>
          </span>
          <span className="flex items-center gap-6 font-display font-extrabold uppercase leading-[0.9] tracking-tight text-[13vw] lg:text-[9rem] text-acid">
            Together
            <ArrowUpRight className="w-[0.7em] h-[0.7em] transition-transform duration-500 group-hover:rotate-45" strokeWidth={2.5} />
          </span>
        </button>

        <div className="grid md:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          <div className="md:col-span-4">
            <div className="font-display font-extrabold text-xl text-bone">
              {/* AR<span className="text-acid">.</span>RAJPUT */}
               <img
    src="/assets/Arvind_Logo.png"
    alt="AR. Rajput"
    className="h-8 md:h-20 w-auto object-contain"
  />
            </div>
            <p className="mt-4 text-sm text-bone/45 max-w-xs leading-relaxed">
              Arvind Rajput — Graphic Designer & Video Editor crafting visuals
              that make brands impossible to ignore.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-bone/60 hover:bg-acid hover:text-ink hover:border-acid transition-all duration-300"
                    data-testid={`social-${s.label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-5">Navigate</h4>
            <ul className="space-y-3">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => go(n.id)}
                    className="text-sm text-bone/60 hover:text-acid transition-colors"
                    data-testid={`footer-nav-${n.id}`}
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-5">Services</h4>
            <ul className="space-y-3 text-sm text-bone/60">
              <li>Graphic Design</li>
              <li>Video Editing</li>
              <li>Motion Graphics</li>
              <li>Social Media Design</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-5">Get in touch</h4>
            <a
              href="mailto:editinghubarvind@gmail.com"
              className="flex items-center gap-3 text-sm text-bone/60 hover:text-acid transition-colors mb-3"
              data-testid="footer-email"
            >
              <Mail className="w-4 h-4 shrink-0" /> editinghubarvind@gmail.com
            </a>
            <a
              href="tel:+917009794869"
              className="flex items-center gap-3 text-sm text-bone/60 hover:text-acid transition-colors"
              data-testid="footer-phone"
            >
              <Phone className="w-4 h-4 shrink-0" /> +91 70097 94869
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-bone/35">
          <span>© 2026 Arvind Rajput. All rights reserved.</span>
          <span>Designed & built with obsession.</span>
        </div>
      </div>
    </footer>
  );
}
