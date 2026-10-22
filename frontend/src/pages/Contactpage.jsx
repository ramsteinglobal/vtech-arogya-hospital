import { useRef } from "react";
import PageHeader from "../components/PageHeader";
import Emergency from "../components/Emergency";
import Appointment from "../components/Appointment";
import useReveal from "../hooks/useReveal";
import { CONTACT } from "../data/content";

export default function ContactPage() {
  const root = useRef(null);
  useReveal(root);

  // [label, text shown, link, opens in new tab?]
  const items = [
    ["Email", CONTACT.email, "https://mail.google.com/mail/?view=cm&fs=1&to=" + CONTACT.email, true],
    ["Phone", CONTACT.phone, "tel:+91" + CONTACT.phone, false],
    ["Address", CONTACT.address, null, false],
  ];

  return (
    <>
      <PageHeader title="Contact and appointments" text="Reach our care team or request a visit. We will confirm your time by phone or email." />
      <section ref={root} className="mx-auto max-w-7xl px-5 pt-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(([label, value, href, external]) => (
            <div key={label} data-reveal className="rounded-3xl border border-slate-200 bg-white p-7">
              <p className="text-sm font-semibold text-blue-800">{label}</p>
              {href ? (
                <a
                  href={href}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="mt-2 block break-words text-lg font-medium text-slate-900 transition-colors hover:text-blue-800"
                >
                  {value}
                </a>
              ) : (
                <p className="mt-2 text-lg font-medium text-slate-900">{value}</p>
              )}
            </div>
          ))}
        </div>
      </section>
      <div className="pt-16"><Emergency /></div>
      <Appointment />
    </>
  );
}