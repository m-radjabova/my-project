import { useEffect, useState } from "react";
import AOS from "aos";
import Header from "../../components/header/Header";
import Hero from "../../components/main/Hero";
import TrialSection from "../../components/main/TrialSection";
import AppsServiceSection from "../../components/main/AppsServiceSection";
import HowItWorksSection from "../../components/main/HowItWorksSection";
import Footer from "../../components/footer/Footer";
import SiteLoader from "../../components/main/SiteLoader";
import CommentsSection from "../../components/main/CommentsSection";

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeNav, setActiveNav] = useState<"O'yinlar" | "Haqida" | "Izohlar" | "Bog'lanish">("O'yinlar");

  const sectionByNav: Record<string, string> = {
    "O'yinlar": "games",
    Haqida: "about",
    Izohlar: "comments",
    "Bog'lanish": "contact",
  };

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });

    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      AOS.refresh();
    }
  }, [isLoading]);

  if (isLoading) {
    return <SiteLoader />;
  }

  const handleNavClick = (section: string) => {
    const targetId = sectionByNav[section];
    if (!targetId) return;

    const element = document.getElementById(targetId);
    if (!element) return;

    setActiveNav(section as "O'yinlar" | "Haqida" | "Izohlar" | "Bog'lanish");

    const headerOffset = 96;
    const y = element.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#d42d73]">
      <Header active={activeNav} onNavClick={handleNavClick} />
      <div className="bg-gradient-to-br from-[#d42d73] via-[#c2185b] to-[#b0134d]">
        <div id="games">
          <Hero />
        </div>
        <TrialSection />
      </div>
      <div id="about">
        <AppsServiceSection />
      </div>
      <HowItWorksSection />
      <CommentsSection />
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}

export default Home
