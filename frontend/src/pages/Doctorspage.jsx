import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Doctors from "../components/Doctors";
import useReveal from "../hooks/useReveal";
import { doctors } from "../data/content";

const HELPDESK_PHONE = "+91 95558 82573";
// Optional real photo behind the trust section, e.g. "/images/consultation.jpg"
const TRUST_PHOTO = "/images/TRUST_PHOTO.jpg";

const promises = [
  { title: "Time to listen", text: "Appointments are planned so your doctor can hear the whole story, not just the main symptom.", icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  { title: "Plain-language answers", text: "We explain your diagnosis and options in simple words and write down the next steps for you.", icon: "M21 12a8 8 0 0 1-11.3 7.3L4 20l1-4.6A8 8 0 1 1 21 12z" },
  { title: "Second opinions welcome", text: "Want another view before a big decision? We will gladly review your reports with you.", icon: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" },
  { title: "Follow-up you can count on", text: "After treatment, your team stays in touch and you know exactly who to call.", icon: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" },
];

function Marquee() {
  const items = useMemo(() => [...new Set(doctors.map((d) => d.specialty))], []);
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden bg-blue-800 py-4 text-white" aria-hidden="true">
      <div className="flex w-max gap-10 hover:[animation-play-state:paused]" style={{ animation: "marquee 32s linear infinite" }}>
        {loop.map((s, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-lg font-medium">
            {s}
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </span>
        ))}
      </div>
    </div>
  );
}

function Trust() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 sm:py-20 lg:py-28">
      {TRUST_PHOTO && <img src={TRUST_PHOTO} alt="" onError={(e) => (e.currentTarget.style.display = "none")} className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30" />}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,.3),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(56,189,248,.18),transparent_50%)]" />
      <div data-reveal className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-xl font-display text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
          What you can expect from every doctor here
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p) => (
            <div key={p.title} className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:bg-white/10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 transition-all duration-300 group-hover:rotate-6 group-hover:bg-blue-500 group-hover:text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={p.icon} /></svg>
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section data-reveal className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-800 to-blue-950 p-8 sm:p-12">
        <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-2 border-white/15" style={{ animation: "cta-ring 7s ease-out infinite" }} />
        <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-2 border-white/15" style={{ animation: "cta-ring 7s ease-out 3.5s infinite" }} />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl md:text-4xl">Not sure which doctor to see?</h2>
          <p className="mt-3 leading-7 text-blue-100">
            Tell our helpdesk what you are feeling and we will match you with the right specialist.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact#appointment" className="rounded-full bg-white px-7 py-3.5 text-center font-semibold text-blue-900 transition hover:-translate-y-0.5 hover:shadow-xl">
              Book an appointment
            </Link>
            <a href={`tel:${HELPDESK_PHONE.replace(/\s/g, "")}`} className="rounded-full border border-white/40 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-white/10">
              Call {HELPDESK_PHONE}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DoctorsPage() {
  const root = useRef(null);
  useReveal(root);

  return (
    <div ref={root}>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes cta-ring { from { transform: scale(.5); opacity: .9; } to { transform: scale(1.6); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>
      <PageHeader title="Meet our doctors" text="Experienced specialists who take the time to listen and explain." />
      <Marquee />
      <Doctors />
      <Trust />
      <Cta />
    </div>
  );
}