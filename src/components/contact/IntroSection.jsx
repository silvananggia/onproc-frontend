"use client";
import * as React from "react";

function IntroSection() {
  return (
    <section className="intro-section">
        <div className="intro-content">
        <h1 className="intro-title">Kontak</h1>
        <p className="intro-description">
          Hubungi Pusat Riset Geoinformatika untuk pertanyaan, kolaborasi, atau
          dukungan penggunaan modul GEOMIMO.
        </p>
      </div>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9ade5950e6c3632c726b2bf7e0742029416e2bcb?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e" alt="Group Image" className="intro-image" />
     

      <style jsx>{`
        .intro-section {
          display: flex;
          align-items: center;
          gap: 24px;
          width: 100%;
          padding: 28px var(--page-pad-x);
          background: linear-gradient(135deg, #205072 0%, #32909c 100%);
        }
        .intro-content {
          color: #f1f1f1;
          font-family: var(--font-heading);
          flex: 1;
        }
        .intro-title {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px;
        }
        .intro-description {
          font-family: var(--font-body);
          font-size: 15px;
          line-height: 1.55;
          margin: 0;
          max-width: 560px;
        }
        .intro-image {
          width: auto;
          height: 220px;
          margin-left: auto;
        }
        @media (max-width: 991px) {
          .intro-section {
            flex-direction: column;
          }
          .intro-image {
            width: 100%;
            height: auto;
            margin-left: 0;
          }
        }
        @media (max-width: 640px) {
          .intro-section {
            padding: 28px 16px;
          }
        }
      `}</style>
    </section>
  );
}

export default IntroSection;
