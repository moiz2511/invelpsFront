import React, { useEffect } from "react";
import * as echarts from "echarts";

const LineRaceChart = ({ chartId, chartData, years }) => {
  useEffect(() => {
    const run = () => {
      const datasetWithFilters = [];
      const seriesList = [];

      chartData.forEach((strategyData, index) => {
        const datasetId = "dataset_" + index;
        const strategyName = strategyData.strategy_name_here;
        const strategyYears = Object.keys(strategyData).filter(
          (key) => key !== "strategy_name_here"
        );

        const filteredData = strategyYears.map((year) => {
          return {
            Year: year,
            Return: parseFloat(strategyData[year].anual_return) || 0, // Using 0 if 'anual_return' is null
          };
        });

        datasetWithFilters.push({
          id: datasetId,
          source: filteredData,
        });

        seriesList.push({
          type: "line",
          datasetId: datasetId,
          showSymbol: false,
          name: strategyName,
          encode: {
            x: "Year",
            y: "Return",
          },
        });
      });

      const option = {
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: years,
        },
        yAxis: {
          type: "value",
        },
        dataset: datasetWithFilters, 
        series: seriesList,
      };

      const chartContainer = document.getElementById(chartId);
      const myChart = echarts.init(chartContainer);
      myChart.setOption(option);
    };

    run();
  }, [chartData, chartId, years]);

  return <div id={chartId} style={{ width: "100%", height: "400px" }} />;
};

export default LineRaceChart;
