import { Box, Skeleton, Stack } from "@mui/material";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeIndex, setActiveIndex] = useState(null); // Track the clicked cell index

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = data?.reduce((sum, entry) => sum + entry[dataKey], 0);

  const handleClick = (index) => {
    setActiveIndex(index); // Update the active index on click
  };

  return (
    <ResponsiveContainer width="100%" height={370}>
      {data.length > 0 ? (
        <PieChart>
          <Pie
            data={data}
            cx={isMobile ? "50%" : "30%"}
            cy="35%"
            innerRadius="40%"
            outerRadius="60%"
            fill="#8884d8"
            paddingAngle={5}
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                onClick={() => handleClick(index)}
                style={{
                  cursor: "pointer",
                  stroke: activeIndex === index ? "none" : "none", 
                  strokeWidth: activeIndex === index ? 3 : 0, 
                }}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            formatter={(value, entry, index) => {
              const percentage = (
                (data[index][dataKey] / total) *
                100
              ).toFixed(1);
              return `${value} (${percentage}%)`;
            }}
            layout={isMobile ? "horizontal" : "vertical"}
            align={isMobile ? "center" : "right"}
            verticalAlign={isMobile ? "top" : "top"}
            wrapperStyle={{
              paddingLeft: "20px",
            }}
          />
        </PieChart>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 250,
          }}
        >
          <Skeleton
            variant="circular"
            width={200}
            height={200}
            animation="wave"
          />
          <Stack direction="column" spacing={2} alignItems="center">
            <Skeleton variant="text" width={180} height={20} animation="wave" />
            <Skeleton variant="text" width={150} height={20} animation="wave" />
            <Skeleton variant="text" width={170} height={20} animation="wave" />
          </Stack>
        </Box>
      )}
    </ResponsiveContainer>
  );
};

export default DonutPieChart;
