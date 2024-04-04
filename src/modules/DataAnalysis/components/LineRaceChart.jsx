import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { Button, Box } from "@mui/material";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const LineRaceChart = ({ chartId, chartData, years, type, chartSwitch }) => {
  const [log, setLog] = useState(true);

  useEffect(() => {
    console.log(chartData);
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

        const filteredData = log
          ? strategyYears.map((year) => {
              return type === "price"
                ? {
                    Year: year,
                    Price: parseFloat(strategyData[year].anualPrice) || 0, // Using 0 if 'anual_return' is null
                    Name: strategyName,
                  }
                : type === "returns"
                ? {
                    Year: year,
                    Return: parseFloat(strategyData[year].anual_return) || 0, // Using 0 if 'anual_return' is null
                    Name: strategyName,
                  }
                : {
                    Year: year,
                    Divdend:
                      parseFloat(strategyData[year].annual_dividend) || 0, // Using 0 if 'anual_return' is null
                    Name: strategyName,
                  };
            })
          : strategyYears.map((year) => {
              return type === "price"
                ? {
                    Year: year,
                    Price:
                      Math.log(parseFloat(strategyData[year].anualPrice)) || 0, // Using 0 if 'anual_return' is null
                    Name: strategyName,
                  }
                : type === "returns"
                ? {
                    Year: year,
                    Return:
                      Math.log(parseFloat(strategyData[year].anual_return)) ||
                      0, // Using 0 if 'anual_return' is null
                    Name: strategyName,
                  }
                : {
                    Year: year,
                    Divdend:
                      Math.log(
                        parseFloat(strategyData[year].annual_dividend)
                      ) || 0, // Using 0 if 'anual_return' is null
                    Name: strategyName,
                  };
            });

        datasetWithFilters.push({
          id: datasetId,
          source: filteredData,
        });

        seriesList.push({
          type: chartSwitch ? "bar" : "line",
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
          formatter: function (params) {
            const data = params[0].data;
            return type === "price"
              ? `Year: ${data.Year}<br />
                    Price: ${data.Price}<br />
                    Name: ${data.Name}`
              : type === "returns"
              ? `Year: ${data.Year}<br />
                    Return: ${data.Return}<br />
                    Name: ${data.Name}`
              : `Year: ${data.Year}<br />
                    Dividend: ${data.Divdend}<br />
                    Name: ${data.Name}`;
          },
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

      console.log(datasetWithFilters);
      console.log(seriesList);

      const chartContainer = document.getElementById(chartId);
      const myChart = echarts.init(chartContainer);
      myChart.setOption(option);
    };

    run();
  }, [chartData, chartId, years, log, chartSwitch]);

  const loggedData = () => {
    setLog(!log);
  };

  return (
    <>
      <div id={chartId} style={{ width: "100%", height: "400px" }} />
      <Box>
        <Button
          variant="outlined"
          onClick={loggedData}
          startIcon={log ? <FaXmark /> : <FaCheck />}
        >
          Log{" "}
        </Button>
      </Box>
    </>
  );
};

export default LineRaceChart;
