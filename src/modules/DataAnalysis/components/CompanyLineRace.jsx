import React, { useEffect } from "react";
import * as echarts from "echarts";

const CompanyLineRace = ({ chartId, chartData, years }) => {
    useEffect(() => {
        const run = () => {
          const datasetWithFilters = [];
          const seriesList = [];
    
          chartData.forEach((data, index) => {
            const datasetId = "dataset_" + index;
            const strategyName = data.symbol; // Assuming symbol represents the strategy name
    
            // Construct the array of data points for the current strategy
            const filteredData = chartData.map(({ date_year, annual_return }) => ({
              Year: date_year,
              Return: parseFloat(annual_return) || 0,
            }));
    
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
              // Define the value key here
              value: "Return"
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
    
          console.log(datasetWithFilters)
        };
    
        run();
      }, [chartData, chartId, years]);
  return <div id={chartId} style={{ width: "100%", height: "400px" }} />;
};

export default CompanyLineRace;
