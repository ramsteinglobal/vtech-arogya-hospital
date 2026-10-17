import { useRef, useState } from "react";
import gsap from "gsap";
import useReveal from "../hooks/useReveal";
import { departments } from "../data/content";

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100";

export default function Appointment() {
  const root = useRef(null);
  const panel = useRef(null);
  const [done, setDone] = useState(null);
  useReveal(root);

  function onSubmit(e) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    gsap.to(panel.current, {
      opacity: 0, y: -12, duration: 0.25,
      onComplete: () => {
        setDone({ name: d.get("name"), department: d.get("department"), date: d.get("date") });
        gsap.fromTo(panel.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
      },
    });
  }

  return (
    <section id="appointment" ref={root} className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
      <div data-reveal className="grid overflow-hidden rounded-[2rem] bg-teal-900 lg:grid-cols-5">
        <div className="p-8 text-white md:p-12 lg:col-span-2">
          <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">Take the first step toward feeling better</h2>
          <p className="mt-5 leading-7 text-teal-100">Request an appointment and our care team will contact you to confirm a time.</p>
          <div className="mt-8 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
            <p className="font-semibold">In an emergency?</p>
            <p className="mt-1 text-sm leading-6 text-teal-100">Call your local emergency number right away instead of using this form.</p>
          </div>
          <p className="mt-6 text-xs text-teal-200">Demo form: nothing is sent or saved.</p>
        </div>

        <div ref={panel} className="bg-white p-8 md:p-12 lg:col-span-3">
          {done ? (
            <div role="status">
              <h3 className="font-display text-2xl font-semibold text-slate-900">Request received, {done.name}</h3>
              <p className="mt-3 leading-7 text-slate-600">
                You asked for a {done.department} appointment on {done.date}. This is a demo, so nothing has been sent.
              </p>
              <button onClick={() => setDone(null)} className="mt-6 font-semibold text-teal-800 underline underline-offset-4">
                Make another request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
              <h3 className="font-display text-2xl font-semibold text-slate-900 sm:col-span-2">Request an appointment</h3>
              <div>
                <label htmlFor="n" className="mb-2 block text-sm font-semibold text-slate-800">Full name</label>
                <input id="n" name="name" required autoComplete="name" placeholder="Your full name" className={field} />
              </div>
              <div>
                <label htmlFor="e" className="mb-2 block text-sm font-semibold text-slate-800">Email address</label>
                <input id="e" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
              </div>
              <div>
                <label htmlFor="d" className="mb-2 block text-sm font-semibold text-slate-800">Department</label>
                <select id="d" name="department" required defaultValue="" className={field}>
                  <option value="" disabled>Select a department</option>
                  {departments.map((x) => <option key={x.name}>{x.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="t" className="mb-2 block text-sm font-semibold text-slate-800">Preferred date</label>
                <input id="t" name="date" type="date" required min={new Date().toLocaleDateString("en-CA")} className={field} />
              </div>
              <button type="submit" className="rounded-xl bg-teal-800 px-6 py-4 font-semibold text-white transition-colors hover:bg-teal-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 sm:col-span-2">
                Request appointment
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}