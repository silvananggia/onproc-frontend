import React, { useState, useRef } from "react";
import Map from "./Map";
import GeolocationButton from "./GeolocationButton";
import BasemapSelect from "./BasemapSelect";
import DrawButton from "./DrawButton";
import { Button, Box } from '@mui/material';
import { WorkOutline } from '@mui/icons-material';

const MapComponent = ({ bbox, selectedItem, collectionId, onAoiChange, isWorkspaceVisible, toggleWorkspace }) => {
  const [map, setMap] = useState(null);
  const vectorLayerRef = useRef(null);



  return (
    <div className="contentRoot">
      <Map map={map} setMap={setMap} vectorLayerRef={vectorLayerRef} bbox={bbox} selectedItem={selectedItem} collectionId={collectionId} />
      {map && (
        <div className="button-container">
          <DrawButton map={map} vectorLayerRef={vectorLayerRef} onAoiChange={onAoiChange} />
          <GeolocationButton map={map} />
          <BasemapSelect map={map} />
        </div>
      )}
      <Box
        onClick={toggleWorkspace}
        sx={{
          position: 'absolute',
          top: '60px',
          right: '10px',
          background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.3)',
          padding: '12px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
          transition: 'all 0.2s ease',
          fontWeight: 600,
          fontSize: '0.9rem',
          '&:hover': {
            background: 'linear-gradient(135deg, #45a049 0%, #1b5e20 100%)',
            boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <WorkOutline sx={{ fontSize: '18px' }} />
        {isWorkspaceVisible ? 'Hide Workspace' : 'Show Workspace'}
      </Box>

    </div>
  );
};

export default MapComponent;
