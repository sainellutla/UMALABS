import SEO from "../components/SEO.jsx";
import PageTransition from "../components/PageTransition.jsx";
import Button from "../components/Button.jsx";

export default function NotFound() {
  return (
    <PageTransition>
      <SEO title="Page Not Found" description="This page could not be found." path="/404" />
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="font-mono text-xs uppercase tracking-widest2 text-white/30">
          404
        </span>
        <h1 className="text-4xl font-medium text-white">Page not found.</h1>
        <p className="max-w-sm text-sm text-white/45">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button to="/" variant="secondary" className="mt-2">
          Back to home
        </Button>
      </section>
    </PageTransition>
  );
}
