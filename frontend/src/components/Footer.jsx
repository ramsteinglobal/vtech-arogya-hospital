import { CONTACT, VTECH_URL } from "../data/content";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 lg:px-8">
        <div>
          <a href="#home" className="font-display text-2xl font-semibold text-slate-900">Arogya</a>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">Thoughtful healthcare with expert specialists. A concept site with demo content.</p>
        </div>
        <address className="text-sm not-italic leading-7 text-slate-600">
          <p className="font-semibold text-slate-900">Contact</p>
          <a
            href={"https://mail.google.com/mail/?view=cm&fs=1&to=" + CONTACT.email}
            target="_blank"
            rel="noopener noreferrer"
          ></a>
          <a href={"tel:" + CONTACT.phone} className="block transition-colors hover:text-blue-800">{CONTACT.phone}</a>
          <p>{CONTACT.address}</p>
        </address>
        <div className="text-sm leading-7 text-slate-600 md:text-right">
          <p className="font-semibold text-slate-900">Website by</p>
          <a href={VTECH_URL} className="font-semibold text-blue-800 underline underline-offset-4 transition-colors hover:text-blue-950">V-Tech</a>
        </div>
      </div>
    </footer>
  );
}