"use client";
import React from "react";
import Header from "../layouts/Header";
import Breadcrumb from "../layouts/Breadcrumb";
import IntroSection from "./IntroSection";
import ProgramSection from "./ProgramSection";
import ConceptSection from "./ConceptSection";
import JourneySection from "./JourneySection";
import Footer from "../layouts/Footer";

function AboutUsPage() {
  return (
    <div className="about-page">
      <Header />
      <div className="page-chrome">
        <Breadcrumb
          items={[
            { label: "Home", url: "/" },
            {
              label: "Tentang Kami",
              url: "/tentang",
              active: true,
            },
          ]}
        />
      </div>
      <main className="main-content">
        <IntroSection />
        <ProgramSection />
        <ConceptSection />
        <JourneySection />
      </main>
      <Footer />
      <style jsx>{`
        .page-chrome {
          padding: 0 var(--page-pad-x);
        }

        .main-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 0 0 var(--page-pad-y);
        }
        @media (max-width: 991px) {
          .main-content {
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default AboutUsPage;
