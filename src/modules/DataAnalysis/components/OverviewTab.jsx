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
}));

const sortingFields = [
  { key: "none", label: "None" },
  { key: "name", label: "Strategy Name" },
  { key: "investors", label: "Investors" },
  { key: "total_return", label: "Total Return" },
  { key: "annualized_return", label: "Annualized Return" },
  { key: "rolling_return", label: "Rolling Return" },
  { key: "stdev_return", label: "Standard Deviation of Return" },
  { key: "max_drawdown", label: "Max Drawdown" },
  { key: "sharpe_ratio", label: "Sharpe Ratio" },
  { key: "sortino_ratio", label: "Sortino Ratio" },
  { key: "duration", label: "Duration" },
];

const OverviewTab = ({
  setSelectedCompany,
  showVisualData,
  setShowVisualData,
  setSelectedStrategyLabel,
}) => {
  let pageLoc = window.location.pathname;
  const [sortOption, setSortOption] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sector, setSector] = useState("");

  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [allStrategies, setAllStrategies] = useState([]);
  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
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

  const criteriaRef = useRef(null);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleDataVisualization = (strategy) => {
    console.log(strategy);
    setIsSwitch2(true);
    setSelectedStrategy(strategy);
    handleScrollToTop();
    setSelectedStrategyLabel(strategy.strategy_label);
  };

  const handleInvestorVisualization = (investor) => {
    setShowInvestor(!showInvestor);
    setSelectedInvestor(investor);
  };

  const closeInvestorModal = () => {
    setShowInvestor(!showInvestor);
  };

  console.log(selectedStrategy);

  useEffect(() => {
    const CheckUserSession = () => {
      return authCtx.isLoggedIn ? authCtx.token : "";
    };

    const userToken = CheckUserSession();
    setAuthToken(userToken);
  }, []);

  console.log(sortOption);
  console.log(sortOrder);
  console.log(sector);

  const fetchStrategyData = async () => {
    try {
      const body = {};
      if (sortOption) {
        body.sort_by = sortOption;
      }
      if (sortOrder) {
        body.order_by = sortOrder;
      }

      const response = await fetch(
        Constants.BACKEND_SERVER_BASE_URL + "/strategies/getAllStrategies",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      console.log(body);
      const data = await response.json();

      if (response.status === 200) {
        console.log("Data:", data.strategies);

        setAllStrategies(data.strategies);
        setStrategiesCopy(data.strategies);

        console.log(sortOption);
        console.log(sector);

        const uniqueValues = data.strategies
          ?.map((item) => item[sortOption])
          .filter(Boolean);
        const uniqueCompanies = [...new Set(uniqueValues)];

        console.log(uniqueValues);
        console.log(uniqueCompanies);
        setUniqueCompanies(uniqueCompanies);

        let filteredData = data.strategies;
        if (selectedItems.length > 0) {
          filteredData = filteredData.filter((item) =>
            selectedItems.includes(item[sortOption])
          );
          console.log("Filtered Data:", filteredData);
        }
        setStrategiesCopy(filteredData); // Update the state with filtered and sorted data
        console.log("Sorted and Filtered Data:", filteredData);
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
        strategy_name: selectedStrategy.name,
      };
      console.log(
        Constants.BACKEND_SERVER_BASE_URL + "/strategies/getStrategyGraphData"
      );
      const response = await fetch(
        Constants.BACKEND_SERVER_BASE_URL + "/strategies/getStrategyGraphData",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log("Company", data.data);
        // console.log("Company",data);
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

  const fetchGraphTableData = async () => {
    try {
      console.log("1");
      console.log(selectedStrategy);
      const body = {
        strategy_name: selectedStrategy.name,
        page: currentPage,
        data_per_page: currentRowsPerPage,
      };

      if (sector) {
        body.sector = sector;
      }
      if (sortOrder) {
        body.order_by = sortOrder;
      }
      if (sortOption) {
        body.sort_by = sortOption;
      }

      console.log(body);

      const response = await fetch(
        Constants.BACKEND_SERVER_BASE_URL + "/strategies/getStrategyTableData",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log(data.data);
        setGraphTableData(data.data);
        setGraphTableDataCopy(data.data);
        setTotalPages(data.paginator.total_pages);
        setPassingCriteria(data.companies_passing_criteris);

        const filterOption = sortOption ? sortOption : sector;
        console.log(filterOption);
        console.log(sortOption);
        console.log(sector);

        //returns unique names of company name(sortOption) like saksoft, tata

        if (!sector) {
          const uniqueValues = data.data
            ?.map((item) => item[filterOption])
            .filter(Boolean);
          const uniqueCompanies = [...new Set(uniqueValues)];

          console.log(uniqueValues);
          console.log(uniqueCompanies);
          setUniqueCompanies(uniqueCompanies);
        }

        if (selectedItems.length > 0) {
          console.log("here");
          console.log(filterOption);
          console.log(data);
          const filteredData = data.data.filter(
            (item) => selectedItems.includes(item[filterOption])
            // item.sector == filterOption
          );
          setGraphTableDataCopy(filteredData); // handles drop down, return the rows which contain particular sector, names eg saksoft, tata from company names
          console.log(filteredData); //technlogy was selected from unique values so its has 2 length data
          console.log(filterOption);
          console.log(filteredData.length);
        } else {
          console.log("here");
          setGraphTableDataCopy(data.data);
        }
      } else {
        console.log("here");
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("here");
    }
  };

  const handleHeaderClick = (key) => {
    console.log(key);
    setAnchorEl(key.currentTarget);
    setOpenFilter(true);
    setSortOption(key);
    setSector("");
  };
  const fetchMapsData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategy.name,
      };

      console.log(
        Constants.BACKEND_SERVER_BASE_URL + "/strategies/getStrategyCountryData"
      );
      const response = await fetch(
        Constants.BACKEND_SERVER_BASE_URL +
          "/strategies/getStrategyCountryData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log("Company", data.data);
        setMapsData(data.data);
        console.log("Countries Data", data.data);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchGraphData();
    fetchMapsData();
    fetchGraphTableData();
    applyFilters(graphTableDataCopy);
  }, [
    selectedStrategy,
    currentPage,
    currentRowsPerPage,
    sortOption,
    sortOrder,
    selectedItems,
    selectedItems.length,
    sector,
  ]);

  const applyFilters = (data) => {
    let filteredData = data;
    console.log(filteredData);
    console.log(sortOption);

    if (sortOption) {
      filteredData = filteredData.filter((item) => item.sector === sortOption);
      console.log(filteredData);
      console.log(filteredData.length);
      console.log("here 1");
    }
    if (selectedItems.length > 0) {
      filteredData = filteredData.filter((item) =>
        selectedItems.includes(item.sector)
      );
      console.log(filteredData);
      console.log(filteredData.length);
      console.log("here 2");
    }
    setGraphTableData(filteredData);
  };

  const handleBarClick = (sortOptionParam) => {
    console.log(sortOptionParam);
    setSortOption("");

    setSector(sortOptionParam);

    console.log(sortOptionParam);
    setSelectedItems([sortOptionParam]);

    if (criteriaRef.current) {
      criteriaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchStrategyData();
    }
  }, [authToken]);
  return (
    <Grid
      container
      sx={{
        fontFamily: "Montserrat",
        width: "100%",
      }}
    >
      {/* Strategies modal */}
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
                  <text style={{ fontWeight: "bolder" }}>
                    {" "}
                    Companies Per Country (%){" "}
                  </text>
                  {/* <PieChart
                    graphData={perExchangeKPI}
                    nameData={(item) => item.exchange}
                  /> */}
                  <GeoChartComponent data={mapsData} />
                </Card>
                <Box
                  style={{ display: "flex", gap: 6, flexDirection: "column" }}
                >
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
                    {/* <PieChart
                    graphData={perMarketKPI}
                    nameData={(item) => item.market_cap_class}
                  /> */}
                  </Card>
                </Box>
              </Box>
              {/* </Card> */}
              <CompaniesPassingCriteria
                graphTableDataCopy={graphTableDataCopy}
                passingHeadCells={passingHeadCells}
                onClickFilter={(event, key) => {
                  handleHeaderClick(key);
                  setAnchorEl(event.currentTarget);
                }}
                onClickTableBody={() => {
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
                sortOption={sortOption}
                sortOrder={sortOrder}
                setSortOption={setSortOption}
                setSortOrder={setSortOrder}
                currentRowsPerPage={currentRowsPerPage}
                setCurrentRowsPerPage={setCurrentRowsPerPage}
                setOpenFilter={setOpenFilter}
                openFilter={openFilter}
                anchorEl={anchorEl}
                items={uniqueCompanies}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
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
                <text
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
                </text>
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
                  <h1>Fetching...</h1>
                )}
              </Box>
            </Box>
          </Card>
          {/* overview 3y chart */}
          <OverviewTableData
            strategiesCopy={strategiesCopy}
            allStrategies={allStrategies}
            sortOption={sortOption}
            setSortOption={setSortOption}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            headCells={headCells}
            setOpenFilter={setOpenFilter}
            openFilter={openFilter}
            anchorEl={anchorEl}
            items={uniqueCompanies}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            onClickVisualization={() => handleDataVisualization(data)}
            onClickInvestorVisualization={() =>
              handleInvestorVisualization(data.investors)
            }
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
  sortOption,
  sortOrder,
  setSortOption,
  setSortOrder,
  openFilter,
  setOpenFilter,
  anchorEl,
  items,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const rowsPerPageOptions = [3, 5, 10];

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  const handleChangeRowsPerPage = (event) => {
    setCurrentRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };
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
        <text style={{ fontSize: 20, fontWeight: "bold" }}>
          Companies Passing Criterias:{" "}
          <span style={{ color: "gray" }}>
            {selectedItems.length < 1
              ? passingCriteria
              : graphTableDataCopy.length}
          </span>
        </text>

        <Box>
          <SortingPopover
            sortOption={sortOption}
            setSortOption={setSortOption}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </Box>
      </Box>
      <TableContainer>
        <Table sx={{ width: "100%", maxWidth: "100%", mt: 1 }} size="medium">
          {/* table head */}
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
                      onClick={(event) => onClickFilter(event, headCell.key)}
                      sx={{
                        color: "black",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: index >= 1 && index <= 3 ? "flex" : "none",
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
                        title="Order By"
                        items={items}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                      />
                    </Box>
                  </Box>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          {/* Conditionally render Table Body */}
          {graphTableDataCopy ? (
            <TableBody>
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
                        color: data.annualized_return >= 0 ? "green" : "red",
                        fontWeight: "bolder",
                      }}
                    >
                      {data.annualized_return}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.rolling_return >= 0 ? "green" : "red",
                        fontWeight: "bolder",
                      }}
                    >
                      {data.rolling_return}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.stdev_excess_return >= 0 ? "green" : "red",
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
                  </StyledTableRow>
                </Tooltip>
              ))}
            </TableBody>
          ) : (
            <CgSpinner size={24} />
          )}
        </Table>
      </TableContainer>
      {/* pagination */}
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
    </Card>
  );
};

const OverviewTableData = ({
  strategiesCopy,
  allStrategies,
  sortOption,
  setSortOption,
  sortOrder,
  setSortOrder,
  headCells,
  openFilter,
  setOpenFilter,
  anchorEl,
  items,
  selectedItems,
  setSelectedItems,
  onClickVisualization,
  onClickInvestorVisualization,
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
              sortOption={sortOption}
              setSortOption={setSortOption}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </Box>
        </Box>
        <TableContainer>
          <Table sx={{ width: "100%", mt: 1 }} size="medium">
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

                        {/* <IconButton
                                onClick={(event) => {
                                  handleHeaderClick(headCell.key);
                                  setAnchorEl(event.currentTarget); // Set the anchor element to the button
                                }}
                                sx={{
                                  color: "black",
                                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                                  borderRadius: "50%",
                                  width: 32,
                                  height: 32,
                                  display:
                                    index === 1 || index === 2
                                      ? "none"
                                      : "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <IoFilterSharp />
                              </IconButton> */}
                      </Box>

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
                        />
                      </Box>
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
                    <StyledTableCell>{data.investing_style}</StyledTableCell>
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
                        color: data.annualized_return >= 0 ? "green" : "red",
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
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
};

{
  /* <FormControl>
                    <InputLabel id="sort-by-select-label">Sort by</InputLabel>
                    <Select
                      labelId="sort-by-select-label"
                      id="sort-by-select"
                      value={selectedSort}
                      label="Sort by"
                      onChange={handleSortChange}
                    >
                      <MenuItem value={0}>None</MenuItem>
                      <MenuItem value={1}>Ascending</MenuItem>
                      <MenuItem value={2}>Descending</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel id="to-sort-select-label">To sort</InputLabel>
                    <Select
                      labelId="to-sort-select-label"
                      id="to-sort-select"
                      value={selectedField}
                      label="To sort"
                      onChange={handleSortingFieldChange}
                    >
                      {sortingFields.map((field) => (
                        <MenuItem key={field.key} value={field.key}>
                          {field.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl> */
}
{
  /* <TextField
                  sx={{ borderRadius: 10 }}
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchValueChange}
                /> */
}
{
  /* {headCell.key.trim() !== "" &&
                              (selectedSort === 1 ? (
                                <button
                                  onClick={() => {
                                    handleSortingFieldChange(headCell.key);
                                    setSelectedSort(2);
                                  }}
                                  style={{
                                    color: "white",
                                    background: "rgba(255, 255, 255, 0.3)",
                                    border: "none",
                                    borderRadius: "9999px",
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid red",
                                  }}
                                >
                                  <IoArrowDown />
                                </button>
                              ) : (
                                <button
                                  style={{
                                    color: "white",
                                    background: "rgba(255, 255, 255, 0.3)",
                                    border: "none",
                                    borderRadius: "9999px",
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid blue",
                                  }}
                                  onClick={() => {
                                    handleSortingFieldChange(headCell.key);
                                    setSelectedSort(1);
                                  }}
                                >
                                  <IoArrowUp />
                                </button>
                              ))} */
}
