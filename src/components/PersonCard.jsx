import Reveal from "./Reveal.jsx";

export default function PersonCard({ person, delay = 0 }) {
  const initials = person.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Reveal
      delay={delay}
      className="group flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.04]"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] font-mono text-sm text-white/60 transition-colors group-hover:border-white/30 group-hover:text-white">
        {initials}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-medium text-white">{person.name}</h3>
        <p className="text-sm text-white/45">{person.role}</p>
      </div>
      {person.bio && (
        <p className="text-sm leading-relaxed text-white/40">{person.bio}</p>
      )}
      {person.focus && (
        <span className="mt-auto font-mono text-[11px] uppercase tracking-widest2 text-white/30">
          {person.focus}
        </span>
      )}
    </Reveal>
  );
}
