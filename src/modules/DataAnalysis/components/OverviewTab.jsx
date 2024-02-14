import React, { useEffect, useState, useContext } from "react";

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

const OverviewTab = ({ setSelectedCompany, setCompanyDetails }) => {
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

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredStrategies = allStrategies.filter((strategy) =>
    strategy.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleDropdown1Change = (event) => {
    setDropdown1Value(event.target.value);
  };

  const handleDropdown2Change = (event) => {
    setDropdown2Value(event.target.value);
  };

  const handleDataVisualization = (strategy) => {
    setShowVisualData(!showVisualData);
    setSelectedStrategy(strategy);
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

  useEffect(() => {
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
          `
            https://api.invelps.com/api/strategies/getStrategyTableData
            `,
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
          setGraphTableData(data.data);
          setTotalPages(data.paginator.total_pages);
        } else {
          console.log("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchGraphData();
    fetchGraphTableData();
  }, [selectedStrategy, currentPage, currentRowsPerPage]);

  console.log(perExchangeKPI);
  console.log(totalPages);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "column",
        fontFamily: "Montserrat",
      }}
    >
      {showVisualData ? (
        <Box ml={2} mb={4}>
          <Typography color={"rgba(0, 0, 0, 0.6)"}>
            Financial goals / {selectedStrategy.name}
          </Typography>
        </Box>
      ) : (
        <PageInfoBreadCrumbs data={pageLoc} />
      )}
      {showVisualData ? (
        <>
          <Button
            onClick={() => setShowVisualData(!showVisualData)}
            sx={{
              alignSelf: "flex-start",
              backgroundColor: "#407879",
              color: "rgb(204, 191, 144)",
              ml: 3,
            }}
          >
            Go Back
          </Button>
          <Card
            sx={{
              margin: 1,
              display: "flex",
              flexDirection: "column",
              padding: 2,
            }}
          >
            <text style={{ fontSize: 20, fontWeight: "bold" }}>
              {" "}
              {selectedStrategy.name}{" "}
            </text>
            <Card
              sx={{
                margin: 2,
                display: "flex",
                flexDirection: "column",
                gap: 5,
                padding: 3,
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
                  <text> Companies Per Exchanges KPI </text>
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
                  <text> Companies Per Sector KPI </text>
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
                  <text> Companies Per Market Cap KPI </text>
                  <PieChart
                    graphData={perMarketKPI}
                    nameData={(item) => item.market_cap_class}
                  />
                </Card>
              </Box>
            </Card>
            <Card
              sx={{
                margin: 2,
                gap: 5,
                padding: 3,
              }}
            >
              <Box justifyContent={"space-between"} display={"flex"}>
                <text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Companies Passing Criterias
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
                  sx={{ minWidth: "100%", maxWidth: "100%", mt: 1 }}
                  size="medium"
                >
                  <TableHead>
                    <TableRow>
                      {passingHeadCells.data.map((headCell, index) => (
                        <StyledTableCell key={index} padding="normal">
                          {headCell.label}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {graphTableData.map((data, index) => {
                      return (
                        <StyledTableRow
                          hover
                          key={index}
                          onClick={() => {
                            setSelectedCompany(data);
                            setCompanyDetails(true);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <StyledTableCell>
                            {" "}
                            {data.strategy_name}{" "}
                          </StyledTableCell>
                          <StyledTableCell>
                            {" "}
                            {data.company_name}{" "}
                          </StyledTableCell>
                          <StyledTableCell> {data.symbol} </StyledTableCell>
                          <StyledTableCell> {data.exchange} </StyledTableCell>
                          <StyledTableCell> {data.sector} </StyledTableCell>
                          <StyledTableCell> {data.industry} </StyledTableCell>
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
                              color:
                                data.stdev_excess_return >= 0 ? "green" : "red",
                            }}
                          >
                            {" "}
                            {data.stdev_excess_return}{" "}
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
                            {data.sortino_ratio
                              ? data.sortino_ratio
                              : "N/A"}{" "}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display={"flex"} justifyContent={"flex-end"} gap={4} mt={2}>
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

                <Box display={"flex"} alignItems={"center"} gap={1}>
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
        </>
      ) : (
        <>
          <Card sx={{ m: 1, position: "relative" }}>
            <Box p={3}>
              <Box spacing={1} sx={{ mt: 0.5 }}>
                <text
                  style={{
                    padding: "5px",
                    fontSize: "27px",
                    fontWeight: "bold",
                  }}
                >
                  Strategies Performances and
                  <br /> Risks (10 years)
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
          <Card sx={{ m: 1, position: "relative" }}>
            <Box>
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
                <Box spacing={1} sx={{ mt: 0.5 }}>
                  <TextField
                    sx={{ borderRadius: 10 }}
                    placeholder="Search"
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                </Box>
              </Box>
              <TableContainer>
                <Table
                  sx={{ minWidth: "100%", maxWidth: "100%", mt: 1 }}
                  size="medium"
                >
                  <TableHead>
                    <TableRow>
                      {headCells.data.map((headCell, index) => (
                        <StyledTableCell key={headCell.id} padding="normal">
                          {headCell.label}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStrategies.map((data, index) => {
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
                            {data.name}{" "}
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
                            {data.sortino_ratio}{" "}
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
        </>
      )}
    </Grid>
  );
};

export default OverviewTab;
