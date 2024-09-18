import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Container, useTheme, useMediaQuery } from "@mui/material";

const COLORS = [
  "#2F4B7C",
  "#A05195",
  "#D45087",
  "#F95D6A",
  "#FF7C43",
  "#FFA600",
  "#665191",
  "#1D8E9B",
  "#8EC06C",
  "#F95D6A",
  "#FFA600",
];

const HorizontalBarChart = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Calculate the total count for percentage calculation
  const totalCount = data.reduce((sum, entry) => sum + entry.total_count, 0);

  return (
    <Container maxWidth="lg" sx={{ height: "100%", py: 4 }}>
      <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis
            dataKey="sector"
            type="category"
            tickFormatter={(value) =>
              value.length > 15 ? `${value.slice(0, 15)}...` : value
            }
            width={150}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_count" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

            {/* Add labels to display the percentage */}
            <LabelList
              dataKey="total_count"
              position="right"
              formatter={(value) =>
                `${((value / totalCount) * 100).toFixed(1)}%`
              }
              fill="#000"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default HorizontalBarChart;
