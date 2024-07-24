import React, { useEffect } from "react";
import * as echarts from "echarts";
import { Card } from "@mui/material";

const VerticalBarChart = ({ chartId, graphData }) => {
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const chartDom = document.getElementById(chartId);
    const myChart = echarts.init(chartDom);

    const names = graphData.map((item) => item.strategy_label);
    const totalReturn = graphData.map((item) => item.total_return);
    const sharpeRatio = graphData.map((item) => item.sharpe_ratio);
    const annualizedReturn = graphData.map((item) => item.annualized_return);

    const graphValues =
      chartId === "bar-chart-1"
        ? totalReturn
        : chartId === "bar-chart-2"
        ? sharpeRatio
        : chartId === "bar-chart-3"
        ? annualizedReturn
        : [];

    const graphTitle =
      chartId === "bar-chart-1"
        ? "Total Return"
        : chartId === "bar-chart-2"
        ? "Sharpe Ratio"
        : chartId === "bar-chart-3"
        ? "Annual Return"
        : "";

    const option = {
      title: {
        text: graphTitle,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        // Allow negative bars only for the Sharpe Ratio chart
        min: chartId === "bar-chart-2" ? undefined : 0,
      },
      yAxis: {
        type: "category",
        data: names,
      },
      series: [
        {
          name: graphTitle,
          type: "bar",
          data: graphValues,
        },
      ],
      color: getRandomColor(),
    };

    if (myChart) {
      myChart.setOption(option);
    }

    return () => {
      myChart.dispose();
    };
  }, [chartId, graphData]); // Ensure effect updates if chartId or graphData changes

  return (
    <Card
      id={chartId}
      style={{ width: "100%", height: "300px", alignSelf: "center" }}
    />
  );
};

export default VerticalBarChart;
