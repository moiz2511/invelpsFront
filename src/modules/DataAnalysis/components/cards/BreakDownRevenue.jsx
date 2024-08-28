import React from "react";
import { Typography, Box } from "@mui/material";

const data = [
  { region: "EMEA", value: 111, percentage: "44%", color: "#0071E3" }, // Blue
  { region: "NORTH AMERICA", value: 65, percentage: "26%", color: "#FFC72C" }, // Yellow
  { region: "APAC", value: 44, percentage: "17%", color: "#34A853" }, // Green
  { region: "LATAM", value: 34, percentage: "13%", color: "#EA4335" }, // Red
];

const RevenueItem = ({ region, value, percentage, color }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
      <Box
        sx={{
          width: 16,
          height: 16,
          backgroundColor: color,
          marginRight: 1,
          borderRadius: "50%",
        }}
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {region}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bolder" }}>{`${value}`}</Typography>
          <Typography
            sx={{ fontWeight: "light" }}
          >{`EURm `}</Typography>
          <Typography
            sx={{ fontWeight: "bolder" }}
          >{`(${percentage})`}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

function BreakdownOfRevenue() {
  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: "#FFFFFF", // White background
        borderRadius: 1,
       
        maxWidth: 300, // Width like the image
        textAlign: "left",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bolder"
        sx={{ marginBottom: 2, textAlign: "center" }}
      >
        Breakdown of Revenue
      </Typography>
      {data.map((item) => (
        <RevenueItem
          key={item.region}
          region={item.region}
          value={item.value}
          percentage={item.percentage}
          color={item.color}
        />
      ))}
    </Box>
  );
}

export default BreakdownOfRevenue;
