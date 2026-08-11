import Reveal from "./Reveal.jsx";
import StatusBadge from "./StatusBadge.jsx";

export default function ProjectCard({ project, delay = 0 }) {
  return (
    <Reveal
      delay={delay}
      className="group flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-medium text-white">{project.title}</h3>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-sm leading-relaxed text-white/50">
        {project.description}
      </p>
    </Reveal>
  );
}
