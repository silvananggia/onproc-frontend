import React from "react";

function FeaturesSection() {
  const features = [
    {
      title: "Inklusif",
      description:
        "Dirancang agar dapat diakses publik luas, dengan komitmen pada keterbukaan data dan kolaborasi lintas sektor.",
    },
    {
      title: "Fleksibel",
      description:
        "Skala waktu harian, bulanan, hingga tahunan untuk mendukung analisis tren jangka pendek maupun panjang.",
    },
    {
      title: "Aplikatif",
      description:
        "Modul riset siap dipakai tanpa harus memahami algoritma teknis secara mendalam.",
    },
    {
      title: "Portabel",
      description:
        "Hasil modul dapat diunduh ke data lokal untuk analisis lanjutan atau integrasi ke sistem pengguna.",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-inner">
        <h2 className="features-title">
          GEOMIMO hadir untuk mendukung riset penginderaan jauh
        </h2>
        <div className="features-container">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
      <style jsx>{`
        .features-section {
          padding: var(--page-pad-y) var(--page-pad-x);
          background: #fff;
        }

        .features-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .features-title {
          font-size: 28px;
          font-weight: 700;
          text-align: center;
          max-width: 720px;
          margin: 0 auto 24px;
          background: linear-gradient(90deg, #205072 0%, #32909c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .features-container {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .feature-card {
          background: #f4f7f8;
          border: 1px solid var(--color-line);
          border-radius: 12px;
          padding: 16px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow);
          background: #fff;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-navy);
          margin: 0 0 8px;
        }

        .feature-description {
          font-size: 14px;
          color: var(--color-muted);
          line-height: 1.55;
        }

        @media (max-width: 991px) {
          .features-title {
            font-size: 22px;
          }

          .features-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .features-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

export default FeaturesSection;
