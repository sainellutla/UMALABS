import SEO from "../components/SEO.jsx";
import PageTransition from "../components/PageTransition.jsx";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import Button from "../components/Button.jsx";
import {
  featuredProjects,
  researchThemes,
  technicalInterests,
  futureDirections,
} from "../data/research.js";

export default function Research() {
  return (
    <PageTransition>
      <SEO
        title="Research"
        description="Explore Uma Labs' current research projects, themes, and technical interests spanning reasoning, alignment, vision, and autonomous systems."
        path="/research"
      />

      <PageHero
        eyebrow="Research"
        title="Fundamental research toward capable, trustworthy AI."
        description="Our research group works across the stack — from learning theory to deployed systems — with a focus on reasoning, safety, and efficiency."
      />

      {/* Current Projects */}
      <section className="border-b border-white/10 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-content">
          <SectionHeading compact eyebrow="Current Projects" title="What we're working on now." />
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.title} project={project} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* Research Themes */}
      <section className="border-b border-white/10 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-content">
          <SectionHeading
            compact
            eyebrow="Research Themes"
            title="The questions guiding our work."
          />
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {researchThemes.map((theme, i) => (
              <Reveal
                key={theme.title}
                delay={i * 0.06}
                className="flex flex-col gap-3 bg-charcoal-950 p-9 transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <h3 className="text-lg font-medium text-white">{theme.title}</h3>
                <p className="text-sm leading-relaxed text-white/45">
                  {theme.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Interests */}
      <section className="border-b border-white/10 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-content">
          <SectionHeading
            compact
            eyebrow="Technical Interests"
            title="Areas we actively explore."
          />
          <div className="mt-12 flex flex-wrap gap-3">
            {technicalInterests.map((interest, i) => (
              <Reveal
                key={interest}
                delay={i * 0.03}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/60 transition-colors duration-300 hover:border-white/40 hover:text-white"
              >
                {interest}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Future Directions */}
      <section className="border-b border-white/10 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-content">
          <SectionHeading
            compact
            eyebrow="Future Directions"
            title="Where we're headed next."
          />
          <div className="mt-14 flex flex-col">
            {futureDirections.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 0.08}
                className="flex flex-col gap-3 border-b border-white/10 py-8 last:border-b-0 sm:flex-row sm:gap-10"
              >
                <span className="shrink-0 font-mono text-sm text-white/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-white">{item.title}</h3>
                  <p className="max-w-xl text-sm leading-relaxed text-white/45">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-10">
        <Reveal className="mx-auto flex max-w-content flex-col items-start gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-medium text-white">
              Interested in collaborating on research?
            </h3>
            <p className="text-sm text-white/45">
              We partner with university labs and independent researchers on
              joint projects and publications.
            </p>
          </div>
          <Button to="/join" variant="primary" className="shrink-0">
            Get in touch
          </Button>
        </Reveal>
      </section>
    </PageTransition>
  );
}
