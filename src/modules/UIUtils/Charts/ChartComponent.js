import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation'
import { Bar, Line } from 'react-chartjs-2';
import Switch from '@mui/material/Switch';
import { Box, Grid } from '@mui/material';
import './candlestick.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

let options = {
  // animations: {
  //   tension: {
  //     from: 1,
  //     to: 0
  //   }
  // },
  maintainAspectRatio: false,
  scales: {
    y: {
      stacked: false,
      grid: {
        display: true
      }
    },
    x: {
      stacked: false,
      grid: {
        display: true
      },
      // type: 'time',
      // min: new Date('2019-01-01').valueOf(),
      // max: new Date('2019-12-31').valueOf()
    }
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        pointStyle: 'rect'
      }
    },
    title: {
      display: false,
      text: '',
    }
  }
};

export default function Chart(props) {
  const [chartSwitch, setChartSwitch] = useState(true);
  const handleChange = () => {
    setChartSwitch(!chartSwitch);
  }
  if (props.plotLineValue) {
    options.plugins['annotation'] = {
      annotations: {
        line1: {
          type: 'line',
          // mode: 'horizontal',
          // scaleID: 'y-axis-0',
          yMin: props.plotLineValue,
          yMax: props.plotLineValue,
          borderColor: 'rgb(0, 0, 0)',
          borderWidth: 1,
          label: {
            enabled: true,
            content: 'Range ' + props.plotLineValue
          }
        }
      }
    }
  }
  if (props?.yAxisUnit ? true : false) {
    options['scales'] = {
      y: {
        title: {
          display: true,
          text:  props.yAxisUnit
        },
      }
    }
  }
  return (
    <Box sx={{ display: 'flex', m: 2 }}>
      <Grid container>
        <Grid item sx={{ width: '100%' }}>
          <label htmlFor='chartswitch' style={{ marginLeft: 10 }}> Line Chart</label>
          <Switch
            id='chartswitch'
            checked={chartSwitch}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          <label htmlFor='chartswitch'> Bar Chart</label>
          <div className="chart-container">
            {chartSwitch && <Bar options={options} data={props.data} />}
            {!chartSwitch && <Line options={options} data={props.data} />}
          </div >
        </Grid>
      </Grid>
    </Box>
  );
}
