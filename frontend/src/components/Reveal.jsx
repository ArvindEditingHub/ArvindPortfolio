import { motion } from "framer-motion";

export function Reveal({ children, delay = 0, y = 40, className = "", once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function LineMask({ lines, className = "", lineClassName = "", delay = 0, as: Tag = "div" }) {
  const MTag = motion[Tag] || motion.div;
  return (
    <MTag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "115%", rotate: 2 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MTag>
  );
}
