import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Typography, Paper } from "@mui/material";

// Sample data
const data = [
  { date: "15/04/2019", price: 60, volume: 20000000 },
  { date: "15/04/2020", price: 70, volume: 22000000 },
  { date: "15/04/2021", price: 50, volume: 21000000 },
  { date: "15/04/2022", price: 100, volume: 25000000 },
  { date: "15/04/2023", price: 90, volume: 23000000 },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <Paper style={{ padding: 10 }}>
        <Typography>Date: {label}</Typography>
        <Typography>Price: {payload[0].value}</Typography>
        <Typography>Volume: {payload[1].value.toLocaleString()}</Typography>
      </Paper>
    );
  }

  return null;
}

function PriceVolumeChart() {
  return (
    <Paper style={{ width: "100%" }}>
      <Typography fontWeight={"bolder"} variant="h5" padding={3}>
        Price & Volume
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        {" "}
        {/* Set a fixed height */}
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            yAxisId="left"
            domain={[40, 120]}
            label={{ value: "Price", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[10000000, 30000000]}
            label={{ value: "Volume", angle: 90, position: "insideRight" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#E7713B"
            yAxisId="left"
          />
          <Line
            type="monotone"
            dataKey="volume"
            stroke="#1D6081"
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default PriceVolumeChart;
