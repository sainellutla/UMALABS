import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import Button from "./Button.jsx";

// Hand-placed hexagonal layout (percent of the stage) for up to six research
// area nodes orbiting a central hub. Positions are presentation-only; the
// text content comes from the `researchAreas` prop so it stays in sync with
// src/data/research.js. If that list ever has more/fewer than six entries,
// extra areas are simply not drawn here (they still appear in the grid below).
const HUB = { x: 50, y: 48 };
const NODE_POSITIONS = [
  { x: 18, y: 28 },
  { x: 34, y: 76 },
  { x: 50, y: 14 },
  { x: 66, y: 76 },
  { x: 82, y: 28 },
  { x: 50, y: 84 },
];

const TRACK_HEIGHT_VH = 560;

// Scroll-progress windows (0–1 across the pinned track) during which each
// edge "draws" from the hub out to its node. They overlap slightly so the
// sequence reads as one continuous motion rather than discrete steps.
const EDGE_RANGES = [
  [0.13, 0.27],
  [0.23, 0.37],
  [0.33, 0.47],
  [0.43, 0.57],
  [0.53, 0.67],
  [0.63, 0.77],
];

// The diagram fully fades out before the finale fades in, so the two never
// visually overlap (they used to — this is the fix for that).
const NETWORK_FADE_RANGE = [0.8, 0.9];
const FINALE_RANGE = [0.9, 0.97];

function useIsCompact(breakpoint = 768) {
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < breakpoint);

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isCompact;
}

// Ambient particle drift painted behind the diagram. Reacts gently to scroll
// speed (a "warp" streak when you scroll fast) and pauses via
// IntersectionObserver once the hero has scrolled out of view.
function useParticleField(canvasRef, containerRef, scrollYProgress, active) {
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let raf = null;
    let running = false;
    let lastProgress = scrollYProgress.get();

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 16000);
      particles = Array.from({ length: count }, () => {
        const far = Math.random() > 0.5;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: far ? Math.random() * 0.8 + 0.3 : Math.random() * 1.6 + 0.8,
          vx: (Math.random() - 0.5) * (far ? 0.04 : 0.09),
          vy: (Math.random() - 0.5) * (far ? 0.04 : 0.09),
          a: far ? Math.random() * 0.25 + 0.06 : Math.random() * 0.4 + 0.15,
        };
      });
    };

    const draw = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      const progress = scrollYProgress.get();
      const streamBoost = (progress - lastProgress) * 40;
      lastProgress = progress;

      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy + streamBoost * p.r * 0.4;
        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      resize();
      draw();
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    observer.observe(container);
    window.addEventListener("resize", resize);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [active, canvasRef, containerRef, scrollYProgress]);
}

function NodeMarker({ node, scale, opacity, labelOpacity, labelY }) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ left: `${node.x}%`, top: `${node.y}%`, opacity, scale }}
      className="node-glow-pulse pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
    >
      <motion.span
        style={{ opacity: labelOpacity, y: labelY }}
        className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap font-mono text-xs uppercase tracking-widest2 text-white/70"
      >
        {node.title}
      </motion.span>
    </motion.div>
  );
}

function Stat({ n, label }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="font-sans text-6xl font-semibold tabular-nums tracking-tightest text-white sm:text-8xl">
        {n}
      </span>
      <span className="font-mono text-xs uppercase tracking-widest2 text-white/40">
        {label}
      </span>
    </div>
  );
}

const gridBg = {
  backgroundImage:
    "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

function HeroCopy({ animated = true }) {
  const fadeProps = animated
    ? {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      }
    : {};

  return (
    <div className="relative mx-auto flex w-full max-w-content flex-col gap-8">
      <motion.span
        {...fadeProps}
        className="font-mono text-xs uppercase tracking-widest2 text-white/40"
      >
        Independent AI Research Organization
      </motion.span>

      <motion.h1
        {...fadeProps}
        transition={{ ...fadeProps.transition, delay: animated ? 0.1 : 0 }}
        className="font-sans text-6xl font-semibold leading-[0.95] tracking-tightest text-white sm:text-7xl lg:text-8xl"
        style={{
          textShadow:
            "0 1px 2px rgba(10,10,10,0.9), 0 0 40px rgba(10,10,10,0.75)",
        }}
      >
        UMA LABS
      </motion.h1>

      <motion.p
        {...fadeProps}
        transition={{ ...fadeProps.transition, delay: animated ? 0.2 : 0 }}
        className="text-balance max-w-2xl font-serif text-2xl italic text-white/70 sm:text-3xl"
      >
        Exploring the frontier of artificial intelligence.
      </motion.p>

      <motion.p
        {...fadeProps}
        transition={{ ...fadeProps.transition, delay: animated ? 0.3 : 0 }}
        className="text-balance max-w-xl text-base leading-relaxed text-white/45"
      >
        Uma Labs conducts independent AI research focused on building
        intelligent systems, advancing machine learning, and empowering
        the next generation of researchers.
      </motion.p>

      <motion.div
        {...fadeProps}
        transition={{ ...fadeProps.transition, delay: animated ? 0.4 : 0 }}
        className="flex flex-wrap items-center gap-4 pt-4"
      >
        <Button to="/research" variant="primary">
          Explore Research
        </Button>
        <Button to="/join" variant="secondary">
          Join Uma Labs
        </Button>
      </motion.div>
    </div>
  );
}

// Simple, non-scroll-jacked hero shown when the visitor prefers reduced
// motion or is on a small/touch screen — same content, no pinned canvas.
function StaticHero({ prefersReducedMotion }) {
  return (
    <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden border-b border-white/10 px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={gridBg} />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "radial-gradient(circle, #4c8dff, transparent 70%)" }}
      />
      <HeroCopy animated={!prefersReducedMotion} />
    </section>
  );
}

export default function ScrollHero({ researchAreas = [] }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isCompact = useIsCompact();
  const isStatic = prefersReducedMotion || isCompact;

  const nodes = researchAreas
    .slice(0, NODE_POSITIONS.length)
    .map((area, i) => ({ ...area, ...NODE_POSITIONS[i] }));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useParticleField(canvasRef, containerRef, scrollYProgress, !isStatic);

  // Subtle mouse-parallax tilt on the whole diagram — spring-smoothed so it
  // trails the cursor rather than snapping to it.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 60, damping: 20 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 60, damping: 20 });

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(py * -6);
    tiltY.set(px * 6);
  };
  const handlePointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const introOpacity = useTransform(scrollYProgress, [0, 0.045], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.045], [0, -40]);
  const introScale = useTransform(scrollYProgress, [0, 0.045], [1, 1.06]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.035], [1, 0]);

  const hubOpacity = useTransform(scrollYProgress, [0.05, 0.09], [0, 1]);
  const hubScale = useTransform(scrollYProgress, [0.05, 0.09, 0.13], [0.2, 1.18, 1]);

  // NODE_POSITIONS has a fixed length (6), so calling hooks in these maps is
  // safe — the same number of hooks fire in the same order on every render.
  const edgeProgress = EDGE_RANGES.map((range) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(scrollYProgress, range, [0, 1], { clamp: true })
  );
  const nodeScales = edgeProgress.map((e) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(e, [0.8, 1], [0.5, 1])
  );
  const nodeOpacities = edgeProgress.map((e) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(e, [0.7, 1], [0, 1])
  );
  const labelOpacities = edgeProgress.map((e) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(e, [0.88, 1], [0, 1])
  );
  const labelYs = edgeProgress.map((e) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(e, [0.88, 1], [6, 0])
  );

  const networkOpacity = useTransform(scrollYProgress, NETWORK_FADE_RANGE, [1, 0]);
  const canvasOpacity = useTransform(scrollYProgress, NETWORK_FADE_RANGE, [0.75, 0.04]);

  const finaleOpacity = useTransform(scrollYProgress, FINALE_RANGE, [0, 1]);
  const finaleY = useTransform(scrollYProgress, FINALE_RANGE, [28, 0]);

  if (isStatic) {
    return <StaticHero prefersReducedMotion={prefersReducedMotion} />;
  }

  return (
    <section
      ref={containerRef}
      style={{ height: `${TRACK_HEIGHT_VH}vh` }}
      className="relative border-b border-white/10"
    >
      <div
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        className="sticky top-0 h-screen overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={gridBg} />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "radial-gradient(circle, #4c8dff, transparent 70%)" }}
        />

        <motion.canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ opacity: canvasOpacity }}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        <motion.div
          style={{
            opacity: networkOpacity,
            rotateX: smoothTiltX,
            rotateY: smoothTiltY,
            transformPerspective: 900,
          }}
          className="pointer-events-none absolute inset-0"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {nodes.map((node, i) => (
              <g key={`edge-${node.title}`}>
                <motion.line
                  x1={HUB.x}
                  y1={HUB.y}
                  x2={node.x}
                  y2={node.y}
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth={1.3}
                  strokeLinecap="round"
                  style={{ pathLength: edgeProgress[i] }}
                />
                <motion.line
                  x1={HUB.x}
                  y1={HUB.y}
                  x2={node.x}
                  y2={node.y}
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth={0.22}
                  strokeLinecap="round"
                  style={{ pathLength: edgeProgress[i] }}
                />
              </g>
            ))}
          </svg>

          <div
            aria-hidden="true"
            style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              style={{ opacity: hubOpacity, scale: hubScale }}
              className="animate-spin-slow absolute left-1/2 top-1/2 h-[24vmin] w-[24vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
            />
            <motion.div
              style={{ opacity: hubOpacity, scale: hubScale }}
              className="animate-spin-slow-reverse absolute left-1/2 top-1/2 h-[38vmin] w-[38vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8"
            />
            {/* The one point of color in an otherwise monochrome scene. */}
            <motion.div
              style={{ opacity: hubOpacity, scale: hubScale }}
              className="hub-glow-pulse h-4 w-4 rounded-full bg-accent"
            />
          </div>

          {nodes.map((node, i) => (
            <NodeMarker
              key={`node-${node.title}`}
              node={node}
              scale={nodeScales[i]}
              opacity={nodeOpacities[i]}
              labelOpacity={labelOpacities[i]}
              labelY={labelYs[i]}
            />
          ))}
        </motion.div>

        <div className="pointer-events-none absolute right-6 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-white/10 sm:block lg:right-10">
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="h-full w-full origin-top bg-accent"
          />
        </div>

        <motion.div
          style={{ opacity: introOpacity, y: introY, scale: introScale }}
          className="h-full"
        >
          <div className="flex h-full flex-col justify-center">
            <HeroCopy />
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest2 text-white/30">
            Scroll
          </span>
          <div className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>

        <motion.div
          style={{ opacity: finaleOpacity, y: finaleY }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-widest2 text-white/40">
            Research at Uma Labs
          </span>
          <h2 className="text-balance max-w-3xl font-sans text-4xl font-semibold leading-[1.05] tracking-tightest text-white sm:text-6xl lg:text-7xl">
            One connected pursuit of intelligence.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-20">
            <Stat n={String(nodes.length).padStart(2, "0")} label="Research Domains" />
            <Stat n="∞" label="Open Problems" />
          </div>
          <a
            href="#research-areas"
            className="link-underline pointer-events-auto text-sm text-white/60 hover:text-white"
          >
            Continue exploring ↓
          </a>
        </motion.div>
      </div>
    </section>
  );
}
