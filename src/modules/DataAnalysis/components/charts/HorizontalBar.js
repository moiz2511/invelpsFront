import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = [
  '#2F4B7C', '#A05195', '#D45087', '#F95D6A', 
  '#FF7C43', '#FFA600', '#665191', '#1D8E9B', 
  '#8EC06C', '#F95D6A', '#FFA600'
];

const HorizontalBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart 
        data={data} 
        layout="vertical" 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }} // Increased left margin
      >
        <XAxis type="number" />
        <YAxis 
          dataKey="sector" 
          type="category" 
          tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value} 
          width={150} // Set a fixed width for Y-axis labels
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_count" fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HorizontalBarChart;
