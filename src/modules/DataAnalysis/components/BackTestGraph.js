import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ReusablePieChart = ({ dividendTotal, montantInvesti, gainPerteEnCapital }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    const options = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'left'
          },
          emphasis: {
            label: {
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: dividendTotal, name: 'Dividend Total', itemStyle: { color: '#407879' } },
            { value: montantInvesti, name: 'Montant Investi', itemStyle: { color: '#D36748' } },
            { value: gainPerteEnCapital, name: 'Gain/Perte en capital', itemStyle: { color: '#DBDBDB' } }
          ]    
        }
      ]
    };

    options && myChart.setOption(options);

    return () => {
      myChart.dispose(); // Dispose the chart when component unmounts
    };
  }, [dividendTotal, montantInvesti, gainPerteEnCapital]);

  return <div ref={chartRef} style={{ width: '50%', height: '250px' }} />;
};

export default ReusablePieChart;
