import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
    <section
      id="home"
      ref={root}
      className="relative overflow-hidden pt-20 lg:min-h-[100svh]"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-4 px-4 pb-10 sm:px-6 md:gap-6 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2 lg:gap-6 lg:px-8 lg:pb-0 2xl:max-w-[96rem] 2xl:gap-12 2xl:px-12">

        {/* Text column */}
        <div className="relative z-10 py-6 text-center sm:py-10 lg:py-12 lg:text-left">
          <p
            data-hero
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-800 ring-1 ring-blue-100 sm:px-3.5 sm:text-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Appointments open this week
          </p>

          <h1
            data-hero
            className="font-display mt-5 text-[1.75rem] font-semibold leading-[1.15] text-slate-900 min-[380px]:text-3xl sm:mt-6 sm:text-5xl md:text-[3.25rem] lg:text-5xl xl:text-6xl 2xl:text-7xl"
          >
            Healthcare that listens before it treats.
          </h1>

          <p
            data-hero
            className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-600 sm:mt-6 sm:max-w-xl sm:text-lg sm:leading-8 lg:mx-0 lg:max-w-lg 2xl:max-w-xl 2xl:text-xl 2xl:leading-9"
          >
            Specialists who take the time to understand you, in a calm, modern setting built around your comfort.
          </p>

          <div
            data-hero
            className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4 lg:justify-start"
          >
            <Link
              to="/contact#appointment"
              className="rounded-full bg-blue-800 px-7 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-900/15 transition-colors hover:bg-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Book a consultation
            </Link>
            <Link
              to="/departments"
              className="rounded-full border border-slate-300 px-7 py-3.5 text-center font-semibold text-slate-800 transition-colors hover:border-blue-800 hover:text-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
            >
              Our departments
            </Link>
          </div>

          <dl
            data-hero
            className="mx-auto mt-10 grid max-w-sm grid-cols-3 gap-3 border-t border-slate-200 pt-6 min-[380px]:gap-4 sm:mt-12 sm:max-w-md sm:gap-6 sm:pt-8 lg:mx-0 2xl:max-w-xl"
          >
            {stats.map((x) => (
              <div key={x.label}>
                <dt className="font-display text-xl font-semibold text-slate-900 sm:text-3xl 2xl:text-4xl">{x.value}</dt>
                <dd className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">{x.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 3D scene */}
        <HeroScene className="mx-auto h-[280px] w-full max-w-xl min-[380px]:h-[320px] sm:h-[400px] md:h-[460px] md:max-w-2xl lg:mx-0 lg:h-[calc(100svh-5rem)] lg:max-h-[780px] lg:max-w-none" />
      </div>
    </section>
  );
}