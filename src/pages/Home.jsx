import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import PageTransition from "../components/PageTransition.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import Button from "../components/Button.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import ComingSoon from "../components/ComingSoon.jsx";
import ScrollHero from "../components/ScrollHero.jsx";
import {
  researchAreas,
  featuredProjects,
  opportunities,
} from "../data/research.js";

export default function Home() {
  return (
    <PageTransition>
      <SEO
        description="Uma Labs is an independent AI research organization advancing artificial intelligence through fundamental research, open science, and student research opportunities."
        path="/"
      />

      <ScrollHero researchAreas={researchAreas} />

      {/* Research Areas */}
      <section id="research-areas" className="border-b border-white/10 px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-content">
          <SectionHeading
            eyebrow="Research Areas"
            title="Six domains, one pursuit of understanding intelligence."
            description="Our research spans the foundations and applications of artificial intelligence, from core learning theory to systems deployed in the real world."
          />

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {researchAreas.map((area, i) => (
              <Reveal
                key={area.title}
                delay={i * 0.05}
                className="group flex flex-col gap-3 bg-charcoal-950 p-8 transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <span className="font-mono text-xs text-white/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-medium text-white">
                  {area.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/45">
                  {area.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Research */}
      <section className="border-b border-white/10 px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-content">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Featured Research"
              title="Active projects from our research group."
            />
            <Reveal>
              <Link
                to="/research"
                className="link-underline shrink-0 text-sm text-white/60 hover:text-white"
              >
                View all research →
              </Link>
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.title} project={project} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="border-b border-white/10 px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-content">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Publications"
              title="Peer-reviewed and open research."
            />
            <Reveal>
              <Link
                to="/publications"
                className="link-underline shrink-0 text-sm text-white/60 hover:text-white"
              >
                View publications →
              </Link>
            </Reveal>
          </div>

          <Reveal
            delay={0.1}
            className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] px-6"
          >
            <ComingSoon
              title="Coming soon."
              description="Our first publications are currently in preparation."
              note="Preparing first release"
              compact
            />
          </Reveal>
        </div>
      </section>

      {/* Opportunities */}
      <section className="px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-content">
          <SectionHeading
            eyebrow="Opportunities"
            title="Build the future of intelligent systems with us."
            description="Uma Labs welcomes researchers, students, and collaborators at every stage of their journey."
          />

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
            {opportunities.map((op, i) => (
              <Reveal
                key={op.title}
                delay={i * 0.08}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/25"
              >
                <h3 className="text-lg font-medium text-white">{op.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  {op.description}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 flex flex-col items-start gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-medium text-white">
                Ready to contribute to frontier research?
              </h3>
              <p className="text-sm text-white/45">
                Applications for internships are reviewed on a rolling basis.
              </p>
            </div>
            <Button to="/join" variant="primary" className="shrink-0">
              Apply to Uma Labs
            </Button>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
