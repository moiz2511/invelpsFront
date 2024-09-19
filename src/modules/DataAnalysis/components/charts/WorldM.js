import React from "react";
import WorldMap from "react-svg-worldmap";

const WorldM = ({ countryColors, mapData }) => {
  const getStyle = ({
    countryValue,
    countryCode,
    minValue,
    maxValue,
    color,
  }) => ({
    // fill:countryCode === "US" ? "blue" : countryCode === "IN" ? "green" : color,
    fill: countryColors[countryCode] || color,
    fillOpacity: countryValue
      ? 0.1 + (1.5 * (countryValue - minValue)) / (maxValue - minValue)
      : 0,
    stroke: "green",
    strokeWidth: 1,
    strokeOpacity: 0.2,
    cursor: "pointer",
  });

  return (
    <WorldMap
      color="red" // Default color, overridden by mapData
      valueSuffix="%" // Value suffix for display
      size="responsive" // Responsive sizing
      data={mapData} // The map data with countries and colors
      style={{ width: "100%", height: "auto", maxHeight: "500px" }}
      styleFunction={getStyle}
    />
  );
};

export default WorldM;
