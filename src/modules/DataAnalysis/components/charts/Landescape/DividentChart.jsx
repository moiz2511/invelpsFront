import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,Cell
} from "recharts";
import { Paper, Typography } from "@mui/material";

// Sample data
const data = [
  { date: "2019-03-27", dividend: 6, shadowOffset: 1 },
  { date: "2020-03-30", dividend: 5, shadowOffset: 1 },
  { date: "2021-03-30", dividend: 5, shadowOffset: 1 },
  { date: "2022-03-30", dividend: 6, shadowOffset: 1 },
  { date: "2023-03-30", dividend: 5, shadowOffset: 1 },
];

function DividendChart() {
  return (
    <Paper style={{ padding: "20px", margin: "20px" }}>
      <Typography
        variant="h6"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        Dividends (in JPY)
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          {/* Shadow bars */}
          <Bar dataKey="shadowOffset" fill="#ccc" barSize={20}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-shadow-${index}`}
                fill="#b0bec5"
                x={entry.shadowOffset * 5}
              />
            ))}
          </Bar>
          {/* Actual data bars */}
          <Bar dataKey="dividend" fill="#82ca9d" barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-dividend-${index}`} fill="#00897b" />
            ))}
            <LabelList dataKey="dividend" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default DividendChart;
