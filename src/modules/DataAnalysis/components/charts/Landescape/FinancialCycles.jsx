import React from 'react'
import DonutChart from './FinancialCycle/DonutChart'
import TreemapWithText from './FinancialCycle/TreeMapChart'
import SummaryCard from './FinancialCycle/SummaryCard'
import CustomCard from './SummaryCard';
import IncomeTaxCard from './FinancialCycle/IncomeTaxCard';

function FinancialCycles() {
  // Sample data
  const data = [
    {
      label: "Revenue",
      percentage: "12,3%",
      value: "120",
      percentageColor: "green",
      valueColor: "#004B80",
    },
    {
      label: "Cost & Opex",
      percentage: "10,5%",
      value: "70",
      percentageColor: "red",
      valueColor: "#FF7043",
    },
    {
      label: "EBTIDA",
      percentage: "7,83%",
      value: "50",
      percentageColor: "green",
      valueColor: "#D8B982",
    },
  ];
  // Sample data
  const cardData = {
    title: "Income Taxes",
    value: "5 M USD",
    valueColor: "red",
    subtitle: "12.5%",
    subtitleColor:'green'
  };

  return (
    <div>
      {/* <DonutChart/> */}
      <TreemapWithText />
      <SummaryCard data={data} />
      <CustomCard
        title="CE Turnover"
        midTitle="Revenue"
        endTitle="Capital Employed"
      />
      <IncomeTaxCard {...cardData} />
    </div>
  );
}

export default FinancialCycles
