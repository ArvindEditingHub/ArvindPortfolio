import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import About from "../components/About";
import Services from "../components/Services";
import Tools from "../components/Tools";
import Projects from "../components/Projects";
import VideoSections from "../components/VideoSections";
import SocialGallery from "../components/SocialGallery";
import Process from "../components/Process";
import Contact from "../components/Contact";
import { scrollToSection } from "../components/Nav";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const id = location.state.scrollTo;
      const t = setTimeout(() => scrollToSection(id), 150);
      return () => clearTimeout(t);
    }
  }, [location.state]);

  return (
    <main>
      <Hero />
      <About />
      <Marquee
        className="bg-bone text-ink/80 py-8 border-y border-ink/10"
        items={["Design", "Motion", "Story", "Impact", "Craft"]}
        itemClassName="font-display font-extrabold uppercase text-5xl md:text-7xl tracking-tight text-stroke-ink"
      />
      <Services />
      <Tools />
      <Projects />
      <VideoSections />
      <SocialGallery />
      <Process />
      <Contact />
    </main>
  );
}
