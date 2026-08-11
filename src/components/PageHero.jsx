import { motion } from "framer-motion";

export default function PageHero({ eyebrow, title, description }) {
  return (
    <section className="border-b border-white/10 px-6 pb-10 pt-28 lg:px-10">
      <div className="mx-auto flex max-w-content flex-col gap-2.5">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-mono text-xs uppercase tracking-widest2 text-white/40"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance max-w-2xl font-sans text-2xl font-medium tracking-tight text-white sm:text-3xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-balance max-w-xl text-sm leading-relaxed text-white/45"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
