import { useEffect, useRef } from "react";
import gsap from "gsap";
import HeroScene from "../three/HeroScene";
import { stats } from "../data/content";

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

  return (
    <section id="home" ref={root} className="relative min-h-screen overflow-hidden pt-20">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-4 px-5 lg:grid-cols-2 lg:px-8">
        <div className="relative z-10 py-12">
          <p data-hero className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-sm font-medium text-blue-800 ring-1 ring-blue-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Appointments open this week
          </p>
          <h1 data-hero className="font-display mt-6 text-4xl font-semibold leading-[1.1] text-slate-900 sm:text-5xl lg:text-6xl">
            Healthcare that listens before it treats.
          </h1>
          <p data-hero className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Specialists who take the time to understand you, in a calm, modern setting built around your comfort.
          </p>
          <div data-hero className="mt-9 flex flex-wrap gap-4">
            <a href="#appointment" className="rounded-full bg-blue-800 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/15 transition-colors hover:bg-blue-900">
              Book a consultation
            </a>
            <a href="#departments" className="rounded-full border border-slate-300 px-7 py-3.5 font-semibold text-slate-800 transition-colors hover:border-blue-800 hover:text-blue-800">
              Our departments
            </a>
          </div>
          <dl data-hero className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-slate-200 pt-8">
            {stats.map((x) => (
              <div key={x.label}>
                <dt className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">{x.value}</dt>
                <dd className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">{x.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroScene className="h-[420px] w-full lg:h-[calc(100vh-5rem)]" />
      </div>
    </section>
  );
}