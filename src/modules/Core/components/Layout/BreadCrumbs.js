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
import { useNavigate } from "react-router-dom";

const BreadcrumbsComponent = ({ parent, subParent, child }) => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <Card elevation={0} sx={{ ml: 1, mb: 1 }}>
        <Breadcrumbs separator={">"} aria-label="breadcrumb" sx={{ ml: 1 }}>
          <div onClick={() => window.location.reload()}>
            <Typography color="inherit">{parent}</Typography>
          </div>

          <Typography
            sx={{ color: "#427879", fontWeight: "bold" }}
            color="inherit"
          >
            {child}
          </Typography>
          {subParent && (
            <Typography
              sx={{ color: "#427879", fontWeight: "bold" }}
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
