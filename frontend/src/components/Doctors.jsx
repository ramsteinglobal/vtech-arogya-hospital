import { useRef } from "react";
import useReveal from "../hooks/useReveal";
import { doctors } from "../data/content";

export default function Doctors() {
  const root = useRef(null);
  useReveal(root);

  return (
    <section id="doctors" ref={root} className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div data-reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-slate-900 md:text-4xl">Meet your specialists</h2>
          <p className="mt-4 leading-7 text-slate-600">
            Sample profiles for this preview. Replace with verified doctor details before publishing.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <article key={doc.name} data-reveal className="group">
              <div className="overflow-hidden rounded-2xl bg-blue-50">
                <img src={doc.image} alt={doc.name} loading="lazy"
                  className="h-80 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">{doc.name}</h3>
                  <p className="mt-1 text-sm text-blue-700">{doc.specialty}</p>
                  <p className="mt-2 text-sm text-slate-500"><span className="font-semibold text-amber-600">★ {doc.rating}</span> · {doc.experience}</p>
                </div>
                <a href="#appointment" className="shrink-0 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-800 hover:bg-blue-800 hover:text-white">
                  Book
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}