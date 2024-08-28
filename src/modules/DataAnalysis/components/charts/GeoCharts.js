import React from "react";
import WorldMap from "react-svg-worldmap";
import { Box, Typography, Paper, Stack } from "@mui/material";

const GeoChartComponent = ({ data }) => {
  // Define colors for visualization
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
  ];

  // Prepare data for the world map
  const prepareDataForMap = (data) => {
    return data.map((item, index) => ({
      country: item.country_code,
      value: item.total_count,
      color: colors[index % colors.length], // Cycle through colors
    }));
  };

  const mapData = prepareDataForMap(data);

  return (
    <Box
      sx={{ width: "100%", maxWidth: 1200, margin: "auto", overflow: "hidden" }}
    >
      <WorldMap
        color="red" // Default color, overridden by mapData
        valueSuffix="%"
        size="responsive"
        data={mapData}
        style={{ width: "100%", height: "auto", maxHeight: "500px" }}
      />
      {/* Optional legend */}
      {/* <Paper elevation={1} sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Legend
        </Typography>
        <Stack direction="row" flexWrap="wrap">
          {colors.map((color, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mr: 2, mb: 1 }}
            >
              <Box sx={{ width: 20, height: 20, bgcolor: color, mr: 1 }} />
              <Typography variant="body2">Color {index + 1}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper> */}
    </Box>
  );
};

export default GeoChartComponent;
