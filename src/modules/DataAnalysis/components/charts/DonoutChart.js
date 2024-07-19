import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2F4B7C",
  "#A05195",
  "#D45087",
  "#F95D6A",
  "#FF7C43",
  "#FFA600",
  "#665191",
  "#1D8E9B",
  "#8EC06C",
  "#F95D6A",
  "#FFA600",
];

const DonutPieChart = ({ data, dataKey, nameKey }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Default mobile breakpoint

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Update based on viewport width
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={370} >
      <PieChart>
        <Pie
          data={data}
          cx={isMobile?"50%":"30%"}
          cy="35%"
          innerRadius="40%"
          outerRadius="60%"
          fill="#8884d8"
          paddingAngle={5}
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          formatter={(value, entry) =>
            ` ${entry.value}`
          }
          layout={isMobile ? "horizontal" : "vertical"}
          align={isMobile ? "center" : "right"}
          verticalAlign={isMobile ? "top" : "top"}
          wrapperStyle={{
            paddingLeft:  "20px",
           
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutPieChart;
