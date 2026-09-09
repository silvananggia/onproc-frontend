import React from "react";
import Card from "./Card";

function JourneySection() {
  return (
    <section className="journey-section">
      <h2 className="journey-title">
        <span>Perjalanan GEOMIMO</span>
      </h2>
      <div className="journey-cards">
        <Card
          title="Newsroom"
          description="Baca liputan terbaru seputar GEOMIMO seputar data dan informasi geospasial dan pelatihan penggunaan teknologi penginderaan jauh"
          actionText="Pelajari Lebih Lanjut"
          href="/infografis"
        />
        <Card
          title="Impact"
          description="Pelajari bagaimana data dan informasi geospasial GEOMIMO berpengaruh dalam kehidupan"
          actionText="Pelajari Lebih Lanjut"
          href="/katalog-modul"
        />
      </div>
      <style jsx>{`
        .journey-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 0 var(--page-pad-x);
        }
        .journey-title {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(90deg, #81883a 0%, #32c596 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }
        .journey-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 100%;
        }
        @media (max-width: 991px) {
          .journey-section {
            align-items: center;
          }
          .journey-cards {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .journey-section {
            padding: 0 16px;
          }
        }
      `}</style>
    </section>
  );
}

export default JourneySection;
