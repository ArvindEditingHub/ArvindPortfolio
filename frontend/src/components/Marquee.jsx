import { Asterisk } from "lucide-react";

export default function Marquee({ items, className = "", fast = false, itemClassName = "" }) {
  const row = [...items, ...items, ...items];
  return (
    <div className={`overflow-hidden select-none ${className}`} data-testid="marquee">
      <div className={`flex w-max whitespace-nowrap ${fast ? "animate-marquee-fast" : "animate-marquee"}`}>
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {row.map((item, i) => (
              <span key={i} className={`flex items-center ${itemClassName}`}>
                <span className="mx-6 md:mx-10">{item}</span>
                <Asterisk className="w-[0.6em] h-[0.6em] shrink-0" strokeWidth={2.5} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
