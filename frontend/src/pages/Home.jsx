import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import Hero from "../components/Hero";
import Emergency from "../components/Emergency";
import useReveal from "../hooks/useReveal";
import { doctors } from "../data/content";

const HELPDESK_PHONE = "+91 95558 82573";

/* One shared content width for every section: phones -> laptops -> 4K */
const WRAP =
  "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[96rem] 2xl:px-12 min-[1920px]:max-w-[110rem] min-[1920px]:px-16 min-[2400px]:max-w-[130rem]";
const H2 =
  "font-display text-balance text-2xl font-semibold leading-tight min-[380px]:text-[1.75rem] sm:text-3xl md:text-4xl 2xl:text-5xl min-[1920px]:text-6xl";

const PLUS =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M24 18v12M18 24h12' stroke='%231d4ed8' stroke-opacity='.14' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\")";

const cards = [
  { to: "/departments", title: "Departments", text: "Cardiology, Neurology, Orthopedics and Oncology.", icon: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" },
  { to: "/doctors", title: "Our doctors", text: "Meet the specialists and see their experience.", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
  { to: "/contact", title: "Book a visit", text: "Request an appointment in under a minute.", icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" },
];

const reasons = [
  { title: "Specialists who listen", text: "Longer conversations, so nothing important is missed.", icon: "M21 12a8 8 0 0 1-11.3 7.3L4 20l1-4.6A8 8 0 1 1 21 12z" },
  { title: "Everything under one roof", text: "Scans, tests and treatment in the same building.", icon: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" },
  { title: "Clear, honest plans", text: "You get your options in plain words before you decide.", icon: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" },
  { title: "Care after the visit", text: "Follow-up calls and a team you can reach.", icon: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" },
];

/* ---------- 3D medical cross (Three.js, no model file needed) ---------- */
function CrossScene({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.domElement.style.display = "block";
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 13);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(4, 6, 8);
    scene.add(key);
    const rim = new THREE.PointLight(0x38bdf8, 70, 40);
    rim.position.set(-6, -3, 5);
    scene.add(rim);

    // plus-shaped cross, extruded with a bevel
    const a = 0.9, b = 2.6, s = new THREE.Shape();
    s.moveTo(-a, -b); s.lineTo(a, -b); s.lineTo(a, -a); s.lineTo(b, -a); s.lineTo(b, a); s.lineTo(a, a);
    s.lineTo(a, b); s.lineTo(-a, b); s.lineTo(-a, a); s.lineTo(-b, a); s.lineTo(-b, -a); s.lineTo(-a, -a);
    s.closePath();
    const crossGeo = new THREE.ExtrudeGeometry(s, { depth: 0.9, bevelEnabled: true, bevelThickness: 0.22, bevelSize: 0.22, bevelSegments: 8 });
    crossGeo.center();
    const crossMat = new THREE.MeshPhysicalMaterial({ color: 0x2563eb, roughness: 0.2, metalness: 0.1, clearcoat: 1 });
    const group = new THREE.Group();
    group.add(new THREE.Mesh(crossGeo, crossMat));
    scene.add(group);

    // orbit rings + glowing orbs riding the first ring
    const TILT = Math.PI / 2.4, R = 4.3;
    const ringGeo = new THREE.TorusGeometry(R, 0.035, 16, 140);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.55 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = TILT;
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.scale.setScalar(1.25);
    ring2.rotation.set(-TILT, 0.6, 0);
    scene.add(ring1, ring2);

    const orbGeo = new THREE.SphereGeometry(0.22, 24, 24);
    const orbMat = new THREE.MeshStandardMaterial({ color: 0xbfdbfe, emissive: 0x3b82f6, emissiveIntensity: 0.9 });
    const orbs = [0, 1, 2].map(() => {
      const m = new THREE.Mesh(orbGeo, orbMat);
      scene.add(m);
      return m;
    });

    /* Auto-fit: the rings are wide but flat, the cross is tall but narrow.
       Find the camera distance that keeps BOTH inside the box, whatever its shape
       (phone portrait or landscape, tablet, desktop, ultrawide). */
    const FIT_W = 5.7, FIT_H = 3.7;
    const fitDistance = (aspect) => {
      const v = THREE.MathUtils.degToRad(camera.fov) / 2;
      const h = Math.atan(Math.tan(v) * aspect);
      return Math.min(Math.max(FIT_W / Math.sin(h), FIT_H / Math.sin(v)), 32);
    };
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, w < 768 ? 1.5 : 2));
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.position.z = fitDistance(w / h);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const mouse = { x: 0, y: 0 }, eased = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    let raf, visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(el);
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = reduce ? 0 : clock.getElapsedTime();
      eased.x += (mouse.x - eased.x) * 0.05;
      eased.y += (mouse.y - eased.y) * 0.05;
      group.rotation.y = t * 0.5 + eased.x * 0.5;
      group.rotation.x = eased.y * 0.35;
      group.position.y = Math.sin(t * 1.2) * 0.25;
      ring1.rotation.z = t * 0.15;
      ring2.rotation.z = -t * 0.1;
      orbs.forEach((m, i) => {
        const p = t * 0.7 + i * 2.094;
        m.position.set(Math.cos(p) * R, Math.sin(p) * R * Math.cos(TILT), Math.sin(p) * R * Math.sin(TILT));
      });
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
      [crossGeo, ringGeo, orbGeo, crossMat, ringMat, orbMat].forEach((o) => o.dispose());
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}

/* ---------- small pieces ---------- */
function Icon({ d, className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* Card that tilts in 3D towards the cursor (mouse only, so touch scrolling is untouched) */
function TiltCard({ to, title, text, icon }) {
  const ref = useRef(null);
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const move = (e) => {
    if (e.pointerType !== "mouse" || reduce.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    ref.current.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg)`;
    ref.current.style.setProperty("--gx", `${px * 100}%`);
    ref.current.style.setProperty("--gy", `${py * 100}%`);
  };
  const leave = () => ref.current && (ref.current.style.transform = "");

  return (
    <div data-reveal className="sm:[&:last-child:nth-child(odd)]:col-span-2 lg:[&:last-child:nth-child(odd)]:col-span-1">
      <Link
        ref={ref}
        to={to}
        onPointerMove={move}
        onPointerLeave={leave}
        className="group relative flex h-full min-w-0 touch-manipulation flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-900/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 active:scale-[.985] sm:rounded-3xl sm:p-7 lg:p-8 2xl:p-10"
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(320px circle at var(--gx,50%) var(--gy,50%), rgba(59,130,246,.14), transparent 65%)" }} />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-800 transition-all duration-300 group-hover:rotate-6 group-hover:bg-blue-800 group-hover:text-white">
          <Icon d={icon} />
        </span>
        <h3 className="relative mt-5 font-display text-xl font-semibold text-slate-900 transition-colors group-hover:text-blue-800 sm:text-2xl 2xl:text-3xl">{title}</h3>
        <p className="relative mt-2 text-pretty text-base leading-7 text-slate-600 sm:mt-3 2xl:text-lg 2xl:leading-8">{text}</p>
        <span className="relative mt-5 inline-block font-semibold text-blue-800 transition-transform motion-safe:group-hover:translate-x-1 sm:mt-6">Open →</span>
      </Link>
    </div>
  );
}

function Marquee() {
  const items = useMemo(() => [...new Set(doctors.map((d) => d.specialty))], []);
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden bg-blue-800 py-3.5 text-white sm:py-4" aria-hidden="true">
      <div className="home-anim flex w-max gap-8 hover:[animation-play-state:paused] sm:gap-10" style={{ animation: "home-marquee 34s linear infinite" }}>
        {loop.map((s, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-base font-medium sm:gap-10 sm:text-lg">
            {s}
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- page ---------- */
export default function Home() {
  const root = useRef(null);
  useReveal(root);

  return (
    <>
      <style>{`
        @keyframes home-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes home-ring { from { transform: scale(.45); opacity: .9; } to { transform: scale(1.5); opacity: 0; } }
        @keyframes home-float { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(22px,-30px,0); } }
        @media (prefers-reduced-motion: reduce) { .home-anim { animation: none !important; } }
      `}</style>

      <Hero />
      <Marquee />

      <div ref={root} className="overflow-x-clip">
        {/* ---- Where would you like to go ---- */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 to-white">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: PLUS, WebkitMaskImage: "linear-gradient(to bottom,#000,transparent 75%)", maskImage: "linear-gradient(to bottom,#000,transparent 75%)" }} />
          <div aria-hidden="true" className="home-anim pointer-events-none absolute -right-24 top-10 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl sm:h-80 sm:w-80" style={{ animation: "home-float 16s ease-in-out infinite" }} />
          <div className={`${WRAP} relative py-14 sm:py-20 lg:py-28 min-[1920px]:py-36`}>
            <h2 data-reveal className={`${H2} text-slate-900`}>
              Where would you like to go?
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 2xl:gap-8">
              {cards.map((c) => <TiltCard key={c.to} {...c} />)}
            </div>
          </div>
        </section>

        {/* ---- Why us, with the 3D model ---- */}
        <section className="relative overflow-hidden bg-slate-900">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,.3),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(56,189,248,.18),transparent_50%)]" />
          <div className={`${WRAP} relative grid items-center gap-8 py-14 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:py-28 min-[1920px]:py-36`}>
            <CrossScene className="mx-auto h-[clamp(240px,70vw,420px)] max-h-[70svh] w-full max-w-md sm:max-w-lg lg:h-[clamp(380px,45vw,640px)] lg:max-h-none lg:max-w-none" />
            <div data-reveal>
              <h2 className={`${H2} text-white`}>
                Care built around you, not the clock
              </h2>
              <p className="mt-4 max-w-xl text-pretty leading-7 text-slate-300 2xl:max-w-2xl 2xl:text-lg">
                A calm setting, a team that explains things clearly, and support that continues after you leave.
              </p>
              <ul className="mt-8 grid gap-4 min-[480px]:grid-cols-2">
                {reasons.map((r) => (
                  <li key={r.title} className="group min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:bg-white/10">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 transition-all duration-300 group-hover:rotate-6 group-hover:bg-blue-500 group-hover:text-white">
                      <Icon d={r.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-white">{r.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-300">{r.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---- Featured doctors ---- */}
        <section className={`${WRAP} py-14 sm:py-20 lg:py-28 min-[1920px]:py-36`}>
          <div data-reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className={`${H2} max-w-xl text-slate-900`}>
              Meet some of our specialists
            </h2>
            <Link to="/doctors" className="w-fit font-semibold text-blue-800 underline-offset-4 hover:underline">See all doctors →</Link>
          </div>
          <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 2xl:gap-8">
            {doctors.slice(0, 3).map((d, i) => (
              <Link
                key={d.name}
                to="/doctors"
                data-reveal
                /* on the 2-column tablet layout show two cards; the third appears from laptop size */
                className={`group min-w-0 touch-manipulation overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/10 hover:ring-blue-300 active:scale-[.99] ${i === 2 ? "sm:max-lg:hidden" : ""}`}
              >
                <div className="relative overflow-hidden bg-blue-50">
                  <img src={d.image} alt={d.name} loading="lazy" className="h-64 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 sm:h-72 2xl:h-96" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-amber-600 shadow backdrop-blur">★ {d.rating}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-slate-900 sm:text-xl">{d.name}</h3>
                  <p className="mt-1 text-sm font-medium text-blue-700">{d.specialty}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ---- Call to action ---- */}
        <section data-reveal className={`${WRAP} pb-14 sm:pb-20 lg:pb-24`}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-800 to-blue-950 p-6 min-[380px]:p-7 sm:p-12 lg:p-16">
            {[0, 3.5].map((d) => (
              <span key={d} aria-hidden="true" className="home-anim pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-2 border-white/15" style={{ animation: `home-ring 7s ease-out ${d}s infinite` }} />
            ))}
            <div className="relative max-w-2xl">
              <h2 className={`${H2} text-white`}>
                Ready to feel heard? Book your first visit.
              </h2>
              <p className="mt-3 leading-7 text-blue-100 2xl:text-lg">Tell us what is bothering you and we will find the right specialist.</p>
              <div className="mt-7 flex flex-col gap-3 min-[560px]:flex-row">
                <Link to="/contact#appointment" className="rounded-full bg-white px-5 py-3.5 sm:px-7 text-center font-semibold text-blue-900 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">
                  Book a consultation
                </Link>
                <a href={`tel:${HELPDESK_PHONE.replace(/\s/g, "")}`} className="rounded-full border border-white/40 px-5 py-3.5 sm:px-7 text-center font-semibold text-white transition hover:bg-white/10">
                  Call {HELPDESK_PHONE}
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="pb-14 sm:pb-20 lg:pb-24">
          <Emergency />
        </div>
      </div>
    </>
  );
}