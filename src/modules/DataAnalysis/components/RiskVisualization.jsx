import React, { useContext, useState, useEffect, useRef } from "react";
import HorizontalBarChart from "./charts/HorizontalBar";
import DonutPieChart from "./charts/DonoutChart";
import GeoChartComponent from "./charts/GeoCharts";
import AuthContext from "../../Core/store/auth-context";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowDown, IoArrowUp, IoFilterSharp } from "react-icons/io5";

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
import Constants from "../../../Constants.json";
import BreadcrumbsComponent from "../../Core/components/Layout/BreadCrumbs";
import { useSwitch } from "../../../utils/context/SwitchContext";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { FaBuilding, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import InvestorScreenerService from "../services/InvestorService";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ColorConstants from "../../Core/constants/ColorConstants.json";
import SortingPopover from "./SortingPopover";
import FilterPopover from "./FilterPopover";
import ResetFilters from "./ResetFilters";

const RiskVisualization = () => {
  const navigate = useNavigate();
  const [perExchangeKPI, setPerExhangeKPI] = useState([]);
  const [perSectorKPI, setPerSectorKPI] = useState([]);
  const [perMarketKPI, setPerMarketKPI] = useState([]);
  const [mapsData, setMapsData] = useState([]);
  const location = useLocation();
  const selectedStrategylocation = location.state.selectedStrategy;
  const selectedLabellocation = location.state.selectedStrategyLabel;
  const setSelectedCompany = location.state.setSelectedCompany;

  console.log(selectedStrategylocation);
  console.log(selectedLabellocation);

  const [passingCriteria, setPassingCriteria] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(3);
  const [graphTableData, setGraphTableData] = useState([]);
  const [graphTableDataCopy, setGraphTableDataCopy] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [strategiesCopy, setStrategiesCopy] = useState([]);

  const [chartSwitch, setChartSwitch] = useState(true);

  const navigation = useNavigate();

  const [companySortBy, setCompanySortBy] = useState("");
  const [companyOrderBy, setCompanyOrderBy] = useState("asc");
  const [sector, setSector] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [selectedStrategyLabel, setSelectedStrategyLabel] = useState(
    selectedStrategylocation
  );

  const [selectedStrategy, setSelectedStrategy] = useState(
    selectedLabellocation
  );
  const [allStrategies, setAllStrategies] = useState([]);

  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const [strategyData, setStrategyData] = useState([]);
  const [years, setYears] = useState([]);
  const [bestWorstData, setBestWorstData] = useState([]);
  // const [showVisualData, setShowVisualData] = useState(false);
  const [bestWorstDataCopy, setBestWorstDataCopy] = useState([]);

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
  const restService = new InvestorScreenerService();

  const [activeButton, setActiveButton] = useState("RETURNS AND RISK");
  const [showVisualData, setShowVisualData] = useState(false);
  const [tab2, setTab2] = useState("");
  const { isSwitch1, setIsSwitch1, isSwitch2, setIsSwitch2 } = useSwitch();

  useEffect(() => {
    const CheckUserSession = () => {
      return authCtx.isLoggedIn ? authCtx.token : "";
    };

    const userToken = CheckUserSession();
    setAuthToken(userToken);
  }, []);

  console.log(selectedStrategyLabel);

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

      if (selectedItems.length > 0) {
        setSelectedCompany("");
        // setCompanySortBy("");
        body.sector = selectedItems;
      }

      if (selectedCountry) {
        setSelectedItems([]);
        console.log(selectedItems);
        body.country = selectedCountry;
      }

      if (companyOrderBy) {
        body.order_by = companyOrderBy;
        console.log("here");
      }
      if (companySortBy) {
        body.sort_by = companySortBy;
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
        console.log(isBarClick);

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
    setAnchorEl(key.currentTarget);
    setOpenFilter(true);
    setCompanySortBy(key);
    setSector("");
    setIsSort(false);
    setIsBarClick(false);
    setSelectedCountry(null);
  };

  useEffect(() => {
    fetchGraphData();
    fetchMapsData();
  }, [selectedStrategy]);

  const handleBarClick = (companySortByParam) => {
    console.log(companySortByParam);
    setCompanySortBy("");
    console.log(companySortByParam);
    setSelectedItems([]);
    setSelectedCountry(null);
    setCompanySortBy("Sector");
    setSelectedItems([companySortByParam]);
    setIsBarClick(true);

    console.log(selectedItems);
    console.log(companySortBy);

    setSector(companySortByParam);
    if (criteriaRef.current) {
      criteriaRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
    selectedStrategy,
    currentPage,
    currentRowsPerPage,
    companySortBy,
    companyOrderBy,
    sector,
    selectedCountry,
  ]);

  useEffect(() => {
    console.log(selectedItems);
    if (selectedItems?.length > 0) {
      const filteredData = graphTableDataCopy.filter((item) =>
        selectedItems.some(
          (selected) =>
            item.exchange === selected ||
            item.sector === selected ||
            item.industry === selected
        )
      );
      console.log(filteredData);
      setGraphTableDataCopy(filteredData);
    } else {
      fetchGraphTableData();
      console.log("here");
    }

    //checks if selected item matches to anythng in the array
  }, [selectedItems]);

  useEffect(() => {
    fetchCriteriaHeaders();
  }, [selectedStrategy]);

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

  console.log(uniqueExchanges);
  console.log(uniqueIndustries);
  console.log(uniqueSectors);

  useEffect(() => {
    fetchGraphData();
    fetchMapsData();
  }, [selectedStrategy]);

  const buttons = [
    {
      id: "OVERVIEW",
      label: "OVERVIEW",
      icon: <AssessmentIcon />,
      component: "OverviewContent",
    },
    {
      id: "RETURNS AND RISK",
      label: "RETURNS AND RISK",
      icon: <TrendingUpIcon />,
      component: "ReturnsRiskContent",
    },
    {
      id: "HISTORICAL PRICES",
      label: "HISTORICAL PRICES",
      icon: <FaBuilding />,
      component: "HistoricalPlacesContent",
    },
  ];

  console.log(activeButton);
  console.log(selectedStrategyLabel);
  console.log(showVisualData);
  console.log(tab2);
  console.log(isSwitch2);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };
    handleScrollToTop();
  }, []);

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

  const handleReset = () => {
    setCompanySortBy(""); // Reset to initial value
    setCompanyOrderBy("asc"); // Reset to initial value
    setSector(""); // Reset to initial value
    setSelectedItems([]); // Reset to initial value
    setSOrderBy(""); // Reset to initial value
    setSSortBy(""); // Reset to initial value
    setIsSort(false); // Reset to initial value
    setIsBarClick(false); // Reset to initial value
    setSelectedCountry(); // Reset to initial value
    setCurrentPage(1);
    setCurrentRowsPerPage(3);
    console.log("here");
  };

  return (
    <>
      <BreadcrumbsComponent
        parent={"Investor Screener"}
        subParent={selectedStrategyLabel}
        child={activeButton}
        setSelectedStrategyLabel={setSelectedStrategyLabel}
        setTab2={setTab2}
        setActiveButton={setActiveButton}
        setShowVisualData={setShowVisualData}
      ></BreadcrumbsComponent>

      <Box padding={2} display={"flex"} gap={3}>
        {buttons.map((button) => (
          <Button
            key={button.id}
            sx={{
              backgroundColor: activeButton === button.id ? "#427879" : "white",
              color: activeButton === button.id ? "white" : "black",
              "&:hover": {
                backgroundColor:
                  activeButton === button.id ? "#427879" : "#427879",
                color: activeButton === button.id ? "white" : "white",
              },
            }}
            startIcon={button.icon}
            onClick={() => {
              setActiveButton(button.id);
              setIsSwitch2(false);
              setTab2("");
              if (selectedStrategyLabel) {
                setSelectedStrategyLabel(null);
                setShowVisualData(false);
                navigate("/dataanalysis/investorscreeners");
              }
            }}
          >
            {button.label}
          </Button>
        ))}
      </Box>

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
          <text style={{ fontWeight: "bolder" }}> Companies Per Country</text>

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
            <text style={{ fontWeight: "bolder" }}>
              {" "}
              Companies Per Sector (%){" "}
            </text>
            <HorizontalBarChart
              onClickBar={handleBarClick}
              data={perSectorKPI}
            />
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
            <text style={{ fontWeight: "bolder" }}>
              {" "}
              Companies Per Market Cap (%){" "}
            </text>
            <DonutPieChart
              data={perMarketKPI}
              dataKey={"total_count"}
              nameKey={"market_cap_class"}
            ></DonutPieChart>
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
    </>
  );
};

export default RiskVisualization;

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

const passingHeadCells = {
  data: [
    {
      label: "Company Name",
      key: "company_name",
      isValueLink: false,
      isDropDown: false,
    },

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
