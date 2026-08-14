import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TRAIL_COUNT = 16;

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState(null);

  const mouse = useRef({
    x: -100,
    y: -100,
  });

  const points = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({
      x: -100,
      y: -100,
    }))
  );

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setEnabled(true);

    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const over = (e) => {
      const tagged = e.target.closest?.("[data-cursor]");
      setLabel(tagged?.dataset.cursor || null);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });

    let animationFrame;

    const animate = () => {
      const current = mouse.current;

      // First particle follows the mouse
      points.current[0].x +=
        (current.x - points.current[0].x) * 0.4;

      points.current[0].y +=
        (current.y - points.current[0].y) * 0.4;

      // Remaining particles follow each other
      for (let i = 1; i < TRAIL_COUNT; i++) {
        const previous = points.current[i - 1];
        const point = points.current[i];

        const strength = Math.max(
          0.12,
          0.34 - i * 0.012
        );

        point.x +=
          (previous.x - point.x) * strength;

        point.y +=
          (previous.y - point.y) * strength;
      }

      forceUpdate((value) => value + 1);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* =====================================================
          NORMAL MOUSE TRAIL
      ====================================================== */}

      <AnimatePresence>
        {!label && (
          <>
            {points.current.map((point, index) => {
              const progress =
                1 - index / TRAIL_COUNT;

              const size =
                6 + progress * 15;

              const opacity =
                progress * 0.6;

              return (
                <motion.span
                  key={index}
                  className="fixed top-0 left-0 z-[200] pointer-events-none rounded-full bg-acid"
                  style={{
                    x: point.x,
                    y: point.y,
                    translateX: "-50%",
                    translateY: "-50%",

                    width: size,
                    height: size,

                    opacity,

                    filter: `blur(${index * 0.16}px)`,

                    boxShadow:
                      index < 5
                        ? "0 0 18px rgba(200,255,0,0.45)"
                        : "none",
                  }}
                />
              );
            })}

            {/* Main glowing cursor particle */}

            <motion.span
              className="fixed top-0 left-0 z-[201] pointer-events-none rounded-full bg-acid"
              style={{
                x: mouse.current.x,
                y: mouse.current.y,

                translateX: "-50%",
                translateY: "-50%",

                width: 11,
                height: 11,

                boxShadow:
                  "0 0 18px rgba(200,255,0,1), 0 0 40px rgba(200,255,0,0.7), 0 0 75px rgba(200,255,0,0.3)",
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* =====================================================
          VIEW / PLAY CURSOR
      ====================================================== */}

      <AnimatePresence mode="wait">
        {label && (
          <motion.div
            key={label}
            initial={{
              opacity: 0,
              scale: 0.4,
              rotate: -20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            exit={{
              opacity: 0,
              scale: 1.4,
              rotate: 20,
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 18,
            }}
            className="fixed top-0 left-0 z-[210] pointer-events-none"
            style={{
              x: mouse.current.x,
              y: mouse.current.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 6, -6, 0],
                scale: [1, 1.04, 1],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                relative
                w-20
                h-20
                rounded-full
                border
                border-acid
                bg-acid
                text-ink
                flex
                items-center
                justify-center
                shadow-[0_0_35px_rgba(200,255,0,0.3)]
              "
            >
              {/* Rotating inner ring */}

              <motion.span
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  absolute
                  inset-2
                  rounded-full
                  border
                  border-ink/20
                  border-dashed
                "
              />

              {/* Label */}

              <span className="relative font-display text-[10px] font-extrabold tracking-[0.2em] uppercase">
                {label}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}