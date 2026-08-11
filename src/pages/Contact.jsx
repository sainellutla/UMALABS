import { useState } from "react";
import { motion } from "framer-motion";
import SEO from "../components/SEO.jsx";
import PageTransition from "../components/PageTransition.jsx";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import Button from "../components/Button.jsx";

const FORM_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

const reasons = [
  "General Inquiry",
  "Research Collaboration",
  "Press / Media",
  "Other",
];

const initialForm = {
  name: "",
  email: "",
  reason: reasons[0],
  message: "",
};

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

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!FORM_ENDPOINT) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <PageTransition>
      <SEO
        title="Contact"
        description="Get in touch with Uma Labs about research collaborations, press inquiries, or general questions."
        path="/contact"
      />

      <PageHero
        eyebrow="Contact"
        title="Get in touch."
        description="Questions about our research, potential collaborations, or press inquiries — we'd love to hear from you."
      />

      <section className="px-6 pb-28 lg:px-10">
        <div className="mx-auto max-w-2xl">
          <Reveal className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-10">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-16 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20">
                  <span className="text-xl">✓</span>
                </div>
                <h3 className="text-xl font-medium text-white">
                  Message sent.
                </h3>
                <p className="max-w-md text-sm text-white/45">
                  Thank you{form.name ? `, ${form.name}` : ""}. We'll get back
                  to you at {form.email || "the email you provided"} as soon
                  as we can.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setForm(initialForm);
                    setStatus("idle");
                  }}
                  className="mt-2"
                >
                  Send another message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Field label="Full name">
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ada Lovelace"
                      className={inputClasses}
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClasses}
                    />
                  </Field>
                </div>

                <Field label="Reason for contact">
                  <select
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    {reasons.map((r) => (
                      <option key={r} value={r} className="bg-charcoal-900">
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Message">
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="How can we help?"
                    className={`${inputClasses} resize-none`}
                  />
                </Field>

                {status === "error" && (
                  <p className="text-sm text-red-400/80">
                    Something went wrong sending your message. Please try
                    again in a moment.
                  </p>
                )}

                <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                  <p className="text-xs text-white/30">
                    We typically respond within a few business days.
                  </p>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={status === "sending"}
                    className="w-full disabled:opacity-50 sm:w-auto"
                  >
                    {status === "sending" ? "Sending…" : "Send Message"}
                  </Button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
