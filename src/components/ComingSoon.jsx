import { motion } from "framer-motion";

function LoadingDots() {
  return (
    <span className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1 w-1 rounded-full bg-white/50"
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{
            repeat: Infinity,
            duration: 1.3,
            delay: i * 0.22,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export default function ComingSoon({
  title = "Coming soon.",
  description,
  note = "Preparing first release",
  compact = false,
}) {
  return (
    <div
      className={`flex flex-col items-center gap-8 text-center ${
        compact ? "py-16" : "py-24"
      }`}
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-white/10" />
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/60"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        />
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-white/60"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        <h3
          className={`font-medium text-white ${compact ? "text-xl" : "text-2xl sm:text-3xl"}`}
        >
          {title}
        </h3>
        {description && (
          <p className="max-w-md text-balance text-sm leading-relaxed text-white/45">
            {description}
          </p>
        )}
      </div>

      {note && (
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-white/30">
          <span>{note}</span>
          <LoadingDots />
        </div>
      )}
    </div>
  );
}
