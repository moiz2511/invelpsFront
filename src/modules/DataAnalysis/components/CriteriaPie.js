import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ReusablePieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    const performanceData = [
      { value: 30, name: 'Profit' },
      { value: 20, name: 'Revenue' },
      { value: 10, name: 'Market Share' },
    ];

    const riskData = [
      { value: 25, name: 'Volatility' },
      { value: 15, name: 'Liquidity Risk' },
      { value: 10, name: 'Credit Risk' },
    ];

    const mergedData = [...performanceData, ...riskData];

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Company Performance & Risk Measures',
          type: 'pie',
          radius: '50%',
          data: mergedData.map(item => ({ value: item.value, name: item.name })),
          label: {
            show: true,
            formatter: '{b} : {c}%', // show name and value
            textStyle: {
              fontSize: '12',
            },
          },
        },
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default ReusablePieChart;
