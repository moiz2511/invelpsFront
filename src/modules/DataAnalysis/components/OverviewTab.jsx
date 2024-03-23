import React, { useEffect, useState, useContext } from "react";

import {
  TextField,
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
  MenuItem,
  Button,
  IconButton,
  Typography,
  Tooltip,
  Modal,
} from "@mui/material";

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
import Fade from "@mui/material/Fade";
import InvestorModal from "./InvestorModal";
import { CgSpinner } from "react-icons/cg";

import { styled } from "@mui/material/styles";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { useSwitch } from "../../../utils/context/SwitchContext";

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
    {
      id: "duration",
      label: "Duration",
      key: "duration",
      isValueLink: false,
      isDropDown: false,
    },
  ],
};

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
    {
      label: "Logo",
      key: "",
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

const OverviewTab = ({ setSelectedCompany }) => {
  let pageLoc = window.location.pathname;

  const [searchValue, setSearchValue] = useState("");
  const [dropdown1Value, setDropdown1Value] = useState("");
  const [dropdown2Value, setDropdown2Value] = useState("");
  const [showVisualData, setShowVisualData] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [allStrategies, setAllStrategies] = useState([]);
  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const [perExchangeKPI, setPerExhangeKPI] = useState([]);
  const [perSectorKPI, setPerSectorKPI] = useState([]);
  const [perMarketKPI, setPerMarketKPI] = useState([]);
  const [graphTableData, setGraphTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(3);
  const [passingCriteria, setPassingCriteria] = useState(null);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [showInvestor, setShowInvestor] = useState(false);

  const [strategiesCopy, setStrategiesCopy] = useState([]);
  const [selectedSort, setSelectedSort] = useState(0);
  const [selectedField, setSelectedField] = useState(sortingFields[0].key);

  const [graphTableDataCopy, setGraphTableDataCopy] = useState([]);

  const { isSwitch1, setIsSwitch1, isSwitch2, setIsSwitch2 } = useSwitch();

  const rowsPerPageOptions = [3, 5, 10];

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  const handleChangeRowsPerPage = (event) => {
    setCurrentRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset page to 1 when changing rowsPerPage
  };

  const handleChangePage = (event) => {
    const newPage = parseInt(event.target.value, 10);
    setCurrentPage(newPage);
  };

  console.log(rowsPerPage);

  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  };

  // const filteredStrategies = allStrategies?.filter((strategy) =>
  //   strategy.name.toLowerCase().includes(searchValue.toLowerCase())
  // );

  const handleDropdown1Change = (event) => {
    setDropdown1Value(event.target.value);
  };

  const handleDropdown2Change = (event) => {
    setDropdown2Value(event.target.value);
  };

  const handleDataVisualization = (strategy) => {
    setIsSwitch2(true);
    setSelectedStrategy(strategy);
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

  console.log(authToken);

  useEffect(() => {
    const fetchStrategyData = async () => {
      try {
        const response = await fetch(
          `
              https://api.invelps.com/api/strategies/getAllStrategies`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 200) {
          console.log("Data:", data.strategies);

          setAllStrategies(data.strategies);
          setStrategiesCopy(data.strategies);
        } else {
          console.log("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (authToken) {
      fetchStrategyData();
    }
  }, [authToken]);

  const fetchGraphData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategy.name,
      };
      const response = await fetch(
        `
            https://api.invelps.com/api/strategies/getStrategyGraphData`,
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
        console.log(data);
        setPerExhangeKPI(data.data.companies_per_exchanges_KPI);
        setPerSectorKPI(data.data.companies_per_sector_KPI);
        setPerMarketKPI(data.data.companies_per_market_cap_KPI);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchGraphTableData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategy.name,
        page: currentPage,
        data_per_page: currentRowsPerPage,
      };
      const response = await fetch(
        `https://api.invelps.com/api/strategies/getStrategyTableData`,
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
        console.log(data.data);
        setGraphTableData(data.data);
        setGraphTableDataCopy(data.data);
        setTotalPages(data.paginator.total_pages);
        setPassingCriteria(data.companies_passing_criteris);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchGraphData();
    fetchGraphTableData();
  }, [selectedStrategy, currentPage, currentRowsPerPage]);

  console.log(isSwitch1);
  console.log(perExchangeKPI);
  console.log(totalPages);
  console.log(passingCriteria);

  // const handleSortChange = (e) => {
  //   setSelectedSort(e.target.value);
  // };

  const handleSortingFieldChange = (field) => {
    setSelectedField(field);
  };

  const sorting = (data) => {
    console.log(selectedField);
    switch (selectedSort) {
      case 1:
        return data.slice().sort((a, b) => {
          const valueA = a[selectedField] || 0;
          const valueB = b[selectedField] || 0;
          console.log(valueA, valueB);

          const alphabetRegex = /[a-zA-Z]/;
          if (alphabetRegex.test(valueA)) {
            return valueA.localeCompare(valueB, undefined, { numeric: true });
          } else {
            return parseFloat(valueA) - parseFloat(valueB);
          }
        });
      case 2:
        return data.slice().sort((a, b) => {
          const valueA = a[selectedField] || 0;
          const valueB = b[selectedField] || 0;
          console.log(valueA, valueB);
          const alphabetRegex = /[a-zA-Z]/;

          if (alphabetRegex.test(valueA)) {
            return valueB.localeCompare(valueA, undefined, { numeric: true });
          } else {
            return parseFloat(valueB) - parseFloat(valueA);
          }
        });
      default:
        return data;
    }
  };

  useEffect(() => {
    handleSearchChange();
  }, [searchValue]);

  useEffect(() => {
    let isMounted = true;
    if (selectedSort !== 0 && isMounted) {
      const sorted = sorting(strategiesCopy);
      setStrategiesCopy(sorted);

      if (isSwitch2) {
        const sorted = sorting(graphTableDataCopy);
        setGraphTableDataCopy(sorted);
      }
    }

    return () => {
      isMounted = false;
      // setIsSwitch2(false);
    };
  }, [selectedSort, selectedField]);

  const handleSearchChange = () => {
    // const searchTerm = event.target.value;
    // setSearchTerm(searchTerm);

    // If search term is empty, set filtered products to original array
    if (!searchValue.trim()) {
      setStrategiesCopy(allStrategies);
    } else {
      // Filter products based on the search term
      const filtered = strategiesCopy.filter((user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setStrategiesCopy(filtered);
    }
  };

  const handleGoBack = () => {
    setIsSwitch2(false);
  };

  return (
    <Grid
      container
      sx={{
        fontFamily: "Montserrat",
        width: "100%",
      }}
    >
      <PageInfoBreadCrumbs data={pageLoc} />

      {/* Strategies modal */}
      {isSwitch2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            position: "absolute",
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
          <Box ml={2} mb={4}>
            <Typography color={"rgba(0, 0, 0, 0.6)"}>
              <span onClick={handleGoBack} style={{ cursor: "pointer" }}>
                {" "}
                Strategies Overview{" "}
              </span>{" "}
              / {selectedStrategy?.name}
            </Typography>
          </Box>
          <Button
            onClick={handleGoBack}
            sx={{
              alignSelf: "flex-start",
              backgroundColor: "#407879",
              color: "rgb(204, 191, 144)",
              ml: 2,
              mb: 2,
            }}
          >
            Back
          </Button>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: 1,
            }}
          >
            <text style={{ fontSize: 25, fontWeight: "bold" }}>
              {" "}
              {selectedStrategy?.name}{" "}
            </text>
            <Card
              sx={{
                my: 1,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                gap: 5,
                padding: 2,
              }}
            >
              <text style={{ fontSize: 20, fontWeight: "bold" }}>
                Companies Passing Criteria Statistics
              </text>
              <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                <Card
                  sx={{
                    padding: 4,
                    gap: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <text> Companies Per Exchanges (%) </text>
                  <PieChart
                    graphData={perExchangeKPI}
                    nameData={(item) => item.exchange}
                  />
                </Card>
                <Card
                  sx={{
                    padding: 4,
                    gap: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <text> Companies Per Sector (%) </text>
                  <PieChart
                    graphData={perSectorKPI}
                    nameData={(item) => item.sector}
                  />
                </Card>
                <Card
                  sx={{
                    padding: 4,
                    gap: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <text> Companies Per Market Cap (%) </text>
                  <PieChart
                    graphData={perMarketKPI}
                    nameData={(item) => item.market_cap_class}
                  />
                </Card>
              </Box>
            </Card>
            <Card
              sx={{
                width: "100%",
                height: "100%",
                margin: 0,
                gap: 5,
                padding: 1,
              }}
            >
              <Box justifyContent={"space-between"} display={"flex"}>
                <text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Companies Passing Criterias:{" "}
                  <span style={{ color: "gray" }}>{passingCriteria}</span>
                </text>
                {/* <input
                  style={{ borderRadius: 10, padding: 12 }}
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchChange}
                /> */}
              </Box>
              <TableContainer>
                <Table
                  sx={{ width: "100%", maxWidth: "100%", mt: 1 }}
                  size="medium"
                >
                  <TableHead>
                    <TableRow>
                      {passingHeadCells.data.map((headCell, index) => (
                        <StyledTableCell key={index} padding="normal">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <span>{headCell.label}</span>
                            {headCell.key.trim() !== "" &&
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
                                  }}
                                  onClick={() => {
                                    handleSortingFieldChange(headCell.key);
                                    setSelectedSort(1);
                                  }}
                                >
                                  <IoArrowUp />
                                </button>
                              ))}
                          </Box>
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  {graphTableDataCopy ? (
                    <TableBody>
                      {graphTableDataCopy.map((data, index) => {
                        return (
                          <Tooltip
                            key={index}
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title="Click to analyze the company"
                          >
                            <StyledTableRow
                              hover
                              onClick={() => {
                                console.log(isSwitch1);
                                setSelectedCompany(data);
                                setIsSwitch1(true);
                                setIsSwitch2(false);
                                setShowVisualData(!showVisualData);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <StyledTableCell>
                                {data.company_name}
                              </StyledTableCell>
                              <StyledTableCell>
                                <img
                                  src={data.image}
                                  style={{ height: "30px", width: "35px" }}
                                />
                              </StyledTableCell>
                              <StyledTableCell> {data.symbol} </StyledTableCell>
                              <StyledTableCell>
                                {" "}
                                {data.exchange}{" "}
                              </StyledTableCell>
                              <StyledTableCell> {data.sector} </StyledTableCell>
                              <StyledTableCell>
                                {" "}
                                {data.industry}{" "}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{
                                  color:
                                    data.total_return >= 0 ? "green" : "red",
                                }}
                              >
                                {" "}
                                {data.total_return}{" "}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{
                                  color:
                                    data.annualized_return >= 0
                                      ? "green"
                                      : "red",
                                }}
                              >
                                {" "}
                                {data.annualized_return}{" "}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{
                                  color:
                                    data.rolling_return >= 0 ? "green" : "red",
                                }}
                              >
                                {" "}
                                {data.rolling_return}{" "}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{
                                  color:
                                    data.stdev_excess_return >= 0
                                      ? "green"
                                      : "red",
                                }}
                              >
                                {" "}
                                {data.stdev_excess_return}{" "}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{
                                  color:
                                    data.max_drawdown >= 0 ? "green" : "red",
                                }}
                              >
                                {" "}
                                {data.max_drawdown}{" "}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{
                                  color:
                                    data.sharpe_ratio >= 0 ? "green" : "red",
                                }}
                              >
                                {" "}
                                {data.sharpe_ratio}{" "}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{
                                  color:
                                    data.sortino_ratio >= 0 ? "green" : "red",
                                }}
                              >
                                {" "}
                                {data.sortino_ratio
                                  ? data.sortino_ratio
                                  : "N/A"}{" "}
                              </StyledTableCell>
                            </StyledTableRow>
                          </Tooltip>
                        );
                      })}
                    </TableBody>
                  ) : (
                    <CgSpinner size={24} />
                  )}
                </Table>
              </TableContainer>
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
                    value={currentRowsPerPage}
                    onChange={handleChangeRowsPerPage}
                  >
                    {rowsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Box>

                <Box display={"flex"} alignItems={"center"} px={2} gap={1}>
                  <IconButton
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ArrowBack />
                  </IconButton>

                  <span style={{ fontFamily: "Montserrat" }}>
                    Page {currentPage} of {totalPages}
                  </span>

                  <IconButton
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ArrowForward />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          </Card>
        </div>
      )}
      {/* ------------------------------------------------------ */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Card
          sx={{
            my: 1,
            position: "relative",
            width: "calc(100vw - 30px)",
            overflowX: "hidden",
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
                Strategies Performances and Risks (10 years)
              </text>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                marginTop: 6,
                overflowX: "hidden",
              }}
            >
              {allStrategies.length > 0 ? (
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
                padding: 3,
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
                </text>
              </Box>
              <Box display="flex" gap={2} sx={{ mt: 0.5 }}>
                {/* <FormControl>
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
                  </FormControl> */}
                <TextField
                  sx={{ borderRadius: 10 }}
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchValueChange}
                />
              </Box>
            </Box>
            <TableContainer>
              <Table sx={{ width: "100%", mt: 1 }} size="medium">
                <TableHead>
                  <TableRow>
                    {headCells.data.map((headCell, index) => (
                      <StyledTableCell key={headCell.id} padding="normal">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <span>{headCell.label}</span>
                          {headCell.key.trim() !== "" &&
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
                                }}
                                onClick={() => {
                                  handleSortingFieldChange(headCell.key);
                                  setSelectedSort(1);
                                }}
                              >
                                <IoArrowUp />
                              </button>
                            ))}
                        </Box>
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {strategiesCopy.map((data, index) => {
                    return (
                      <StyledTableRow hover key={index} sx={{ ml: 3 }}>
                        <StyledTableCell
                          onClick={() => handleDataVisualization(data)}
                          sx={{
                            cursor: "pointer",
                            ":hover": {
                              textDecoration: "underline",
                              color: "blue",
                            },
                          }}
                        >
                          {" "}
                          {data.name}
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() =>
                            handleInvestorVisualization(data.investors)
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
                          }}
                        >
                          {" "}
                          {data.total_return}{" "}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color:
                              data.annualized_return >= 0 ? "green" : "red",
                          }}
                        >
                          {" "}
                          {data.annualized_return}{" "}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color: data.rolling_return >= 0 ? "green" : "red",
                          }}
                        >
                          {" "}
                          {data.rolling_return}{" "}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color: data.stdev_return >= 0 ? "green" : "red",
                          }}
                        >
                          {" "}
                          {data.stdev_return}{" "}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color: data.max_drawdown >= 0 ? "green" : "red",
                          }}
                        >
                          {" "}
                          {data.max_drawdown}{" "}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color: data.sharpe_ratio >= 0 ? "green" : "red",
                          }}
                        >
                          {" "}
                          {data.sharpe_ratio}{" "}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color: data.sortino_ratio >= 0 ? "green" : "red",
                          }}
                        >
                          {" "}
                          {data.sortino_ratio ? data.sortino_ratio : "-"}{" "}
                        </StyledTableCell>
                        <StyledTableCell> {data.duration} </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Card>
      </div>

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
