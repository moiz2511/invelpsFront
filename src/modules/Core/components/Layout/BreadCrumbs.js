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

const BreadcrumbsComponent = ({parent,child}) => {

  return (
    <React.Fragment>
      <Card elevation={0} sx={{ ml: 1, mb: 1 }}>
        <Breadcrumbs separator={">"} aria-label="breadcrumb" sx={{ ml: 1 }}>
          <Typography color="inherit">{parent}</Typography>
          <Typography
            sx={{ color: "#427879", fontWeight: "bold" }}
            color="inherit"
          >
            {child}
          </Typography>
        </Breadcrumbs>
      </Card>
    </React.Fragment>
  );
};

export default  BreadcrumbsComponent 