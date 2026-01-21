import React, { useState } from "react";
import MapComponent from "./MapComponent";
import MenuIcon from '@mui/icons-material/Menu';
import { Typography } from "@mui/material";

const Home = () => {
  const [bbox, setBbox] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const [aoiCoords, setAoiCoords] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isWorkspaceVisible, setIsWorkspaceVisible] = useState(false);

  const handleHoverItem = (bbox) => {
    setBbox(bbox);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  const handleCollectionSelect = (id) => {
    setCollectionId(id);
  };

  const handleAoiChange = (coords) => {
    setAoiCoords(coords);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleWorkspace = (isWorkspaceVisible) => {
    setIsWorkspaceVisible(isWorkspaceVisible);
  };

  const toggleWorkspace = () => {
    setIsWorkspaceVisible(!isWorkspaceVisible);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <MapComponent
        bbox={bbox}
        selectedItem={selectedItem}
        collectionId={collectionId}
        onAoiChange={handleAoiChange}
        isWorkspaceVisible={isWorkspaceVisible}
        toggleWorkspace={toggleWorkspace}
      />
    </div>
  );
};

export default Home;
