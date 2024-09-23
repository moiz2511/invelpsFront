import React, { useEffect, useState } from "react";
import WorldMap from "react-svg-worldmap";
import { Box, Typography, Paper, Stack } from "@mui/material";

const GeoChartComponent = ({ data }) => {
  const colors = [
    "#FFD700",
    "#FFA07A",
    "#20B2AA",
    "#FF6347",
    "#4682B4",
    "#DA70D6",
    "#32CD32",
    "#F4A460",
    "#87CEEB",
    "#FF69B4",
    "red",
    "blue",
    "green",
    "yellow",
    "white",
    "black",
    "orange",
  ];

  const [countryColors, setCountryColors] = useState({});
  const [mapData, setMapData] = useState(null);

  const prepareDataForMap = (data) => {
    let newCountryColors = {};

    const mappedData = data
      .map((item, index) => {
        if (item.country_code === "Unknown") {
          return null; // Skip unknown country codes
        } else {
          newCountryColors[item.country_code] =
            newCountryColors[item.country_code] ||
            colors[index % colors.length];
          return {
            country: item.country_code,
            value: item.total_count,
            color: newCountryColors[item.country_code],
          };
        }
      })
      .filter((item) => item !== null); // Filter out null entries

    // Set the state once after the loop
    setCountryColors(newCountryColors);
    return mappedData;
  };

  useEffect(() => {
    if (data) {
      const mapD = prepareDataForMap(data);
      setMapData(mapD);
    }
  }, [data]); // Only recalculate when the `data` changes

  const getStyle = ({
    countryValue,
    countryCode,
    minValue,
    maxValue,
    color,
  }) => ({
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
    <Box
      sx={{ width: "100%", maxWidth: 1200, margin: "auto", overflow: "hidden" }}
    >
      {mapData && (
        <WorldMap
          color="red" // Default color, overridden by mapData
          valueSuffix="%" // Value suffix for display
          size="responsive" // Responsive sizing
          data={mapData} // The map data with countries and colors
          style={{ width: "100%", height: "auto", maxHeight: "500px" }}
          styleFunction={getStyle}
        />
      )}

      {/* Legend for country colors */}
      <Paper elevation={1} sx={{ mt: 2, p: 2 }}>
        <Stack direction="row" flexWrap="wrap">
          {mapData?.map((item, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mr: 2, mb: 1 }}
            >
              <Box sx={{ width: 20, height: 8, bgcolor: item.color, mr: 1 }} />
              <Typography variant="body2">{item.country}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default GeoChartComponent;
