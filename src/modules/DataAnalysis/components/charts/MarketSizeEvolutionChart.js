import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Box, Paper, Typography } from "@mui/material";

// Example data
const data = [
  { name: "2019", Top10: 60, Other: 40 },
  { name: "2020", Top10: 70, Other: 30 },
  { name: "2021", Top10: 75, Other: 25 },
  { name: "2022", Top10: 80, Other: 20 },
];

function MarketSizeEvolutionChart() {
  return (
    <Box style={{ padding: "1rem", margin: "1rem" }}>
      <Typography
        variant="h6"
        style={{ textAlign: "left", marginBottom: "0.5rem" , fontWeight:'bolder' }}
      >
        Top 10 Vs Other Market Size Evolution
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(tick) => `${tick}%`} />
          <Tooltip />
          <Legend />
          <Bar  dataKey="Top10" stackId="a" fill="#82ca9d" />
          <Bar dataKey="Other" stackId="a" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default MarketSizeEvolutionChart;
