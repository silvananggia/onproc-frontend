import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import axios from 'axios';

const OlMapWithStacSearch = () => {
  const mapRef = useRef(null);
  const [features, setFeatures] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  useEffect(() => {
    // Define the geometry
    const geometry = {
      "type": "Polygon",
      "coordinates": [
        [
            [94.0, -11.0], // Southwest (bottom-left)
            [141.0, -11.0], // Southeast (bottom-right)
            [141.0, 6.0], // Northeast (top-right)
            [94.0, 6.0], // Northwest (top-left)
            [94.0, -11.0], // Repeat the first point to close the polygon
          ]
      ]
    };

    // Define the search parameters
    const searchParams = {
      collections: ["landsat-c2-l2"],
      intersects: geometry,
      datetime: "2022-06-01/2022-09-01",
      query: {
        "eo:cloud_cover": {
          lte: 10,
        },
      },
      max_items: 10,
    };

    // Perform the search using Axios
    axios.post("https://planetarycomputer.microsoft.com/api/stac/v1/search", searchParams, {
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    const itemCollection = response.data.features;

    // Log the received GeoJSON data
    console.log("Received GeoJSON data:", itemCollection);

    // Create a GeoJSON format object
    const geojsonFormat = new GeoJSON();

    // Try to convert the GeoJSON data to features
    try {
      // Convert the GeoJSON data to features
      const parsedFeatures = geojsonFormat.readFeatures(itemCollection);

      // Set the features in the state
      setFeatures(parsedFeatures);

      // Access the OL map instance and add a vector layer with the features
      const map = mapRef.current;
      const vectorLayer = new TileLayer({
        source: new XYZ(),
      });

      // Add the features to the vector layer
      vectorLayer.getSource().addFeatures(parsedFeatures);

      // Add the vector layer to the map
      map.addLayer(vectorLayer);

      // Fit the view to the extent of the features
      map.getView().fit(vectorLayer.getSource().getExtent());
    } catch (error) {
      console.error("Error parsing GeoJSON data:", error);
    }
  })
  .catch((error) => console.error("Error performing STAC search:", error));

  }, []); // Empty dependency array ensures this runs only once on component mount

  const handleItemClick = (itemId) => {
    setSelectedItemId(itemId);

    // Retrieve details for the selected item
    const selectedItem = features.find(feature => feature.getProperties().id === itemId);
    setSelectedItemDetails(selectedItem.getProperties());

    // Highlight the feature on the map
    const map = mapRef.current;
    const vectorLayer = map.getLayers().item(1); // Assuming the vector layer is the second layer
    vectorLayer.getSource().forEachFeature((feature) => {
      if (feature.getProperties().id === itemId) {
        feature.setStyle(/* Add a style for highlighting */);
      } else {
        feature.setStyle(null); // Reset style for other features
      }
    });
  };

  // Set up the OL map when the component mounts
  useEffect(() => {
    // Create an OL map instance
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          }),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    // Save the map instance in the ref for future use
    mapRef.current = map;

    // Cleanup function
    return () => {
      map.dispose();
    };
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '50vh' }}></div>
      <h1>STAC Search Example with OpenLayers and Axios</h1>

      {/* Display the list of STAC items */}
      <div>
        <h2>STAC Items</h2>
        <ul>
          {features.map((feature) => (
            <li
              key={feature.getProperties().id}
              onClick={() => handleItemClick(feature.getProperties().id)}
              style={{ cursor: 'pointer', color: selectedItemId === feature.getProperties().id ? 'blue' : 'black' }}
            >
              {feature.getProperties().id}
            </li>
          ))}
        </ul>
      </div>

      {/* Display details for the selected item */}
      {selectedItemDetails && (
        <div>
          <h2>Selected Item Details</h2>
          <pre>{JSON.stringify(selectedItemDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default OlMapWithStacSearch;
