import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
 
} from "recharts";
import { Typography, Paper ,Box} from "@mui/material";

const data = [
  { name: "Indonesia", revenue: 20 },
  { name: "United States", revenue: 30 },
  { name: "Taiwan", revenue: 15 },
  { name: "Turkey", revenue: 25 },
  { name: "Sweden", revenue: 18 },
  { name: "Thailand", revenue: 24 },
  { name: "England", revenue: 22 },
  { name: "Italy", revenue: 17 },
  { name: "Australia", revenue: 19 },
];

function RevenueBarChart() {
  return (
    <Box style={{ padding: 16, marginTop: 16, width: "100%", maxWidth: 600 }}>
      <Typography variant="h6" fontWeight={'bolder'} gutterBottom>
        Top 10 Countries by Revenue in M$
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={80} />
          <Tooltip />
          <Bar dataKey="revenue" fill="#82ca9d" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default RevenueBarChart;
