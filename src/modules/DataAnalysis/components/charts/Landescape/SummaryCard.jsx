import React from "react";
import { styled } from "@mui/material/styles";
import { Card, CardContent, Typography, Box } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { ArrowUpward } from "@mui/icons-material";



// CustomCard component
const CustomCard = ({ title, midTitle , endTitle }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: "auto", boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography  variant="h5" component="div" sx={{ mb: 1.5 , fontWeight:'bolder' }}>
            {title}
          </Typography>
          <ArrowUpward sx={{ color: "green" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="p" component="div" sx={{ mb: 1.5 }}>
            {midTitle}
          </Typography>
          <ArrowUpward sx={{ color: "green" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="p" component="div" sx={{ mb: 1.5 }}>
            {endTitle}
          </Typography>
          <ArrowUpward sx={{ color: "green" }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
