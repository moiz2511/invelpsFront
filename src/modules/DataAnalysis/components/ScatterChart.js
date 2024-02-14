import React, { useEffect } from "react";
import * as echarts from "echarts";

const ScatterChart = ({ chartId, data }) => {
  useEffect(() => {
    const chartDom = document.getElementById(chartId);
    const myChart = echarts.init(chartDom);

    const xAxis = {
      name: 'Standard Deviation',
      nameLocation: 'center',
      nameGap: 30, // Adjust the gap as needed
      nameTextStyle: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#272727',
        fontFamily: "Montserrat",
      }
    };
    const yAxis = {
      name: 'Portfolio Annualized Return',
      nameLocation: 'middle',
      nameRotate: 90, // Rotate the title vertically
      nameGap: 30, // Adjust the gap as needed
      nameTextStyle: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#272727',
        fontFamily: "Montserrat",
      }
    };

    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const symbolShapes = ['circle', 'rect', 'diamond', 'triangle', 'star'];

    const symbolMapping = {};
    data.forEach((entry, index) => {
      const shape = symbolShapes[index % symbolShapes.length];
      symbolMapping[entry.name] = {
        symbol: shape,
        color: getRandomColor() 
      };
    });

    const series = [{
      symbolSize: 20,
      data: data.map(entry => ({
        value: [parseFloat(entry.stdev_return), parseFloat(entry.annualized_return)], 
        symbol: symbolMapping[entry.name] ? symbolMapping[entry.name].symbol : 'circle',
        itemStyle: {
          color: symbolMapping[entry.name] ? symbolMapping[entry.name].color : getRandomColor()
        },
        name: entry.name // Add the name to each data point
      })),
      type: 'scatter'
    }];

    const option = {
      xAxis: xAxis,
      yAxis: yAxis,
      series: series,
      tooltip: {
        formatter: function(params) {
          const data = params.data;
          return `Strategy: ${data.name}<br />Standard Deviation: ${data.value[0]}<br />Annualized Return: ${data.value[1]}`;
        }
      }
    };

    option && myChart.setOption(option);

    return () => {
      // Clean up chart instance when component unmounts
      myChart.dispose();
    };
  }, [chartId, data]);

  return <div id={chartId} style={{ width: "100%", height: "400px" }} />;
};

export default ScatterChart;
