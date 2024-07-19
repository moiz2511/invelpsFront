import React from "react";
import WorldMap from "react-svg-worldmap";
import { Box, Typography, Paper, Stack } from "@mui/material";


const GeoChartComponent = ({ data }) => {
  const exchangeToCountryCode = {
    // Mapping exchanges to country codes
    "National Stock Exchange Of India": "IN",
    "Taipei Exchange": "TW",
    "NASDAQ Global Market": "US",
    "Athens Stock Exchange": "GR",
    "Six Swiss Exchange": "CH",
    "Hong Kong Exchange": "HK",
    "London Stock Exchange": "GB",
    "Frankfurt Stock Exchange": "DE",
    "Johannesburg Stock Exchange": "ZA",
    "New York Stock Exchange": "US",
    "NASDAQ Capital Market": "US",
    "Shenzhen Stock Exchange": "CN",
    "Korea Exchange": "KR",
    "Shanghai Stock Exchange": "CN",
    "Nyse Euronext - Euronext Brussels": "BE",
    "Euronext Paris": "FR",
    "Australian Securities Exchange": "AU",
    "Tokyo Stock Exchange": "JP",
    "Bombay Stock Exchange": "IN",
    "Toronto Stock Exchange Ventures": "CA",
    "Madrid Stock Exchange": "ES",
  };

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

  const mapExchangesToCountryCodes = (data) => {
    return data.map((exchange, index) => {
      const countryCode = exchangeToCountryCode[exchange[0]] || "Unknown";
      const colorIndex = index % colors.length; // Cycle through colors
      return {
        country: countryCode,
        value: exchange[1],
        color: colors[colorIndex],
      };
    });
  };

  const chartData = [
    ["Exchange", "Total Count"],
    ...data.map((item) => [item.exchange, item.total_count]),
  ];

  const mappedData = mapExchangesToCountryCodes(chartData);

  return (
    <Box
      sx={{ width: "100%", maxWidth: 1200, margin: "auto", overflow: "hidden" }}
    >
      <WorldMap
        color="red" // Default color, overridden by mappedData
        valueSuffix="%"
        size="responsive"
        data={mappedData}
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
