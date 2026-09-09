import React, { useState } from "react";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import "./BasemapToggle.css";

const BASEMAPS = {
  default: {
    label: "Default",
    preview:
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/4/12/7",
    createLayer: () =>
      new TileLayer({
        title: "Basemap",
        zIndex: 0,
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          attributions: "&copy; <a href='https://www.esri.com/'>Esri</a>",
        }),
      }),
  },
  satellite: {
    label: "Satelit",
    preview:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/4/12/7",
    createLayer: () =>
      new TileLayer({
        title: "Basemap",
        zIndex: 0,
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attributions: "&copy; <a href='https://www.esri.com/'>Esri</a>",
          maxZoom: 19,
        }),
      }),
  },
};

export function applyBasemap(map, type) {
  if (!map) return;
  const next = BASEMAPS[type] || BASEMAPS.default;
  const collection = map.getLayers();
  const layers = collection.getArray();
  const index = layers.findIndex((item) => item.get("title") === "Basemap");
  const newLayer = next.createLayer();

  if (index >= 0) {
    collection.removeAt(index);
    collection.insertAt(index, newLayer);
  } else {
    collection.insertAt(0, newLayer);
  }
}

function BasemapToggle({ map }) {
  const [active, setActive] = useState("default");

  const handleSelect = (type) => {
    applyBasemap(map, type);
    setActive(type);
  };

  return (
    <div className="basemap-toggle" role="group" aria-label="Pilih basemap">
      {Object.entries(BASEMAPS).map(([key, option]) => (
        <button
          key={key}
          type="button"
          className={`basemap-option ${active === key ? "active" : ""}`}
          onClick={() => handleSelect(key)}
          aria-pressed={active === key}
          title={option.label}
        >
          <img src={option.preview} alt="" />
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}

export default BasemapToggle;
