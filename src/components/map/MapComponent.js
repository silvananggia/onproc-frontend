// MapComponent.js
import React, { useState } from "react";
import Map from "./Map";
import GeolocationButton from "./GeolocationButton";
import BasemapSelect from "./BasemapSelect";

const MapComponent = () => {
  const [map, setMap] = useState(null);

  return (
    <div className="contentRoot">
      <Map map={map} setMap={setMap} />
      <GeolocationButton map={map} />
      <BasemapSelect map={map} />
    </div>
  );
};

export default MapComponent;
