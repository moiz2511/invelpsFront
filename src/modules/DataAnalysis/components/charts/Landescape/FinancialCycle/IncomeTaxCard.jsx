import React from "react";
import { Card, CardContent, Typography, Box, Divider } from "@mui/material";
import { styled } from "@mui/system";

// Custom styled Box for value display
const ValueBox = styled(Box)(({ theme, color }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: color,
  fontWeight: "bold",
}));

// CustomCard component
const IncomeTaxCard = ({ title, value, valueColor, subtitle, subtitleColor }) => {
  return (
    <Card sx={{ maxWidth: 300, margin: "auto", boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" textAlign="center">
          {title}
        </Typography>
        <ValueBox color={valueColor} variant="h5">
          {value}
        </ValueBox>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">Annual Changes</Typography>
          <Typography
            variant="body2"
            sx={{ color: subtitleColor, fontWeight: "bold" }}
          >
            {subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}; 
export default IncomeTaxCard




