import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import HeroScene from "../three/HeroScene";
import { stats } from "../data/content";

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    // matchMedia lets us skip the animation for people who prefer reduced motion
    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-hero]", {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.2,
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="home"
      ref={root}
      // svh = stable on mobile browsers (address bar), only force full height when there is room
      className="relative overflow-hidden pt-16 sm:pt-20 lg:min-h-[100svh] [@media(max-height:560px)]:lg:min-h-0"
    >
      <div
        className="
          mx-auto grid w-full max-w-7xl items-center
          gap-2 px-4 pb-10
          sm:gap-4 sm:px-6
          md:gap-6
          lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-0
          lg:min-h-[calc(100svh_-_5rem)] [@media(max-height:560px)]:lg:min-h-0
          xl:gap-10
          2xl:max-w-[96rem] 2xl:gap-14 2xl:px-12
          min-[1920px]:max-w-[110rem] min-[1920px]:px-16
          pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]
        "
      >
        {/* Text column */}
        <div className="relative z-10 min-w-0 py-4 text-center sm:py-8 lg:py-12 lg:text-left [@media(max-height:560px)]:lg:py-8">
          <p
            data-hero
            className="inline-flex max-w-full items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-800 ring-1 ring-blue-100 sm:px-3.5 sm:text-sm"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span className="truncate">Appointments open this week</span>
          </p>

          {/* Fluid type: scales smoothly from 320px phones to 4K screens */}
          <h1
            data-hero
            className="font-display mt-5 text-balance font-semibold leading-[1.12] text-slate-900 sm:mt-6 text-[clamp(1.75rem,1.1rem+3.2vw,2.75rem)] md:text-[clamp(2.5rem,1.6rem+2.4vw,3.5rem)] lg:text-[clamp(2.5rem,1rem+3.2vw,3.75rem)] xl:text-[clamp(3rem,1.2rem+2.6vw,4.25rem)] 2xl:text-[clamp(3.75rem,1.5rem+2.2vw,5rem)]"
          >
            Healthcare that listens before it treats.
          </h1>

          <p
            data-hero
            className="mx-auto mt-5 max-w-md text-pretty text-base leading-7 text-slate-600 sm:mt-6 sm:max-w-xl sm:text-lg sm:leading-8 lg:mx-0 lg:max-w-lg xl:text-xl xl:leading-8 2xl:max-w-xl 2xl:text-xl 2xl:leading-9 min-[1920px]:max-w-2xl min-[1920px]:text-2xl min-[1920px]:leading-10"
          >
            Specialists who take the time to understand you, in a calm, modern setting built around your comfort.
          </p>

          <div
            data-hero
            className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4 lg:justify-start"
          >
            <Link
              to="/contact#appointment"
              className="rounded-full bg-blue-800 px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-900/15 transition-colors hover:bg-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:px-7 min-[1920px]:px-9 min-[1920px]:py-4 min-[1920px]:text-lg"
            >
              Book a consultation
            </Link>
            <Link
              to="/departments"
              className="rounded-full border border-slate-300 px-6 py-3.5 text-center font-semibold text-slate-800 transition-colors hover:border-blue-800 hover:text-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:px-7 min-[1920px]:px-9 min-[1920px]:py-4 min-[1920px]:text-lg"
            >
              Our departments
            </Link>
          </div>

          <dl
            data-hero
            className="mx-auto mt-10 grid max-w-sm grid-cols-3 gap-3 border-t border-slate-200 pt-6 min-[380px]:gap-4 sm:mt-12 sm:max-w-md sm:gap-6 sm:pt-8 lg:mx-0 2xl:max-w-xl min-[1920px]:max-w-2xl [@media(max-height:560px)]:mt-6 [@media(max-height:560px)]:pt-4"
          >
            {stats.map((x) => (
              <div key={x.label} className="min-w-0">
                <dt className="font-display text-xl font-semibold text-slate-900 sm:text-3xl 2xl:text-4xl min-[1920px]:text-5xl">
                  {x.value}
                </dt>
                <dd className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm min-[1920px]:text-base">
                  {x.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 3D scene: height follows viewport width on phones/tablets, viewport height on desktop */}
        <HeroScene
          className="
            mx-auto w-full max-w-xl
            h-[clamp(240px,72vw,420px)]
            sm:h-[clamp(340px,60vw,460px)]
            md:max-w-2xl md:h-[clamp(400px,52vw,520px)]
            lg:mx-0 lg:max-w-none
            lg:h-[clamp(420px,calc(100svh_-_5rem),780px)]
            [@media(max-height:560px)]:lg:h-[420px]
            min-[1920px]:max-h-[900px] min-[1920px]:h-[clamp(560px,calc(100svh_-_5rem),900px)]
          "
        />
      </div>
    </section>
  );
}