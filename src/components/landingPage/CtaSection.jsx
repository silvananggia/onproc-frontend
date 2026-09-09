import React from "react";

function CtaSection() {
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <h2 className="cta-title">Siap mencoba GEOMIMO?</h2>
        <p className="cta-description">
          Mulai jelajahi katalog modul atau hubungi kami untuk kolaborasi dan
          informasi lebih lanjut.
        </p>
        <div className="cta-buttons">
          <a href="/katalog-modul" className="cta-button-primary">
            Jelajahi GEOMIMO
          </a>
          <a href="/kontak" className="cta-button-secondary">
            Hubungi Kami
          </a>
        </div>
      </div>
      <style jsx>{`
        .cta-section {
          padding: var(--page-pad-y) var(--page-pad-x);
          background:
            linear-gradient(180deg, rgba(32, 80, 114, 0.82), rgba(50, 144, 156, 0.88)),
            url("https://cdn.builder.io/api/v1/image/assets/TEMP/4f5e1d623f818fd5ff76ee12827605d1c549c146?placeholderIfAbsent=true");
          background-size: cover;
          background-position: center;
        }

        .cta-inner {
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-title {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 8px;
        }

        .cta-description {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.92);
          margin: 0 auto 20px;
          max-width: 620px;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cta-button-primary,
        .cta-button-secondary {
          padding: 10px 22px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          min-width: 160px;
        }

        .cta-button-primary {
          color: var(--color-navy);
          background: #fff;
        }

        .cta-button-secondary {
          color: #fff;
          border: 2px solid #fff;
        }

        @media (max-width: 640px) {
          .cta-title {
            font-size: 22px;
          }

          .cta-button-primary,
          .cta-button-secondary {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

export default CtaSection;
