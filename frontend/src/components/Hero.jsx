import { useEffect, useRef } from "react";
import gsap from "gsap";
import HeroScene from "../three/HeroScene";
import { stats } from "../data/content";
import { Link } from "react-router-dom";

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hero]", {
        y: 36, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.2,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  function goTo(e, id) {
    const target = document.getElementById(id);
    if (!target) return; // falls back to normal anchor behaviour
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <section
      id="home"
      ref={root}
      className="relative min-h-[100svh] overflow-hidden pt-20"
    >
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:gap-4 lg:px-8">
        <div className="relative z-10 py-8 text-center sm:py-12 lg:text-left">
          <p
            data-hero
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-800 ring-1 ring-blue-100 sm:text-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Appointments open this week
          </p>

          <h1
            data-hero
            className="font-display mt-5 text-3xl font-semibold leading-[1.15] text-slate-900 sm:mt-6 sm:text-5xl lg:text-6xl"
          >
            Healthcare that listens before it treats.
          </h1>

          <p
            data-hero
            className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0"
          >
            Specialists who take the time to understand you, in a calm, modern setting built around your comfort.
          </p>

          <div
            data-hero
            className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:justify-center sm:gap-4 lg:justify-start"
          >
            <Link
              to="/contact#appointment"
              className="rounded-full bg-blue-800 px-7 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-900/15 transition-colors hover:bg-blue-900"
            >
              Book a consultation
            </Link>
            <Link
              to="/departments"
              className="rounded-full border border-slate-300 px-7 py-3.5 text-center font-semibold text-slate-800 transition-colors hover:border-blue-800 hover:text-blue-800"
            >
              Our departments
            </Link>
          </div>

          <dl
            data-hero
            className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-slate-200 pt-6 sm:mt-12 sm:gap-6 sm:pt-8 lg:mx-0"
          >
            {stats.map((x) => (
              <div key={x.label}>
                <dt className="font-display text-xl font-semibold text-slate-900 sm:text-3xl">{x.value}</dt>
                <dd className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">{x.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroScene className="h-[300px] w-full sm:h-[400px] lg:h-[calc(100svh-5rem)]" />
      </div>
    </section>
  );
}