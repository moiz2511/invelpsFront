import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

const data = [
  { year: "2019", hausse: 0, baisse: 0, total: 0 },
  { year: "2020", hausse: 0, baisse: -6.18, total: -3.18 },
  { year: "2021", hausse: 15.54, baisse: 0, total: 15.54 },
  { year: "2022", hausse: 119.54, baisse: 0, total: 119.54 },
  { year: "2023", hausse: 108.8, baisse: 0, total: 108.8 },
];

const AnnualReturnChart = () => {
  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Annual Return/Drawdown
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="hausse" fill="#0073C8" name="Hausse">
            <LabelList
              dataKey="hausse"
              position="top"
              formatter={(value) => `${value.toFixed(2)}%`}
            />
          </Bar>
          <Bar dataKey="baisse" fill="#FF7043" name="Baisse">
            <LabelList
              dataKey="baisse"
              position="top"
              formatter={(value) => `${value.toFixed(2)}%`}
            />
          </Bar>
          <Bar dataKey="total" fill="#004B80" name="Total">
            <LabelList
              dataKey="total"
              position="top"
              formatter={(value) => `${value.toFixed(2)}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default AnnualReturnChart;
