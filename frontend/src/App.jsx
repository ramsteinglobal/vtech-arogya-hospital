import { useEffect, useRef } from "react";
import { Routes, Route, Outlet, Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DepartmentsPage from "./pages/Departmentspage";
import DoctorsPage from "./pages/Doctorspage";
import ContactPage from "./pages/Contactpage";


function Layout() {
  const { pathname } = useLocation();
  const main = useRef(null);

  // Scroll to top + soft fade on every page change
  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(main.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "transform" });
    });
    return () => ctx.revert();
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main ref={main}><Outlet /></main>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-40 text-center">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-4 text-slate-600">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-blue-800 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-blue-900">Back to home</Link>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}