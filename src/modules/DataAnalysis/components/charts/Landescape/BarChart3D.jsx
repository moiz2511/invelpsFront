import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";

highcharts3d(Highcharts);

const BarChart3D = ({ title, categories, data }) => {
  const barChartOptions = {
    chart: {
      renderTo: "container",
      type: "column",
      options3d: {
        enabled: true,
        alpha: 0,
        beta: 0,
        depth: 50,
        viewDistance: 25,
      },
    },
    xAxis: {
      categories: categories,
    },
    yAxis: {
      title: {
        enabled: false,
      },
    },
    title: {
      text: title,
      align: "left",
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        depth: 25,
      },
    },
    series: [
      {
        data: data,
        colorByPoint: true,
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
};

BarChart3D.defaultProps = {
  title: "",
  categories: ["Mystery", "Science Fiction"],
  data: [1318, 1073],
};

export default BarChart3D;
