// Map.js
import React, { useEffect, useState } from "react";
import { Map, View } from "ol";
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import "./Map.scss";

import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { defaults as defaultControls } from "ol/control";
import LayerGroup from "ol/layer/Group";

const MapComponent = ({ map, setMap }) => {
  const [centerMap, setCenterMap] = useState([
    13124075.715923082, -277949.29803053016,
  ]);
  const [zoomLevel, setZoomLevel] = useState(5);
  useEffect(() => {
    if (!map) {
      const newMap = new Map({
        target: "map",
        controls: defaultControls(),
        layers: [
          new LayerGroup({
            title: "Basemap",
            layers: [
              new TileLayer({
                title: "Basemap",
                source: new XYZ({
                  url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                }),
              }),
            ],
          }),
          new LayerGroup({
            title: "Basemap",
          }),

          new LayerGroup({
            title: "Overlay",
          }),
        ],
        view: new View({
          center: centerMap,
          zoom: zoomLevel,
          maxZoom: 20,
        }),
      });
      setMap(newMap);
    }
  }, [map, setMap]);

  return <div id="map" className="map"></div>;
};

export default MapComponent;
