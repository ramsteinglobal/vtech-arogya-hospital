import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageHeader({ title, text }) {
  const root = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-ph]", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="border-b border-slate-200 bg-white pb-16 pt-36">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <h1 data-ph className="font-display max-w-3xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">{title}</h1>
        <p data-ph className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{text}</p>
      </div>
    </section>
  );
}