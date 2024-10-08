import React, { useEffect, useState } from "react";
import WorldMap from "react-svg-worldmap";
import { Box, Typography, Paper, Stack, Skeleton } from "@mui/material";

const GeoChartComponent = ({
  data,
  selectedCountry,
  setSelectedCountry,
  setSSortBy,
  sSortBy,
  setCompanySortBy,
  companySortBy,
}) => {
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

  console.log(data);

  const [countryColors, setCountryColors] = useState({});
  const [mapData, setMapData] = useState([]);

  console.log("Data received:", data);
  console.log("Map data:", mapData);

  console.log("selected country:", selectedCountry);

  const prepareDataForMap = (data) => {
    let newCountryColors = {};
    const mappedData = data
      .map((item, index) => {
        if (item.country_code === "Unknown") {
          return null;
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
      .filter((item) => item !== null);

    setCountryColors(newCountryColors);
    return mappedData;
  };

  useEffect(() => {
    if (data) {
      console.log("Data is an array:", data);
      const mapD = prepareDataForMap(data);
      setMapData(mapD);
      console.log(mapData);
      console.log(mapD);
      console.log(data);
    } else {
      console.log("Data is not valid for map:", data);
      setMapData([]);
    }
  }, [data]);

  const getStyle = ({ countryValue = 0, countryCode, color }) => ({
    fill: countryColors[countryCode] || color,
    fillOpacity: countryValue ? 0.1 + (1.5 * countryValue) / 100 : 0,
    stroke: "green",
    strokeWidth: 1,
    strokeOpacity: 0.2,
    cursor: "pointer",
  });

  const handleCountryClick = (countryCode) => {
    console.log(sSortBy);
    console.log(companySortBy);
    console.log(countryCode);

    setSelectedCountry(countryCode);
    setSSortBy(null);
    setCompanySortBy("");
    console.log(sSortBy);
    console.log(companySortBy);
    console.log(countryCode);
  };
  return (
    <Box
      sx={{ width: "100%", maxWidth: 1200, margin: "auto", overflow: "hidden" }}
    >
      {mapData?.length > 0 ? (
        <WorldMap
          color="red"
          valueSuffix="%"
          size="responsive"
          data={mapData}
          style={{ width: "100%", height: "auto", maxHeight: "500px" }}
          styleFunction={getStyle}
          onClickFunction={(event) => handleCountryClick(event.countryCode)}
        />
      ) : (
        <Box sx={{ width: { xs: "100%", sm: "33%", lg: "700px" }, padding: 2 }}>
          <Skeleton animation="wave" variant="rectangular" height={300} />
        </Box>
      )}

      <Paper elevation={1} sx={{ mt: 2, p: 2 }}>
        <Stack direction="row" flexWrap="wrap">
          {mapData?.length > 0 ? (
            mapData.map((item, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", mr: 2, mb: 1 }}
              >
                <Box
                  sx={{ width: 20, height: 8, bgcolor: item.color, mr: 1 }}
                />
                <Typography variant="body2">{item.country || "N/A"}</Typography>
              </Box>
            ))
          ) : (
            <></>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default GeoChartComponent;
