import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, LineMask } from "./Reveal";
import { PROJECTS, CATEGORIES } from "../data/projects";

const SPANS = [
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
];

export default function Projects() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? PROJECTS.slice(0, 10)
      : PROJECTS.filter((p) => p.cats.includes(filter));

  return (
    <section
      id="work"
      className="relative bg-ink py-28 md:py-40"
      data-testid="projects-section"
    >
      <div className="max-w-[90rem] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-8 mb-12">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.35em] uppercase text-bone/40 mb-6">
                — Selected Work
              </p>
            </Reveal>

            <LineMask
              as="h2"
              className="font-display font-extrabold uppercase tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-6xl text-bone"
              lines={[
                <>
                  Work that{" "}
                  <span className="font-serif italic font-medium normal-case text-acid">
                    speaks
                  </span>
                </>,
                <>for itself</>,
              ]}
            />
          </div>

          <Reveal delay={0.15}>
            <p className="text-sm text-bone/40 font-display font-bold uppercase tracking-widest">
              {filtered.length} Projects
            </p>
          </Reveal>
        </div>

        {/* Filters */}
        <Reveal>
          <div
            className="flex flex-wrap gap-3 mb-14"
            data-testid="project-filters"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-5 py-2.5 text-xs md:text-sm font-display font-bold uppercase tracking-wider border transition-all duration-300 ${
                  filter === c
                    ? "bg-acid text-ink border-acid"
                    : "border-white/15 text-bone/60 hover:border-acid/60 hover:text-bone"
                }`}
                data-testid={`filter-${c
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-6 gap-5 md:gap-6 items-start"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                layout
                key={p.slug}
                initial={{
                  opacity: 0,
                  y: 50,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                }}
                transition={{
                  duration: 0.6,
                  delay: (i % 5) * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={SPANS[i % SPANS.length]}
              >
                <Link
                  to={`/project/${p.slug}`}
                  data-cursor="view"
                  className="group relative block w-full overflow-hidden rounded-2xl bg-coal"
                  data-testid={`project-card-${p.slug}`}
                >
                  {/* Project Image */}
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="block w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

                  {/* Project Content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex items-end justify-between gap-3">
                    <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-[10px] tracking-[0.25em] uppercase text-acid">
                        {p.category}
                      </span>

                      <h3 className="font-display font-extrabold text-xl md:text-2xl text-bone tracking-tight mt-1">
                        {p.title}
                      </h3>

                      <p className="text-xs text-bone/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-1">
                        {p.tagline}
                      </p>
                    </div>

                    {/* Arrow */}
                    <span className="shrink-0 w-11 h-11 rounded-full bg-acid text-ink flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}