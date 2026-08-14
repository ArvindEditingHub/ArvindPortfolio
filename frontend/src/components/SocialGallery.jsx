import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal, LineMask } from "./Reveal";
import { PROJECTS } from "../data/projects";

const ITEMS = PROJECTS.filter((p) =>
  ["Social Media", "Website Banners", "Posters"].some((c) => p.cats.includes(c))
);

export default function SocialGallery() {
  return (
    <section className="relative bg-bone text-ink py-28 md:py-40" data-testid="social-gallery-section">
      <div className="max-w-[90rem] mx-auto px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.35em] uppercase text-ink/50 mb-6">— Social Media Design</p>
            </Reveal>
            <LineMask
              as="h2"
              className="font-display font-extrabold uppercase tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-6xl"
              lines={[<>Made for the <span className="font-serif italic font-medium normal-case text-forest">feed</span></>]}
            />
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-sm text-sm md:text-base text-ink/55">
              Posts, stories, banners and campaign creatives — every format a
              feed can throw at a brand.
            </p>
          </Reveal>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-5 [column-fill:_balance]">
          {ITEMS.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 0.06} className="mb-5 break-inside-avoid">
              <Link
                to={`/project/${p.slug}`}
                data-cursor="view"
                className="group relative block overflow-hidden rounded-2xl"
                data-testid={`social-item-${p.slug}`}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/45 transition-colors duration-500 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 w-12 h-12 rounded-full bg-acid text-ink flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>
                <span className="absolute bottom-3 left-3 text-[10px] tracking-[0.2em] uppercase bg-ink/70 backdrop-blur text-bone px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {p.title}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
