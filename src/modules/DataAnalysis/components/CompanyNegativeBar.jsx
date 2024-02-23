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

    const yAxisData = chartData.company_name;

    const bestSeriesData = [
      {
        value: parseFloat(chartData.best_return),
        itemStyle: {
          color: parseFloat(chartData.best_return) >= 0 ? "blue" : "orange",
        },
        label: {
          show: parseFloat(chartData.best_return) >= 0,
          position: "right",
          formatter: "{b}",
        },
      },
    ];

    const worstSeriesData = [
      {
        value: parseFloat(chartData.worst_return),
        itemStyle: {
          color: parseFloat(chartData.worst_return) >= 0 ? "blue" : "orange",
        },
        label: {
          show: parseFloat(chartData.worst_return) >= 0,
          position: "left",
          formatter: "{b}",
        },
      },
    ];

    const option = {
      title: {
        text: chartTitle,
      },
      legend: {
        data: ["Best Return", "Worst Return"], // Legend labels
        itemGap: 20,
      },
      itemStyle: {
        height: 50,
        borderRadius: 4,
      },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        top: 80,
        bottom: 30,
      },
      xAxis: {
        type: "value",
        position: "top",
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
      },
      yAxis: {
        type: "category",
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        data: yAxisData,
      },
      series: [
        {
          name: "Best Return",
          type: "bar",
          stack: "Total",
          label: {
            show: true,
            formatter: "{c}",
          },
          data: bestSeriesData,
          color: "blue",
        },
        {
          name: "Worst Return",
          type: "bar",
          stack: "Total",
          label: {
            show: true,
            formatter: "{c}",
          },
          data: worstSeriesData,
          color: "orange",
        },
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [chartId, chartTitle, chartData]);

  return <div id={chartId} style={{ width: "100%", height: "400px" }} />;
};

export default CompanyNegativeBar;
