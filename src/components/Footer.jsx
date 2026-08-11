import { Link } from "react-router-dom";

const columns = [
  {
    title: "Organization",
    links: [
      { label: "Research", to: "/research" },
      { label: "Publications", to: "/publications" },
      { label: "Team", to: "/team" },
      { label: "Join Uma Labs", to: "/join" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "GitHub", to: "https://github.com", external: true },
      { label: "Twitter / X", to: "https://twitter.com", external: true },
      { label: "LinkedIn", to: "https://linkedin.com", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="mx-auto max-w-content px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <span className="font-sans text-xl font-semibold tracking-tightest text-white">
              UMA LABS
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-white/40">
              Exploring the frontier of artificial intelligence through
              independent research, open science, and the next generation of
              researchers.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-widest2 text-white/30">
                {col.title}
              </span>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.to}
                        target={link.to.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="link-underline text-sm text-white/50 hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="link-underline text-sm text-white/50 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/30 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Uma Labs. All rights reserved.</span>
          <span className="font-mono">Independent AI Research Organization</span>
        </div>
      </div>
    </footer>
  );
}
