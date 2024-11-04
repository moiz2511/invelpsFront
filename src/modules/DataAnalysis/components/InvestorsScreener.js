import {
  TextField,
  MenuItem,
  Grid,
  Card,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";

import React, { useEffect, useState, useContext } from "react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import PageInfoBreadCrumbs from "../../Core/components/Layout/PageInfoBreadCrumbs";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableBody from "@mui/material/TableBody";
import PieChart from "./PieChart";
import ColorConstants from "../../Core/constants/ColorConstants.json";
import BACKEND_SERVER_BASE_URL from "../../../Constants.json";
import AuthContext from "../../Core/store/auth-context";
import VerticalBarChart from "./VerticalBarChart";

import { styled } from "@mui/material/styles";
import OverviewTab from "./OverviewTab";
import ReturnsTab from "./ReturnsTab";
import RisksTab from "./RisksTab";
import BackTestTab from "./BackTestTab";
import DAFinancials from "./Financials";
import BackTest from "./BackTest";
import CompanyFinancials from "./CompanyFinancials";

import CompanyReturnTab from "./CompanyReturnTab";
import CompanyRiskTab from "./CompanyRiskTab";
import { useSwitch } from "../../../utils/context/SwitchContext";
import AboutCompany from "./cards/About";
import Description from "./cards/Description";
import RadarChartComponent from "./charts/RadarChart";
import MeterChart from "./charts/MeterChart";
import MarketDataChart from "./charts/AreaChart";
import MarketAnalysis from "../MarketAnalysis";
import Landescape from "./Landescape";
import BreadcrumbsComponent from "../../Core/components/Layout/BreadCrumbs";
import AssessmentIcon from "@mui/icons-material/Assessment"; // Icon for OVERVIEW
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; // Icon for RETURNS AND RISKS
import PlaceIcon from "@mui/icons-material/Place"; // Icon for HISTORICAL PLACES
import NavigationWithBreadcrumbs from "./Navigation";
import Constants from "../../../Constants.json";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const InvestorsScreener = () => {
  const [value, setValue] = useState(0);
  const [valueCompanyDetails, setValueCompanyDetails] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(false);

  const { isSwitch1, setIsSwitch1, isSwitch2, setIsSwitch2 } = useSwitch();

  const handleChange = (event, newValue) => {
    if (isSwitch1) {
      setValueCompanyDetails(newValue);
    } else {
      setValue(newValue);
    }
  };

  useEffect(() => {
    return () => {
      setIsSwitch1(false);
    };
  }, []);

  // console.log(isSwitch1);
  console.log(selectedCompany);

  return (
    <Grid
      sx={{
        // display: "flex",
        // flexDirection: "column",
        // justifyContent: "flex-start",
        placeItems: "center",
        width: "100%",
        alignItems: "center",
        position: "relative",
      }}
    >
      {isSwitch1 && (
        <Grid
          sx={{
            // display: "flex",
            // flexDirection: "column",
            // justifyContent: "flex-start",
            alignItems: "start",
            p: 1,
            gap: 2,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            zIndex: 2,
          }}
        >
          <Button
            onClick={() => {
              setIsSwitch1(false);
              setIsSwitch2(true);
              // setSelectedCompany(null);
            }}
            sx={{
              alignSelf: "flex-start",
              backgroundColor: "#407879",
              color: "rgb(204, 191, 144)",
            }}
          >
            Back
          </Button>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={valueCompanyDetails}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Financials" {...a11yProps(0)} />
                <Tab label="Returns and Risks" {...a11yProps(1)} />
                <Tab label="Backtest" {...a11yProps(2)} />
                <Tab label="Market Analysis" {...a11yProps(3)} />
                <Tab label="Landescape" {...a11yProps(4)} />
              </Tabs>
            </Box>

            {/* company detail boxes are here */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "3fr 1fr" },
                paddingTop: 3,
                gap: 1,
                width: "100%",
              }}
            >
              <Box sx={{ display: { xs: "block", md: "flex" }, gap: 2 }}>
                <AboutCompany />
                <Description />
              </Box>

              <Box style={{ display: "flex", gap: 3 }}>
                <RadarChartComponent />
                <MeterChart />
                <MarketDataChart />
              </Box>
            </Box>

            <CustomTabPanel value={valueCompanyDetails} index={0}>
              <CompanyFinancials
                companyName={selectedCompany.company_name}
                companySymbol={selectedCompany.symbol}
                companyImage={selectedCompany.image}
                exchangeName={selectedCompany.exchange}
                strategyName={selectedCompany.strategy_name}
              />
            </CustomTabPanel>
            <CustomTabPanel value={valueCompanyDetails} index={1}>
              <CompanyReturnTab
                companySymbol={selectedCompany.symbol}
                companyName={selectedCompany.company_name}
                companyImage={selectedCompany.image}
              />
            </CustomTabPanel>
            <CustomTabPanel value={valueCompanyDetails} index={2}>
              <div style={{ backgroundColor: "#DEDEDE", height: "150vh" }}>
                <BackTest
                  strategyLabel={selectedCompany.strategy_name}
                  companySymbol={selectedCompany.symbol}
                  companyLogo={selectedCompany.image}
                />
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={valueCompanyDetails} index={3}>
              <div style={{ backgroundColor: "#ffff", height: "150vh" }}>
                <MarketAnalysis
                  strategyLabel={selectedCompany.strategy_name}
                  companySymbol={selectedCompany.symbol}
                  companyLogo={selectedCompany.image}
                />
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={valueCompanyDetails} index={4}>
              <div style={{ backgroundColor: "#ffff", height: "150vh" }}>
                <Landescape
                  strategyLabel={selectedCompany.strategy_name}
                  companySymbol={selectedCompany.symbol}
                  companyLogo={selectedCompany.image}
                />
              </div>
            </CustomTabPanel>
          </Box>
        </Grid>
      )}
      <Box sx={{ width: "100%" }}>
        <NavigationWithBreadcrumbs setSelectedCompany={setSelectedCompany} />
      </Box>
    </Grid>
  );
};

export default InvestorsScreener;
