import React from "react";
import Header from "../../layouts/Header";
import TunafinderMap from "./TunafinderMap";

function InfoTunafinder() {
  return (
    <main className="info-page">
      <Header />
      <div className="info-map-area">
        <TunafinderMap />
      </div>
      <style jsx>{`
        .info-page {
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          width: 100%;
          height: 100vh;
        }
        .info-map-area {
          flex: 1;
          min-height: 0;
          width: 100%;
        }
      `}</style>
    </main>
  );
}

export default InfoTunafinder;
