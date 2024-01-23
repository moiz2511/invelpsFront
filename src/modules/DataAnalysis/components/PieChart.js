import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const PieChart = ({graphData, nameData}) => {
  Chart.register(...registerables);
 
  const dataName = graphData?.map(nameData);
  const numericData = graphData?.map((item) => item.total_count);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };


  const data = {
    labels: dataName,
    datasets: [
      {
        data: numericData,
        backgroundColor: Array.from({ length: numericData.length }, () => getRandomColor()),
        borderColor: ["#FEFEFA"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
        legend: {
          position: 'bottom', 
        },
        tooltip: {
          bodyFontFamily: "Montserrat", 
        },
      },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
  };

  return (
    <div style={{ width: "100%", height:"300px", alignSelf: 'center' }} >
      <Pie data={data} options={options} />
    </div>
  );
}; 

export default PieChart;
