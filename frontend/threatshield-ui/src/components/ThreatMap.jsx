import React from 'react';
import './ThreatMap.css';

// The 'import' is no longer needed

function ThreatMap() {
  return (
    <div className="map-widget">
      <h3 className="widget-title">Global Threat Origins</h3>
      <div className="map-image-container">
        {/* This now uses a direct path to the public folder */}
        <img src="/threat-map.jpg" alt="Global Threat Map" className="map-image" />
      </div>
    </div>
  );
}
export default ThreatMap;