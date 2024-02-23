import React, { useEffect } from "react";
import * as echarts from "echarts";

const LineRaceChart = ({ chartId, chartData, years }) => {
  useEffect(() => {
    const run = () => {
      const datasetWithFilters = [];
      const seriesList = [];
      const legendData = []; // To store legend data
    
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
            Name: strategyName 
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
    
        legendData.push(strategyName); // Add strategyName to legendData
      });
    
      const option = {
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            const data = params[0].data;
            return `Year: ${data.Year}<br />
                    Return: ${data.Return}<br />
                    Name: ${data.Name}`; // Displaying Name at the end
          }
        },
        xAxis: {
          type: "category",
          data: years,
        },
        yAxis: {
          type: "value",
        },
        legend: {
          data: legendData, // Set legend data
        },
        dataset: datasetWithFilters,
        series: seriesList,
      };

      console.log(datasetWithFilters)
      console.log(seriesList)
    
      const chartContainer = document.getElementById(chartId);
      const myChart = echarts.init(chartContainer);
      myChart.setOption(option);
    };
    

    run();
  }, [chartData, chartId, years]);

  return <div id={chartId} style={{ width: "100%", height: "400px" }} />;
};

export default LineRaceChart;
