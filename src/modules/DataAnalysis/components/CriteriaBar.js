import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const CriteriaBar = ({ data }) => {
  const chartRef = useRef(null);

  const keys = [
    "performance",
    "risk",
    "value",
    "profitability",
    "liquidity",
    "solvency",
    "efficiency",
    "return_field",
    "valuation",
  ];

  const chartData = keys.map((key) => data[key] || "N/A");

  console.log(chartData);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    const categories = [
      "Cash Flow",
      "Return",
      "Profitability",
      "Valuation",
      "Solvency",
    ];
    const data = [120, 200, 150, 80, 70]; // Sample data, you can replace it with your own data

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      yAxis: {
        type: "category",
        data: keys,
        axisLabel: {
          rotate: 0,
          textStyle: {
            fontSize: 12,
          },
        },
      },
      xAxis: {
        type: "value",
        name: "Value", // Label for x-axis
        axisLabel: {
          textStyle: {
            fontSize: 12, // Adjust font size if needed
          },
        },
      },
      series: [
        {
          data: chartData,
          type: "bar",
          barWidth: "60%",
          itemStyle: {
            color: getRandomColor(), // Custom color for bars
          },
        },
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default CriteriaBar;
