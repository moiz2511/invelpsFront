import React, { useEffect } from "react";
import * as echarts from "echarts";

const LineRaceChart = ({ chartId, chartData }) => {
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  useEffect(() => {
    const ROOT_PATH = ""; // Set your root path here
    const fetchData = async () => {
      try {
        // Generate a larger dummy dataset
        const rawData = generateLargeDataset();

        run(rawData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const generateLargeDataset = () => {
      const countries = [
        "Finland",
        "France",
        "Germany",
        "Iceland",
        "Norway",
        "Poland",
        "Russia",
        "United Kingdom",
      ];
      const years = Array.from({ length: 51 }, (_, index) => 1950 + index); // Years from 1950 to 2000
      const rawData = [];

      countries.forEach((country) => {
        years.forEach((year) => {
          rawData.push({
            Country: country,
            Year: year,
            Income: Math.floor(Math.random() * 10000), // Generate random income values for demonstration
          });
        });
      });

      return rawData;
    };

    const run = (_rawData) => {
      const countries = [
        "Finland",
        "France",
        "Germany",
        "Iceland",
        "Norway",
        "Poland",
        "Russia",
        "United Kingdom",
      ];

      const datasetWithFilters = [];
      const seriesList = [];
      echarts.util.each(countries, function (country) {
        var datasetId = "dataset_" + country;
        datasetWithFilters.push({
          id: datasetId,
          fromDatasetId: "dataset_raw",
          transform: {
            type: "filter",
            config: {
              and: [
                { dimension: "Year", gte: 1950 },
                { dimension: "Country", "=": country },
              ],
            },
          },
        });
        seriesList.push({
          type: "line",
          datasetId: datasetId,
          showSymbol: false,
          name: country,
          endLabel: {
            show: true,
            formatter: function (params) {
              return params.value[3] + ": " + params.value[0];
            },
          },
          labelLayout: {
            moveOverlap: "shiftY",
          },
          emphasis: {
            focus: "series",
          },
          encode: {
            x: "Year",
            y: "Income",
            label: ["Country", "Income"],
            itemName: "Year",
            tooltip: ["Income"],
          },
        });
      });

      const option = {
        animationDuration: 5000,
        dataset: [
          {
            id: "dataset_raw",
            source: _rawData,
          },
          ...datasetWithFilters,
        ],
        title: {
          text: "Income of Selected Countries since 1950",
        },
        tooltip: {
          order: "valueDesc",
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          nameLocation: "middle",
        },
        yAxis: {
          name: "Income",
        },
        grid: {
          right: 140,
        },
        series: seriesList,
      };

      const chartContainer = document.getElementById(chartId);
      const myChart = echarts.init(chartContainer);
      myChart.setOption(option);
    };

    fetchData();
  }, []);

  return <div id={chartId} style={{ width: "100%", height: "400px" }} />;
};

export default LineRaceChart;
