import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Paper, Typography, Box } from "@mui/material";

// Sample data
const sampleData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DonutChartWithText = ({  data }) => {
  return (
    <Box
     
      sx={{ padding: 3, borderRadius: "10px", maxWidth: 400, margin: "auto" }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
  
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50} // Adjusted for wider cells
            outerRadius={100} // Adjusted for wider cells
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>External Funding</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>$90</Typography>
            <Typography sx={{ color: "green", fontWeight: "bold" }}>
              10.4%
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>External Funding</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>$60</Typography>
            <Typography sx={{ color: "green", fontWeight: "bold" }}>
              12.6%
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Debt</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>$30</Typography>
            <Typography sx={{ color: "red", fontWeight: "bold" }}>
              -7.4%
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

DonutChartWithText.defaultProps = {

  data: sampleData,
};

export default DonutChartWithText;
