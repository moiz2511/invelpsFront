import React, { useState } from "react";
import PageInfoDailog from "./PageInfoDailog";
import InfoIcon from "@mui/icons-material/Info";
import {
  Breadcrumbs,
  Card,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSwitch } from "../../../../utils/context/SwitchContext";

const BreadcrumbsComponent = ({
  parent,
  subParent,
  child,
  setSelectedStrategyLabel,
  setTab2,
  setActiveButton,
  setShowVisualData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isSwitch2, setIsSwitch2 } = useSwitch();
  console.log(child);
  console.log(location);
  console.log(location.pathname);

  const handleGoBack = () => {
    setSelectedStrategyLabel(null);
    setShowVisualData(false);
    console.log("here");

    if (child == "OVERVIEW") {
      setIsSwitch2(false);
      console.log("BD 1");
    }
    if (child == "RETURNS AND RISK") {
      setIsSwitch2(false);
      setTab2("");
      console.log("BD 2");
    }

    if (location.pathname !== "/riskVisualization") {
      console.log("here 1");
      console.log("BD 3");
    }
    if (location.pathname === "/riskVisualization") {
      navigate("/dataanalysis/investorscreeners");
      setShowVisualData(false);
      console.log("BD 4");
    }
  };

  const handleReload = () => {
    setIsSwitch2(false);
    setTab2("");
    setSelectedStrategyLabel(null);
    setActiveButton("OVERVIEW");
    setShowVisualData(false);
  };
  return (
    <React.Fragment>
      <Card elevation={0} sx={{ ml: 1, mb: 1 }}>
        <Breadcrumbs separator={">"} aria-label="breadcrumb" sx={{ ml: 1 }}>
          <div onClick={handleReload}>
            <Typography
              sx={{
                cursor: "pointer",
              }}
              color="inherit"
            >
              {parent}
            </Typography>
          </div>

          <Typography
            sx={{
              color: "#427879",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            color="inherit"
            onClick={handleGoBack}
          >
            {child}
          </Typography>

          {subParent && (
            <Typography
              sx={{ color: "#427879", fontWeight: "bold", cursor: "pointer" }}
              color="inherit"
            >
              {subParent}
            </Typography>
          )}
        </Breadcrumbs>
      </Card>
    </React.Fragment>
  );
};

export default BreadcrumbsComponent;
