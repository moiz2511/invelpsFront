import React, { useState, useEffect, useContext, useRef } from "react";

import {
  Card,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Fade,
  Switch,
  Breadcrumbs,
  CircularProgress,
} from "@mui/material";

import { FaBuilding, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import AuthContext from "../../Core/store/auth-context";
import { styled } from "@mui/material/styles";
import PageInfoBreadCrumbs from "../../Core/components/Layout/PageInfoBreadCrumbs";
import LineRaceChart from "./LineRaceChart";
import NegativeBarChart from "./NegativeBarChart";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ColorConstants from "../../Core/constants/ColorConstants.json";
import Constants from "../../../Constants.json";
import { IoArrowDown, IoArrowUp, IoFilterSharp } from "react-icons/io5";
import { IoArrowUpOutline } from "react-icons/io5";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import PieChart from "./PieChart";
import { useSwitch } from "../../../utils/context/SwitchContext";

import { CgSpinner } from "react-icons/cg";
import GeoChartComponent from "./charts/GeoCharts";
import HorizontalBarChart from "./charts/HorizontalBar";
import DonutPieChart from "./charts/DonoutChart";
import SortingPopover from "./SortingPopover";
import InvestorScreenerService from "../services/InvestorService";
import FilterPopover from "./FilterPopover";
import ResetFilters from "./ResetFilters";

const headYears = [
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
];

const passingHeadCells = {
  data: [
    // {
    //   label: "Strategy Name",
    //   isValueLink: false,
    //   isDropDown: false,
    // },
    {
      label: "Company Name",
      key: "company_name",
      isValueLink: false,
      isDropDown: false,
    },
    // {
    //   label: "Logo",
    //   key: "",
    //   isValueLink: false,
    //   isDropDown: false,
    // },
    {
      label: "Ticker",
      key: "symbol",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Exchange",
      key: "exchange",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Sector",
      key: "sector",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Industry",
      key: "industry",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Total Return (%)",
      key: "total_return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Annualized Return (%)",
      key: "annualized_return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Rolling Return (%)",
      key: "rolling_return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Standard Deviation (%)",
      key: "stdev_return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Max Drawdown (%)",
      key: "max_drawdown",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Sharpe Ratio",
      key: "sharpe_ratio",
      isValueLink: false,
      isDropDown: false,
    },
    {
      label: "Sortino Ratio",
      key: "sortino_ratio",
      isValueLink: false,
      isDropDown: false,
    },
  ],
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: ColorConstants.APP_TABLE_HEAD_COLOR,
    color: theme.palette.common.black,
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

const headCategories = [
  { title: "Avg", key: "rolling_return" },
  { title: "Best", key: "best_return" },
  { title: "Worst", key: "worst_return" },
  { title: "Negative Periods", key: "negative_annual_returns" },
  // { title: "Duration", key: "duration" },
];

const ReturnsTab = ({
  selectedStrategyLabel,
  setSelectedStrategyLabel,
  setSelectedCompany,
  activeButton,
  setActiveButton,
  showVisualData,
  setShowVisualData,
  setTab2,
}) => {
  console.log(selectedStrategyLabel);
  console.log(activeButton);
  console.log(showVisualData);

  let pageLoc = window.location.pathname;

  const [companySortBy, setCompanySortBy] = useState("");
  const [companyOrderBy, setCompanyOrderBy] = useState("asc");
  const [sector, setSector] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [allStrategies, setAllStrategies] = useState([]);

  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const [strategyData, setStrategyData] = useState([]);
  const [years, setYears] = useState([]);
  const [bestWorstData, setBestWorstData] = useState([]);
  // const [showVisualData, setShowVisualData] = useState(false);
  const [bestWorstDataCopy, setBestWorstDataCopy] = useState([]);
  const [selectedSort, setSelectedSort] = useState(0);
  const [selectedField, setSelectedField] = useState();

  const [perExchangeKPI, setPerExhangeKPI] = useState([]);
  const [perSectorKPI, setPerSectorKPI] = useState([]);
  const [perMarketKPI, setPerMarketKPI] = useState([]);
  const [passingCriteria, setPassingCriteria] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(3);
  const [graphTableData, setGraphTableData] = useState([]);
  const [graphTableDataCopy, setGraphTableDataCopy] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [strategiesCopy, setStrategiesCopy] = useState([]);
  const [chartSwitch, setChartSwitch] = useState(true);
  const [mapsData, setMapsData] = useState([]);
  const [annual, setAnnual] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [storedToken, setStoredToken] = useState(null);

  const [sOrderBy, setSOrderBy] = useState("");
  const [sSortBy, setSSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueExchanges, setUniqueExchanges] = useState([]);
  const [uniqueIndustries, setUniqueIndustries] = useState([]);
  const [uniqueSectors, setUniqueSectors] = useState([]);
  const [isSort, setIsSort] = useState(false);
  const [isBarClick, setIsBarClick] = useState(false);
  const criteriaRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const { isSwitch1, setIsSwitch1, isSwitch2, setIsSwitch2 } = useSwitch();
  const restService = new InvestorScreenerService();

  const handleChartSwitchChange = () => {
    setChartSwitch(!chartSwitch);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    setStoredToken(token);
  }, []);

  useEffect(() => {
    console.log(storedToken);
    if (authCtx.isLoggedIn || authCtx.token) {
      setAuthToken(authCtx.token);
    } else if (storedToken) {
      setAuthToken(storedToken);
    } else {
      setAuthToken("");
    }
    setRefresh(!refresh);
  }, [authCtx.isLoggedIn, authCtx.token, storedToken]);

  useEffect(() => {
    if (authToken) {
      console.log(authToken);
      fetchStrategyData();
    }
  }, [authToken, sOrderBy, sSortBy]);

  const fetchMapsData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategyLabel,
      };
      console.log(selectedStrategyLabel);

      const response = await restService.getStrategyCountryData(body);
      if (response.status === 200) {
        const data = response.data; // Ensure correct reference to response data
        console.log("Company", data);

        setMapsData(data.data); // Set the map data state
        console.log("Countries Data", data);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchGraphData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategyLabel,
      };

      const response = await restService.getStrategyGraphData(body);
      if (response.status === 200) {
        const data = response.data; // Ensure proper reference to response data
        console.log("Company", data);

        setPerExhangeKPI(data.data.companies_per_exchanges_KPI);
        setPerSectorKPI(data.data.companies_per_sector_KPI);
        setPerMarketKPI(data.data.companies_per_market_cap_KPI);

        console.log("Exchange KPI", data.data.companies_per_exchanges_KPI);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchCriteriaHeaders = async () => {
    try {
      setIsLoading(true);
      const body = {
        strategy_name: selectedStrategyLabel,
      };
      console.log(body);

      const response = await restService.getStrategyHeaderValues(body);
      if (response.status === 200) {
        const data = response.data;
        console.log(data);

        const uniqueExchangesSet = new Set(
          data.data?.map((item) => item.exchange).filter(Boolean)
        );
        const uniqueIndustriesSet = new Set(
          data.data?.map((item) => item.industry).filter(Boolean)
        );
        const uniqueSectorsSet = new Set(
          data.data?.map((item) => item.sector).filter(Boolean)
        );

        setUniqueExchanges([...uniqueExchangesSet]);
        setUniqueIndustries([...uniqueIndustriesSet]);
        setUniqueSectors([...uniqueSectorsSet]);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error fetching criteria headers:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(uniqueExchanges);
  console.log(uniqueIndustries);
  console.log(uniqueSectors);

  // not related
  const fetchStrategyData = async () => {
    try {
      setIsLoading(true);

      const body = {};
      if (sSortBy) {
        body.sort_by = sSortBy;
      }
      if (sOrderBy) {
        body.order_by = sOrderBy;
      }

      const response = await restService.getAllStrategies(body);

      if (response.status === 200) {
        const data = response.data; // Ensure correct reference to response data
        console.log("Data:", data.strategies);

        setAllStrategies(data.strategies);
        setStrategiesCopy(data.strategies);

        console.log(sSortBy);
        console.log(sector);
        console.log("overview table data:", strategiesCopy);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error fetching strategy data:", error);
    } finally {
      setIsLoading(false); // Ensure loading state is turned off even if an error occurs
    }
  };

  // the Overview table
  const fetchGraphTableData = async () => {
    try {
      setIsLoading(true);
      console.log("1");
      console.log(selectedStrategy);
      const body = {
        strategy_name: selectedStrategyLabel,
        page: currentPage,
        data_per_page: currentRowsPerPage,
      };

      if (selectedCountry) {
        setSelectedItems([]);
        console.log(selectedItems);
        body.country = selectedCountry;
        console.log(selectedCountry);
      }

      if (selectedItems.length > 0) {
        setSelectedCompany("");
        console.log(selectedCountry);
        body.sector = selectedItems;
        console.log(selectedItems);
      }

      if (companyOrderBy) {
        body.order_by = companyOrderBy;
        console.log("here");
        console.log(companyOrderBy);
      }
      if (companySortBy) {
        body.sort_by = companySortBy;
        console.log(companySortBy);
      }

      console.log(selectedItems.length);
      console.log(body);

      if (criteriaRef.current) {
        criteriaRef.current.scrollIntoView({ behavior: "smooth" });
      }
      const response = await restService.getStrategyTableData(body);
      if (response.status === 200) {
        const data = response.data;
        console.log(data.data);

        console.log(selectedCountry);

        setGraphTableData(data.data);
        setGraphTableDataCopy(data.data);
        setTotalPages(data.paginator.total_pages);
        setPassingCriteria(data.companies_passing_criteris);

        if (companySortBy == "exchange") {
          setUniqueCompanies(uniqueExchanges);
        } else if (companySortBy == "industry") {
          setUniqueCompanies(uniqueIndustries);
        } else if (companySortBy == "sector") {
          setUniqueCompanies(uniqueSectors);
        }

        console.log(companySortBy);
        console.log(uniqueCompanies);
        setIsLoading(false);
        console.log(graphTableDataCopy);
      } else {
        console.log("Unexpected status code:", response.status);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeaderClick = (key) => {
    console.log(key);
    console.log(key.currentTarget);
    console.log(companySortBy);

    setAnchorEl(key.currentTarget);
    setOpenFilter(true);
    setCompanySortBy(key);
    // setSector("");
    setSelectedCountry(null);
    setCompanyOrderBy("");
  };

  useEffect(() => {
    fetchGraphData();
    fetchMapsData();
  }, [selectedStrategy, selectedCountry]);

  const handleBarClick = (companySortByParam) => {
    setCompanySortBy("");
    setSelectedItems([]);
    setSelectedCountry(null);
    setCurrentPage(1);
    setCompanySortBy("sector");
    setSelectedItems([companySortByParam]);

    console.log(selectedItems);
    console.log(companySortBy);
    console.log(companySortByParam);
    console.log(companySortByParam);
    console.log(selectedCountry);

    setSector(companySortByParam);
    if (criteriaRef.current) {
      criteriaRef.current.scrollIntoView({ behavior: "smooth" });
    }

    console.log("here");
  };

  const fetchStrategyAnnualPerformance = async () => {
    try {
      const response = await fetch(
        Constants.BACKEND_SERVER_BASE_URL +
          "/strategies/getStrategiesAnnualPerformance",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();
      // console.log("test",response);
      if (response.status === 200) {
        console.log("Data:", data);
        setStrategyData(data?.strategies);

        // console.log("strategydata",strategyData);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchStrategyBestWorstPerformance = async () => {
    try {
      const response = await fetch(
        Constants.BACKEND_SERVER_BASE_URL +
          "/strategies/getStrategiesBestWorstPerformance",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log("data inside returns tab is:", data.data);
        setBestWorstData(data.data);
        setBestWorstDataCopy(data.data);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchStrategyAnnualPerformance();
      fetchStrategyBestWorstPerformance();
      fetchMapsData();
    }
  }, [authToken, selectedStrategy, selectedStrategyLabel]);

  useEffect(() => {
    if (strategyData && strategyData?.length > 0) {
      const firstStrategy = strategyData[0];
      const strategyKeys = Object.keys(firstStrategy);
      const filteredYears = strategyKeys.filter(
        (key) => key !== "strategy_name_here" && key !== "strategy_label"
      );
      setYears(filteredYears);
    }
  }, [strategyData]);

  console.log(years);
  console.log(bestWorstData);

  console.log(strategyData);

  console.log(selectedItems);

  useEffect(() => {
    fetchGraphTableData();
  }, [
    currentPage,
    currentRowsPerPage,
    companySortBy,
    companyOrderBy,
    selectedCountry,
  ]);

  useEffect(() => {
    if (selectedStrategy) {
      fetchGraphTableData();
    }
  }, [selectedStrategy]);

  useEffect(() => {
    if (selectedItems) {
      fetchGraphTableData();
    }
  }, [selectedItems]);

  console.log(selectedStrategy);
  console.log(currentPage);
  console.log(currentRowsPerPage);
  console.log(companySortBy);
  console.log(companyOrderBy);
  console.log(selectedCountry);
  console.log(selectedItems);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleDataVisualizationAnnual = (strategy) => {
    console.log("here");
    console.log(strategy);
    setShowVisualData(!showVisualData);
    setIsSwitch2(true);
    console.log(strategy.strategy_name_here);
    setSelectedStrategy(strategy);
    setSelectedStrategyLabel(strategy.strategy_name_here);
    setSelectedSort(2);
    setTab2("returns");
    handleScrollToTop();
    setAnnual(true);
  };

  const handleDataVisualizationRolling = (strategy) => {
    console.log("here");
    console.log(strategy);
    setShowVisualData(!showVisualData);
    setIsSwitch2(true);
    console.log(strategy.name);
    setSelectedStrategy(strategy);
    setSelectedStrategyLabel(strategy.name);
    setSelectedSort(2);
    setTab2("returns");
    handleScrollToTop();
    setAnnual(false);
  };

  const handleReset = () => {
    setCompanySortBy(""); // Reset to initial value
    setCompanyOrderBy(""); // Reset to initial value
    setSelectedItems([]); // Reset to initial value
    setSOrderBy(""); // Reset to initial value
    setSSortBy(""); // Reset to initial value
    setSelectedCountry(); // Reset to initial value
    setCurrentPage(1);
    setCurrentRowsPerPage(3);
    console.log("here");
  };

  return isSwitch2 ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        // position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
        backgroundColor: "white",
        zIndex: 1,
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 1,
        }}
      >
        <Box
          sx={{
            display: "grid",
            justifyContent: "space-around",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr",
              md: "1.5fr 1fr",
            },
            gap: 2,
            my: 2,
          }}
        >
          <Card
            sx={{
              padding: 4,
              gap: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography style={{ fontWeight: "bolder" }}>
              {" "}
              Companies Per Country (%){" "}
            </Typography>

            <GeoChartComponent
              data={mapsData}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              setSSortBy={setSSortBy}
              sSortBy={sSortBy}
              setCompanySortBy={setCompanySortBy}
              companySortBy={companySortBy}
            />
          </Card>
          <Box style={{ display: "flex", gap: 6, flexDirection: "column" }}>
            <Card
              sx={{
                padding: 2,
              }}
            >
              <Typography style={{ fontWeight: "bolder" }}>
                {" "}
                Companies Per Sector (%){" "}
              </Typography>
              {/* {perSectorKPI && ( */}
              <HorizontalBarChart
                onClickBar={handleBarClick}
                data={perSectorKPI}
              />
              {/* )} */}
            </Card>
            <Card
              sx={{
                padding: 4,
                paddingBottom: { xs: 8, md: 4 },
                display: "flex",
                flexDirection: "column",
                height: 250,
              }}
            >
              <Typography style={{ fontWeight: "bolder" }}>
                {" "}
                Companies Per Market Cap (%){" "}
              </Typography>
              {/* {perMarketKPI && ( */}
              <DonutPieChart
                data={perMarketKPI}
                dataKey={"total_count"}
                nameKey={"market_cap_class"}
              ></DonutPieChart>
              {/* )} */}

              {/* <PieChart
                    graphData={perMarketKPI}
                    nameData={(item) => item.market_cap_class}
                  /> */}
            </Card>
          </Box>
        </Box>
        <CompaniesPassingCriteria
          graphTableDataCopy={graphTableDataCopy}
          passingHeadCells={passingHeadCells}
          onClickFilter={(event, key) => {
            handleHeaderClick(key);
            setAnchorEl(event.currentTarget);
            setIsBarClick(false);
          }}
          onClickTableBody={(data) => {
            setSelectedCompany(data);
            setIsSwitch1(true);
            setIsSwitch2(false);
            setShowVisualData(!showVisualData);
          }}
          // normal props
          criteriaRef={criteriaRef}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          passingCriteria={passingCriteria}
          companySortBy={companySortBy}
          companyOrderBy={companyOrderBy}
          setCompanySortBy={setCompanySortBy}
          setCompanyOrderBy={setCompanyOrderBy}
          currentRowsPerPage={currentRowsPerPage}
          setCurrentRowsPerPage={setCurrentRowsPerPage}
          setOpenFilter={setOpenFilter}
          openFilter={openFilter}
          anchorEl={anchorEl}
          items={uniqueCompanies}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          setIsSort={setIsSort}
          handleReset={handleReset}
        />
      </Card>
    </div>
  ) : (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // single column on small screens
            sm: "1fr 1fr", // two columns on medium screens and larger
          },
          gap: 2, // spacing between grid items
        }}
      >
        <Card sx={{ m: 1 }}>
          <Box p={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ mt: 0.5, mr: 1 }}>
                <Typography
                  variant="h6"
                  component="span"
                  sx={{
                    padding: "5px",
                    fontSize: "27px",
                    fontWeight: "bold",
                  }}
                >
                  Annual Returns
                </Typography>
              </Box>

              {/* switch  */}
              <Box>
                <label
                  htmlFor="annualDevidendSwitch"
                  style={{ marginLeft: 10 }}
                >
                  Line Chart
                </label>

                <Switch
                  id="annualDevidendSwitch"
                  checked={chartSwitch}
                  onChange={handleChartSwitchChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
                <label htmlFor="annualDevidendSwitch"> Bar Chart</label>
              </Box>
            </Box>

            {/* chart  */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 3,
                marginTop: 6,
              }}
            >
              <LineRaceChart
                chartId={"LR-chart-1"}
                chartData={strategyData}
                years={years}
                type="returns"
                chartSwitch={chartSwitch}
              />
            </Box>

            <TableContainer>
              <Table
                sx={{ minWidth: "100%", maxWidth: "100%", mt: 1 }}
                size="medium"
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#e7ecef",
                      color: "#272727",
                      fontSize: 14,
                    }}
                  >
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      Strategy
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      Trends
                    </TableCell>
                    {years.map((year, index) => (
                      <TableCell
                        key={index}
                        padding="normal"
                        sx={{ fontFamily: "Montserrat", color: "#427878" }}
                      >
                        {year}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {strategyData !== null &&
                    strategyData?.map((strategy, index) => (
                      <StyledTableRow hover key={index} sx={{ ml: 3 }}>
                        <StyledTableCell
                          onClick={() =>
                            handleDataVisualizationAnnual(strategy)
                          }
                          sx={{
                            cursor: "pointer",
                            ":hover": {
                              textDecoration: "underline",
                              color: "blue",
                            },
                          }}
                        >
                          {/* strategy button */}
                          {/* on click should open charts */}
                          {strategy?.strategy_label}
                        </StyledTableCell>
                        <StyledTableCell>
                          {(strategy[years[years.length - 1]]?.anual_return -
                            strategy[years[1]]?.anual_return) /
                            (years[years.length - 1] - years[1]) >=
                          0 ? (
                            <IoArrowUpOutline color="green" size={18} />
                          ) : (
                            <IoArrowDown color="red" size={18} />
                          )}
                        </StyledTableCell>

                        {years.map((year, index) => (
                          <StyledTableCell
                            key={index}
                            sx={{
                              color:
                                parseFloat(strategy[year]?.anual_return) >= 0
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {strategy[year]?.anual_return
                              ? strategy[year]?.anual_return
                              : "-"}
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Card>
        <Card sx={{ m: 1, position: "relative" }}>
          <Box p={3}>
            <Box spacing={1} sx={{ mt: 0.5 }}>
              <text
                style={{
                  padding: "5px",
                  fontSize: "27px",
                  fontWeight: "bold",
                  fontFamily: "Montserrat",
                }}
              >
                Rolling Return
              </text>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 3,
                marginTop: 6,
              }}
            >
              <NegativeBarChart
                chartId={"Neg-chart-1"}
                chartData={bestWorstData}
              />
            </Box>
            <TableContainer>
              <Table
                sx={{
                  minWidth: "100%",
                  maxWidth: "100%",
                  mt: 2,
                  fontFamily: "Montserrat",
                }}
                size="medium"
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#e7ecef",
                      color: "#272727",
                      fontSize: 14,
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          fontFamily: "Montserrat",
                        }}
                      >
                        <span>Strategy</span>
                      </Box>
                    </TableCell>
                    {headCategories.map((category, index) => (
                      <TableCell key={index} padding="normal">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <span>{category.title}</span>
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bestWorstDataCopy.map((data, index) => (
                    <StyledTableRow hover key={index} sx={{ ml: 3 }}>
                      <StyledTableCell
                        onClick={() => handleDataVisualizationRolling(data)}
                        sx={{
                          cursor: "pointer",
                          ":hover": {
                            textDecoration: "underline",
                            color: "blue",
                          },
                        }}
                      >
                        {data.strategy_label}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color:
                            parseFloat(data.rolling_return) >= 0
                              ? "green"
                              : "red",
                        }}
                      >
                        {data.rolling_return}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color:
                            parseFloat(data.best_return) >= 0 ? "green" : "red",
                        }}
                      >
                        {data.best_return}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color:
                            parseFloat(data.worst_return) >= 0
                              ? "green"
                              : "red",
                        }}
                      >
                        {data.worst_return}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color:
                            parseFloat(data.negative_annual_returns) >= 0
                              ? "green"
                              : "red",
                        }}
                      >
                        {data.negative_annual_returns}
                      </StyledTableCell>
                      {/* <StyledTableCell
                      sx={{
                        color: parseFloat(data.duration) >= 0 ? "green" : "red",
                      }}
                    >
                      {data.duration}
                    </StyledTableCell> */}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default ReturnsTab;

const CompaniesPassingCriteria = ({
  criteriaRef,
  selectedItems,
  setSelectedItems,
  passingCriteria,
  graphTableDataCopy,
  passingHeadCells,
  onClickFilter,
  onClickTableBody,
  currentRowsPerPage,
  setCurrentRowsPerPage,
  companySortBy,
  companyOrderBy,
  setCompanySortBy,
  setCompanyOrderBy,
  openFilter,
  setOpenFilter,
  anchorEl,
  items,
  currentPage,
  totalPages,
  setCurrentPage,
  isLoading,
  setIsSort,
  handleReset,
}) => {
  const rowsPerPageOptions = [3, 5, 10];

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
    setSelectedItems([]); //so on new page no filters are there
    console.log("here");
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
    setSelectedItems([]); //so on new page no filters are there
    console.log("here");
  };

  const handleChangeRowsPerPage = (event) => {
    setCurrentRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
    setSelectedItems([]); //so on new page no filters are there
    console.log("here");
  };

  console.log(selectedItems);

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        margin: 0,
        gap: 5,
        padding: 1,
      }}
      ref={criteriaRef}
    >
      <Box justifyContent={"space-between"} display={"flex"}>
        <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
          Companies Passing Criterias:{" "}
          <span style={{ color: "gray" }}>{passingCriteria}</span>
        </Typography>

        <Box>
          <SortingPopover
            companySortBy={companySortBy}
            setCompanySortBy={setCompanySortBy}
            companyOrderBy={companyOrderBy}
            setCompanyOrderBy={setCompanyOrderBy}
            setIsSort={setIsSort}
          />

          <ResetFilters handleReset={handleReset} />
        </Box>
      </Box>

      <Box position="relative">
        <TableContainer>
          <Table sx={{ width: "100%", maxWidth: "100%", mt: 1 }} size="medium">
            {/* Overlay and Spinner */}

            <Box pos="relative" justifyContent="center">
              {isLoading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1,
                  }}
                >
                  <CircularProgress size={40} />
                </Box>
              )}
              <>
                <TableHead>
                  <TableRow>
                    {passingHeadCells.data
                      ?.slice(0, -1)
                      ?.map((headCell, index) => (
                        <StyledTableCell key={index} padding="normal">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              position: "relative",
                            }}
                          >
                            <Typography>{headCell.label}</Typography>
                            <IconButton
                              onClick={(event) =>
                                onClickFilter(event, headCell.key)
                              }
                              sx={{
                                color: "black",
                                backgroundColor: "rgba(255, 255, 255, 0.3)",
                                borderRadius: "50%",
                                width: 24,
                                height: 24,
                                display:
                                  index >= 2 && index <= 4 ? "flex" : "none",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                              }}
                            >
                              <IoFilterSharp />
                            </IconButton>
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                              }}
                            >
                              <FilterPopover
                                openFilter={openFilter}
                                setOpenFilter={setOpenFilter}
                                anchorEl={anchorEl}
                                title="Sort By"
                                items={items}
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                                graphTableDataCopy={graphTableDataCopy}
                                companySortBy={companySortBy}
                                setIsSort={setIsSort}
                                isLoading={isLoading}
                              />
                            </Box>
                          </Box>
                        </StyledTableCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {graphTableDataCopy.length > 0 ? (
                    <>
                      {graphTableDataCopy?.map((data, index) => (
                        <Tooltip
                          key={index}
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          title="Click to analyze the company"
                        >
                          <StyledTableRow
                            hover
                            onClick={onClickTableBody}
                            style={{ cursor: "pointer" }}
                          >
                            <StyledTableCell>
                              <div
                                style={{
                                  display: "grid",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gridTemplateColumns: "1fr 3fr",
                                }}
                              >
                                <img
                                  src={data.image}
                                  style={{ height: "30px", width: "35px" }}
                                />
                                {data.company_name}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>{data.symbol}</StyledTableCell>
                            <StyledTableCell>{data.exchange}</StyledTableCell>
                            <StyledTableCell>{data.sector}</StyledTableCell>
                            <StyledTableCell>{data.industry}</StyledTableCell>
                            <StyledTableCell
                              sx={{
                                color: data.total_return >= 0 ? "green" : "red",
                                fontWeight: "bolder",
                              }}
                            >
                              {data.total_return}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{
                                color:
                                  data.annualized_return >= 0 ? "green" : "red",
                                fontWeight: "bolder",
                              }}
                            >
                              {data.annualized_return}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{
                                color:
                                  data.rolling_return >= 0 ? "green" : "red",
                                fontWeight: "bolder",
                              }}
                            >
                              {data.rolling_return}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{
                                color:
                                  data.stdev_excess_return >= 0
                                    ? "green"
                                    : "red",
                                fontWeight: "bolder",
                              }}
                            >
                              {data.stdev_excess_return}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{
                                color: data.max_drawdown >= 0 ? "green" : "red",
                                fontWeight: "bolder",
                              }}
                            >
                              {data.max_drawdown}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{
                                fontWeight: "bolder",
                              }}
                            >
                              {data.country}
                            </StyledTableCell>
                          </StyledTableRow>
                        </Tooltip>
                      ))}
                    </>
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={10} align="center">
                        <Typography variant="h6" fontWeight="bold">
                          No data found with current filters in current page.
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </>
            </Box>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          width={"100%"}
          gap={1}
          mt={2}
        >
          <Box display={"flex"} alignItems={"center"} gap={1}>
            <label>Rows Per Page:</label>
            <select
              style={{ border: "none", outline: "none" }}
              value={currentRowsPerPage}
              onChange={handleChangeRowsPerPage}
            >
              {rowsPerPageOptions?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Box>

          <Box display={"flex"} alignItems={"center"} px={2} gap={1}>
            <span style={{ fontFamily: "Montserrat" }}>
              {currentPage}-{currentRowsPerPage} of {totalPages}
            </span>
            <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
              <FaChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};
