import React, { useEffect, useRef, useState, useContext } from "react";

import {
  Grid,
  Card,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
  Tooltip,
  CircularProgress,
  Skeleton,
} from "@mui/material";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import ColorConstants from "../../Core/constants/ColorConstants.json";
import AuthContext from "../../Core/store/auth-context";
import VerticalBarChart from "./VerticalBarChart";
import Fade from "@mui/material/Fade";
import InvestorModal from "./InvestorModal";
import { CgSpinner } from "react-icons/cg";
import DonutPieChart from "./charts/DonoutChart";
import { styled } from "@mui/material/styles";
import { IoFilterSharp } from "react-icons/io5";
import { useSwitch } from "../../../utils/context/SwitchContext";
import HorizontalBarChart from "./charts/HorizontalBar";
import GeoChartComponent from "./charts/GeoCharts";
import { RiArrowUpDownLine } from "react-icons/ri";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import BreadcrumbsComponent from "../../Core/components/Layout/BreadCrumbs";
import Constants from "../../../Constants.json";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { FaBuilding } from "react-icons/fa";
import { VscListFilter } from "react-icons/vsc";
import SortingPopover from "./SortingPopover";
import FilterPopover from "./FilterPopover";
import OverviewSortingPopover from "./OverviewSortingPopover";
import InvestorScreenerService from "../services/InvestorService";
import ResetFilters from "./ResetFilters";

const OverviewTab = ({
  setSelectedCompany,
  showVisualData,
  setShowVisualData,
  setSelectedStrategyLabel,
}) => {
  const restService = new InvestorScreenerService();
  const [companySortBy, setCompanySortBy] = useState("");
  const [companyOrderBy, setCompanyOrderBy] = useState("");
  // const [sector, setSector] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [allStrategies, setAllStrategies] = useState([]);
  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);

  const [storedToken, setStoredToken] = useState(null);

  const [perExchangeKPI, setPerExhangeKPI] = useState([]);
  const [perSectorKPI, setPerSectorKPI] = useState([]);
  const [perMarketKPI, setPerMarketKPI] = useState([]);
  const [graphTableData, setGraphTableData] = useState([]);
  const [graphTableDataCopy, setGraphTableDataCopy] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [passingCriteria, setPassingCriteria] = useState(null);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [showInvestor, setShowInvestor] = useState(false);
  const [mapsData, setMapsData] = useState([]);
  const [strategiesCopy, setStrategiesCopy] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { setIsSwitch1, isSwitch2, setIsSwitch2 } = useSwitch();
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(3);
  const [sOrderBy, setSOrderBy] = useState("");
  const [sSortBy, setSSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueExchanges, setUniqueExchanges] = useState([]);
  const [uniqueIndustries, setUniqueIndustries] = useState([]);
  const [uniqueSectors, setUniqueSectors] = useState([]);

  const criteriaRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const fetchGraphTableData = async () => {
    try {
      setIsLoading(true);
      console.log("1");
      console.log(selectedStrategy);
      const body = {
        strategy_name: selectedStrategy?.name,
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

  const fetchMapsData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategy?.name,
      };

      console.log(body);

      const response = await restService.getStrategyCountryData(body);

      if (response.status === 200) {
        const data = response.data; // Ensure correct reference to response data
        console.log("Company", data.data);

        setMapsData(data.data); // Set the map data state
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error fetching maps data:", error);
    }
  };

  const fetchGraphData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategy?.name,
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
      console.error("Error fetching graph data:", error);
    }
  };

  const fetchCriteriaHeaders = async () => {
    try {
      setIsLoading(true);
      const body = {
        strategy_name: selectedStrategy?.name,
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

  useEffect(() => {
    fetchCriteriaHeaders();
  }, [selectedStrategy]);

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
        console.log(sOrderBy);

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

  useEffect(() => {
    fetchGraphData();
    fetchMapsData();
  }, [selectedStrategy, selectedCountry]);

  useEffect(() => {
    fetchGraphTableData();
  }, [
    currentPage,
    currentRowsPerPage,
    companySortBy,
    companyOrderBy,
    selectedCountry,
  ]);

  console.log(selectedStrategy);
  console.log(currentPage);
  console.log(currentRowsPerPage);
  console.log(companySortBy);
  console.log(companyOrderBy);
  console.log(selectedCountry);
  console.log(selectedItems);

  useEffect(() => {
    if (selectedStrategy) {
      fetchGraphTableData();
    }
    console.log(selectedStrategy);
  }, [selectedStrategy]);

  useEffect(() => {
    if (selectedItems) {
      fetchGraphTableData();
    }
    console.log(selectedItems);
  }, [selectedItems]);


  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

    // setSector(companySortByParam);
    if (criteriaRef.current) {
      criteriaRef.current.scrollIntoView({ behavior: "smooth" });
    }

    console.log("here");
  };
  const closeInvestorModal = () => {
    setShowInvestor(!showInvestor);
  };

  const handleReset = () => {
    setCompanySortBy(""); 
    setCompanyOrderBy(""); 
    setSelectedItems([]); 
    setSOrderBy(""); 
    setSSortBy(""); 
    setSelectedCountry(); 
    setCurrentPage(1);
    setCurrentRowsPerPage(3);
    console.log("here");
  };

  const handleDataVisualization = (strategy) => {
    setIsSwitch2(true);
    setSelectedStrategy(strategy);
    handleScrollToTop();
    setSelectedStrategyLabel(strategy.strategy_label);
  };
  const handleInvestorVisualization = (investor) => {
    setShowInvestor(!showInvestor);
    setSelectedInvestor(investor);
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
  //auth related work
  //auth related work

  return (
    <Grid
      container
      sx={{
        fontFamily: "Montserrat",
        width: "100%",
      }}
    >
      {isSwitch2 ? (
        <>
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
              {/* Companies Per Country, sector, market */}
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

                <Box
                  style={{ display: "flex", gap: 6, flexDirection: "column" }}
                >
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
                handleReset={handleReset}
              />
            </Card>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

            gap: 5,
          }}
        >
          {/* strategies */}
          <Card
            sx={{
              my: 1,
              position: "relative",
              width: "calc(100vw - 30px)",
              overflowX: "hidden",
              boxShadow: "none",
            }}
          >
            <Box px={2} py={2} width={"100%"}>
              <Box spacing={1} sx={{ mt: 0.5 }}>
                <Typography
                  style={{
                    padding: "5px",
                    fontSize: "27px",
                    fontWeight: "bold",
                  }}
                >
                  Strategies Performances and Risks{" "}
                  <span style={{ color: "gray" }}>
                    ({strategiesCopy?.[0]?.duration}years)
                  </span>
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  marginTop: 6,
                  overflowX: "hidden",
                }}
              >
                {allStrategies?.length > 0 ? (
                  <>
                    <VerticalBarChart
                      chartId={"bar-chart-1"}
                      graphData={allStrategies}
                    />

                    <VerticalBarChart
                      chartId={"bar-chart-2"}
                      graphData={allStrategies}
                    />

                    <VerticalBarChart
                      chartId={"bar-chart-3"}
                      graphData={allStrategies}
                    />
                  </>
                ) : (
                  <>
                    <Box sx={{ width: { xs: "100%", sm: "33%" }, padding: 2 }}>
                      <Skeleton variant="rectangular" height={300} />
                    </Box>
                    <Box sx={{ width: { xs: "100%", sm: "33%" }, padding: 2 }}>
                      <Skeleton variant="rectangular" height={300} />
                    </Box>
                    <Box sx={{ width: { xs: "100%", sm: "33%" }, padding: 2 }}>
                      <Skeleton variant="rectangular" height={300} />
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Card>
          {/* overview 3y chart Companies Per Country*/}
          <OverviewTableData
            strategiesCopy={strategiesCopy}
            sOrderBy={sOrderBy}
            setSOrderBy={setSOrderBy}
            sSortBy={sSortBy}
            setSSortBy={setSSortBy}
            headCells={headCells}
            onClickVisualization={(data) => handleDataVisualization(data)}
            onClickInvestorVisualization={() =>
              handleInvestorVisualization(data.investors)
            }
            isLoading={isLoading}
          />
        </div>
      )}

      {showInvestor && (
        <InvestorModal
          showInvestor={showInvestor}
          closeInvestorModal={closeInvestorModal}
          investor={selectedInvestor}
        />
      )}
    </Grid>
  );
};

export default OverviewTab;

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
  handleReset,
}) => {
  const rowsPerPageOptions = [3, 5, 10];

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
    console.log("here");
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
    console.log("here");
  };

  const handleChangeRowsPerPage = (event) => {
    setCurrentRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
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
                    {passingHeadCells.data?.map((headCell, index) => (
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
              {currentPage} of {totalPages}
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

const OverviewTableData = ({
  strategiesCopy,
  sOrderBy,
  setSOrderBy,
  sSortBy,
  setSSortBy,
  headCells,
  onClickVisualization,
  onClickInvestorVisualization,
  isLoading,
}) => {
  return (
    <Card
      sx={{
        display: "flex",
        width: "calc(100vw - 30px)",
        my: 1,
        position: "relative",
        overflowX: "auto",
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        width={"100%"}
        bgcolor={"white"}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingX: 3,
            paddingY: 1,
          }}
        >
          <Box spacing={1} sx={{ mt: 0.5 }}>
            <text
              style={{
                padding: "5px",
                fontSize: "27px",
                fontWeight: "bold",
              }}
            >
              {" "}
              Overview{" "}
              <span style={{ color: "gray" }}>
                ({strategiesCopy?.[0]?.duration} years)
              </span>
            </text>
          </Box>
          <Box display="flex" gap={2} sx={{ mt: 0.5 }}>
            <OverviewSortingPopover
              sOrderBy={sOrderBy}
              setSOrderBy={setSOrderBy}
              sSortBy={sSortBy}
              setSSortBy={setSSortBy}
            />
          </Box>
        </Box>
        <TableContainer>
          <Table sx={{ width: "100%", mt: 1 }} size="medium">
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
                    {headCells.data?.map((headCell, index) => (
                      <StyledTableCell key={headCell.id} padding="normal">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            position: "relative",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {headCell.label}
                          </Box>

                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                            }}
                          ></Box>
                        </Box>
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {strategiesCopy?.map((data, index) => {
                    return (
                      <StyledTableRow hover key={index} sx={{ ml: 3 }}>
                        <StyledTableCell
                          onClick={() => onClickVisualization(data)}
                          // onClick={() => handleDataVisualization(data)}
                          sx={{
                            cursor: "pointer",
                            ":hover": {
                              textDecoration: "underline",
                              color: "blue",
                            },
                          }}
                        >
                          {" "}
                          {/* strategy button */}
                          {data.strategy_label}
                        </StyledTableCell>
                        <StyledTableCell
                          // onClick={() =>
                          //   handleInvestorVisualization(data.investors)
                          // }

                          onClick={() =>
                            onClickInvestorVisualization(data.investors)
                          }
                          sx={{
                            cursor: "pointer",
                            ":hover": {
                              textDecoration: "underline",
                              color: "blue",
                            },
                          }}
                        >
                          {data.investors}
                        </StyledTableCell>
                        <StyledTableCell>
                          {data.investing_style}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color: data.total_return >= 0 ? "green" : "red",
                            fontWeight: "bolder",
                          }}
                        >
                          {" "}
                          {data.total_return}{" "}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color:
                              data.annualized_return >= 0 ? "green" : "red",
                            fontWeight: "bolder",
                          }}
                        >
                          {" "}
                          {data.annualized_return}{" "}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color: data.rolling_return >= 0 ? "green" : "red",
                            fontWeight: "bolder",
                          }}
                        >
                          {" "}
                          {data.rolling_return}{" "}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color: data.stdev_return >= 0 ? "green" : "red",
                            fontWeight: "bolder",
                          }}
                        >
                          {" "}
                          {data.stdev_return}{" "}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color: data.max_drawdown >= 0 ? "green" : "red",
                            fontWeight: "bolder",
                          }}
                        >
                          {" "}
                          {data.max_drawdown}{" "}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color: data.sharpe_ratio >= 0 ? "green" : "red",
                            fontWeight: "bolder",
                          }}
                        >
                          {" "}
                          {data.sharpe_ratio}{" "}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color: data.sortino_ratio >= 0 ? "green" : "red",
                            fontWeight: "bolder",
                          }}
                        >
                          {" "}
                          {data.sortino_ratio ? data.sortino_ratio : "-"}{" "}
                        </StyledTableCell>
                        {/* <StyledTableCell> {data.duration} </StyledTableCell> */}
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </>
            </Box>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
};

const headCells = {
  data: [
    {
      id: "strategy",
      label: "Strategy",
      key: "name",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "investor",
      label: "Investors",
      key: "investors",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "investStyle",
      label: "Investing Style",
      key: "",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "totalreturn",
      label: "Total Return (%)",
      key: "total_return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "annualizedReturn",
      label: "Annualized Return (%)",
      key: "annualized_return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "rollingReturn",
      label: "Rolling Return (%)",
      key: "rolling_return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "standardDeviation",
      label: "Standard Deviation (%)",
      key: "stdev_excess_return",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "maxDrawdown",
      label: "Max Drawdown (%)",
      key: "max_drawdown",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "sharpeRatio",
      label: "Sharpe Ratio",
      key: "sharpe_ratio",
      isValueLink: false,
      isDropDown: false,
    },
    {
      id: "sortinoRatio",
      label: "Sortino Ratio",
      key: "sortino_ratio",
      isValueLink: false,
      isDropDown: false,
    },
    // {
    //   id: "duration",
    //   label: "Duration",
    //   key: "duration",
    //   isValueLink: false,
    //   isDropDown: false,
    // },
  ],
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
      label: "Symbol",
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
      key: "stdev_excess_return",
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
      label: "Country",
      key: "country",
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
    border: `1px solid ${theme.palette.divider}`,
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
  border: 0,
}));
