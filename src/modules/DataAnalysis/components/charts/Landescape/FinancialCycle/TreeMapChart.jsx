import React from "react";
import ReactECharts from "echarts-for-react";
import { Paper, Typography, Box } from "@mui/material";

const TreemapChart = ({ title, data, additionalInfo }) => {
  const option = {
    series: [
      {
        type: "treemap",
        data: data,
      },
    ],
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 3, borderRadius: "10px", maxWidth: 400, margin: "auto" }}
    >
      
        <ReactECharts option={option} style={{ height: 300, width: "100%" }} />
      
      <Box sx={{ mt: 3 }}>
        {additionalInfo.map((info, index) => (
          <Box
            key={index}
            sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
          >
            <Typography>{info.name}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontWeight: "bold" }}>{info.value}</Typography>
              <Typography
                sx={{
                  color: info.percentage > 0 ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {info.percentage}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

TreemapChart.defaultProps = {
  title: "Default Title",
  data: [
    {
      name: "nodeA",
      value: 30,
      children: [
        {
          name: "Debt Service",
          value: 20,
          itemStyle: {
            color: "#4CAF50",
          },
        },
        {
          name: "Equity Service",
          value: 10,
          itemStyle: {
            color: "#FF7043",
          },
        },
      ],
      itemStyle: {
        color: "#004b80",
      },
    },
    {
      name: "nodeB",
      value: 30,
      children: [
        {
          name: "Cashflow",
          value: 30,
          itemStyle: {
            color: "#FFA726",
          },
        },
      ],
      itemStyle: {
        color: "#42A5F5",
      },
    },
  ],
  additionalInfo: [
    {
      name: "Free Cash Flow",
      value: "$30",
      percentage: 10.4,
    },
    {
      name: "Debt Service",
      value: "$20",
      percentage: 12.6,
    },
    {
      name: "Equity Service",
      value: "$10",
      percentage: -7.4,
    },
  ],
};

export default TreemapChart;
