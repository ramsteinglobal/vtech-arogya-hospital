import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { EMERGENCY_PHONE } from "../data/content";

const links = [
  ["Home", "/"],
  ["Departments", "/departments"],
  ["Doctors", "/doctors"],
  ["Contact", "/contact"],
];

const linkClass = ({ isActive }) =>
  "text-sm font-medium transition-colors " + (isActive ? "text-blue-800" : "text-slate-600 hover:text-blue-800");

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Link to="/" className="font-display text-xl font-semibold text-slate-900">Arogya</Link>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map(([label, to]) => (
            <li key={to}><NavLink to={to} end={to === "/"} className={linkClass}>{label}</NavLink></li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href={"tel:" + EMERGENCY_PHONE} className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700">
            <span className="hidden sm:inline">Emergency: </span>{EMERGENCY_PHONE}
          </a>
          <Link to="/contact" className="hidden rounded-full bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-900 lg:inline-block">
            Book appointment
          </Link>
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-5 pb-5 pt-2 md:hidden">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}
              className={({ isActive }) => "block py-3 text-base font-medium " + (isActive ? "text-blue-800" : "text-slate-700")}>
              {label}
            </NavLink>
          ))}
          <Link to="/contact" onClick={() => setOpen(false)} className="mt-2 block rounded-full bg-blue-800 py-3 text-center font-semibold text-white">
            Book appointment
          </Link>
        </div>
      )}
    </header>
  );
}