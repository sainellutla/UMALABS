import SEO from "../components/SEO.jsx";
import PageTransition from "../components/PageTransition.jsx";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import ComingSoon from "../components/ComingSoon.jsx";
import Button from "../components/Button.jsx";

export default function Publications() {
  return (
    <PageTransition>
      <SEO
        title="Publications"
        description="Uma Labs' publication record is in preparation. Check back soon for our first peer-reviewed papers and preprints."
        path="/publications"
      />

      <PageHero
        eyebrow="Publications"
        title="Our published and ongoing research."
        description="A record of Uma Labs' contributions to the field, from peer-reviewed conference papers to workshop submissions."
      />

      <section className="px-6 pb-28 lg:px-10">
        <div className="mx-auto max-w-content">
          <Reveal className="rounded-2xl border border-white/10 bg-white/[0.02] px-6">
            <ComingSoon
              title="Coming soon."
              description="Our research group is actively working toward its first publications. This page will host peer-reviewed papers, preprints, and technical reports as they're released."
              note="Preparing first release"
              compact
            />
          </Reveal>

          <Reveal
            delay={0.1}
            className="mt-10 flex flex-col items-center gap-2 text-center"
          >
            <p className="text-sm text-white/40">
              In the meantime, see what our research group is working on.
            </p>
            <Button to="/research" variant="secondary" className="mt-3">
              Explore Research
            </Button>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
