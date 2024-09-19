import React, { useState } from "react";
import { Box, Button, Breadcrumbs, Typography } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PlaceIcon from "@mui/icons-material/Place";
import BreadcrumbsComponent from "../../Core/components/Layout/BreadCrumbs";
import OverviewTab from "./OverviewTab";
import RisksTab from "./RisksTab";
import BackTest from "./BackTest";
import BackTestTab from "./BackTestTab";
import ReturnsTab from "./ReturnsTab";
import { FaBuilding } from "react-icons/fa";
import { useBreadcrumbs } from "../../Core/store/BreadcrumbsContext";

const NavigationWithBreadcrumbs = ({ setSelectedCompany }) => {
  const [activeButton, setActiveButton] = useState("OVERVIEW");
  const [selectedStrategyLabel, setSelectedStrategyLabel] = useState(null);
  const [showVisualData, setShowVisualData] = useState(false);

  const buttons = [
    {
      id: "OVERVIEW",
      label: "OVERVIEW",
      icon: <AssessmentIcon />,
      component: "OverviewContent",
    },
    {
      id: "RETURNS AND RISK",
      label: "RETURNS AND RISK",
      icon: <TrendingUpIcon />,
      component: "ReturnsRiskContent",
    },
    {
      id: "HISTORICAL PRICES",
      label: "HISTORICAL PRICES",
      icon: <FaBuilding />,
      component: "HistoricalPlacesContent",
    },
  ];

  return (
    <>
      <BreadcrumbsComponent
        parent={"Investor Screener"}
        subParent={selectedStrategyLabel}
        child={activeButton}
      ></BreadcrumbsComponent>

      <Box padding={2} display={"flex"} gap={3}>
        {buttons.map((button) => (
          <Button
            key={button.id}
            sx={{
              backgroundColor: activeButton === button.id ? "#427879" : "white",
              color: activeButton === button.id ? "white" : "black",
              "&:hover": {
                backgroundColor:
                  activeButton === button.id ? "#427879" : "#427879",
                color: activeButton === button.id ? "white" : "white",
              },
            }}
            startIcon={button.icon}
            onClick={() => {
              setActiveButton(button.id);
              if (selectedStrategyLabel) {
                setSelectedStrategyLabel(null);
                setShowVisualData(!showVisualData);
              }
            }}
          >
            {button.label}
          </Button>
        ))}
      </Box>
      <Box>
        {activeButton === "OVERVIEW" && (
          <OverviewTab
            selectedStrategyLabel={selectedStrategyLabel}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
            setSelectedCompany={setSelectedCompany}
            setSelectedStrategyLabel={setSelectedStrategyLabel}
            setShowVisualData={setShowVisualData}
          />
        )}
        {activeButton === "RETURNS AND RISK" && (
          <Box>
            <ReturnsTab
              selectedStrategyLabel={selectedStrategyLabel}
              activeButton={activeButton}
              setActiveButton={setActiveButton}
              setSelectedCompany={setSelectedCompany}
              setSelectedStrategyLabel={setSelectedStrategyLabel}
              setShowVisualData={setShowVisualData}
            />
            <RisksTab
              selectedStrategyLabel={selectedStrategyLabel}
              activeButton={activeButton}
              setActiveButton={setActiveButton}
              setSelectedCompany={setSelectedCompany}
              setSelectedStrategyLabel={setSelectedStrategyLabel}
              setShowVisualData={setShowVisualData}
            />
            <></>
          </Box>
        )}
        {activeButton === "HISTORICAL PRICES" && (
          <BackTestTab
            selectedStrategyLabel={selectedStrategyLabel}
            setSelectedStrategyLabel={setSelectedStrategyLabel}
            showVisualData={showVisualData}
            setShowVisualData={setShowVisualData}
          />
        )}
      </Box>
    </>
  );
};

export default NavigationWithBreadcrumbs;
