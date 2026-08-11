import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition.jsx";
import Reveal from "../components/Reveal.jsx";
import Button from "../components/Button.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient.js";

const inputClasses =
  "w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors duration-200 focus:border-white/40 focus:bg-white/[0.04]";

function formatKey(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function NotConfigured() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-widest2 text-white/30">
        Applications
      </span>
      <h1 className="text-2xl font-medium text-white">Not configured yet.</h1>
      <p className="max-w-sm text-sm text-white/45">
        Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment
        to enable the applications dashboard.
      </p>
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setStatus("error");
    } else {
      onLogin();
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <Reveal className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.02] p-8">
        <h1 className="text-xl font-medium text-white">Applications login</h1>
        <p className="mt-2 text-sm text-white/45">
          Sign in to view submitted applications.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-white/40">
              Email
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-white/40">
              Password
            </span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
            />
          </label>

          {status === "error" && (
            <p className="text-sm text-red-400/80">
              Invalid email or password.
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={status === "sending"}
            className="w-full disabled:opacity-50"
          >
            {status === "sending" ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Reveal>
    </div>
  );
}

function ApplicationRow({ application, delay = 0 }) {
  const [open, setOpen] = useState(false);
  const { track, applicant_status, created_at, data } = application;

  return (
    <Reveal
      delay={delay}
      className="rounded-2xl border border-white/10 bg-white/[0.02]"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-col items-start justify-between gap-3 p-6 text-left sm:flex-row sm:items-center"
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-base font-medium text-white">
              {data?.name || "Unnamed applicant"}
            </h3>
            <StatusBadge
              status={track === "internship" ? "Internship" : "Collaboration"}
            />
            {applicant_status && (
              <span className="font-mono text-[11px] uppercase tracking-widest2 text-white/30">
                {applicant_status === "highschool" ? "High School" : "Undergraduate"}
              </span>
            )}
          </div>
          <span className="text-sm text-white/40">
            {data?.email} · {formatDate(created_at)}
          </span>
        </div>
        <span className="text-xs text-white/40">{open ? "Hide details ▲" : "Show details ▼"}</span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden border-t border-white/10 px-6 pb-6"
        >
          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(data ?? {}).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-white/40">
                  {formatKey(key)}
                </dt>
                <dd className="text-sm text-white/70">{value || "—"}</dd>
              </div>
            ))}
          </dl>

          {data?.email && (
            <a
              href={`mailto:${data.email}`}
              className="link-underline mt-6 inline-block text-sm text-white/60 hover:text-white"
            >
              Reply via email →
            </a>
          )}
        </motion.div>
      )}
    </Reveal>
  );
}

export default function Applications() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [applications, setApplications] = useState([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    let cancelled = false;
    supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setLoadError(true);
        } else {
          setApplications(data ?? []);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  if (!isSupabaseConfigured) return <NotConfigured />;

  if (session === undefined) {
    return <div className="min-h-[70vh]" />;
  }

  if (!session) {
    return <LoginForm onLogin={() => {}} />;
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Applications — Uma Labs</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="px-6 pb-28 pt-28 lg:px-10">
        <div className="mx-auto max-w-content">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-xs uppercase tracking-widest2 text-white/40">
                Applications
              </span>
              <h1 className="text-2xl font-medium text-white sm:text-3xl">
                {applications.length} submitted
              </h1>
            </div>
            <Button
              variant="secondary"
              onClick={() => supabase.auth.signOut()}
            >
              Sign out
            </Button>
          </div>

          {loadError && (
            <p className="mt-10 text-sm text-red-400/80">
              Couldn't load applications. Check your Supabase table and
              policies.
            </p>
          )}

          {!loadError && applications.length === 0 && (
            <p className="mt-10 text-sm text-white/40">
              No applications submitted yet.
            </p>
          )}

          <div className="mt-10 flex flex-col gap-4">
            {applications.map((app, i) => (
              <ApplicationRow key={app.id} application={app} delay={i * 0.03} />
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
