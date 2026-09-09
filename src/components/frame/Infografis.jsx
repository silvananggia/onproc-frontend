import React from "react";
import Header from "../layouts/Header";

function Infografis() {
  return (
    <main className="info-page">
      <Header />
      <iframe
        src="https://cms-geomimo-prototype.brin.go.id/dashboards#/"
        title="Infografis GEOMIMO"
        style={{ width: "100%", height: "100%", border: "none", flex: 1, minHeight: 0 }}
      />
      <style jsx>{`
        .info-page {
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          width: 100%;
          height: 100vh;
        }
      `}</style>
    </main>
  );
}

export default Infografis;
