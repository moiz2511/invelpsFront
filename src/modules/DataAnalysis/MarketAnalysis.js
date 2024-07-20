import React from "react";
import { Box, Typography } from "@mui/material";
import ConsumerElectronics from "./components/cards/ConsumerElectronics";
import BreakdownOfRevenue from "./components/cards/BreakDownRevenue";
import GeoChartComponent from "./components/charts/GeoCharts";
import { kpi } from "./kpidata";
import RevenueBarChart from "./components/charts/RevenueBarChart";
import RevenueTable from "./components/Table/RevenueTable";
import MarketSizeEvolutionChart from "./components/charts/MarketSizeEvolutionChart";
import PerformanceByCountryChart from "./components/charts/PerformanceByCountryChart";
import MarketShareTable from "./components/Table/MarketShareTable";

function MarketAnalysis() {
  return (
    <div>
      {/* Responsive grid using Box with sx prop for different breakpoints */}
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr", // All items in a single column on extra-small devices
            sm: "1fr 1fr", // Two columns on small devices
            md: "1fr 1fr 2fr", // Three columns on medium devices and larger
          },
          gap: 2, // Space between grid items
          padding: 2, // Padding around the grid container
        }}
      >
        <ConsumerElectronics />
        <BreakdownOfRevenue />
        <div>
          <Typography variant="h5" fontWeight={"bolder"} textAlign={"center"}>
            Organic Growth
          </Typography>
          <GeoChartComponent data={kpi} />
        </div>
      </Box>
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr", // All items in a single column on extra-small devices
            sm: "1fr 1fr", // Two columns on small devices
            md: "1fr 1fr", // Three columns on medium devices and larger
          },
          gap: 2, // Space between grid items
          padding: 2, // Padding around the grid container
        }}
      >
        <RevenueBarChart />
        <RevenueTable />
        <MarketSizeEvolutionChart />
        <PerformanceByCountryChart />
      </Box>
      <MarketShareTable />
      <RevenueTable/>
    </div>
  );
}

export default MarketAnalysis;
