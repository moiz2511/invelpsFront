import React, { useEffect } from "react";
import * as echarts from "echarts";

const CompanyScatterChart = ({ chartId, data }) => {
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

    const series = [{
      symbolSize: 20,
      data: [{
        value: [parseFloat(data.standard_deviation), parseFloat(data.annualized_return)],
        symbol: 'circle', // Use a default symbol
        itemStyle: {
          color: 'blue' // Use a default color
        },
        name: data.company_name // Add the name to the data point
      }],
      type: 'scatter'
    }];

    const option = {
      xAxis: xAxis,
      yAxis: yAxis,
      series: series,
      tooltip: {
        formatter: function(params) {
          const data = params.data;
          return `Company: ${data.name}<br />Standard Deviation: ${data.value[0]}<br />Annualized Return: ${data.value[1]}`;
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

export default CompanyScatterChart;
