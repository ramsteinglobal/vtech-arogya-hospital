import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Departments from "../components/Departments";
import useReveal from "../hooks/useReveal";

/* ---------- Edit this content to match your hospital ---------- */
const EMERGENCY_PHONE = "+91 9555882573"; // replace with your real 24/7 line
// Optional real photo for the equipment section, e.g. "/images/hospital-corridor.jpg"
const FACILITIES_PHOTO = "";

const journey = [
  { title: "Book a visit", text: "Pick a department and a time that suits you, online or by phone." },
  { title: "Get assessed", text: "Your specialist reviews your history, tests and symptoms in one sitting." },
  { title: "Agree a plan", text: "Teams from different departments meet so your plan covers everything." },
  { title: "Stay supported", text: "Follow-up visits and a named nurse you can call with questions." },
];

const areas = [
  {
    id: "Heart",
    conditions: ["Coronary artery disease", "Heart failure", "Irregular heartbeat", "Valve problems"],
    care: "Tests such as ECG and echo are done on the same day, so most people leave their first visit with a clear next step.",
  },
  {
    id: "Brain",
    conditions: ["Stroke recovery", "Epilepsy", "Migraine", "Parkinson’s disease"],
    care: "Neurologists, therapists and nurses plan together, with rehabilitation starting as early as it safely can.",
  },
  {
    id: "Bones",
    conditions: ["Joint replacement", "Fractures", "Sports injuries", "Back and spine pain"],
    care: "Surgeons and physiotherapists agree your recovery goals before any procedure, so you know what to expect.",
  },
  {
    id: "Cancer",
    conditions: ["Breast cancer", "Lung cancer", "Blood cancers", "Cancer screening"],
    care: "Every case is reviewed by a panel of specialists, then you meet one team that stays with you through treatment.",
  },
];

const facilities = [
  { name: "Cardiac cath lab", text: "Look inside the heart and treat blocked arteries in a single procedure." },
  { name: "3T MRI scanner", text: "Detailed brain and joint images, with shorter scan times." },
  { name: "Robotic-assisted surgery", text: "Smaller cuts and more precise implant placement for bones and joints." },
  { name: "Radiotherapy suite", text: "Targeted cancer treatment that protects the healthy tissue around it." },
];

const faqs = [
  { q: "Do I need a referral to book?", a: "No. You can book directly with any department. If your GP has already written a letter, bring it along." },
  { q: "Can I see more than one specialist on the same day?", a: "Often yes. Tell us when you book and we will try to line up your appointments back to back." },
  { q: "What should I bring to my first visit?", a: "Photo ID, your current medicines, and any recent reports, scans or test results." },
  { q: "Do you work with health insurance?", a: "We work with most major insurers. Share your policy details when booking and we will confirm cover before your visit." },
];

/* ---------- Small helpers ---------- */
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setSeen(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

/* ---------- Background decorations ---------- */
const PLUS =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M24 18v12M18 24h12' stroke='%230d9488' stroke-opacity='.22' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\")";

/* Faint medical-cross pattern that fades out towards the edges */
function Pattern() {
  const mask = "radial-gradient(ellipse at 50% 40%, #000 20%, transparent 75%)";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ backgroundImage: PLUS, WebkitMaskImage: mask, maskImage: mask }}
    />
  );
}

/* Heartbeat line with a pulse that travels along it */
function Ecg({ className = "", color = "#2dd4bf" }) {
  const d =
    "M0 60 H180 L200 60 L215 40 L230 60 H300 L318 60 L330 94 L350 8 L372 110 L388 60 H560 L578 60 L592 44 L608 60 H760 L778 60 L790 94 L810 8 L832 110 L848 60 H1020 L1036 60 L1050 42 L1066 60 H1200";
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className={`pointer-events-none absolute ${className}`}>
      <path d={d} fill="none" stroke={color} strokeOpacity=".18" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path
        d={d} pathLength="1" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray="0.22 1" vectorEffect="non-scaling-stroke"
        style={{ animation: "ecg 4.5s linear infinite" }}
      />
    </svg>
  );
}

/* ---------- Sections ---------- */
function Journey() {
  const [ref, seen] = useInView();
  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
      <Pattern />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-xl font-display text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">
          One plan, even when you need several specialists
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Here is what happens from your first booking to your follow-up care.
        </p>

        <ol className="relative mt-12 grid gap-8 lg:grid-cols-4 lg:gap-6">
          {/* progress line, desktop only */}
          <div aria-hidden="true" className="absolute left-5 right-5 top-5 hidden h-0.5 bg-slate-200 lg:block">
            <div
              className="h-full bg-teal-600 transition-[width] duration-[1600ms] ease-out"
              style={{ width: seen ? "100%" : "0%" }}
            />
          </div>

          {journey.map((s, i) => (
            <li
              key={s.title}
              className="relative flex gap-4 transition-all duration-700 lg:block"
              style={{
                transitionDelay: `${i * 220}ms`,
                opacity: seen ? 1 : 0,
                transform: seen ? "none" : "translateY(16px)",
              }}
            >
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-700 font-display font-semibold text-white ring-4 ring-white">
                {i + 1}
              </span>
              <div className="lg:mt-5">
                <h3 className="font-display text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Conditions() {
  const [tab, setTab] = useState(areas[0].id);
  const current = areas.find((a) => a.id === tab);
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 to-white">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" aria-hidden="true" />
      <div data-reveal className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">
        What we treat
      </h2>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">
        Pick an area to see common conditions and how our teams approach them.
      </p>

      <div role="tablist" aria-label="Care areas" className="mt-8 flex flex-wrap gap-2">
        {areas.map((a) => (
          <button
            key={a.id}
            role="tab"
            aria-selected={tab === a.id}
            onClick={() => setTab(a.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
              tab === a.id
                ? "bg-teal-700 text-white shadow-lg shadow-teal-700/25"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-teal-400"
            }`}
          >
            {a.id}
          </button>
        ))}
      </div>

      <div
        key={tab}
        role="tabpanel"
        className="mt-6 grid gap-8 rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:p-8 lg:grid-cols-2"
        style={{ animation: "page-in .45s ease both" }}
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {current.conditions.map((c, i) => (
            <li
              key={c}
              className="flex items-center gap-3 rounded-xl bg-teal-50 px-4 py-3 text-slate-800"
              style={{ animation: "page-in .4s ease both", animationDelay: `${i * 70}ms` }}
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-teal-600" />
              {c}
            </li>
          ))}
        </ul>
        <div className="flex flex-col justify-center">
          <p className="font-display text-lg font-semibold text-slate-900">How we approach it</p>
          <p className="mt-2 leading-7 text-slate-600">{current.care}</p>
          <Link to="/contact#appointment" className="mt-5 w-fit font-medium text-teal-800 underline-offset-4 hover:underline">
            Book a {current.id.toLowerCase()} consultation →
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}

function Facilities() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 sm:py-20 lg:py-28">
      {FACILITIES_PHOTO && (
        <img src={FACILITIES_PHOTO} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25" />
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,.28),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(56,189,248,.18),transparent_50%)]" />
      <Ecg className="inset-x-0 bottom-6 h-24 w-full" />
      <div data-reveal className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-xl font-display text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
          Modern equipment, on site
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          Scans, procedures and treatment happen in the same building, so you are not sent across the city.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((f) => (
            <div
              key={f.name}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/60 hover:bg-white/10"
            >
              <span className="mb-5 block h-1 w-10 rounded bg-teal-500 transition-all duration-300 group-hover:w-20" />
              <h3 className="font-display text-lg font-semibold text-white">{f.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section data-reveal className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
      <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">
        Before you book
      </h2>
      <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-medium text-slate-900 transition-colors hover:text-teal-800"
              >
                {f.q}
                <span className={`text-2xl leading-none text-teal-700 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} aria-hidden="true">+</span>
              </button>
              <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <p className="overflow-hidden pr-8 leading-7 text-slate-600">
                  <span className="block pb-5">{f.a}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Emergency() {
  return (
    <section data-reveal className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-28">
      <div className="flex flex-col items-start justify-between gap-6 relative overflow-hidden rounded-3xl bg-teal-700 p-7 sm:p-10 md:flex-row md:items-center">
        <Ecg className="inset-x-0 bottom-0 h-full w-full" color="#ffffff" />
        <div className="relative">
          <p className="flex items-center gap-2 text-sm font-medium text-teal-100">
            <span className="h-2 w-2 rounded-full bg-white" style={{ animation: "page-pulse 1.8s ease-out infinite" }} />
            Emergency team on duty, 24 hours
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
            Chest pain, stroke signs or a serious injury?
          </h2>
          <p className="mt-2 max-w-xl text-teal-50">Do not wait for an appointment. Call now and we will get an ambulance moving.</p>
        </div>
        <a
          href={`tel:${EMERGENCY_PHONE.replace(/\s/g, "")}`}
          className="relative w-full shrink-0 rounded-full bg-white px-7 py-3.5 text-center font-semibold text-teal-800 transition hover:-translate-y-0.5 hover:shadow-xl md:w-auto"
        >
          Call {EMERGENCY_PHONE}
        </a>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function DepartmentsPage() {
  const root = useRef(null);
  useReveal(root);

  return (
    <div ref={root}>
      <style>{`
        @keyframes ecg { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1.22; } }
        @keyframes page-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes page-pulse { 0% { box-shadow: 0 0 0 0 rgba(255,255,255,.6); } 70%, 100% { box-shadow: 0 0 0 10px rgba(255,255,255,0); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>

      <PageHeader
        title="Our departments"
        text="Specialised teams for the heart, brain, bones and cancer care, working together under one roof."
      />
      <Departments />
      <Journey />
      <Conditions />
      <Facilities />
      <Faq />
      <Emergency />
    </div>
  );
}