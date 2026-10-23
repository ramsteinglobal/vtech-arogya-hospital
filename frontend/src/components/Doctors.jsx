import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";
import { doctors } from "../data/content";

// Optional real photo behind the section, e.g. "/images/hospital-lobby.jpg"
const BG_PHOTO = "/images/BG_PHOTO.jpg";

const PLUS =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M24 18v12M18 24h12' stroke='%231d4ed8' stroke-opacity='.16' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\")";

/* ---------- helpers ---------- */
function useSeen(threshold = 0.2) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setSeen(true);
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setSeen(true), io.disconnect()),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function CountUp({ to, decimals = 0, suffix = "" }) {
  const [ref, seen] = useSeen(0.6);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(to);
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - start) / 1400, 1);
      setN(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{n.toFixed(decimals)}{suffix}</span>;
}

function Stars({ rating }) {
  const pct = Math.max(0, Math.min(5, parseFloat(rating) || 0)) * 20;
  return (
    <span className="relative inline-block whitespace-nowrap text-sm leading-none" aria-label={`Rated ${rating} out of 5`}>
      <span className="text-slate-300" aria-hidden="true">★★★★★</span>
      <span className="absolute left-0 top-0 overflow-hidden text-amber-500" style={{ width: `${pct}%` }} aria-hidden="true">★★★★★</span>
    </span>
  );
}

/* ---------- card ---------- */
function DoctorCard({ doc, i }) {
  const [ref, seen] = useSeen(0.15);
  return (
    <article
      ref={ref}
      className="group"
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : "translateY(28px)",
        transition: "opacity .7s ease, transform .7s ease",
        transitionDelay: `${(i % 3) * 120}ms`,
      }}
    >
      <div className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-slate-200 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-blue-900/10 group-hover:ring-blue-300">
        <div className="relative overflow-hidden rounded-2xl bg-blue-50">
          <img
            src={doc.image}
            alt={doc.name}
            loading="lazy"
            className="h-72 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 sm:h-80"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-amber-600 shadow backdrop-blur">
            ★ {doc.rating}
          </span>
          {/* slide-up panel on hover / keyboard focus */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent p-4 pt-14 transition-transform duration-300 group-focus-within:translate-y-0 group-hover:translate-y-0">
            <p className="text-sm text-blue-100">{doc.experience}</p>
            <Link
              to="/contact#appointment"
              tabIndex={-1}
              className="mt-2 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Book an appointment
            </Link>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 px-2 pb-2 pt-5">
          <div>
            <h3 className="font-display text-xl font-semibold text-slate-900">{doc.name}</h3>
            <p className="mt-1 text-sm font-medium text-blue-700">{doc.specialty}</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Stars rating={doc.rating} /> {doc.experience}
            </p>
          </div>
          <Link
            to="/contact#appointment"
            className="shrink-0 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-800 hover:bg-blue-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ---------- section ---------- */
export default function Doctors() {
  const root = useRef(null);
  useReveal(root);
  const [spec, setSpec] = useState("All");

  const specialties = useMemo(() => ["All", ...new Set(doctors.map((d) => d.specialty))], []);
  const list = spec === "All" ? doctors : doctors.filter((d) => d.specialty === spec);
  const avg = useMemo(() => {
    const r = doctors.map((d) => parseFloat(d.rating)).filter((n) => !isNaN(n));
    return r.length ? Math.round((r.reduce((a, b) => a + b, 0) / r.length) * 10) / 10 : 0;
  }, []);

  const stats = [
    { to: doctors.length, label: "Specialists", decimals: 0 },
    { to: specialties.length - 1, label: "Specialties", decimals: 0 },
    { to: avg, label: "Average rating", decimals: 1 },
  ];

  return (
    <section id="doctors" ref={root} className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white py-16 sm:py-20 lg:py-32">
      <style>{`
        @keyframes doc-ring { from { transform: scale(.35); opacity: .9; } to { transform: scale(1.15); opacity: 0; } }
        @keyframes doc-float { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(20px,-28px,0); } }
        @media (prefers-reduced-motion: reduce) { .doc-anim { animation: none !important; } }
      `}</style>

      {/* ---- background layers ---- */}
      {BG_PHOTO && (
        <img src={BG_PHOTO} alt="" onError={(e) => (e.currentTarget.style.display = "none")} className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: PLUS,
          WebkitMaskImage: "linear-gradient(to bottom, #000, transparent 70%)",
          maskImage: "linear-gradient(to bottom, #000, transparent 70%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[26rem] w-[26rem] sm:h-[34rem] sm:w-[34rem]">
        {[0, 2, 4].map((d) => (
          <span
            key={d}
            className="doc-anim absolute inset-0 rounded-full border-2 border-blue-300/50"
            style={{ animation: "doc-ring 6s ease-out infinite", animationDelay: `${d}s` }}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="doc-anim pointer-events-none absolute -left-20 bottom-20 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl sm:h-80 sm:w-80"
        style={{ animation: "doc-float 16s ease-in-out infinite" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">Meet your specialists</h2>
          <p className="mt-4 leading-7 text-slate-600">
            Sample profiles for this preview. Replace with verified doctor details before publishing.
          </p>
        </div>

        {/* stats */}
        <dl data-reveal className="mt-8 grid max-w-2xl grid-cols-3 gap-3 sm:gap-5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/80 p-4 ring-1 ring-blue-100 backdrop-blur">
              <dt className="font-display text-2xl font-semibold text-blue-800 sm:text-3xl">
                <CountUp to={s.to} decimals={s.decimals} />
              </dt>
              <dd className="mt-1 text-xs text-slate-500 sm:text-sm">{s.label}</dd>
            </div>
          ))}
        </dl>

        {/* filters */}
        <div data-reveal className="mt-10">
          <div role="tablist" aria-label="Filter by specialty" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {specialties.map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={spec === s}
                onClick={() => setSpec(s)}
                className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                  spec === s
                    ? "bg-blue-800 text-white shadow-lg shadow-blue-800/25"
                    : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-blue-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-slate-500" aria-live="polite">
            Showing {list.length} of {doctors.length} doctors
          </p>
        </div>

        {/* grid: key replays the entrance whenever the filter changes */}
        <div key={spec} className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((doc, i) => (
            <DoctorCard key={doc.name} doc={doc} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}