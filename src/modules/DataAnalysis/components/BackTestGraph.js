import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const ReusablePieChart = ({
  dividendTotal,
  montantInvesti,
  gainPerteEnCapital,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    const total = dividendTotal + montantInvesti + gainPerteEnCapital;

    const options = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: true,
        orient: "vertical",
        bottom: 0, // Adjust bottom position
        right: 0, // Adjust left position
        textStyle: {
          fontFamily: "Montserrat", // Specify the desired font family
        },
      },
      series: [
        {
          type: "pie",
          radius: ["60%", "80%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "outside",
            formatter: "$ {c} ",
            textStyle: {
              fontSize: "19",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              color: "auto",
            },
          },
          labelLine: {
            show: true,
          },
          itemStyle: {
            borderRadius: 7,
          },
          data: [
            {
              value: dividendTotal,
              name: "Dividend Total",
              itemStyle: { color: "#407879" },
            },
            {
              value: montantInvesti,
              name: "Invested Capital",
              itemStyle: { color: "#D36748" },
            },
            {
              value: gainPerteEnCapital,
              name: "Gain/Loss Capital",
              itemStyle: { color: "#ACABAB" },
            },
          ],
        },
      ],
    };

    options && myChart.setOption(options);

    return () => {
      myChart.dispose();
    };
  }, [dividendTotal, montantInvesti, gainPerteEnCapital]);

  return (
    <>
      <div
        ref={chartRef}
        style={{ width: "100%", height: "250px", alignSelf: "center" }}
      />
      {/* <text>total return</text> */}
    </>
  );
};

export default ReusablePieChart;
