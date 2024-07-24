import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";

// Custom styled Box for value display
const ValueBox = styled(Box)(({ theme, color }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "50px",
  height: "30px",
  borderRadius: "5px",
  backgroundColor: color,
  color: "#fff",
  fontWeight: "bold",
}));

// Custom styled Box for percentage display
const PercentageBox = styled(Box)(({ color }) => ({
  color: color,
  fontWeight: "bold",
}));

// CustomCard component
const SummaryCard = ({ data }) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: "auto",
        boxShadow: 3,
        borderRadius: 2,
        padding: 2,
      }}
    >
      <CardContent>
        {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1" component="div">
                {item.label}
              </Typography>
              <PercentageBox color={item.percentageColor}>
                {item.percentage}
              </PercentageBox>
            </Box>
            <ValueBox color={item.valueColor}>{item.value}</ValueBox>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};


export default SummaryCard