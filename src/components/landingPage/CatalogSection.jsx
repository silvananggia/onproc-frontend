import React from "react";
import { Link } from "react-router-dom";

const featuredModules = [
  {
    title: "Hotspot",
    url: "/info-hotspot",
    description: "Pantau titik panas kebakaran secara spasial dan nirkala.",
    tag: "Kebencanaan",
  },
  {
    title: "Zona Potensi Ikan",
    url: "/info-zppi",
    description: "Temukan area laut yang berpotensi sebagai lokasi tangkapan.",
    tag: "Perikanan",
  },
  {
    title: "Tumpahan Minyak",
    url: "/info-spill",
    description: "Visualisasi sebaran tumpahan minyak di perairan Indonesia.",
    tag: "Lingkungan",
  },
  
  {
    title: "Emisi CO2 dan CH4",
    url: "/info-ch4",
    description: "Klasifikasi emisi gas rumah kaca dari data penginderaan jauh.",
    tag: "Lingkungan",
  },
];

function CatalogSection() {
  return (
    <section className="catalog-section">
      <div className="catalog-content">
        <div className="catalog-copy">
          <h2 className="catalog-title">Katalog Modul GEOMIMO</h2>
          <p className="catalog-description">
            Jelajahi modul riset penginderaan jauh dari berbagai topik: kebencanaan,
            pertanian, perikanan, kehutanan, dan lingkungan.
          </p>
        </div>
        <div className="catalog-grid">
          {featuredModules.map((module) => (
            <Link key={module.title} to={module.url} className="catalog-card">
              <span className="catalog-tag">{module.tag}</span>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
            </Link>
          ))}
        </div>
        <div className="button-container">
          <a href="/katalog-modul" className="catalog-button">
            Lihat semua modul
          </a>
        </div>
      </div>
      <style jsx>{`
        .catalog-section {
          padding: var(--page-pad-y) var(--page-pad-x);
          background: linear-gradient(135deg, #205072 0%, #32909c 60%, #32c596 100%);
        }

        .catalog-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .catalog-title {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .catalog-description {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.9);
          max-width: 640px;
          margin: 0 0 20px;
        }

        .catalog-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .catalog-card {
          background: rgba(255, 255, 255, 0.96);
          border-radius: 12px;
          padding: 16px;
          text-decoration: none;
          color: var(--color-ink);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .catalog-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow);
        }

        .catalog-tag {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          color: var(--color-navy);
          background: #e8f1f6;
          border-radius: 999px;
          padding: 4px 10px;
          margin-bottom: 8px;
        }

        .catalog-card h3 {
          font-size: 18px;
          margin: 0 0 6px;
        }

        .catalog-card p {
          font-size: 14px;
          color: var(--color-muted);
          line-height: 1.5;
        }

        .button-container {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
        }

        .catalog-button {
          border: none;
          color: var(--color-navy);
          padding: 10px 22px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          background-color: #fff;
          text-decoration: none;
        }

        @media (max-width: 991px) {
          .catalog-title {
            font-size: 24px;
          }

          .catalog-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .catalog-grid {
            grid-template-columns: 1fr;
          }

          .button-container {
            justify-content: stretch;
          }

          .catalog-button {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}

export default CatalogSection;
