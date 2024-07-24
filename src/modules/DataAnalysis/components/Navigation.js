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

const NavigationWithBreadcrumbs = ({ setSelectedCompany }) => {
  const [activeButton, setActiveButton] = useState("OVERVIEW");

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
      id: "HISTORICAL",
      label: "HISTORICAL",
      icon: <PlaceIcon />,
      component: "HistoricalPlacesContent",
    },
  ];

  return (
    <>
      <BreadcrumbsComponent
        parent={"Investor Screener"}
        child={activeButton}
      ></BreadcrumbsComponent>
      <Box padding={2} display={"flex"} gap={3}>
        {buttons.map((button) => (
          <Button
            key={button.id}
            sx={{
              background: activeButton === button.id ? "#427879" : "white",
              color: activeButton === button.id ? "white" : "black",
            }}
            startIcon={button.icon}
            onClick={() => setActiveButton(button.id)}
          >
            {button.label}
          </Button>
        ))}
      </Box>
      <Box>
        {activeButton === "OVERVIEW" && <OverviewTab setSelectedCompany={setSelectedCompany}/>}
        {activeButton === "RETURNS AND RISK" && (
        //   <RisksTab/>
         <ReturnsTab/>
        )}
        {activeButton === "HISTORICAL" && (
         <BackTestTab/>
        )}
      </Box>
    </>
  );
};

export default NavigationWithBreadcrumbs;
