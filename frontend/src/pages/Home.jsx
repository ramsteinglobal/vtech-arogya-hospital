import { useRef } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Emergency from "../components/Emergency";
import useReveal from "../hooks/useReveal";

const cards = [
  { to: "/departments", title: "Departments", text: "Cardiology, Neurology, Orthopedics and Oncology." },
  { to: "/doctors", title: "Our doctors", text: "Meet the specialists and see their experience." },
  { to: "/contact", title: "Book a visit", text: "Request an appointment in under a minute." },
];

export default function Home() {
  const root = useRef(null);
  useReveal(root);

  return (
    <>
      <Hero />
      <section ref={root} className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-28">
        <h2 data-reveal className="font-display text-3xl font-semibold text-slate-900 md:text-4xl">Where would you like to go?</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <Link key={c.to} to={c.to} data-reveal className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5">
              <h3 className="font-display text-2xl font-semibold text-slate-900 transition-colors group-hover:text-blue-800">{c.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{c.text}</p>
              <span className="mt-6 inline-block font-semibold text-blue-800 transition-transform group-hover:translate-x-1">Open →</span>
            </Link>
          ))}
        </div>
      </section>
      <div className="pb-24"><Emergency /></div>
    </>
  );
}