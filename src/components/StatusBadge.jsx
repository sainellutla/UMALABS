const styles = {
  Active: "border-white/25 text-white/80",
  "In Review": "border-white/15 text-white/50",
  Published: "border-white/25 text-white/80",
  Accepted: "border-white/25 text-white/80",
  "Under Review": "border-white/15 text-white/50",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-widest2 ${
        styles[status] ?? "border-white/15 text-white/50"
      }`}
    >
      {status}
    </span>
  );
}
