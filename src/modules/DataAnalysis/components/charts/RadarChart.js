import { Card } from "@mui/material";
import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Text,
} from "recharts";

// Updated sample data to match the financial metrics
const data = [
  { attribute: "Dividend", Value: 65 },
  { attribute: "Growth", Value: 85 },
  { attribute: "Profitability", Value: 90 },
  { attribute: "Liquidity", Value: 70 },
  { attribute: "Valuation", Value: 50 },
  { attribute: "Efficiency", Value: 60 },
  { attribute: "Solvency", Value: 80 },
];

const style = {
  fontFamily: "Arial",
  fontSize: 12,
};

function RadarChartComponent() {
  return (
    <Card style={{ position: "relative",width:360,  height: 332 }}>
      <ResponsiveContainer>
        {" "}
        <div
          style={{
            padding: 10,
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <h2 style={{ margin: 0 }}>
            Score: <span style={{ color: "green" }}>65</span>/100
          </h2>
          <p style={{ margin: 0 }}>
            Year:{" "}
            <span style={{ boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" ,borderRadius:5,padding:3 }}>
              3Y Avg
            </span>{" "}
          </p>
        </div>
        <RadarChart cx="50%" cy="35%" outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="attribute" style={style} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar
            name="Company"
            dataKey="Value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
            dot={{ r: 5 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default RadarChartComponent;
