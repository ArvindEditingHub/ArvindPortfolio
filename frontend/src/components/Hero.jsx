import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Film, Palette, Play, Sparkles } from "lucide-react";
import Magnetic from "./Magnetic";
import Marquee from "./Marquee";
import { scrollToSection } from "./Nav";

const lineAnim = (delay) => ({
  initial: { y: "115%", rotate: 2.5 },
  animate: { y: "0%", rotate: 0 },
  transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] },
});

// Words the typewriter cycles through — edit freely
const ROLES = ["Graphic Designer", "Video Editor", "Motion Artist", "Brand Storyteller"];

// Showcase panels — reuses existing assets
const SHOWCASE = [
  { img: "/assets/motion1.png", label: "Motion Graphics", icon: Film },
  { img: "/assets/motion2.png", label: "Video Editing", icon: Play },
  { img: "/assets/motion3.png", label: "Visual Design", icon: Palette },
];

/** Classic typewriter: types a word, holds, deletes, moves to next word. */
function Typewriter({ words, typeSpeed = 65, deleteSpeed = 35, hold = 1300, startDelay = 900 }) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle -> typing -> holding -> deleting

  useEffect(() => {
    const t = setTimeout(() => setPhase("typing"), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (phase === "idle") return;
    const current = words[wordIndex];

    if (phase === "typing") {
      if (text.length < current.length) {
        const t = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("holding"), hold);
      return () => clearTimeout(t);
    }

    if (phase === "holding") {
      const t = setTimeout(() => setPhase("deleting"), 0);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (text.length > 0) {
        const t = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
        return () => clearTimeout(t);
      }
      setWordIndex((i) => (i + 1) % words.length);
      setPhase("typing");
    }
  }, [phase, text, wordIndex, words, typeSpeed, deleteSpeed, hold]);

  return (
    <span className="inline-flex items-baseline font-serif italic font-medium normal-case text-acid">
      {text}
      <motion.span
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="ml-1 w-[0.06em] h-[0.8em] bg-acid inline-block translate-y-[0.05em]"
        aria-hidden
      />
    </span>
  );
}

function ShowcaseStack() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((v) => (v + 1) % SHOWCASE.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full max-w-md aspect-[4/5] mx-auto">
      {SHOWCASE.map((card, idx) => {
        const offset = (idx - active + SHOWCASE.length) % SHOWCASE.length;
        const isFront = offset === 0;
        const Icon = card.icon;
        return (
          <motion.div
            key={card.img}
            animate={{
              scale: isFront ? 1 : 0.93 - offset * 0.035,
              y: isFront ? 0 : 22 + offset * 16,
              x: isFront ? 0 : 12 + offset * 12,
              rotate: isFront ? -2.5 : 3.5 + offset * 3,
              opacity: offset > 1.5 ? 0 : 1,
              zIndex: SHOWCASE.length - offset,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden bg-bone p-2.5 shadow-2xl shadow-black/60">
              <img
                src={card.img}
                alt={card.label}
                className="w-full h-full rounded-[1.4rem] object-cover"
              />
              {isFront && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="absolute inset-2.5 rounded-[1.4rem] flex items-center justify-center"
                  >
                    <span className="w-16 h-16 rounded-full bg-acid/95 flex items-center justify-center shadow-xl">
                      <Play className="w-6 h-6 text-ink fill-ink translate-x-[1px]" />
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-full bg-ink/85 backdrop-blur px-4 py-2.5"
                  >
                    <Icon className="w-4 h-4 text-acid shrink-0" />
                    <span className="text-xs font-semibold tracking-widest uppercase text-bone/90">
                      {card.label}
                    </span>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* progress dots */}
      <div className="absolute -bottom-9 left-0 right-0 flex justify-center gap-2">
        {SHOWCASE.map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === active ? "w-7 bg-acid" : "w-1.5 bg-bone/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative min-h-screen bg-ink overflow-hidden" data-testid="hero-section">
      <div className="absolute inset-0 hero-grid-lines" aria-hidden />

      <motion.div
        aria-hidden
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-acid/20 blur-[100px]"
      />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.1, 0.22, 0.1], scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-0 -left-24 w-[24rem] h-[24rem] rounded-full bg-forest/40 blur-[100px]"
      />

      <div className="relative max-w-[90rem] mx-auto px-6 md:px-10 pt-40 md:pt-48 lg:pt-40 pb-24 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* TEXT — now 6/12 so it doesn't dominate the layout */}
          <motion.div style={{ y: textY, opacity: fade }} className="lg:col-span-6 relative z-10">
            <div className="overflow-hidden mb-6">
              <motion.p
                {...lineAnim(0.5)}
                className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-bone/60 inline-flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-acid" />
                Hi, I'm <span className="text-acid">Arvind Rajput</span>
              </motion.p>
            </div>

            <h1 className="font-display font-extrabold uppercase leading-[0.95] tracking-tight" data-testid="hero-heading">
              <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
                <motion.span {...lineAnim(0.65)} className="block text-[11vw] lg:text-[5rem] text-bone">
                  Creative
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.12em] -mb-[0.02em]">
                <motion.span {...lineAnim(0.8)} className="flex items-baseline text-[11vw] lg:text-[5rem] normal-case min-h-[1.1em]">
                  <Typewriter words={ROLES} />
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1 }}
              className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-bone/60"
              data-testid="hero-intro"
            >
              I create engaging visual designs, social media creatives, branding
              materials, video content and motion graphics — work that makes
              brands impossible to scroll past.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.25 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {["Adobe Premiere", "After Effects", "Photoshop", "Illustrator", "CapCut"].map((tool, idx) => (
                <motion.span
                  key={tool}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 }}
                  className="text-[11px] md:text-xs font-semibold tracking-wide uppercase text-bone/70 border border-bone/15 rounded-full px-3 py-1.5"
                >
                  {tool}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.4 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Magnetic>
                <button
                  onClick={() => scrollToSection("work")}
                  className="group inline-flex items-center gap-3 rounded-full bg-acid text-ink font-display font-bold px-8 py-4 text-sm md:text-base hover:bg-bone transition-colors duration-300"
                  data-testid="hero-view-work-btn"
                >
                  View My Work
                  <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="group inline-flex items-center gap-3 rounded-full border border-bone/25 text-bone font-display font-bold px-8 py-4 text-sm md:text-base hover:border-acid hover:text-acid transition-colors duration-300"
                  data-testid="hero-work-together-btn"
                >
                  Let's Work Together
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* VISUAL — now 6/12, much bigger stage for the work */}
          <motion.div style={{ y: portraitY }} className="lg:col-span-6 relative flex justify-center mt-6 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg mt-10 md:mt-4"
            >
              <div className="absolute -inset-5 bg-acid rounded-[2.2rem] rotate-2" aria-hidden />
              <ShowcaseStack />

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute z-30 -left-6 md:-left-10 top-6 hidden md:flex items-center gap-2 rounded-full bg-coal/90 backdrop-blur border border-white/10 px-4 py-2 shadow-lg shadow-black/40"
              >
                <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
                <span className="text-xs font-semibold tracking-widest uppercase text-bone/80">Video Editor</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute z-30 -right-4 md:-right-8 -top-6 hidden md:flex items-center gap-2 rounded-full bg-coal/90 backdrop-blur border border-white/10 px-4 py-2 shadow-lg shadow-black/40"
              >
                <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
                <span className="text-xs font-semibold tracking-widest uppercase text-bone/80">Graphic Designer</span>
              </motion.div>
{/* 
              <div className="absolute z-30 -bottom-16 -left-8 hidden md:block animate-spin-slow" aria-hidden>
                <svg viewBox="0 0 100 100" className="w-28 h-28">
                  <defs>
                    <path id="circ" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                  </defs>
                  <text className="fill-bone/70" style={{ fontSize: 10.5, letterSpacing: 2.5 }}>
                    <textPath href="#circ">OPEN FOR PROJECTS • DESIGN • MOTION •</textPath>
                  </text>
                </svg>
              </div> */}
            </motion.div>
          </motion.div>
        </div>

        <motion.button
          onClick={() => scrollToSection("about")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-24 left-6 md:left-10 hidden md:flex items-center gap-3 text-bone/50 hover:text-acid transition-colors"
          data-testid="hero-scroll-indicator"
        >
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ArrowDown className="w-4 h-4" />
          </motion.span>
          <span className="text-xs tracking-[0.3em] uppercase">Scroll to explore</span>
        </motion.button>
      </div>

      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 bg-acid text-ink py-3 md:py-4 -rotate-[0.5deg] scale-[1.02]"
      >
        <Marquee
          items={["Graphic Design", "Video Editing", "Motion Graphics", "Social Media Design", "Branding", "Creative Direction"]}
          itemClassName="font-display font-extrabold uppercase text-xl md:text-3xl tracking-tight"
        />
      </motion.div> */}
    </section>
  );
}
