"use client";
import * as React from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import CatalogSection from "./CatalogSection";
import FeaturesSection from "./FeaturesSection";
import FaqSection from "./FaqSection";
import CtaSection from "./CtaSection";
import Footer from "./Footer";

function GeoMimoLandingPage() {
  return (
    <main className="landing-page">
      <Header />
      <HeroSection />
      <CatalogSection />
      <FeaturesSection />
      <FaqSection />
      <CtaSection />
      <Footer />
      <style jsx>{`
        .landing-page {
          width: 100%;
          font-family: var(--font-body);
          background-color: #f4f7f8;
          color: var(--color-ink);
        }
      `}</style>
    </main>
  );
}

export default GeoMimoLandingPage;
