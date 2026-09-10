import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getProject, getNextProject } from "../data/projects";
import { Reveal, LineMask } from "../components/Reveal";

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProject(slug);
  const next = getNextProject(slug);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(() => {
    if (!project) return;
    setLightboxIndex((i) => (i === null ? null : (i - 1 + project.gallery.length) % project.gallery.length));
  }, [project]);
  const showNext = useCallback(() => {
    if (!project) return;
    setLightboxIndex((i) => (i === null ? null : (i + 1) % project.gallery.length));
  }, [project]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <main className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-display font-extrabold text-4xl text-bone">Project not found</p>
          <Link to="/" className="mt-6 inline-block text-acid font-display font-bold" data-testid="not-found-home-link">
            ← Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-ink text-bone overflow-x-hidden" data-testid="project-page">
      <section className="relative overflow-hidden">
        {/*
          pt-28 / md:pt-36 pushes content below the fixed/sticky navbar so the
          "All Work" link isn't hidden behind it. relative z-10 is a safety
          net in case the navbar's stacking context ever overlaps this block.
        */}
        <div className="relative z-10 pt-28 md:pt-36 px-6 md:px-10 max-w-[90rem] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-bone/60 hover:text-acid transition-colors mb-8"
            data-testid="project-back-link"
          >
            <ArrowLeft className="w-4 h-4" /> All Work
          </Link>
          <LineMask
            as="h1"
            className="font-display font-extrabold uppercase tracking-tight leading-[0.9] text-4xl sm:text-6xl lg:text-8xl break-words"
            lines={[project.title]}
          />
          <Reveal delay={0.2}>
            <p className="mt-4 font-serif italic text-lg md:text-2xl text-acid">{project.tagline}</p>
          </Reveal>
        </div>

        <div ref={heroRef} className="relative w-full mt-10 md:mt-14 bg-coal">
          {/* Blurred backdrop fills the width without cropping the real image */}
          <div
            className="absolute inset-0 bg-center bg-cover scale-110 blur-3xl opacity-40"
            style={{ backgroundImage: `url(${project.image})` }}
            aria-hidden="true"
          />
          <div className="relative w-full max-h-[85vh] flex items-center justify-center">
            <motion.img
              style={{ scale: imgScale }}
              src={project.image}
              alt={project.title}
              className="relative w-full h-auto max-h-[85vh] object-contain"
              data-testid="project-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-[90rem] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-white/10">
          {[
            ["Category", project.category],
            ["Client", project.client],
            ["Year", project.year],
            ["Tools", project.tools.join(", ")],
          ].map(([k, v]) => (
            <Reveal key={k}>
              <div data-testid={`project-meta-${k.toLowerCase()}`} className="min-w-0">
                <div className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-2">{k}</div>
                <div className="font-display font-bold text-lg text-bone break-words">{v}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12 py-16 md:py-24">
          <div className="lg:col-span-7 min-w-0">
            <Reveal>
              <p className="text-xs tracking-[0.35em] uppercase text-bone/40 mb-6">— The Brief</p>
              <p className="text-lg md:text-2xl leading-relaxed text-bone/80 font-light" data-testid="project-description">
                {project.description}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5 min-w-0">
            <Reveal delay={0.15}>
              <p className="text-xs tracking-[0.35em] uppercase text-bone/40 mb-6">— The Process</p>
              <ol className="space-y-0 border-t border-white/10">
                {project.process.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 py-4 border-b border-white/10" data-testid={`project-process-${i}`}>
                    <span className="font-display font-extrabold text-sm text-acid shrink-0">0{i + 1}</span>
                    <span className="text-sm md:text-base text-bone/65">{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>

        {project.video && (
          <Reveal>
            <div className="pb-16 md:pb-24">
              <p className="text-xs tracking-[0.35em] uppercase text-bone/40 mb-6">— Watch</p>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                <video
                  src={project.video}
                  poster={project.image}
                  controls
                  preload="metadata"
                  className="w-full aspect-video object-cover bg-black"
                  data-testid="project-video"
                />
                <span className="absolute top-5 left-5 inline-flex items-center gap-2 bg-ink/70 backdrop-blur px-4 py-2 rounded-full text-xs tracking-[0.2em] uppercase text-bone/80 pointer-events-none">
                  <Play className="w-3 h-3 fill-acid text-acid" /> Final Cut
                </span>
              </div>
            </div>
          </Reveal>
        )}

        <div>
          <Reveal>
            <p className="text-xs tracking-[0.35em] uppercase text-bone/40 mb-8">— Gallery</p>
          </Reveal>
          <div className="grid md:grid-cols-12 gap-5 md:gap-6" data-testid="project-gallery">
            <Reveal className="md:col-span-7">
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="block w-full aspect-[4/3] md:aspect-auto md:h-full rounded-2xl overflow-hidden cursor-zoom-in group relative"
                data-testid="project-gallery-item-0"
              >
                <img
                  src={project.gallery[0]}
                  alt={`${project.title} artwork 1`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-500" />
              </button>
            </Reveal>
            <div className="md:col-span-5 grid gap-5 md:gap-6">
              {project.gallery.slice(1).map((g, i) => (
                <Reveal key={i} delay={0.1 + i * 0.1}>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(i + 1)}
                    className="block w-full aspect-square md:aspect-auto md:h-full rounded-2xl overflow-hidden cursor-zoom-in group relative"
                    data-testid={`project-gallery-item-${i + 1}`}
                  >
                    <img
                      src={g}
                      alt={`${project.title} artwork ${i + 2}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-500" />
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-md flex items-center justify-center px-4 md:px-10"
            data-testid="project-lightbox"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-11 h-11 rounded-full border border-bone/25 text-bone flex items-center justify-center hover:border-acid hover:text-acid transition-colors"
              data-testid="lightbox-close"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="absolute top-6 left-6 text-xs tracking-[0.3em] uppercase text-bone/50">
              {lightboxIndex + 1} / {project.gallery.length}
            </span>

            {project.gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); showPrev(); }}
                  className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full border border-bone/25 text-bone flex items-center justify-center hover:border-acid hover:text-acid transition-colors"
                  data-testid="lightbox-prev"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); showNext(); }}
                  className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full border border-bone/25 text-bone flex items-center justify-center hover:border-acid hover:text-acid transition-colors"
                  data-testid="lightbox-next"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              src={project.gallery[lightboxIndex]}
              alt={`${project.title} artwork ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl shadow-black/60"
              onClick={(e) => e.stopPropagation()}
              data-testid="lightbox-image"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        to={`/project/${next.slug}`}
        className="group relative block py-20 md:py-36 bg-coal hover:bg-acid transition-colors duration-700 overflow-hidden"
        data-testid="next-project-link"
      >
        <div className="max-w-[90rem] mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-6">
          <div className="min-w-0">
            <span className="text-xs tracking-[0.35em] uppercase text-bone/40 group-hover:text-ink/60 transition-colors duration-500">
              Next Project
            </span>
            <h2 className="mt-4 font-display font-extrabold uppercase tracking-tight leading-[0.9] text-3xl sm:text-6xl lg:text-8xl text-bone group-hover:text-ink transition-colors duration-500 break-words">
              {next.title}
            </h2>
            <span className="mt-4 inline-block font-serif italic text-lg md:text-xl text-acid group-hover:text-ink/70 transition-colors duration-500">
              {next.category}
            </span>
          </div>
          <span className="shrink-0 self-start sm:self-auto w-14 h-14 md:w-24 md:h-24 rounded-full border border-bone/25 group-hover:border-ink group-hover:bg-ink group-hover:text-acid text-bone flex items-center justify-center transition-all duration-500 group-hover:rotate-45">
            <ArrowRight className="w-5 h-5 md:w-8 md:h-8" />
          </span>
        </div>
      </Link>
    </main>
  );
}