import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const CompanyLineBar = ({ chartId, chartData, years }) => {
  Chart.register(...registerables);
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const strategyName = chartData[0].symbol;

      const filteredData = chartData.map(({ date_year, annual_return }) => ({
        Year: date_year,
        Return: parseFloat(annual_return) || 0,
      }));

      const data = {
        labels: filteredData.map(item => item.Year),
        datasets: [{
          label: strategyName,
          data: filteredData.map(item => item.Return),
          fill: false,
          borderColor: '#427878',
          tension: 0.1
        }]
      };

      setGraphData(data);
    }
  }, [chartData]);

  return (
    <div style={{ width: "70%", height: "auto" }}>
      {graphData && (
        <Bar
          data={graphData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                bodyFontFamily: "Montserrat",
              },
            },
            scales: {
              y: {
                type: 'linear',
                display: true,
                title: {
                  display: true,
                  text: 'Return',
                },
              },
              x: {
                display: true,
                title: {
                  display: true,
                  text: 'Year',
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default CompanyLineBar;
