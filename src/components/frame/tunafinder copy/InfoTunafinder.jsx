import React from "react";
import Header from "../../layouts/Header";
import TunafinderMap from "./TunafinderMap";

function InfoTunafinder() {
  return (
    <main className="info-page">
      <Header />
      <TunafinderMap />
      <style jsx>{`
        .info-page {
          background-color: #ffffff;
          flex-direction: column;
          overflow: hidden;
          align-items: center;
          width: 100%;
          height: 100vh;
        }
      `}</style>
    </main>
  );
}

export default InfoTunafinder;
