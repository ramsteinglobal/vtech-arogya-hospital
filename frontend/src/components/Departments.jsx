import { useRef } from "react";
import useReveal from "../hooks/useReveal";
import { departments } from "../data/content";

export default function Departments() {
  const root = useRef(null);
  useReveal(root);

  return (
    <section id="departments" ref={root} className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-12">
        <div data-reveal className="lg:col-span-4">
          <h2 className="font-display text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            Specialised care, all in one place
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Choose a department to see how we can help, then book directly with the team.
          </p>
        </div>

        <ul className="divide-y divide-slate-200 border-y border-slate-200 lg:col-span-8">
          {departments.map((d) => (
            <li key={d.name} data-reveal>
              <a href="#appointment" className="group grid items-center gap-2 px-2 py-7 transition-colors hover:bg-white sm:grid-cols-12 sm:gap-6 sm:px-5">
                <div className="sm:col-span-4">
                  <h3 className="font-display text-2xl font-semibold text-slate-900 transition-colors group-hover:text-teal-800">{d.name}</h3>
                  <p className="mt-1 text-sm font-medium text-teal-700">{d.tag}</p>
                </div>
                <p className="text-slate-600 sm:col-span-7">{d.desc}</p>
                <span className="hidden justify-self-end text-xl text-teal-800 transition-transform group-hover:translate-x-1 sm:col-span-1 sm:block" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}