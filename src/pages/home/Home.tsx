import { useEffect, useState } from "react";
import AOS from "aos";
import Header from "../../components/header/Header";
import Hero from "../../components/main/Hero";
import TrialSection from "../../components/main/TrialSection";
import AppsServiceSection from "../../components/main/AppsServiceSection";
import HowItWorksSection from "../../components/main/HowItWorksSection";
import Footer from "../../components/footer/Footer";
import SiteLoader from "../../components/main/SiteLoader";

function Home() {
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#d42d73]">
      <Header active="O'yinlar" />
      <div className="bg-gradient-to-br from-[#d42d73] via-[#c2185b] to-[#b0134d]">
        <Hero />
        <TrialSection />
      </div>
      <AppsServiceSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}

export default Home
