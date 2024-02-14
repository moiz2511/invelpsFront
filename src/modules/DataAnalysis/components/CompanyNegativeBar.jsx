import React, { useEffect } from "react";
import * as echarts from "echarts";

const CompanyNegativeBar = ({ chartId, chartTitle = 'Bar Chart', chartData }) => {
  useEffect(() => {
    const chartDom = document.getElementById(chartId);
    const myChart = echarts.init(chartDom);
    
    const yAxisData = chartData.company_name;

    const bestSeriesData = [{
      value: parseFloat(chartData.best_return),
      itemStyle: {
        color: parseFloat(chartData.best_return) >= 0 ? 'blue' : 'orange'
      },
      label: {
        show: parseFloat(chartData.best_return) >= 0,
        position: 'right',
        formatter: '{b}'
      }
    }];

    const worstSeriesData = [{
      value: parseFloat(chartData.worst_return),
      itemStyle: {
        color: parseFloat(chartData.worst_return) >= 0 ? 'blue' : 'orange'
      },
      label: {
        show: parseFloat(chartData.worst_return) >= 0,
        position: 'left',
        formatter: '{b}'
      }
    }];

    const option = {
      title: {
        text: chartTitle
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: 80,
        bottom: 30
      },
      xAxis: {
        type: 'value',
        position: 'top',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        data: yAxisData
      },
      series: [
        {
          name: 'Best Return',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            formatter: '{b}'
          },
          data: bestSeriesData
        },
        {
          name: 'Worst Return',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            formatter: '{b}'
          },
          data: worstSeriesData
        }
      ]
    };

    option && myChart.setOption(option);

    return () => {
      // Clean up chart instance when component unmounts
      myChart.dispose();
    };
  }, [chartId, chartTitle, chartData]);

  return <div id={chartId} style={{ width: "100%", height: "400px" }} />;
};

export default CompanyNegativeBar;
