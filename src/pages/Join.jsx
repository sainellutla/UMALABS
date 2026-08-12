import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO.jsx";
import PageTransition from "../components/PageTransition.jsx";
import PageHero from "../components/PageHero.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import Reveal from "../components/Reveal.jsx";
import Button from "../components/Button.jsx";

// Research Internship applications go straight to a Google Form
// (`applyHref`) instead of the in-page modal below. External Collaboration
// still uses the modal + Supabase, unchanged.
const RESEARCH_INTERNSHIP_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdXR3X3Sp2m4i1lzwQnZnaxmyA5YGRPfqcivFBnyAlA05GVsQ/viewform";

const tracks = [
  {
    id: "internship",
    title: "Research Internship",
    description:
      "Designed primarily for high school students, though undergraduates are welcome to apply as well. Interns work directly with Uma Labs researchers on active projects in reasoning, vision, and alignment.",
    applyHref: RESEARCH_INTERNSHIP_FORM_URL,
  },
  {
    id: "collaboration",
    title: "External Collaboration",
    duration: "Ongoing",
    description:
      "For university labs, independent researchers, and institutions interested in joint research or co-authored publications.",
    fields: [
      { name: "name", label: "Full name", type: "text", placeholder: "Dr. Jane Doe", required: true },
      { name: "email", label: "Email", type: "email", placeholder: "you@institution.edu", required: true },
      { name: "institution", label: "Institution / Organization", type: "text", placeholder: "MIT CSAIL", required: true },
      { name: "links", label: "Website / Lab page", type: "text", placeholder: "https://" },
      {
        name: "message",
        label: "Proposed collaboration",
        type: "textarea",
        placeholder: "Describe the project or partnership you have in mind.",
      },
    ],
  },
];

const qualities = [
  "Genuine curiosity about how intelligent systems work",
  "Willingness to ask questions and learn by working through hard problems",
  "Follow-through — showing up consistently and finishing what you start",
  "Honesty and integrity in how you approach your work",
  "Openness to feedback and collaborating with others",
  "No prior research experience required — curiosity matters more than credentials",
];

const steps = [
  { label: "Application", detail: "Submit your background, interests, and CV." },
  { label: "Review", detail: "Our research team reviews applications on a rolling basis." },
  { label: "Interview", detail: "A conversation about your interests and potential projects." },
  { label: "Onboarding", detail: "Get matched with a mentor and a research track." },
];

export default function Join() {
  const [activeTrackId, setActiveTrackId] = useState(null);
  const activeTrack = tracks.find((t) => t.id === activeTrackId) ?? null;

  return (
    <PageTransition>
      <SEO
        title="Join Uma Labs"
        description="Apply to Uma Labs' research internships for high school and undergraduate students, and our external collaboration program."
        path="/join"
      />

      <PageHero
        eyebrow="Join Uma Labs"
        title="Contribute to independent AI research."
        description="We welcome applications from high school students, undergraduate researchers, and collaborators who want to work on open problems in artificial intelligence."
      />

      {/* Tracks */}
      <section className="border-b border-white/10 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-content">
          <SectionHeading compact eyebrow="Opportunities" title="Ways to work with us." />
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {tracks.map((track, i) => (
              <Reveal
                key={track.id}
                delay={i * 0.08}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/25"
              >
                {track.duration && (
                  <span className="font-mono text-xs uppercase tracking-widest2 text-white/30">
                    {track.duration}
                  </span>
                )}
                <h3 className="text-lg font-medium text-white">{track.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  {track.description}
                </p>
                {track.applyHref ? (
                  <Button
                    variant="secondary"
                    href={track.applyHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto w-full"
                  >
                    Apply
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => setActiveTrackId(track.id)}
                    className="mt-auto w-full"
                  >
                    Apply
                  </Button>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Qualities + Process */}
      <section className="px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading compact eyebrow="What We Value" title="What we look for." />
            <ul className="mt-10 flex flex-col gap-4">
              {qualities.map((quality, i) => (
                <Reveal
                  key={quality}
                  delay={i * 0.05}
                  className="flex items-start gap-3 text-sm leading-relaxed text-white/55"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                  {quality}
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading compact eyebrow="Process" title="How applications work." />
            <div className="mt-10 flex flex-col">
              {steps.map((step, i) => (
                <Reveal
                  key={step.label}
                  delay={i * 0.06}
                  className="flex gap-5 border-b border-white/10 py-6 last:border-b-0"
                >
                  <span className="font-mono text-sm text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-medium text-white">
                      {step.label}
                    </h4>
                    <p className="text-sm text-white/45">{step.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeTrack && (
          <ApplicationModal
            track={activeTrack}
            onClose={() => setActiveTrackId(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

const inputClasses =
  "w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors duration-200 focus:border-white/40 focus:bg-white/[0.04]";

function Field({ label, children, span }) {
  return (
    <label className={`flex flex-col gap-2 ${span ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium uppercase tracking-wide text-white/40">
        {label}
      </span>
      {children}
    </label>
  );
}

function ApplicationModal({ track, onClose }) {
  const [form, setForm] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | sending | success | error

  const fields = track.fields;

  useEffect(() => {
    if (!fields) return;
    setForm(
      Object.fromEntries(
        fields.map((f) => [f.name, f.type === "select" ? f.options[0] : ""])
      )
    );
  }, [fields]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("sending");

    const { supabase, isSupabaseConfigured } = await import(
      "../lib/supabaseClient.js"
    );

    if (!isSupabaseConfigured) {
      setSubmitStatus("error");
      return;
    }

    const { error } = await supabase.from("applications").insert({
      track: track.id,
      applicant_status: null,
      data: form,
    });
    setSubmitStatus(error ? "error" : "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-10 backdrop-blur-sm sm:items-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-charcoal-900 p-6 shadow-2xl shadow-black/50 sm:p-10"
      >
        <button
          onClick={onClose}
          aria-label="Close application form"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors duration-200 hover:bg-white/5 hover:text-white"
        >
          ✕
        </button>

        {submitStatus === "success" ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20"
            >
              <span className="text-xl">✓</span>
            </motion.div>
            <h3 className="text-xl font-medium text-white">
              Application received.
            </h3>
            <p className="max-w-sm text-sm text-white/45">
              Thank you{form.name ? `, ${form.name}` : ""}. We review{" "}
              {track.title.toLowerCase()} applications on a rolling basis and
              will follow up at {form.email || "the email you provided"} if
              there's a fit.
            </p>
            <Button variant="secondary" onClick={onClose} className="mt-2">
              Done
            </Button>
          </div>
        ) : (
          <>
            <span className="font-mono text-xs uppercase tracking-widest2 text-white/40">
              {track.duration}
            </span>
            <h3 className="mt-3 text-2xl font-medium text-white">
              Apply — {track.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/45">
              {track.description}
            </p>

            {fields && (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {fields.map((field) => (
                    <Field
                      key={field.name}
                      label={field.label}
                      span={field.type === "textarea"}
                    >
                      {field.type === "textarea" ? (
                        <textarea
                          name={field.name}
                          value={form[field.name] ?? ""}
                          onChange={handleChange}
                          rows={4}
                          placeholder={field.placeholder}
                          className={`${inputClasses} resize-none`}
                        />
                      ) : field.type === "select" ? (
                        <select
                          name={field.name}
                          value={form[field.name] ?? ""}
                          onChange={handleChange}
                          className={inputClasses}
                        >
                          {field.options.map((opt) => (
                            <option key={opt} value={opt} className="bg-charcoal-900">
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          required={field.required}
                          value={form[field.name] ?? ""}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className={inputClasses}
                        />
                      )}
                    </Field>
                  ))}
                </div>

                {submitStatus === "error" && (
                  <p className="text-sm text-red-400/80">
                    Something went wrong submitting your application. Please
                    try again in a moment.
                  </p>
                )}

                <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                  <p className="text-xs text-white/30">
                    By submitting, you agree to be contacted about your
                    application.
                  </p>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitStatus === "sending"}
                    className="w-full disabled:opacity-50 sm:w-auto"
                  >
                    {submitStatus === "sending" ? "Submitting…" : "Submit Application"}
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
