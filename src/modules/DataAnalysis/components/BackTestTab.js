import React, { useState, useEffect, useContext } from "react";

import {
  Card,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import Fade from "@mui/material/Fade";
import { CgSpinner } from "react-icons/cg";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

import AuthContext from "../../Core/store/auth-context";
import { styled } from "@mui/material/styles";

import LineRaceChart from "./LineRaceChart";
import NegativeBarChart from "./NegativeBarChart";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ColorConstants from "../../Core/constants/ColorConstants.json";
import PageInfoBreadCrumbs from "../../Core/components/Layout/PageInfoBreadCrumbs";
import PieChart from "./PieChart";

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

const headYears = [
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
];

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: ColorConstants.APP_TABLE_HEAD_COLOR,
//     color: theme.palette.common.white,
//     padding: 12,
//     fontFamily: "Montserrat",
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 12,
//     padding: 12,
//     fontFamily: "Montserrat",
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type()": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

const headCategories = ["Avg", "Best", "Worst", "Negative Periods"];
const BackTestTab = () => {
  let pageLoc = window.location.pathname;

  const strategyNames = [
    "Buffett: Hangstrom",
    "Philip Fisher Screen",
    "Defensive Investor",
  ];

  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const [strategyData, setStrategyData] = useState([]);
  const [years, setYears] = useState([]);
  const [bestWorstData, setBestWorstData] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [showVisualData, setShowVisualData] = useState(false);
  const [perExchangeKPI, setPerExhangeKPI] = useState([]);
  const [perSectorKPI, setPerSectorKPI] = useState([]);
  const [perMarketKPI, setPerMarketKPI] = useState([]);
  const [dividendTableData, setDividendTableData] = useState([]);
  const [graphTableDataCopy, setGraphTableDataCopy] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [passingCriteria, setPassingCriteria] = useState(null);
  const [selectedSort, setSelectedSort] = useState(0);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

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

  useEffect(() => {
    const CheckUserSession = () => {
      return authCtx.isLoggedIn ? authCtx.token : "";
    };

    const userToken = CheckUserSession();
    console.log(userToken);
    setAuthToken(userToken);
  }, []);

  useEffect(() => {
    const fetchStrategyAnnualPerformance = async () => {
      try {
        const response = await fetch(
          `https://api.invelps.com/api/strategies/getStrategiesAnnualPerformance`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 200) {
          console.log("Data:", data);
          setStrategyData(data.strategies);
          console.log(strategyData);
        } else {
          console.log("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (authToken) {
      fetchStrategyAnnualPerformance();
    }
  }, [authToken]);

  useEffect(() => {
    if (strategyData && strategyData.length > 0) {
      const firstStrategy = strategyData[0];
      const strategyKeys = Object.keys(firstStrategy);
      const filteredYears = strategyKeys.filter(
        (key) => key !== "strategy_name_here"
      );
      setYears(filteredYears);
    }
  }, [strategyData]);

  console.log(years);
  console.log(bestWorstData);

  const fetchGraphData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategy,
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

  const fetchDividendTableData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategy,
      };
      const response = await fetch(
        `
            https://api.invelps.com/api/strategies/getStrategyAnnualizedDividend`,
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
        setDividendTableData(data.data);
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
    if (selectedStrategy !== null) {
      fetchGraphData();
      fetchDividendTableData();
      fetchGraphTableData();
    }
  }, [selectedStrategy]);

  const handleDataVisualization = (strategy) => {
    setSelectedStrategy(null);
    setShowVisualData(!showVisualData);
    setSelectedStrategy(strategy);
  };

  const handleSortingFieldChange = (field) => {
    setSelectedField(field);
  };

  const generateRandomInvestmentData = () => {
    const data = [];

    for (let year = 2012; year <= 2023; year++) {
      strategyNames.forEach((strategy) => {
        data.push({
          year: year,
          strategy: strategy,
          performance: Math.floor(Math.random() * 100),
        });
      });
    }

    return data;
  };

  const investmentData = generateRandomInvestmentData();
  console.log(investmentData);
  console.log(strategyData);

  return (
    <>
      {showVisualData ? (
        <Box ml={2} mb={4}>
          <Typography color={"rgba(0, 0, 0, 0.6)"}>
            Strategies Overview / {selectedStrategy.name}
          </Typography>
        </Box>
      ) : (
        <PageInfoBreadCrumbs data={pageLoc} />
      )}
      {showVisualData ? (
        // <>
        //   <Button
        //     onClick={() => setShowVisualData(!showVisualData)}
        //     sx={{
        //       alignSelf: "flex-start",
        //       backgroundColor: "#407879",
        //       color: "rgb(204, 191, 144)",
        //       ml: 3,
        //     }}
        //   >
        //     Back
        //   </Button>
        //   <Card
        //     sx={{
        //       margin: 1,
        //       display: "flex",
        //       flexDirection: "column",
        //       padding: 2,
        //     }}
        //   >
        //     <text
        //       style={{
        //         fontFamily: "Montserrat",
        //         fontSize: 25,
        //         fontWeight: "bold",
        //       }}
        //     >
        //       {selectedStrategy.split("_").join(" ")}
        //     </text>
        //     <Card
        //       sx={{
        //         margin: 2,
        //         display: "flex",
        //         flexDirection: "column",
        //         gap: 5,
        //         padding: 3,
        //       }}
        //     >
        //       <text style={{ fontSize: 20, fontWeight: "bold" }}>
        //         Companies Passing Criteria Statistics
        //       </text>
        //       <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        //         <Card
        //           sx={{
        //             padding: 4,
        //             gap: 5,
        //             display: "flex",
        //             flexDirection: "column",
        //             gap: 4,
        //           }}
        //         >
        //           <text> Companies Per Exchanges (%) </text>
        //           <PieChart
        //             graphData={perExchangeKPI}
        //             nameData={(item) => item.exchange}
        //           />
        //         </Card>
        //         <Card
        //           sx={{
        //             padding: 4,
        //             gap: 5,
        //             display: "flex",
        //             flexDirection: "column",
        //             gap: 4,
        //           }}
        //         >
        //           <text> Companies Per Sector (%) </text>
        //           <PieChart
        //             graphData={perSectorKPI}
        //             nameData={(item) => item.sector}
        //           />
        //         </Card>
        //         <Card
        //           sx={{
        //             padding: 4,
        //             gap: 5,
        //             display: "flex",
        //             flexDirection: "column",
        //             gap: 4,
        //           }}
        //         >
        //           <text> Companies Per Market Cap (%) </text>
        //           <PieChart
        //             graphData={perMarketKPI}
        //             nameData={(item) => item.market_cap_class}
        //           />
        //         </Card>
        //       </Box>
        //     </Card>

        //     <Card
        //       sx={{
        //         margin: 2,
        //         display: "flex",
        //         flexDirection: "column",
        //         gap: 5,
        //         padding: 3,
        //       }}
        //     >
        //       <text style={{ fontSize: 20, fontWeight: "bold" }}>
        //         Annual Dividend ({dividendTableData.length} years)
        //       </text>

        //       <TableContainer>
        //         <Table
        //           sx={{ minWidth: "100%", maxWidth: "100%", mt: 1 }}
        //           size="medium"
        //         >
        //           <TableHead>
        //             <TableRow>
        //               <TableCell
        //                 padding="normal"
        //                 colSpan={1}
        //                 sx={{
        //                   backgroundColor: "#272727",
        //                   color: "white",
        //                   fontSize: 18,
        //                   fontFamily: "Montserrat",
        //                 }}
        //               >
        //                 Strategy Models
        //               </TableCell>
        //               <TableCell
        //                 padding="normal"
        //                 colSpan={12}
        //                 align="center"
        //                 sx={{
        //                   backgroundColor: "#427878",
        //                   color: "white",
        //                   fontSize: 18,
        //                   fontFamily: "Montserrat",
        //                 }}
        //               >
        //                 Annual Dividends (USD)
        //               </TableCell>
        //             </TableRow>
        //           </TableHead>

        //           <TableHead>
        //             <TableRow
        //               sx={{
        //                 backgroundColor: "#e7ecef",
        //                 color: "#272727",
        //                 fontSize: 14,
        //               }}
        //             >
        //               <TableCell sx={{ fontFamily: "Montserrat" }}>
        //                 Strategy
        //               </TableCell>
        //               {dividendTableData.map((data, index) => (
        //                 <TableCell
        //                   key={index}
        //                   padding="normal"
        //                   sx={{ fontFamily: "Montserrat", color: "#427878" }}
        //                 >
        //                   {data.date_Year}
        //                 </TableCell>
        //               ))}
        //             </TableRow>
        //           </TableHead>
        //           <TableBody>
        //             <StyledTableRow hover sx={{ ml: 3 }}>
        //               <StyledTableCell>{selectedStrategy}</StyledTableCell>
        //               {dividendTableData.map((data, index) => (
        //                 <StyledTableCell
        //                   key={index}
        //                   sx={{
        //                     color:
        //                       parseFloat(data.Annual_Dividend) >= 0
        //                         ? "green"
        //                         : "red",
        //                   }}
        //                 >
        //                   {data.Annual_Dividend || "N/A"}
        //                 </StyledTableCell>
        //               ))}
        //             </StyledTableRow>
        //           </TableBody>
        //         </Table>
        //       </TableContainer>
        //     </Card>
        //   </Card>
        // </>
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
              <span
                onClick={() => setShowVisualData(!showVisualData)}
                style={{ cursor: "pointer" }}
              >
                Strategies Overview
              </span>{" "}
              / {selectedStrategy?.name}
            </Typography>
          </Box>
          <Button
            onClick={() => setShowVisualData(!showVisualData)}
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
                                setSelectedCompany(data);
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
      ) : (
        <Card sx={{ m: 1, position: "relative", fontFamily: "Montserrat" }}>
          <Box p={3}>
            <Box spacing={1} sx={{ mt: 0.5 }}>
              <text
                style={{
                  padding: "5px",
                  fontSize: "27px",
                  fontWeight: "bold",
                }}
              >
                Annual Returns ({years.length} years)
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
              <LineRaceChart
                chartId={"LR-chart-1"}
                chartData={strategyData}
                years={years}
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
                  <TableCell
                    padding="normal"
                    colSpan={1}
                    sx={{
                      backgroundColor: "#272727",
                      color: "white",
                      fontSize: 18,
                      fontFamily: "Montserrat",
                    }}
                  >
                    Strategy Models
                  </TableCell>
                  <TableCell
                    padding="normal"
                    colSpan={12}
                    align="center"
                    sx={{
                      backgroundColor: "#427878",
                      color: "white",
                      fontSize: 18,
                      fontFamily: "Montserrat",
                    }}
                  >
                    Annual Prices (USD)
                  </TableCell>
                </TableRow>
              </TableHead>

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
                {strategyData.map((strategy, index) => (
                  <StyledTableRow hover key={index} sx={{ ml: 3 }}>
                    <StyledTableCell
                      onClick={() => {
                        handleDataVisualization(strategy?.strategy_name_here);
                      }}
                      sx={{
                        cursor: "pointer",
                        ":hover": {
                          textDecoration: "underline",
                          color: "blue",
                        },
                      }}
                    >
                      {strategy?.strategy_name_here}
                    </StyledTableCell>
                    {years.map((year, index) => (
                      <StyledTableCell
                        key={index}
                        sx={{
                          color:
                            parseFloat(strategy[year]?.anualPrice) >= 0
                              ? "green"
                              : "red",
                        }}
                      >
                        {strategy[year]?.anualPrice
                          ? strategy[year]?.anualPrice
                          : "N/A"}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </>
  );
};

export default BackTestTab;
