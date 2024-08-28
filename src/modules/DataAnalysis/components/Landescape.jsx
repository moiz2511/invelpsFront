import React from 'react'
import MarketShareTable from './Table/Landescape/MarketShareTable'
import PriceVolumeChart from './charts/Landescape/PriceVolumeChart'
import { Box } from '@mui/material'
import DividendChart from './charts/Landescape/DividentChart';
import GrowthTable from './Table/Landescape/GrowthTable';
import FinancialCycle from './charts/Landescape/FinancialCycles';
import BarChart3D  from './charts/Landescape/BarChart3D';
// import CustomCard from './charts/Landescape/SummaryCard';
import AnnualReturnChart from './charts/Landescape/AnnualCharts';
// import SummaryCard from './charts/Landescape/FinancialCycle/SummaryCard';


function Landescape() {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "center",
          gap: 5,
          paddingY: 5,
        }}
      >
        <MarketShareTable />
        <PriceVolumeChart />
        <DividendChart />
        <GrowthTable
          data={[
            {
              metric: "Gross Profit Margin",
              trend: "up",
              historicalAvg: "43.98%",
              industryAvg: "43.98%",
              target: ">40%",
              score: "100",
            },
            {
              metric: "Operating Profit Margin",
              trend: "down",
              historicalAvg: "13.34%",
              industryAvg: "13.34%",
              target: ">12%",
              score: "100",
            },
            {
              metric: "Net Profit Margin",
              trend: "up",
              historicalAvg: "10.23%",
              industryAvg: "10.23%",
              target: ">20%",
              score: "100",
            },
            // More rows...
          ]}
        />
      </Box>
      <FinancialCycle />
      <BarChart3D />
     
      <div style={{ padding: 20 }}>
        <AnnualReturnChart />
      </div>
    
    </>
  );
}

export default Landescape
