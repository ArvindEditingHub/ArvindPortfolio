import { motion } from "framer-motion";
import { Reveal, LineMask } from "./Reveal";

const TOOLS = [
  { name: "Photoshop", short: "Ps", level: 92, bg: "#001E36", fg: "#31A8FF" },
  { name: "Premiere Pro", short: "Pr", level: 85, bg: "#00005B", fg: "#EA77FF" },
  { name: "After Effects", short: "Ae", level: 70, bg: "#00005B", fg: "#9999FF" },
  { name: "Illustrator", short: "Ai", level: 78, bg: "#330000", fg: "#FF9A00" },
  { name: "Canva", short: "Ca", level: 70, bg: "#00C4CC", fg: "#FFFFFF" },
];

export default function Tools() {
  return (
    <section className="relative bg-forest text-bone py-28 md:py-40 overflow-hidden" data-testid="tools-section">
      <div
        className="absolute -right-20 top-1/2 -translate-y-1/2 font-display font-extrabold uppercase text-[22vw] leading-none text-bone/[0.04] select-none pointer-events-none"
        aria-hidden
      >
        Tools
      </div>
      <div className="relative max-w-[90rem] mx-auto px-6 md:px-10">
        <div className="max-w-2xl mb-20">
          <Reveal>
            <p className="text-xs tracking-[0.35em] uppercase text-bone/40 mb-6">— My Favourite Tools</p>
          </Reveal>
          <LineMask
            as="h2"
            className="font-display font-extrabold uppercase tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-6xl"
            lines={[<>The <span className="font-serif italic font-medium normal-case text-acid">toolkit</span> behind</>, <>the designs</>]}
          />
        </div>

        <div className="space-y-2">
          {TOOLS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.07}>
              <div className="group grid grid-cols-12 items-center gap-4 md:gap-8 py-6 border-b border-bone/10" data-testid={`tool-${t.short.toLowerCase()}`}>
                <div className="col-span-3 md:col-span-2 flex items-center gap-4">
                  <span
                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-display font-bold text-lg md:text-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                    style={{ backgroundColor: t.bg, color: t.fg }}
                  >
                    {t.short}
                  </span>
                  <span className="hidden md:block font-display font-bold text-xl tracking-tight">{t.name}</span>
                </div>
                <div className="col-span-7 md:col-span-8">
                  <div className="h-[6px] rounded-full bg-bone/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${t.level}%` }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 1.4, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-acid"
                    />
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <span className="font-display font-extrabold text-2xl md:text-3xl text-acid">{t.level}%</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
