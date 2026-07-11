import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { FaqSection } from "@/components/landing/FaqSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <FeaturesGrid />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}

