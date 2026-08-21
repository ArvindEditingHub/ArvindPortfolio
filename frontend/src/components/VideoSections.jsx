import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Reveal, LineMask } from "./Reveal";
import { PROJECTS } from "../data/projects";

const EDITS = PROJECTS.filter(
  (p) =>
    p.cats.includes("Video Editing") &&
    !p.cats.includes("Motion Graphics")
);

const MOTION = PROJECTS.filter((p) =>
  p.cats.includes("Motion Graphics")
);

function PlayBadge() {
  return (
    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-acid text-ink flex items-center justify-center scale-90 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-black/50">
        <Play className="w-6 h-6 md:w-7 md:h-7 fill-current ml-1" />
      </span>
    </span>
  );
}

function VideoCard({
  video,
  className = "",
  motionCard = false,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (!videoRef.current) return;

    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Video play failed:", error);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-black ${className}`}
      data-testid={`video-card-${video.slug}`}
    >
      {/* Actual Video */}
      <video
        ref={videoRef}
        src={video.video}
        poster={video.image}
        playsInline
        preload="metadata"
        controls={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={handlePause}
        onEnded={handleEnded}
        className="absolute inset-0 w-full h-full object-cover bg-black"
      />

      {/* Thumbnail / Play Overlay */}
      {!isPlaying && (
        <button
          type="button"
          onClick={handlePlay}
          data-cursor="play"
          aria-label={`Play ${video.title}`}
          data-testid={`video-play-${video.slug}`}
          className="absolute inset-0 z-10 w-full h-full text-left"
        >
          {/* Thumbnail */}
          <img
            src={video.image}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Dark Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />

          {/* Play Button */}
          <PlayBadge />

          {/* Motion Graphics Number */}
          {motionCard && video.index && (
            <span className="absolute top-5 left-5 font-display font-extrabold text-sm text-acid">
              {video.index}
            </span>
          )}

          {/* Video Information */}
          <div className="absolute bottom-0 left-0 p-5 md:p-6">
            {!motionCard && video.category && (
              <span className="text-[10px] tracking-[0.25em] uppercase text-acid">
                {video.category}
              </span>
            )}

            <h3
              className={`font-display font-extrabold text-bone tracking-tight ${
                motionCard
                  ? "text-xl md:text-2xl"
                  : "text-xl md:text-2xl lg:text-4xl"
              }`}
            >
              {video.title}
            </h3>

            {video.tagline && (
              <p className="text-xs md:text-sm text-bone/55 mt-1 max-w-md">
                {video.tagline}
              </p>
            )}
          </div>
        </button>
      )}

      {/* Playing Indicator */}
      {isPlaying && (
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <span className="px-3 py-1.5 rounded-full bg-ink/70 backdrop-blur-md text-[10px] tracking-[0.2em] uppercase text-bone">
            Playing
          </span>
        </div>
      )}
    </div>
  );
}

export default function VideoSections() {
  const [feature, ...rest] = EDITS;

  return (
    <>
      {/* =====================================================
          VIDEO EDITING SECTION
      ====================================================== */}
      <section
        className="relative bg-bone text-ink py-28 md:py-40 overflow-hidden"
        data-testid="video-editing-section"
      >
        <div className="max-w-[90rem] mx-auto px-6 md:px-10">

          {/* Section Header */}
          <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
            <div>
              <Reveal>
                <p className="text-xs tracking-[0.35em] uppercase text-ink/50 mb-6">
                  — Video Editing
                </p>
              </Reveal>

              <LineMask
                as="h2"
                className="font-display font-extrabold uppercase tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-6xl"
                lines={[
                  <>
                    Selected{" "}
                    <span className="font-serif italic font-medium normal-case text-forest">
                      cuts
                    </span>
                  </>,
                ]}
              />
            </div>

            <Reveal delay={0.15}>
              <p className="max-w-sm text-sm md:text-base text-ink/55">
                Travel films, promos and reels — cut to rhythm, graded to feel.
                Press play.
              </p>
            </Reveal>
          </div>

          {/* Video Grid */}
          {feature && (
            <div className="grid lg:grid-cols-12 gap-6">

              {/* Featured Video */}
              <Reveal className="lg:col-span-7">
                <VideoCard
                  video={feature}
                  className="w-full aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px]"
                />
              </Reveal>

              {/* Smaller Videos */}
              <div className="lg:col-span-5 grid gap-6">
                {rest.map((v, i) => (
                  <Reveal
                    key={v.slug}
                    delay={0.1 + i * 0.1}
                  >
                    <VideoCard
                      video={v}
                      className="w-full aspect-[16/9]"
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          MOTION GRAPHICS SECTION
      ====================================================== */}
      <section
        className="relative bg-ink py-28 md:py-40 overflow-hidden"
        data-testid="motion-graphics-section"
      >
        {/* Section Header */}
        <div className="max-w-[90rem] mx-auto px-6 md:px-10 mb-14">
          <div className="flex flex-wrap items-end justify-between gap-6">

            <div>
              <Reveal>
                <p className="text-xs tracking-[0.35em] uppercase text-bone/40 mb-6">
                  — Motion Graphics
                </p>
              </Reveal>

              <LineMask
                as="h2"
                className="font-display font-extrabold uppercase tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-6xl text-bone"
                lines={[
                  <>
                    Design in{" "}
                    <span className="font-serif italic font-medium normal-case text-acid">
                      motion
                    </span>
                  </>,
                ]}
              />
            </div>

            <Reveal delay={0.15}>
              <p className="text-xs tracking-[0.3em] uppercase text-bone/40">
                Scroll / drag sideways →
              </p>
            </Reveal>

          </div>
        </div>

        {/* Horizontal Video Scroller */}
        <div
          className="overflow-x-auto no-scrollbar snap-x snap-mandatory"
          data-testid="motion-scroller"
        >
          <div className="flex gap-6 px-6 md:px-10 w-max">

            {MOTION.map((m, i) => (
              <motion.div
                key={m.slug}
                initial={{
                  opacity: 0,
                  y: 60,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="snap-center"
              >
                <VideoCard
                  video={{
                    ...m,
                    index: `0${i + 1}`,
                  }}
                  motionCard
                  className="w-[70vw] sm:w-[42vw] lg:w-[24vw] aspect-[9/16]"
                />
              </motion.div>
            ))}

          </div>
        </div>
      </section>
    </>
  );
}