import React from "react";

function ProgramSection() {
  return (
    <section className="program-section">
      <h2 className="program-title">
        <span>Program GEOMIMO</span>
      </h2>
      <p className="program-description">
        GEOMIMO merupakan sebuah sistem yang dibangun sebagai hasil kerjasama
        antara Pusat Riset Geoinformatika dan Pusat Riset Sains Data dan
        Informasi , yang berada dibawah naungan Organisasi Riset Elektronika dan
        Informatika, BRIN. Kami terdiri atas peneliti dan perekayasa yang
        bertujuan untuk memanfaatkan teknologi penginderaan jauh untuk menangani
        permasalahan kompleks di bidang kebumian dengan data yang besar.
      </p>
      <p className="program-links">
        <span>Pelajari lebih lanjut tentang</span>
        <a href="https://brin.go.id/orei/pusat-riset-geoinformatika/page/beranda-2" className="program-link">
          Pusat Riset Geoinformatika
        </a>
        <span>dan</span>
        <a href="https://brin.go.id/orei/pusat-riset-sains-data-dan-informasi/page/selamat-datang-4" className="program-link">
          Pusat Riset Sains Data dan Informasi
        </a>
      </p>
      <style jsx>{`
        .program-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 0 var(--page-pad-x);
        }

        .program-title {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(90deg, #205072 0%, #32909c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }
        .program-description {
          font-family: var(--font-body);
          font-size: 15px;
          line-height: 1.55;
          color: var(--color-ink);
          margin: 0;
          max-width: 920px;
        }
        .program-links {
          font-family: var(--font-body);
          font-size: 15px;
          line-height: 1.55;
          color: var(--color-navy);
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .program-link {
          color: #205072;
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
}

export default ProgramSection;
