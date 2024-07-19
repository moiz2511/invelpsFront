import React from "react";
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, Typography } from "@mui/material";

const data = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 30 },
  { name: "Mar", value: 20 },
  { name: "Apr", value: 27 },
  { name: "May", value: 18 },
  { name: "Jun", value: 23 },
  { name: "Jul", value: 34 },
];

function MarketDataChart() {
  return (
    <Card sx={{ padding: 2, boxShadow: 3, width: 200 }}>
      <Typography
        variant="h6"
        component="div"
        sx={{ fontWeight: "bold", marginBottom: 2 }}
      >
        Market Data
      </Typography>
      <Typography
        component="div"
        sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
      >
        Market Share: 2%{" "}
        <span style={{ color: "red", marginLeft: "8px" }}>▼</span>
      </Typography>
      <Typography sx={{ marginBottom: 2, fontWeight: "bolder" }}>
        Ranking: <span style={{color:'green'}}>17</span> /33
      </Typography>
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default MarketDataChart;
