import Reveal from "./Reveal.jsx";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  compact = false,
}) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <Reveal className={`flex max-w-2xl flex-col ${compact ? "gap-2.5" : "gap-4"} ${alignment}`}>
      {eyebrow && (
        <span className="font-mono text-xs uppercase tracking-widest2 text-white/40">
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-balance font-sans font-medium tracking-tight text-white ${
          compact ? "text-lg sm:text-xl" : "text-3xl sm:text-4xl"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-balance leading-relaxed text-white/50 ${
            compact ? "text-sm" : "text-base"
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
