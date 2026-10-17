import { useRef } from "react";
import useReveal from "../hooks/useReveal";
import { EMERGENCY_PHONE } from "../data/content";

export default function Emergency() {
  const root = useRef(null);
  useReveal(root);

  return (
    <section ref={root} aria-label="Emergency contact" className="mx-auto max-w-7xl px-5 lg:px-8">
      <div data-reveal className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-red-50 p-8 ring-1 ring-red-200 md:flex-row md:items-center md:p-10">
        <div>
          <h2 className="font-display text-2xl font-semibold text-red-900 md:text-3xl">Emergency care, open 24/7</h2>
          <p className="mt-2 max-w-xl leading-7 text-red-800/80">
            For life-threatening situations call 112 immediately. For help reaching our emergency desk, call us directly.
          </p>
        </div>
        <a href={"tel:" + EMERGENCY_PHONE} className="shrink-0 rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-red-900/15 transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200">
          Call {EMERGENCY_PHONE}
        </a>
      </div>
    </section>
  );
}