import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Departments from "./components/Departments";
import Doctors from "./components/Doctors";
import Emergency from "./components/Emergency";
import Appointment from "./components/Appointment";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Departments />
        <Doctors />
        <Emergency />
        <Appointment />
      </main>
      <Footer />
    </>
  );
}