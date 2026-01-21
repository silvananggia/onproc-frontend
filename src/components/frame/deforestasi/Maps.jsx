import React from "react";
import Header from "../../layouts/Header";
import Map from "./MapComponent";
import "./Maps.css";

function DeforestasiPage() {
  return (
    <div className="deforestasi-page">
      <Header />
      
      <main className="main-content-deforestasi">
        <Map />
      </main>
    </div>
  );
}

export default DeforestasiPage;
