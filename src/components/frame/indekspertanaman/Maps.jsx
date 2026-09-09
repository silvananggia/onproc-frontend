"use client";
import React from "react";
import Header from "../../layouts/Header";
import Map from "./MapComponent";

function IndeksPenanamanPadiPage() {
  return (
    <div className="info-page">
      <Header />
      <main className="info-map-area">
        <Map />
      </main>
      <style jsx>{`
        .info-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background-color: #ffffff;
        }
        .info-map-area {
          flex: 1;
          min-height: 0;
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default IndeksPenanamanPadiPage;
