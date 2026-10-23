import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";
import { departments } from "../data/content";

/* Edit these to match your hospital / clinic */
const stats = [
  { value: 24, suffix: "/7", label: "Emergency care" },
  { value: 40, suffix: "+", label: "Specialist doctors" },
  { value: 15, suffix: " min", label: "Average wait to see a nurse" },
];

/* Counts up once when scrolled into view */
function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setN(to);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1400;
        const tick = (t) => {
          const p = Math.min((t - start) / dur, 1);
          setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); // ease-out
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export default function Departments() {
  const root = useRef(null);
  useReveal(root);

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter((d) =>
      `${d.name} ${d.tag} ${d.desc}`.toLowerCase().includes(q)
    );
  }, [query]);

  /* Spotlight glow follows the cursor inside each row */
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      id="departments"
      ref={root}
      className="relative mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-32"
    >
      <style>{`
        @keyframes dept-float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(24px, -30px, 0) scale(1.08); }
        }
        @keyframes dept-pulse {
          0% { box-shadow: 0 0 0 0 rgba(13, 148, 136, .55); }
          70%, 100% { box-shadow: 0 0 0 10px rgba(13, 148, 136, 0); }
        }
        @keyframes dept-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dept-row { --mx: 50%; --my: 50%; }
        .dept-row::before {
          content: "";
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0; transition: opacity .35s ease;
          background: radial-gradient(360px circle at var(--mx) var(--my), rgba(20, 184, 166, .14), transparent 65%);
        }
        .dept-row:hover::before, .dept-row:focus-within::before { opacity: 1; }
        .dept-item { animation: dept-in .45s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .dept-blob, .dept-live, .dept-item { animation: none !important; }
          .dept-row *, .dept-row::before { transition: none !important; }
        }
      `}</style>

      {/* soft drifting background glow */}
      <div
        aria-hidden="true"
        className="dept-blob pointer-events-none absolute -left-24 top-10 h-48 w-48 rounded-full sm:h-72 sm:w-72 bg-teal-200/40 blur-3xl"
        style={{ animation: "dept-float 14s ease-in-out infinite" }}
      />
      <div
        aria-hidden="true"
        className="dept-blob pointer-events-none absolute -right-20 bottom-10 h-52 w-52 rounded-full sm:h-80 sm:w-80 bg-sky-200/40 blur-3xl"
        style={{ animation: "dept-float 18s ease-in-out infinite reverse" }}
      />

      <div className="relative grid gap-8 sm:gap-10 lg:grid-cols-12">
        {/* Left column */}
        <div data-reveal className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <p className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 ring-1 ring-teal-200">
            <span
              className="dept-live h-2 w-2 rounded-full bg-teal-600"
              style={{ animation: "dept-pulse 1.8s ease-out infinite" }}
            />
            Open now. Walk-ins welcome
          </p>

          <h2 className="mt-5 font-display text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
            Specialised care, all in one place
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Choose a department to see how we can help, then book directly with the team.
          </p>

          {/* Search */}
          <label className="relative mt-7 block">
            <span className="sr-only">Search departments</span>
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. heart, skin, children"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </label>
          <p className="mt-2 text-sm text-slate-500" aria-live="polite">
            Showing {list.length} of {departments.length} departments
          </p>

          {/* Stats */}
          <dl className="mt-8 grid grid-cols-3 gap-3 sm:mt-9 sm:gap-4 border-t border-slate-200 pt-7">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-xl font-semibold text-teal-800 sm:text-2xl md:text-3xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dt>
                <dd className="mt-1 text-xs leading-5 text-slate-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right column */}
        <div className="lg:col-span-8">
          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
              <p className="font-display text-xl font-semibold text-slate-900">
                No department matches “{query}”
              </p>
              <p className="mt-2 text-slate-600">
                Try a different word, or call us and we will point you to the right team.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-5 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800"
              >
                Show all departments
              </button>
            </div>
          ) : (
            <ul
              key={query /* replay the entrance when results change */}
              className="divide-y divide-slate-200 border-y border-slate-200"
              onMouseLeave={() => setActive(null)}
            >
              {list.map((d, i) => {
                const open = active === d.name;
                return (
                  <li
                    key={d.name}
                    className="dept-item"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <Link
                      to="/contact#appointment"
                      onMouseEnter={() => setActive(d.name)}
                      onFocus={() => setActive(d.name)}
                      onBlur={() => setActive(null)}
                      onMouseMove={onMove}
                      className="dept-row group relative block overflow-hidden px-3 py-6 sm:px-5 sm:py-7"
                    >
                      {/* sliding accent bar */}
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 top-0 h-full w-1 origin-top bg-teal-600 transition-transform duration-300 ${
                          open ? "scale-y-100" : "scale-y-0"
                        }`}
                      />

                      <div className="relative grid items-center gap-2 sm:grid-cols-12 sm:gap-6">
                        <div className="sm:col-span-4">
                          <h3
                            className={`font-display text-xl font-semibold transition-all duration-300 sm:text-2xl ${
                              open ? "sm:translate-x-2 text-teal-800" : "text-slate-900"
                            }`}
                          >
                            {d.name}
                          </h3>
                          <p className="mt-1 text-sm font-medium text-teal-700">{d.tag}</p>
                        </div>
                        <p className="text-slate-600 sm:col-span-7">{d.desc}</p>

                        <span
                          aria-hidden="true"
                          className={`hidden h-10 w-10 items-center justify-center justify-self-end rounded-full border text-lg transition-all duration-300 sm:col-span-1 sm:flex ${
                            open
                              ? "translate-x-1 border-teal-700 bg-teal-700 text-white"
                              : "border-slate-200 text-teal-800"
                          }`}
                        >
                          →
                        </span>
                      </div>

                      {/* expands on hover or keyboard focus */}
                      <div
                        className={`relative grid transition-all duration-300 ease-out ${
                          open
                            ? "mt-4 grid-rows-[1fr] opacity-100 sm:mt-5"
                            : "mt-4 grid-rows-[1fr] opacity-100 sm:mt-0 sm:grid-rows-[0fr] sm:opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:pl-2">
                            <span className="inline-flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                              Same-week appointments
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                              Free first consultation call
                            </span>
                            <span className="font-medium text-teal-800">
                              Book with {d.name} →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* bottom call to action */}
          <div
            data-reveal
            className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl bg-slate-900 p-6 sm:flex-row sm:p-7 sm:items-center"
          >
            <div>
              <p className="font-display text-lg font-semibold text-white sm:text-xl">
                Not sure which department you need?
              </p>
              <p className="mt-1 text-slate-300">
                Tell us your symptoms and our team will guide you to the right specialist.
              </p>
            </div>
            <Link
              to="/contact#appointment"
              className="w-full shrink-0 rounded-full bg-teal-500 px-6 py-3 text-center sm:w-auto text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}