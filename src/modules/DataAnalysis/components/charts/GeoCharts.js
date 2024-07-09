import React from 'react';
import { Chart } from 'react-google-charts';

const GeoChartComponent = ({ data }) => {
  const chartData = [
    ['Exchange', 'Total Count'],
    ...data.map(item => [item.exchange, item.total_count])
  ];

  const options = {
    colorAxis: { colors: ['#e7711c', '#4374e0'] },
    backgroundColor: '#81d4fa',
    datalessRegionColor: '#f8bbd0',
    defaultColor: '#f5f5f5',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
      <Chart
        chartType="GeoChart"
        width="100%"
        height="100%"
        data={chartData}
        options={options}
      />
    </div>
  );
};

export default GeoChartComponent;
