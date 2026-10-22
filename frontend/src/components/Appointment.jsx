import { useRef, useState } from "react";
import gsap from "gsap";
import emailjs from "@emailjs/browser";
import useReveal from "../hooks/useReveal";
import { departments } from "../data/content";

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100";
const label = "mb-2 block text-sm font-semibold text-slate-800";

export default function Appointment() {
  const root = useRef(null);
  const panel = useRef(null);
  const [done, setDone] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | error | config
  useReveal(root);

  function showSuccess(data) {
    gsap.to(panel.current, {
      opacity: 0, y: -12, duration: 0.25,
      onComplete: () => {
        setDone(data);
        setStatus("idle");
        gsap.fromTo(panel.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
      },
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (data.botcheck) return; // honeypot: bots fill this hidden field
    if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) return setStatus("config");

    setStatus("sending");
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: data.name,
          email: data.email,
          phone: data.phone || "Not given",
          department: data.department,
          preferred_date: data.date,
          message: data.message || "None",
        },
        { publicKey: PUBLIC_KEY }
      );
      showSuccess(data);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="appointment" ref={root} className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
      <div data-reveal className="grid overflow-hidden rounded-[2rem] bg-blue-900 lg:grid-cols-5">
        <div className="p-8 text-white md:p-12 lg:col-span-2">
          <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">Take the first step toward feeling better</h2>
          <p className="mt-5 leading-7 text-blue-100">Request an appointment and our care team will contact you to confirm a time.</p>
          <div className="mt-8 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
            <p className="font-semibold">In an emergency?</p>
            <p className="mt-1 text-sm leading-6 text-blue-100">Call your local emergency number right away instead of using this form.</p>
          </div>
        </div>

        <div ref={panel} className="bg-white p-8 md:p-12 lg:col-span-3">
          {done ? (
            <div role="status">
              <h3 className="font-display text-2xl font-semibold text-slate-900">Request sent, {done.name}</h3>
              <p className="mt-3 leading-7 text-slate-600">
                We received your {done.department} appointment request for {done.date}. Our team will contact you at {done.email} to confirm.
              </p>
              <button onClick={() => setDone(null)} className="mt-6 font-semibold text-blue-800 underline underline-offset-4 hover:text-blue-950">
                Make another request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
              <h3 className="font-display text-2xl font-semibold text-slate-900 sm:col-span-2">Request an appointment</h3>

              {/* Honeypot (hidden from people) */}
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

              <div>
                <label htmlFor="n" className={label}>Full name</label>
                <input id="n" name="name" required autoComplete="name" placeholder="Your full name" className={field} />
              </div>
              <div>
                <label htmlFor="e" className={label}>Email address</label>
                <input id="e" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
              </div>
              <div>
                <label htmlFor="p" className={label}>Phone (optional)</label>
                <input id="p" name="phone" type="tel" autoComplete="tel" placeholder="10-digit mobile number" className={field} />
              </div>
              <div>
                <label htmlFor="d" className={label}>Department</label>
                <select id="d" name="department" required defaultValue="" className={field}>
                  <option value="" disabled>Select a department</option>
                  {departments.map((x) => <option key={x.name}>{x.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="t" className={label}>Preferred date</label>
                <input id="t" name="date" type="date" required min={new Date().toLocaleDateString("en-CA")} className={field} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="m" className={label}>Message (optional)</label>
                <textarea id="m" name="message" rows={3} placeholder="Tell us briefly what you need help with" className={field} />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-xl bg-blue-800 px-6 py-4 font-semibold text-white transition-colors hover:bg-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
              >
                {status === "sending" ? "Sending..." : "Request appointment"}
              </button>

              {status === "error" && (
                <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800 sm:col-span-2">
                  Something went wrong and your request was not sent. Please try again or call us directly.
                </p>
              )}
              {status === "config" && (
                <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 sm:col-span-2">
                  Form is not set up yet: add the VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID and VITE_EMAILJS_TEMPLATE_ID values to your .env file and restart the dev server.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}