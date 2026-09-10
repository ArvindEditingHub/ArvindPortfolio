import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Reveal, LineMask } from "./Reveal";
import { PROJECTS } from "../data/projects";

const EDITS = PROJECTS.filter(
  (p) =>
    p.cats.includes("Video Showcase") &&
    !p.cats.includes("Motion Graphics")
);

const MOTION = PROJECTS.filter((p) =>
  p.cats.includes("Motion Graphics")
);



// How fast the motion-graphics row auto-scrolls, in pixels per frame.
const AUTO_SCROLL_SPEED = 0.6;

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
  onPlayingChange,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const setPlaying = (val) => {
    setIsPlaying(val);
    onPlayingChange?.(val);
  };

  const handlePlay = async () => {
    if (!videoRef.current) return;

    try {
      await videoRef.current.play();
      setPlaying(true);
    } catch (error) {
      console.error("Video play failed:", error);
    }
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleEnded = () => {
    setPlaying(false);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-black ${className}`}
      data-testid={`video-card-${video.slug}`}
    >
      {/*
        Single <video> element does double duty:
        - Paused (before click) it shows the video's own first frame as the
          thumbnail automatically (preload="metadata"), cropped with
          object-cover to fill the box neatly — no `image` field needed.
        - Once playing, it switches to object-contain so the full video is
          visible without any cropping, still inside the same box.
      */}
      <video
        ref={videoRef}
        src={video.video}
        preload="metadata"
        playsInline
        controls={isPlaying}
        onPlay={() => setPlaying(true)}
        onPause={handlePause}
        onEnded={handleEnded}
        className={`absolute inset-0 w-full h-full bg-black ${
          isPlaying ? "object-contain" : "object-cover"
        }`}
      />

      {/* Play Overlay (hidden once playing) */}
      {!isPlaying && (
        <button
          type="button"
          onClick={handlePlay}
          data-cursor="play"
          aria-label={`Play ${video.title}`}
          data-testid={`video-play-${video.slug}`}
          className="absolute inset-0 z-10 w-full h-full text-left"
        >
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

  // ---- Motion Graphics horizontal auto-scroller ----
  const scrollerRef = useRef(null);
  const isHoveringRef = useRef(false);
  const isDraggingRef = useRef(false);
  const playingCountRef = useRef(0);
  const dragState = useRef({ startX: 0, startScroll: 0, moved: false });
  const rafRef = useRef(null);

  // Render the motion list twice back-to-back so we can loop the scroll
  // seamlessly (jump exactly at the halfway point, where content repeats).
  const LOOPED_MOTION =
    MOTION.length > 0 ? [...MOTION, ...MOTION] : [];

  // Keeps scrollLeft inside [0, halfWidth) so the loop never visibly jumps.
  const normalizeLoop = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (half <= 0) return;
    if (el.scrollLeft >= half) {
      el.scrollLeft -= half;
    } else if (el.scrollLeft < 0) {
      el.scrollLeft += half;
    }
  };

  // Continuous auto-scroll loop. Pauses on hover, drag, or while a video
  // in the row is playing.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || MOTION.length === 0) return;

    const step = () => {
      const isPaused =
        isHoveringRef.current ||
        isDraggingRef.current ||
        playingCountRef.current > 0;

      if (!isPaused) {
        el.scrollLeft += AUTO_SCROLL_SPEED;
        normalizeLoop();
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
  };
  const handleMouseLeaveHover = () => {
    isHoveringRef.current = false;
    isDraggingRef.current = false;
  };

  // Let a normal vertical mouse-wheel / trackpad gesture move the row
  // sideways too, not just shift+scroll.
  const handleWheel = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    const canScroll = el.scrollWidth > el.clientWidth;
    if (!canScroll) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
      normalizeLoop();
    }
  };

  // Click-and-drag scrolling for desktop mouse users.
  const handleMouseDown = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    dragState.current = {
      startX: e.pageX,
      startScroll: el.scrollLeft,
      moved: false,
    };
  };

  const handleMouseMove = (e) => {
    const el = scrollerRef.current;
    if (!el || !isDraggingRef.current) return;
    const delta = e.pageX - dragState.current.startX;
    if (Math.abs(delta) > 3) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScroll - delta;
    normalizeLoop();
  };

  const endDrag = () => {
    isDraggingRef.current = false;
  };

  // Touch support: pause auto-scroll while the user's finger is on the row.
  const handleTouchStart = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    dragState.current = {
      startX: e.touches[0].pageX,
      startScroll: el.scrollLeft,
      moved: false,
    };
  };

  const handleTouchMove = (e) => {
    const el = scrollerRef.current;
    if (!el || !isDraggingRef.current) return;
    const delta = e.touches[0].pageX - dragState.current.startX;
    if (Math.abs(delta) > 3) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScroll - delta;
    normalizeLoop();
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Prevent a drag-release from being interpreted as a click on the
  // play button underneath it.
  const handleClickCapture = (e) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

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
                    Travel{" "}
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
          {/* Video Grid */}
{feature && (
  <div className="grid lg:grid-cols-12 gap-6 min-w-0">

    {/* Featured Video */}
    <Reveal className="lg:col-span-7 min-w-0">
      <VideoCard
        video={feature}
        className="w-full aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px]"
      />
    </Reveal>

    {/* Smaller Videos */}
    <div className="lg:col-span-5 grid gap-6 min-w-0">
      {rest.map((v, i) => (
        <Reveal key={v.slug} delay={0.1 + i * 0.1} className="min-w-0">
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
                Auto-scrolling — hover to pause
              </p>
            </Reveal>

          </div>
        </div>

        {/* Horizontal Video Scroller (auto-scrolls, pauses on hover/drag/play) */}
        <div
          ref={scrollerRef}
          className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
          data-testid="motion-scroller"
          onWheel={handleWheel}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeaveHover}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={endDrag}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClickCapture={handleClickCapture}
        >
          <div className="flex gap-6 px-6 md:px-10 w-max">

            {LOOPED_MOTION.map((m, i) => (
              <motion.div
                key={`${m.slug}-${i}`}
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
                  delay: (i % MOTION.length) * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <VideoCard
                  video={{
                    ...m,
                    index: `0${(i % MOTION.length) + 1}`,
                  }}
                  motionCard
                  className="w-[70vw] sm:w-[42vw] lg:w-[24vw] aspect-[9/16]"
                  onPlayingChange={(playing) => {
                    playingCountRef.current += playing ? 1 : -1;
                    if (playingCountRef.current < 0) playingCountRef.current = 0;
                  }}
                />
              </motion.div>
            ))}

          </div>
        </div>
      </section>
    </>
  );
}