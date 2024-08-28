import React, { useEffect } from "react";
import * as echarts from "echarts";

const CompanyNegativeBar = ({
  chartId,
  chartTitle = "Bar Chart",
  chartData,
}) => {
  useEffect(() => {
    const chartDom = document.getElementById(chartId);
    const myChart = echarts.init(chartDom);

    // Axis data
    const xAxisData = chartData.company_name;

    // Series data with colors matching the legend
    const bestSeriesData = [
      {
        value: parseFloat(chartData.best_return),
        itemStyle: {
          color: "blue", // Color for "Best Return"
        },
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
        },
      },
    ];

    const worstSeriesData = [
      {
        value: parseFloat(chartData.worst_return),
        itemStyle: {
          color: "orange", // Color for "Worst Return"
        },
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
        },
      },
    ];

    const option = {
      title: {
        text: chartTitle,
      },
      legend: {
        data: ["Best Return", "Worst Return"],
        itemGap: 20,
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
        type: "category",
        data: xAxisData,
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Best Return",
          type: "bar",
          barWidth: "60%",
          data: bestSeriesData,
          itemStyle: {
            color: "blue", // Ensure the bar color matches the legend color
          },
        },
        {
          name: "Worst Return",
          type: "bar",
          barWidth: "60%",
          data: worstSeriesData,
          itemStyle: {
            color: "orange", // Ensure the bar color matches the legend color
          },
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [chartId, chartTitle, chartData]);

  return <div id={chartId} style={{ width: "100%", height: "400px" }} />;
};

export default CompanyNegativeBar;
