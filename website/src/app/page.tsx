import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import DiseaseDetection from "@/components/DiseaseDetection";
import SensorDashboard from "@/components/SensorDashboard";
import Architecture from "@/components/Architecture";
import Roadmap from "@/components/Roadmap";
import Team from "@/components/Team";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <DiseaseDetection />
      <SensorDashboard />
      <Architecture />
      <Roadmap />
      <Team />
      <CTA />
      <Footer />
    </main>
  );
}
