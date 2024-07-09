import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = [
  '#2F4B7C', '#A05195', '#D45087', '#F95D6A', 
  '#FF7C43', '#FFA600', '#665191', '#1D8E9B', 
  '#8EC06C', '#F95D6A', '#FFA600'
];

const DonutPieChart = ({ data ,dataKey , nameKey }) => {
  return (
    <PieChart width={700} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        innerRadius={100}  // Increased inner radius for donut effect
        outerRadius={140}  // Adjusted outer radius
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
        formatter={(value, entry) => entry.payload[nameKey]} 
        layout="vertical"
        align="right"
        verticalAlign="middle"
        wrapperStyle={{
          paddingLeft: "20px"
        }}
      
      />
    </PieChart>
  );
};

export default DonutPieChart;
