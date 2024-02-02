import React, { useEffect } from "react";
import * as echarts from 'echarts';

const VerticalBarChart = ({chartId, graphData}) => {
  useEffect(() => {
    console.log(graphData)
    const chartDom = document.getElementById(chartId);
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: 'World Population'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
      },
      series: [
        {
          name: '2011',
          type: 'bar',
          data: [18203, 23489, 29034, 104970, 131744, 630230]
        },
      ]
    };
    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div id={chartId} style={{ width: "100%", height: "300px", alignSelf: 'center' }} />
  );
};

export default VerticalBarChart;
