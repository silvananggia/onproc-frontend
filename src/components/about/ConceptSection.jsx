import React from "react";

function ConceptSection() {
  return (
    <section className="concept-section">
      <h2 className="concept-title">
        <span>Konsep</span>
         <span>  GEOMIMO</span>
      </h2>
      <p className="concept-description">
        Kami menggambarkan konsep untuk memungkinkan banyak data dapat
        masukan dalam satu mesin yang dilengkapi dengan berbagai plugin yang
        terspesialisasikan. Setiap plugin ini dirancang untuk menghasilkan
        output yang beragam, disebut sebagai multi output
      </p>
      <style jsx>{`
        .concept-section {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          padding: 0 var(--page-pad-x);
        }
        .concept-title {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(90deg, #32909c 0%, #32c596 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }
        .concept-description {
          font-family: var(--font-body);
          font-size: 15px;
          line-height: 1.55;
          color: var(--color-ink);
          max-width: 720px;
          margin: 0;
        }
        @media (max-width: 991px) {
          .concept-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .concept-description {
            width: 100%;
          }
        }
        @media (max-width: 640px) {
          .concept-section {
            padding: 0 16px;
          }
        }
      `}</style>
    </section>
  );
}

export default ConceptSection;
