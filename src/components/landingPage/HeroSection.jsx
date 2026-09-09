import React from "react";

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-background" />
      <div className="hero-content">
        <h1 className="hero-title">GEOMIMO</h1>
        <p className="hero-description">
          Mengolah data satelit penginderaan jauh dan geospasial secara otomatis
          menjadi informasi spasial yang siap dipakai untuk riset, pemantauan,
          dan pengambilan keputusan.
        </p>
        <div className="hero-actions">
          <a href="/katalog-modul" className="hero-button">
            Mulai Jelajahi
          </a>
          <a href="/tentang" className="hero-button-ghost">
            Tentang GEOMIMO
          </a>
        </div>
        <div className="hero-stats">
          <div>
            <strong>12+</strong>
            <span>Modul informasi</span>
          </div>
          <div>
            <strong>Multi-input</strong>
            <span>Data satelit & spasial</span>
          </div>
          <div>
            <strong>Terbuka</strong>
            <span>Akses publik & institusi</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          padding: 40px var(--page-pad-x) 48px;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1080px;
          height: 100%;
          background-image: url("https://cdn.builder.io/api/v1/image/assets/TEMP/cd6846bc90e376537ad687564e5f05e67e492aa2?placeholderIfAbsent=true");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 1;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-kicker {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(32, 80, 114, 0.08);
          color: var(--color-navy);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 800;
          letter-spacing: 0.06em;
          margin: 0 0 8px;
          background: linear-gradient(90deg, #205072 0%, #32909c 55%, #32c596 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          font-size: 16px;
          line-height: 1.55;
          color: var(--color-muted);
          margin: 0 auto 20px;
          max-width: 640px;
        }

        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-button,
        .hero-button-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 160px;
          padding: 10px 22px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hero-button {
          color: #fff;
          background: var(--color-navy);
          box-shadow: 0 10px 24px rgba(32, 80, 114, 0.25);
        }

        .hero-button-ghost {
          color: var(--color-navy);
          background: #fff;
          border: 1px solid #c5d5de;
        }

        .hero-button:hover,
        .hero-button-ghost:hover {
          transform: translateY(-2px);
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin: 20px auto 0;
          max-width: 640px;
        }

        .hero-stats div {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #dce7ec;
          border-radius: 10px;
          padding: 10px 8px;
        }

        .hero-stats strong {
          display: block;
          font-family: var(--font-heading);
          font-size: 20px;
          color: var(--color-navy);
          margin-bottom: 4px;
        }

        .hero-stats span {
          font-size: 14px;
          color: var(--color-muted);
        }

        @media (max-width: 991px) {
          .hero-section {
            padding: 36px var(--page-pad-x) 48px;
          }

          .hero-background {
            width: 100%;
          }

          .hero-title {
            font-size: 40px;
            letter-spacing: 0.04em;
          }

          .hero-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
