import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell
} from "recharts";
import { Box, Paper, Typography } from "@mui/material";

// Sample data
const data = [
  { name: "Country 1", value: -12.2 },
  { name: "Country 2", value: -9.8 },
  { name: "Country 3", value: -11.7 },
  { name: "Country 4", value: -2.6 },
  { name: "Country 5", value: 2.6 },
  { name: "Country 6", value: 7.1 },
  { name: "Country 7", value: 7.2 },
  { name: "Country 8", value: 3.8 },
];

// Function to determine bar color
const getColor = (value) => {
  if (value < -10) return "#666666"; // Dark gray for large negative
  if (value < 0) return "#888888"; // Lighter gray for negative
  if (value < 5) return "#34A853"; // Green for low positive
  if (value < 10) return "#4285F4"; // Blue for moderate positive
  return "#F4B400"; // Gold for high positive
};

function PerformanceByCountryChart() {
  return (
    <Box style={{ padding: "1rem", margin: "1rem" }}>
      <Typography
        variant="h6"
        style={{ textAlign: "left", marginBottom: "0.5rem" , fontWeight:'bolder' }}
      >
        Performance by Country, FY2020
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
            ))}
            <LabelList dataKey="value" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default PerformanceByCountryChart;
