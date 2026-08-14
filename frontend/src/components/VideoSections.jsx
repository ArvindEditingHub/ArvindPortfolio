import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Play, X } from "lucide-react";
import { Reveal, LineMask } from "./Reveal";
import { PROJECTS } from "../data/projects";

const EDITS = PROJECTS.filter((p) => p.cats.includes("Video Editing") && !p.cats.includes("Motion Graphics"));
const MOTION = PROJECTS.filter((p) => p.cats.includes("Motion Graphics"));

function Lightbox({ video, onClose }) {
  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[160] bg-ink/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          onClick={onClose}
          data-testid="video-lightbox"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 text-bone flex items-center justify-center hover:bg-acid hover:text-ink hover:border-acid transition-colors"
            aria-label="Close video"
            data-testid="lightbox-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
          <motion.div
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 30 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-6xl flex justify-center flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={video.video}
              poster={video.image}
              controls
              autoPlay
              className="w-auto max-w-full h-auto max-h-[78vh] object-contain rounded-2xl shadow-2xl shadow-black/70 bg-black"
              data-testid="lightbox-video"
            />
            <div className="mt-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-acid">{video.category}</span>
                <h3 className="font-display font-extrabold text-2xl text-bone">{video.title}</h3>
              </div>
              <Link
                to={`/project/${video.slug}`}
                className="inline-flex items-center gap-2 text-sm font-display font-bold text-acid hover:text-bone transition-colors"
                data-testid="lightbox-case-study-link"
              >
                Case Study <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PlayBadge() {
  return (
    <span className="absolute inset-0 flex items-center justify-center">
      <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-acid text-ink flex items-center justify-center scale-90 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-black/50">
        <Play className="w-6 h-6 md:w-7 md:h-7 fill-current ml-1" />
      </span>
    </span>
  );
}

export default function VideoSections() {
  const [active, setActive] = useState(null);
  const [feature, ...rest] = EDITS;

  return (
    <>
      <section className="relative bg-bone text-ink py-28 md:py-40 overflow-hidden" data-testid="video-editing-section">
        <div className="max-w-[90rem] mx-auto px-6 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
            <div>
              <Reveal>
                <p className="text-xs tracking-[0.35em] uppercase text-ink/50 mb-6">— Video Editing</p>
              </Reveal>
              <LineMask
                as="h2"
                className="font-display font-extrabold uppercase tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-6xl"
                lines={[<>Selected <span className="font-serif italic font-medium normal-case text-forest">cuts</span></>]}
              />
            </div>
            <Reveal delay={0.15}>
              <p className="max-w-sm text-sm md:text-base text-ink/55">
                Travel films, promos and reels — cut to rhythm, graded to feel.
                Press play.
              </p>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <Reveal className="lg:col-span-7">
              <button
                onClick={() => setActive(feature)}
                data-cursor="play"
                className="group relative block w-full aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden rounded-2xl text-left"
                data-testid={`video-feature-${feature.slug}`}
              >
                <img src={feature.image} alt={feature.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <PlayBadge />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-acid">{feature.category}</span>
                  <h3 className="font-display font-extrabold text-2xl md:text-4xl text-bone tracking-tight mt-1">{feature.title}</h3>
                  <p className="text-sm text-bone/60 mt-2 max-w-md">{feature.tagline}</p>
                </div>
              </button>
            </Reveal>
            <div className="lg:col-span-5 grid gap-6">
              {rest.map((v, i) => (
                <Reveal key={v.slug} delay={0.1 + i * 0.1}>
                  <button
                    onClick={() => setActive(v)}
                    data-cursor="play"
                    className="group relative block w-full aspect-[16/9] overflow-hidden rounded-2xl text-left"
                    data-testid={`video-thumb-${v.slug}`}
                  >
                    <img src={v.image} alt={v.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
                    <PlayBadge />
                    <div className="absolute bottom-0 left-0 p-5">
                      <span className="text-[10px] tracking-[0.25em] uppercase text-acid">{v.category}</span>
                      <h3 className="font-display font-extrabold text-xl text-bone tracking-tight">{v.title}</h3>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-ink py-28 md:py-40 overflow-hidden" data-testid="motion-graphics-section">
        <div className="max-w-[90rem] mx-auto px-6 md:px-10 mb-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <p className="text-xs tracking-[0.35em] uppercase text-bone/40 mb-6">— Motion Graphics</p>
              </Reveal>
              <LineMask
                as="h2"
                className="font-display font-extrabold uppercase tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-6xl text-bone"
                lines={[<>Design in <span className="font-serif italic font-medium normal-case text-acid">motion</span></>]}
              />
            </div>
            <Reveal delay={0.15}>
              <p className="text-xs tracking-[0.3em] uppercase text-bone/40">Scroll / drag sideways →</p>
            </Reveal>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory" data-testid="motion-scroller">
          <div className="flex gap-6 px-6 md:px-10 w-max">
            {MOTION.map((m, i) => (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="snap-center"
              >
                <button
                  onClick={() => setActive(m)}
                  data-cursor="play"
                  className="group relative block w-[70vw] sm:w-[42vw] lg:w-[24vw] aspect-[9/16] overflow-hidden rounded-2xl text-left"
                  data-testid={`motion-thumb-${m.slug}`}
                >
                  <img src={m.image} alt={m.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                  <PlayBadge />
                  <span className="absolute top-5 left-5 font-display font-extrabold text-sm text-acid">0{i + 1}</span>
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="font-display font-extrabold text-xl md:text-2xl text-bone tracking-tight">{m.title}</h3>
                    <p className="text-xs text-bone/55 mt-1">{m.tagline}</p>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Lightbox video={active} onClose={() => setActive(null)} />
    </>
  );
}
