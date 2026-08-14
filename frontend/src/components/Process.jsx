import { Reveal, LineMask } from "./Reveal";

const STEPS = [
  { n: "01", title: "Understand", text: "A deep dive into your brand, audience and goals before a single pixel moves." },
  { n: "02", title: "Plan", text: "Moodboards, references and a clear creative direction we both believe in." },
  { n: "03", title: "Design", text: "Crafting visuals, frames and cuts with intent — where the idea becomes real." },
  { n: "04", title: "Refine", text: "Sharpening every pixel, word and transition through honest feedback loops." },
  { n: "05", title: "Deliver", text: "Final files, exports and formats — ready to ship, on time, every time." },
];

export default function Process() {
  return (
    <section className="relative bg-ink py-28 md:py-40" data-testid="process-section">
      <div className="max-w-[90rem] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <p className="text-xs tracking-[0.35em] uppercase text-bone/40 mb-6">— Work Process</p>
              </Reveal>
              <LineMask
                as="h2"
                className="font-display font-extrabold uppercase tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-6xl text-bone"
                lines={[<>How the <span className="font-serif italic font-medium normal-case text-acid">magic</span></>, <>happens</>]}
              />
              <Reveal delay={0.2}>
                <p className="mt-8 max-w-sm text-sm md:text-base text-bone/50 leading-relaxed">
                  Five steps. No chaos, no guesswork — a process refined over
                  150+ projects so you always know what happens next.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={0.05} y={60}>
                <div
                  className="group relative flex items-start gap-6 md:gap-10 py-10 md:py-12 border-b border-white/10"
                  data-testid={`process-step-${s.n}`}
                >
                  <span className="font-display font-extrabold text-5xl md:text-7xl leading-none text-stroke-bone group-hover:text-acid group-hover:[-webkit-text-stroke:0px] transition-all duration-500">
                    {s.n}
                  </span>
                  <div className="pt-2">
                    <h3 className="font-display font-extrabold uppercase tracking-tight text-2xl md:text-3xl text-bone group-hover:translate-x-2 transition-transform duration-500">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm md:text-base text-bone/50 max-w-md leading-relaxed">{s.text}</p>
                  </div>
                  <span className="absolute left-0 bottom-0 h-px w-0 bg-acid transition-all duration-700 group-hover:w-full" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
