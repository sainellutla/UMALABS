import SEO from "../components/SEO.jsx";
import PageTransition from "../components/PageTransition.jsx";
import PageHero from "../components/PageHero.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import PersonCard from "../components/PersonCard.jsx";
import Reveal from "../components/Reveal.jsx";
import Button from "../components/Button.jsx";
import { founders, interns } from "../data/team.js";

export default function Team() {
  return (
    <PageTransition>
      <SEO
        title="Team"
        description="Uma Labs is currently led by its founder, Sai Nellutla, joined by our first research intern. Our team is growing."
        path="/team"
      />

      <PageHero
        eyebrow="Team"
        title="The people behind Uma Labs' research."
        description="Uma Labs is an early-stage research organization, currently led by its founder and joined by our first research intern, with more of the team on the way."
      />

      <section className="border-b border-white/10 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-content">
          <SectionHeading compact eyebrow="Founder" title="Leadership" />
          <div className="mt-14 grid max-w-sm grid-cols-1 gap-6">
            {founders.map((person, i) => (
              <PersonCard key={person.name} person={person} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-content">
          <SectionHeading
            compact
            eyebrow="Research Team & Interns"
            title="Growing the lab."
          />
          <div className="mt-14 grid max-w-sm grid-cols-1 gap-6">
            {interns.map((person, i) => (
              <PersonCard key={person.name} person={person} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-10">
        <Reveal className="mx-auto flex max-w-content flex-col items-start gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-medium text-white">
              Want to join the team?
            </h3>
            <p className="text-sm text-white/45">
              We're always looking for driven researchers and students to
              collaborate with.
            </p>
          </div>
          <Button to="/join" variant="primary" className="shrink-0">
            View Opportunities
          </Button>
        </Reveal>
      </section>
    </PageTransition>
  );
}
