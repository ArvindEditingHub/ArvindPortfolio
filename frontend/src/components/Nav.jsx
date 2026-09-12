import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Magnetic from "./Magnetic";

const LINKS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Work", id: "work" },
  { label: "Contact", id: "contact" },
];

// "home" maps to the root path "/"; every other section maps to "/<id>",
// e.g. "about" -> "/about".
const pathFor = (id) => (id === "home" ? "/" : `/${id}`);
const idFromPath = (pathname) => {
  const clean = pathname.replace(/^\/+/, ""); // strip leading slash(es)
  return clean === "" ? "home" : clean;
};

// Exported so App.jsx's ScrollManager can tell "moving between sections
// of the single page" apart from "navigating to a genuinely different
// page" (like /project/:slug) — without duplicating this list there.
export const SECTION_PATHS = LINKS.map((l) => pathFor(l.id));

export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: id === "home" ? -100 : -60 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(() => idFromPath(window.location.pathname));
  const location = useLocation();
  const navigate = useNavigate();

  // Only run the section-tracking behaviour (scroll-spy, initial scroll,
  // etc.) when we're actually on one of the single-page section routes —
  // i.e. not on something like /project/:slug.
  const isSectionRoute = SECTION_PATHS.includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On first load (or a hard refresh) at a clean path like /about, scroll
  // to that section once the page has settled.
  useEffect(() => {
    if (!isSectionRoute) return;
    const id = idFromPath(location.pathname);
    if (id === "home") return;
    const t = setTimeout(() => scrollToSection(id), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll-spy: as the user scrolls (not just clicks), keep the URL path
  // and the highlighted nav link in sync with whichever section is
  // currently in view. Uses `replace` so scrolling doesn't spam browser
  // history — only explicit clicks (via `go`) add a new history entry.
  useEffect(() => {
    if (!isSectionRoute) return;

    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveId(id);
            if (location.pathname !== pathFor(id)) {
              navigate(pathFor(id), { replace: true });
            }
          }
        });
      },
      // Counts a section as "current" once it crosses the middle band of
      // the viewport, rather than only when fully in view.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSectionRoute]);

  const go = (id) => {
    setOpen(false);
    if (!isSectionRoute) {
      // Coming from another page (e.g. /project/:slug) — navigate home
      // and let that page handle scrolling once it mounts.
      navigate(pathFor(id), { state: { scrollTo: id } });
    } else {
      scrollToSection(id);
      setActiveId(id);
      navigate(pathFor(id));
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "py-3 bg-ink/70 backdrop-blur-xl border-b border-white/10"
            : "py-6 bg-transparent border-b border-transparent"
        }`}
        data-testid="main-nav"
      >
        <div className="max-w-[90rem] mx-auto px-6 md:px-10 flex items-center justify-between">
          <button
            onClick={() => go("home")}
            className="font-display font-800 text-lg md:text-xl font-extrabold tracking-tight text-bone"
            data-testid="nav-logo"
          >
            {/* AR<span className="text-acid">.</span>RAJPUT */}
            <img
    src="/assets/Arvind_Logo.png"
    alt="AR. Rajput"
    className="h-8 md:h-20 w-auto object-contain"
  />
          </button>
          

          <nav className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`group relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                  activeId === l.id ? "text-bone" : "text-bone/70 hover:text-bone"
                }`}
                data-testid={`nav-${l.id}-link`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-acid transition-all duration-300 ${
                    activeId === l.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic>
              <button
                onClick={() => go("contact")}
                className="hidden md:inline-flex items-center gap-2 rounded-full bg-acid text-ink font-display font-bold text-sm px-6 py-2.5 hover:bg-bone transition-colors duration-300"
                data-testid="nav-lets-talk-btn"
              >
                Let's Talk <ArrowUpRight className="w-4 h-4" />
              </button>
            </Magnetic>
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-bone p-2"
              aria-label="Open menu"
              data-testid="nav-menu-open-btn"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[150] bg-ink flex flex-col"
            data-testid="mobile-menu"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-display font-extrabold text-lg text-bone">
                AR<span className="text-acid">.</span>RAJPUT
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-bone p-2"
                aria-label="Close menu"
                data-testid="nav-menu-close-btn"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
                  onClick={() => go(l.id)}
                  className={`text-left font-display font-extrabold uppercase text-4xl transition-colors py-2 ${
                    activeId === l.id ? "text-acid" : "text-bone/90 hover:text-acid"
                  }`}
                  data-testid={`mobile-nav-${l.id}-link`}
                >
                  {l.label}
                </motion.button>
              ))}
            </nav>
            <div className="px-8 pb-10">
              <button
                onClick={() => go("contact")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-acid text-ink font-display font-bold px-6 py-4"
                data-testid="mobile-lets-talk-btn"
              >
                Let's Talk <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}