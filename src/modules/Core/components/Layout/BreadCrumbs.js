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
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isSwitch2, setIsSwitch2 } = useSwitch();
  console.log(child);
  console.log(location);
  console.log(location.pathname);

  const handleGoBack = () => {
    if (child == "OVERVIEW") {
      setIsSwitch2(false);
      setSelectedStrategyLabel(null);
    }
    if (child == "RETURNS AND RISK") {
      setSelectedStrategyLabel(null);
      setIsSwitch2(false);
      setTab2("");
    }

    if (
      child == "RETURNS AND RISK" &&
      location.pathname != "/riskVisualization"
    ) {
      setSelectedStrategyLabel(null);
      // navigate("/dataanalysis/investorscreeners");
      console.log("here 1");
    }

    if (
      child == "RETURNS AND RISK" &&
      location.pathname == "/riskVisualization"
    ) {
      setSelectedStrategyLabel(null);
      navigate("/dataanalysis/investorscreeners");
      console.log("here 2");
    }
  };

  const handleReload = () => {
    // window.location.reload();
    setIsSwitch2(false);
    setTab2("");
    setSelectedStrategyLabel(null);
    setActiveButton("OVERVIEW");
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
