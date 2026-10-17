import { EMERGENCY_PHONE } from "../data/content";

const links = [
  ["Home", "#home"],
  ["Departments", "#departments"],
  ["Doctors", "#doctors"],
  ["Contact", "#appointment"],
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <a href="#home" className="font-display text-xl font-semibold text-slate-900">Arogya</a>
        <ul className="hidden items-center gap-9 text-sm font-medium md:flex">
          {links.map(([label, href]) => (
            <li key={href}><a href={href} className="text-slate-600 transition-colors hover:text-blue-800">{label}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
        <a href={"tel:" + EMERGENCY_PHONE} className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700">
          <span className="hidden sm:inline">Emergency: </span>{EMERGENCY_PHONE}
        </a>
        <a href="#appointment" className="hidden rounded-full bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-900 md:inline-block">
          Book appointment
        </a>
        </div>
      </nav>
    </header>
  );
}