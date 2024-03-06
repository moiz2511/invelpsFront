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

const headCells = {
  data: [
    {
      id: "strategy",
      label: "Strategy",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "totalreturn",
      label: "Total Return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "annualizedReturn",
      label: "Annualized return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "rollingReturn",
      label: "Rolling Return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "standardDeviation",
      label: "Standard Deviation",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "maxDrawdown",
      label: "Max Drawdown",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "sharpeRatio",
      label: "Sharpe Ratio",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "sortinoRatio",
      label: "Sortino Ratio",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "duration",
      label: "Duration",
      isValueLink: false,
      isDropDown: false,
    },
  ],
};

const dummyData = [
  {
    companyName: "ABC Inc.",
    ticker: "ABC",
    exchange: "NYSE",
    sector: "Technology",
    industry: "Software",
    totalReturn: "10%",
    annualizedReturn: "5%",
    rollingReturn: "6%",
    standardDeviation: "2%",
    maxDrawDown: "1%",
    sharpeRatio: "3",
    sortinoRatio: "4",
  },
  {
    companyName: "XYZ Corp.",
    ticker: "XYZ",
    exchange: "NASDAQ",
    sector: "Finance",
    industry: "Banking",
    totalReturn: "15%",
    annualizedReturn: "7%",
    rollingReturn: "8%",
    standardDeviation: "3%",
    maxDrawDown: "2%",
    sharpeRatio: "4",
    sortinoRatio: "5",
  },
  // Add more objects as needed...
];

const passingHeadCells = {
  data: [
    {
      label: "Strategy Name",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Company Name",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Ticker",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Exchange",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Sector",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Industry",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Total Return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Annualized Return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Rolling Return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Standard Deviation",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Max Drawdown",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Sharpe Ratio",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Sortino Ratio",
      isValueLink: false,
      isDropDown: false,
    },
  ],
};

const data = [
  {
    investor: "Investor 1",
    strategy: "Strategy A",
    factor: "Factor X",
    totalreturn: "10%",
    annualizedReturn: "5%",
    rollingReturn: "6%",
    standardDeviation: "2%",
    maxDrawdown: "1%",
    sharpeRatio: "3",
    sortinoRatio: "4",
  },
  {
    investor: "Investor 2",
    strategy: "Strategy B",
    factor: "Factor Y",
    totalreturn: "15%",
    annualizedReturn: "7%",
    rollingReturn: "8%",
    standardDeviation: "3%",
    maxDrawdown: "2%",
    sharpeRatio: "4",
    sortinoRatio: "5",
  },
  // Add more objects as needed...
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: ColorConstants.APP_TABLE_HEAD_COLOR,
    color: theme.palette.common.white,
    padding: 12,
    fontFamily: "Montserrat",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 12,
    fontFamily: "Montserrat",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type()": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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

  const handleChange = (event, newValue) => {
    if (companyDetails) {
      setValueCompanyDetails(newValue);
    } else {
      setValue(newValue);
    }
  };

  console.log(selectedCompany);

  return (
    <>
      {companyDetails ? (
        <Box sx={{ display: "flex", flexDirection: "column", p: 1, gap: 2 }}>
          <Button
            onClick={() => setCompanyDetails(false)}
            sx={{
              alignSelf: "flex-start",
              backgroundColor: "#407879",
              color: "rgb(204, 191, 144)",
            }}
          >
            Go Back
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
              </Tabs>
            </Box>
            <CustomTabPanel value={valueCompanyDetails} index={0}>
              <CompanyFinancials
                companyName={selectedCompany.company_name}
                companyImage={selectedCompany.image}
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
                  companySymbol={selectedCompany.symbol}
                  companyLogo={selectedCompany.image}
                />
              </div>
            </CustomTabPanel>
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Overview" {...a11yProps(0)} />
              <Tab label="Returns" {...a11yProps(1)} />
              <Tab label="Risks" {...a11yProps(2)} />
              <Tab label="Historical Prices" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <OverviewTab
              setSelectedCompany={setSelectedCompany}
              setCompanyDetails={setCompanyDetails}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <ReturnsTab />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <RisksTab />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <BackTestTab />
          </CustomTabPanel>
        </Box>
      )}
    </>
  );
};

export default InvestorsScreener;
