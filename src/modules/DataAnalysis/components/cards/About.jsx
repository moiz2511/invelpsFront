import React from "react";
import { Card, Box, Grid, Typography } from "@mui/material";
import Logo from "../../../../assets/Logo3.png"; // Ensure the path is correct

const AboutCompany = () => {
  // Data structure holding company information
  const companyData = {
    address: "3-12, Moriyacho, Yokohama, JP 221-002",
    phone: "81 4 5444 5232",
    website: "https://www.jvckenwood.com",
    sector: "Technology",
    industry: "Consumer Electronics",
    employees: 16277,
    marketCap: "Mega",
    beta: 0.799,
    price: 804,
    currency: "JPY",
    exchange: "Tokyo",
    ipoDate: "2001-01-01",
    range: "456.0-966.0",
  };

  return (
    <Card sx={{ padding: 2 ,height:300}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
          paddingRight: 5,
          
        }}
      >
        <Typography variant="h5" fontWeight={"bolder"}>
          About
        </Typography>
        <img src={Logo} alt="Company Logo" style={{ height: 50 }} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} >
          <Typography variant="body1">{companyData.address}</Typography>
          <Typography variant="body1">{companyData.phone}</Typography>
          <Typography variant="body1">
            <a
              href={companyData.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
            </a>
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body1">
            <strong>Sector(s):</strong> {companyData.sector}
          </Typography>
          <Typography variant="body1">
            <strong>Industry:</strong> {companyData.industry}
          </Typography>
          <Typography variant="body1">
            <strong>Full Time Employees:</strong> {companyData.employees}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body1">
            <strong>Market Cap:</strong> {companyData.marketCap}
          </Typography>
          <Typography variant="body1">
            <strong>Beta:</strong> {companyData.beta}
          </Typography>
          <Typography variant="body1">
            <strong>Price:</strong> {companyData.price}
          </Typography>
          <Typography variant="body1">
            <strong>Currency:</strong> {companyData.currency}
          </Typography>
          <Typography variant="body1">
            <strong>Exchange:</strong> {companyData.exchange}
          </Typography>
          <Typography variant="body1">
            <strong>IPO Date:</strong> {companyData.ipoDate}
          </Typography>
          <Typography variant="body1">
            <strong>Range:</strong> {companyData.range}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AboutCompany;
