import React, { useState } from "react";

/* ---------- Data ---------- */

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Departments", href: "#departments" },
  { label: "Doctors", href: "#doctors" },
  { label: "How it works", href: "#process" },
];

const departments = [
  { name: "Cardiology", desc: "Heart health checks, diagnostics and long-term care plans.", tag: "Heart & vessels" },
  { name: "Neurology", desc: "Care for headaches, nerve conditions, stroke and memory concerns.", tag: "Brain & nerves" },
  { name: "Orthopedics", desc: "Joint, bone and sports injury treatment, from advice to surgery.", tag: "Bones & joints" },
  { name: "Oncology", desc: "Personalised cancer care with a team that walks with you.", tag: "Cancer care" },
];

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    next: "Next available: Tomorrow",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    next: "Next available: This week",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Dr. Emily Davis",
    specialty: "Orthopedic Specialist",
    next: "Next available: Tomorrow",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=700&auto=format&fit=crop&q=80",
  },
];

const steps = [
  { title: "Choose a department", text: "Tell us what you need help with and we’ll point you to the right specialist." },
  { title: "Pick a date", text: "Select a day that suits you. Our team confirms the time with you." },
  { title: "Meet your doctor", text: "Arrive, be heard, and leave with a clear plan for your next steps." },
];

const highlights = [
  ["Specialist-led", "Every department is run by an experienced consultant."],
  ["Modern facilities", "Up-to-date diagnostics under one roof."],
  ["Patient-first", "Unhurried consultations and clear explanations."],
  ["Easy booking", "Request a visit online in under a minute."],
];

/* ---------- Small pieces ---------- */

const Arrow = ({ className = "" }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={"h-4 w-4 " + className} aria-hidden="true">
    <path d="M4 10h12m0 0-5-5m5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Logo = () => (
  <a href="#home" className="flex items-center gap-2.5" aria-label="Arogya Healthcare home">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-800">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor" aria-hidden="true">
        <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" />
      </svg>
    </span>
    <span className="font-display text-xl font-semibold text-slate-900">Arogya</span>
  </a>
);

/* ---------- App ---------- */

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7FAF9] font-body text-slate-700 antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; }
        .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } * { transition: none !important; } }
      `}</style>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
          <Logo />

          <ul className="hidden items-center gap-9 text-sm font-medium md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-slate-600 transition-colors hover:text-teal-800">{l.label}</a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#appointment"
              className="hidden rounded-full bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 sm:inline-block"
            >
              Book appointment
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-5 pb-5 pt-2 md:hidden">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium text-slate-700">
                {l.label}
              </a>
            ))}
            <a href="#appointment" onClick={() => setMenuOpen(false)} className="mt-2 block rounded-full bg-teal-800 py-3 text-center font-semibold text-white">
              Book appointment
            </a>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 md:py-20 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-24">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1.5 text-sm font-medium text-teal-800 ring-1 ring-teal-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Appointments open this week
            </p>

            <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.1] text-slate-900 sm:text-5xl lg:text-[3.5rem]">
              Healthcare that listens before it treats.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              Meet specialists who take the time to understand you, in a calm,
              modern setting built around your comfort.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#appointment"
                className="inline-flex items-center gap-2 rounded-full bg-teal-800 px-7 py-3.5 font-semibold text-white shadow-lg shadow-teal-900/15 transition-colors hover:bg-teal-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
              >
                Book a consultation <Arrow />
              </a>
              <a href="#departments" className="rounded-full px-5 py-3.5 font-semibold text-teal-900 underline decoration-teal-300 decoration-2 underline-offset-8 transition-colors hover:decoration-teal-700">
                See our departments
              </a>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="absolute -inset-3 rounded-[2.5rem] bg-teal-100/70" aria-hidden="true" />
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1200&auto=format&fit=crop&q=85"
              alt="Doctor consulting with a patient in a bright clinic"
              className="relative h-[380px] w-full rounded-[2rem] object-cover sm:h-[500px]"
            />
            <div className="absolute -bottom-6 left-4 right-4 rounded-2xl bg-white p-5 shadow-xl shadow-slate-900/10 ring-1 ring-slate-100 sm:left-auto sm:right-8 sm:w-72">
              <p className="font-display text-lg font-semibold text-slate-900">Not sure where to start?</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">Send a request and our care team will guide you to the right doctor.</p>
              <a href="#appointment" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:text-teal-950">
                Request a visit <Arrow />
              </a>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="mt-6 border-y border-slate-200 bg-white">
          <dl className="mx-auto grid max-w-7xl gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(([title, text]) => (
              <div key={title} className="bg-white px-6 py-8 lg:px-8">
                <dt className="font-display text-lg font-semibold text-slate-900">{title}</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-500">{text}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Departments */}
        <section id="departments" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="font-display text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
                Specialised care, all in one place
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Choose a department to see how we can help, then book directly with the team.
              </p>
            </div>

            <ul className="divide-y divide-slate-200 border-y border-slate-200 lg:col-span-8">
              {departments.map((d) => (
                <li key={d.name}>
                  <a
                    href="#appointment"
                    className="group grid items-center gap-2 px-2 py-7 transition-colors hover:bg-white sm:grid-cols-12 sm:gap-6 sm:px-5"
                  >
                    <div className="sm:col-span-4">
                      <h3 className="font-display text-2xl font-semibold text-slate-900 transition-colors group-hover:text-teal-800">{d.name}</h3>
                      <p className="mt-1 text-sm font-medium text-teal-700">{d.tag}</p>
                    </div>
                    <p className="text-slate-600 sm:col-span-7">{d.desc}</p>
                    <span className="hidden justify-self-end text-teal-800 transition-transform group-hover:translate-x-1 sm:col-span-1 sm:block">
                      <Arrow className="h-5 w-5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Doctors */}
        <section id="doctors" className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold text-slate-900 md:text-4xl">Meet your specialists</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Sample profiles for this preview. Replace with verified doctor details before publishing.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doc) => (
                <article key={doc.name} className="group">
                  <div className="overflow-hidden rounded-2xl bg-teal-50">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      loading="lazy"
                      className="h-80 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-slate-900">{doc.name}</h3>
                      <p className="mt-1 text-sm text-teal-700">{doc.specialty}</p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {doc.next}
                      </p>
                    </div>
                    <a
                      href="#appointment"
                      className="shrink-0 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-teal-800 hover:bg-teal-800 hover:text-white"
                    >
                      Book
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <h2 className="font-display max-w-xl text-3xl font-semibold text-slate-900 md:text-4xl">
            Booking is simple, in three steps
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="relative border-t-2 border-teal-800 pt-6">
                <span className="font-display text-sm font-semibold text-teal-700">Step {i + 1}</span>
                <h3 className="font-display mt-2 text-xl font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Appointment */}
        <section id="appointment" className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
          <div className="grid overflow-hidden rounded-[2rem] bg-teal-900 lg:grid-cols-5">
            <div className="p-8 text-white md:p-12 lg:col-span-2">
              <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
                Take the first step toward feeling better
              </h2>
              <p className="mt-5 leading-7 text-teal-100">
                Request an appointment and our care team will get back to you to confirm a time.
              </p>
              <div className="mt-8 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
                <p className="font-semibold">In an emergency?</p>
                <p className="mt-1 text-sm leading-6 text-teal-100">
                  Please call your local emergency number right away instead of using this form.
                </p>
              </div>
              <p className="mt-6 text-xs text-teal-200">
                Demo form: details are shown on screen only and are not sent or saved.
              </p>
            </div>

            <div className="bg-white p-8 md:p-12 lg:col-span-3">
              <AppointmentForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 md:flex-row md:items-center md:justify-between lg:px-8">
          <Logo />
          <p className="text-sm text-slate-500">A healthcare website concept with demo content.</p>
          <p className="text-sm text-slate-500">
            Crafted by <span className="font-semibold text-teal-800">V-Tech</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Form ---------- */

const fieldClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100";

function AppointmentForm() {
  const [submitted, setSubmitted] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitted({ name: data.get("name"), department: data.get("department"), date: data.get("date") });
    event.currentTarget.reset();
  }

  if (submitted) {
    return (
      <div role="status" className="flex h-full flex-col justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="font-display mt-5 text-2xl font-semibold text-slate-900">Request received, {submitted.name}</h3>
        <p className="mt-3 leading-7 text-slate-600">
          You asked for a {submitted.department} appointment on {submitted.date}. This is a demo, so nothing has been sent or saved.
        </p>
        <button onClick={() => setSubmitted(null)} className="mt-6 self-start font-semibold text-teal-800 underline underline-offset-4 hover:text-teal-950">
          Make another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-display text-2xl font-semibold text-slate-900">Request an appointment</h3>
      <p className="mt-2 text-sm text-slate-500">All fields are required.</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="patient-name" className="mb-2 block text-sm font-semibold text-slate-800">Full name</label>
          <input id="patient-name" name="name" required autoComplete="name" placeholder="Your full name" className={fieldClass} />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="patient-email" className="mb-2 block text-sm font-semibold text-slate-800">Email address</label>
          <input id="patient-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={fieldClass} />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="department" className="mb-2 block text-sm font-semibold text-slate-800">Department</label>
          <select id="department" name="department" required defaultValue="" className={fieldClass}>
            <option value="" disabled>Select a department</option>
            {departments.map((d) => (
              <option key={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="appointment-date" className="mb-2 block text-sm font-semibold text-slate-800">Preferred date</label>
          <input id="appointment-date" name="date" type="date" required min={new Date().toLocaleDateString("en-CA")} className={fieldClass} />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-teal-800 px-6 py-4 font-semibold text-white transition-colors hover:bg-teal-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 sm:col-span-2"
        >
          Request appointment
        </button>
      </div>
    </form>
  );
}

export default App;