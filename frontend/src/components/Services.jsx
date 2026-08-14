import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Clapperboard, PenTool, Sparkles, MonitorSmartphone } from "lucide-react";
import { Reveal, LineMask } from "./Reveal";

const SERVICES = [
  {
    n: "01",
    title: "Graphic Design",
    desc: "Posters, brand identities and print-ready artwork with strong visual hierarchy.",
    skills: ["Poster Design", "Branding", "Typography", "Layout"],
    icon: PenTool,
    image: "/assets/proj_armguards.png",
  },
  {
    n: "02",
    title: "Video Editing",
    desc: "Cuts, colour and rhythm — edits that keep viewers watching till the last frame.",
    skills: ["Reels", "YouTube", "Color Grading", "Sound Design"],
    icon: Clapperboard,
    image: "/assets/travel2.png",
  },
  {
    n: "03",
    title: "Motion Graphics",
    desc: "Type in motion, logo animation and animated stories that move people.",
    skills: ["Kinetic Type", "Logo Animation", "Transitions", "2D Animation"],
    icon: Sparkles,
    image: "/assets/motion1.png",
  },
  {
    n: "04",
    title: "Social Media Design",
    desc: "Scroll-stopping creatives for feeds, stories and full campaigns.",
    skills: ["Instagram Posts", "Stories", "Ad Creatives", "Campaigns"],
    icon: MonitorSmartphone,
    image: "/assets/social_mockup.png",
  },
];

export default function Services() {
  const [active, setActive] = useState(null);
  const wrapRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 150, damping: 20 });
  const py = useSpring(my, { stiffness: 150, damping: 20 });

  const onMove = (e) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <section id="services" className="relative bg-ink py-28 md:py-40" data-testid="services-section">
      <div className="max-w-[90rem] mx-auto px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.35em] uppercase text-bone/40 mb-6">— Services</p>
            </Reveal>
            <LineMask
              as="h2"
              className="font-display font-extrabold uppercase tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-6xl text-bone"
              lines={[<>What I <span className="font-serif italic font-medium normal-case text-acid">do</span> best</>]}
            />
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-sm md:text-base text-bone/50">
              Four disciplines, one obsession — visuals that make people stop,
              look and remember.
            </p>
          </Reveal>
        </div>

        <div ref={wrapRef} onMouseMove={onMove} className="relative border-t border-white/10">
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 3 }}
                exit={{ opacity: 0, scale: 0.85, rotate: 4 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ x: px, y: py }}
                className="pointer-events-none absolute z-20 hidden lg:block w-72 -ml-36 -mt-48 rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
                aria-hidden
              >
                <img src={SERVICES[active].image} alt="" className="w-full h-48 object-cover" />
              </motion.div>
            )}
          </AnimatePresence>

          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            const isActive = active === i;
            return (
              <Reveal key={s.n} delay={i * 0.06}>
                <div
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className={`group relative grid md:grid-cols-12 gap-4 md:gap-8 items-center py-10 md:py-12 px-4 md:px-8 border-b border-white/10 transition-colors duration-500 ${
                    isActive ? "bg-acid" : "bg-transparent"
                  }`}
                  data-testid={`service-${s.n}`}
                >
                  <div className="md:col-span-1">
                    <span className={`font-display font-extrabold text-sm transition-colors duration-500 ${isActive ? "text-ink/60" : "text-acid"}`}>
                      {s.n}
                    </span>
                  </div>
                  <div className="md:col-span-5 flex items-center gap-5">
                    <span
                      className={`shrink-0 w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${
                        isActive ? "border-ink/30 bg-ink text-acid rotate-[360deg]" : "border-white/15 text-acid"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3
                      className={`font-display font-extrabold uppercase tracking-tight text-2xl md:text-4xl transition-all duration-500 ${
                        isActive ? "text-ink translate-x-2" : "text-bone"
                      }`}
                    >
                      {s.title}
                    </h3>
                  </div>
                  <div className="md:col-span-4">
                    <p className={`text-sm md:text-base leading-relaxed transition-colors duration-500 ${isActive ? "text-ink/70" : "text-bone/50"}`}>
                      {s.desc}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.skills.map((sk) => (
                        <span
                          key={sk}
                          className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full border transition-colors duration-500 ${
                            isActive ? "border-ink/25 text-ink/70" : "border-white/15 text-bone/45"
                          }`}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 flex md:justify-end">
                    <span
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isActive ? "bg-ink text-acid rotate-45" : "border border-white/15 text-bone/60"
                      }`}
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
