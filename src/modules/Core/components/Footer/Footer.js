import React from "react";
import { Box, Container, Grid, Link, Typography, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Logo from "../../../../assets/logos/Original.svg";

const Footer = () => {
  return (
    <Box
      sx={{
        height: "full",
        bgcolor: "#427879",
        color: "white",
        p: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <img src={Logo} alt="INVELPS Logo" width={200} height={100} />
            <Typography variant="subtitle1" gutterBottom>
              Investment help strategies
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Stack spacing={2}>
              <Link sx={{ textDecoration: "none" }} href="#" color="inherit">
                Home
              </Link>
              <Link sx={{ textDecoration: "none" }} href="#" color="inherit">
                About us
              </Link>
              <Link sx={{ textDecoration: "none" }} href="#" color="inherit">
                Blog
              </Link>
            </Stack>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Stack spacing={2}>
              <Link sx={{ textDecoration: "none" }} href="#" color="inherit">
                Risk & Return
              </Link>
              <Link sx={{ textDecoration: "none" }} href="#" color="inherit">
                Market Analysis
              </Link>
              <Link sx={{ textDecoration: "none" }} href="#" color="inherit">
                Applications
              </Link>
              <Link sx={{ textDecoration: "none" }} href="#" color="inherit">
                Solutions
              </Link>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body2">
              24 Commercial Avenue PO Box 249 Kilcoy QLD 4515
            </Typography>
            <Typography variant="body2">+07 5687 1450 00</Typography>
            <Typography variant="body2">help@invelps.com</Typography>
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "space-between", pt: 4 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="#" color="inherit">
              <LinkedInIcon />
            </Link>
            <Link href="#" color="inherit">
              <InstagramIcon />
            </Link>
            <Link href="#" color="inherit">
              <FacebookIcon />
            </Link>
            <Link href="#" color="inherit">
              <TwitterIcon />
            </Link>
            <Link href="#" color="inherit">
              <YouTubeIcon />
            </Link>
          </Box>
        </Box>
        <Typography variant="body2" textAlign={"center"} sx={{ pt: 3 }}>
          Invelps © 2023 All Rights Reserved
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
