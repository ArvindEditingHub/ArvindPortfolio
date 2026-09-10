import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Reveal, LineMask } from "./Reveal";

function Counter({ target, suffix, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1800;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <div ref={ref} data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="font-display font-extrabold text-6xl md:text-7xl text-forest">
        {val}
        <span className="text-acid">{suffix}</span>
      </div>
      <div className="mt-2 text-xs md:text-sm tracking-[0.25em] uppercase text-ink/50">{label}</div>
    </div>
  );
}

const CHAPTERS = [
  { n: "01", title: "Design that speaks", text: "Posters, brand systems and social creatives built on strong hierarchy and bolder ideas." },
  { n: "02", title: "Motion that moves", text: "Edits and motion graphics cut to rhythm — pacing that keeps eyes on the frame." },
  { n: "03", title: "Stories that sell", text: "Every pixel and every cut serves one goal: making your brand unforgettable." },
];

export default function About() {
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section id="about" className="relative bg-bone text-ink py-28 md:py-40 overflow-hidden" data-testid="about-section">
      <div className="max-w-[90rem] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 relative" ref={imgRef}>
            <Reveal>
              <div className="relative">
                {/* <div className="absolute -top-6 -left-6 font-display font-extrabold text-[8rem] leading-none text-stroke-ink select-none" aria-hidden>
                  ME
                </div> */}
                <motion.div style={{ y: imgY }} className="relative rounded-[1.6rem] overflow-hidden rotate-2 shadow-2xl shadow-ink/20">
                  <img src="/assets/about_portrait.png" alt="Arvind Rajput" className="w-full object-cover" data-testid="about-portrait" />
                </motion.div>
                <div className="absolute -bottom-8 -right-4 md:-right-8 bg-forest text-bone rounded-2xl px-6 py-5 rotate-[-3deg] shadow-xl">
                  <div className="font-serif italic text-2xl text-acid">Arvind Rajput</div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-bone/60 mt-1">Designer / Editor</div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xs tracking-[0.35em] uppercase text-ink/50 mb-6">— About Me</p>
            </Reveal>
            <LineMask
              as="h2"
              className="font-display font-extrabold uppercase tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-6xl"
              lines={[
                <>Who is <span className="font-serif italic font-medium normal-case text-forest">Arvind</span>?</>,
              ]}
            />
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-ink/70" data-testid="about-intro">
                A graphic designer and video editor with 3+ years of hands-on
                experience crafting visuals for brands, startups and creators.
                From scroll-stopping social creatives to cinematic video edits —
                I turn ideas into visuals people remember.
              </p>
            </Reveal>

            <div className="mt-12 space-y-0 border-t border-ink/10">
              {CHAPTERS.map((c, i) => (
                <Reveal key={c.n} delay={i * 0.08}>
                  <div className="group flex items-baseline gap-6 md:gap-10 py-6 border-b border-ink/10" data-testid={`chapter-${c.n}`}>
                    <span className="font-display font-extrabold text-sm text-acid">{c.n}</span>
                    <div>
                      <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight group-hover:text-forest transition-colors duration-300">
                        {c.title}
                      </h3>
                      <p className="mt-1 text-sm md:text-base text-ink/55 max-w-lg">{c.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 md:gap-10">
              <Reveal delay={0.1}><Counter target={150} suffix="+" label="Projects Completed" /></Reveal>
              <Reveal delay={0.2}><Counter target={50} suffix="+" label="Happy Clients" /></Reveal>
              <Reveal delay={0.3}><Counter target={3} suffix="+" label="Years Experience" /></Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
