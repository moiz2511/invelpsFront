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
  Switch,
} from "@mui/material";

import AuthContext from "../../Core/store/auth-context";
import { styled } from "@mui/material/styles";

import LineRaceChart from "./LineRaceChart";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ColorConstants from "../../Core/constants/ColorConstants.json";
import PageInfoBreadCrumbs from "../../Core/components/Layout/PageInfoBreadCrumbs";
import PieChart from "./PieChart";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import HorizontalBarChart from "./charts/HorizontalBar";
import DonutPieChart from "./charts/DonoutChart";
import GeoChartComponent from "./charts/GeoCharts";
import Constants from "../../../Constants.json";

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

const BackTestTab = ({
  selectedStrategyLabel,
  setSelectedStrategyLabel,
  showVisualData,
  setShowVisualData,
}) => {
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
  // const [showVisualData, setShowVisualData] = useState(false);
  const [perExchangeKPI, setPerExhangeKPI] = useState([]);
  const [perSectorKPI, setPerSectorKPI] = useState([]);
  const [perMarketKPI, setPerMarketKPI] = useState([]);
  const [dividendTableData, setDividendTableData] = useState([]);
  const [annualPriceSwitch, setAnnualPriceSwitch] = useState(true);
  const [annualDevidendSwitch, setAnnualDevidendSwitch] = useState(true);
  const [graphTableData, setGraphTableData] = useState([]);
  const [graphTableDataCopy, setGraphTableDataCopy] = useState([]);
  const [mapsData, setMapsData] = useState([]);

  const handlePriceSwitch = () => {
    setAnnualPriceSwitch(!annualPriceSwitch);
  };

  const handleDevidendSwitch = () => {
    setAnnualDevidendSwitch(!annualDevidendSwitch);
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

        if (response.status === 200) {
          console.log("Historical Data:", data);
          setStrategyData(data.strategies);
          // console.log(strategyData);
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
        (key) => key !== "strategy_name_here" && key != "strategy_label"
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
      console.log("GraphData", data);
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
  // const fetchGraphTableData = async () => {
  //   try {
  //     const body = {
  //       strategy_name: selectedStrategy.name,
  //       page: currentPage,
  //       data_per_page: currentRowsPerPage,
  //     };
  //     const response = await fetch(
  //       `https://api.invelps.com/api/strategies/getStrategyTableData`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //         body: JSON.stringify(body),
  //       }
  //     );

  //     const data = await response.json();

  //     if (response.status === 200) {
  //       console.log(data.data);
  //       setGraphTableData(data.data);
  //       setGraphTableDataCopy(data.data);
  //       setTotalPages(data.paginator.total_pages);
  //       setPassingCriteria(data.companies_passing_criteris);
  //     } else {
  //       console.log("Unexpected status code:", response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
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
  const fetchMapsData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategy,
      };
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
    if (selectedStrategy !== null) {
      fetchGraphData();
      fetchDividendTableData();
      fetchMapsData();
    }
  }, [selectedStrategy]);

  const handleDataVisualization = (strategy) => {
    console.log(strategy);
    setSelectedStrategy(null);
    setShowVisualData(!showVisualData);
    setSelectedStrategy(strategy.strategy_name_here);
    // setSelectedStrategyLabel(strategy.strategy_label);
    setSelectedStrategyLabel(strategy.strategy_label);
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

  const claculateTrend = (data, type) => {
    let lastYear = years[years.length - 1];
    let secondLastYear = years[years.length - 2];
    let lastYearValue = parseInt(
      type === "price"
        ? data[lastYear]?.anual_price
        : data[lastYear]?.annual_dividend
    );
    let secondLastYearValue = parseInt(
      type === "price"
        ? data[secondLastYear]?.anual_price
        : data[secondLastYear]?.annual_dividend
    );
    let dividendDiff = lastYearValue - secondLastYearValue;
    if (dividendDiff > 0) {
      return <IoArrowUp color="green" size={18} />;
    } else if (dividendDiff < 0) {
      return <IoArrowDown color="red" size={18} />;
    } else if (dividendDiff === 0) {
      return "-";
    }
  };

  return (
    <>
      {showVisualData ? (
        <Box ml={2} mb={4}>
          {/* <Typography color={"rgba(0, 0, 0, 0.6)"}>
            Strategies Overview / {selectedStrategyLabel}
          </Typography> */}
        </Box>
      ) : (
        <></>
        // <PageInfoBreadCrumbs data={pageLoc} />
      )}
      {showVisualData ? (
        <>
          <Button
            onClick={() => {
              setShowVisualData(!showVisualData);
              setSelectedStrategyLabel(null);
            }}
            sx={{
              alignSelf: "flex-start",
              backgroundColor: "#407879",
              color: "rgb(204, 191, 144)",
              ml: 3,
            }}
          >
            Back
          </Button>

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
              <text
                style={{
                  fontFamily: "Montserrat",
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                {selectedStrategyLabel}
              </text>
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
                <HorizontalBarChart data={perSectorKPI} />
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
              Annual Dividend ({dividendTableData.length} years)
            </text>

            <TableContainer>
              <Table
                sx={{ minWidth: "100%", maxWidth: "100%", mt: 1 }}
                size="medium"
              >
                {/* <TableHead>
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
                        Annual Dividends (USD)
                      </TableCell>
                    </TableRow>
                  </TableHead> */}

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
                    {dividendTableData.map((data, index) => (
                      <TableCell
                        key={index}
                        padding="normal"
                        sx={{ fontFamily: "Montserrat", color: "#427878" }}
                      >
                        {data.date_Year}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow hover sx={{ ml: 3 }}>
                    <StyledTableCell>{selectedStrategyLabel}</StyledTableCell>
                    {dividendTableData.map((data, index) => (
                      <StyledTableCell
                        key={index}
                        sx={{
                          color:
                            parseFloat(data.Annual_Dividend) >= 0
                              ? "green"
                              : "red",
                        }}
                      >
                        {data.Annual_Dividend || "-"}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
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
                Annual Prices (
                {strategyData &&
                  strategyData[0] &&
                  strategyData[0][Object.keys(strategyData[0])[0]]
                    ?.duration}{" "}
                years)
              </text>
            </Box>
            <div
              style={{
                width: "100%",
              }}
            >
              <label htmlFor="annualPriceSwitch" style={{ marginLeft: 10 }}>
                Line Chart
              </label>
              <Switch
                id="annualPriceSwitch"
                checked={annualPriceSwitch}
                onChange={handlePriceSwitch}
                inputProps={{ "aria-label": "controlled" }}
              />
              <label htmlFor="annualPriceSwitch"> Bar Chart</label>
            </div>
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
                type="price"
                chartSwitch={annualPriceSwitch}
              />
            </Box>
            <TableContainer
              style={{
                marginBottom: "50px",
              }}
            >
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
                    <TableCell
                      padding="normal"
                      sx={{ fontFamily: "Montserrat", color: "#427878" }}
                    >
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
                  {strategyData.map((strategy, index) => (
                    <StyledTableRow hover key={index} sx={{ ml: 3 }}>
                      <StyledTableCell
                        onClick={() => {
                          handleDataVisualization(strategy);
                        }}
                        sx={{
                          cursor: "pointer",
                          ":hover": {
                            textDecoration: "underline",
                            color: "blue",
                          },
                        }}
                      >
                        {strategy?.strategy_label}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color: "green",
                        }}
                      >
                        {claculateTrend(strategy, "price")}
                      </StyledTableCell>
                      {years.map((year, index) => (
                        <StyledTableCell
                          key={index}
                          sx={{
                            color:
                              parseFloat(strategy[year]?.anual_price) >= 0
                                ? "green"
                                : "red",
                          }}
                        >
                          {strategy[year]?.anual_price
                            ? strategy[year]?.anual_price
                            : "-"}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box p={3}>
            <Box spacing={1} sx={{ mt: 0.5 }}>
              <text
                style={{
                  padding: "5px",
                  fontSize: "27px",
                  fontWeight: "bold",
                }}
              >
                Annual Dividend (
                {strategyData &&
                  strategyData[0] &&
                  strategyData[0][Object.keys(strategyData[0])[0]]
                    ?.duration}{" "}
                years)
              </text>
            </Box>
            <div
              style={{
                width: "100%",
              }}
            >
              <label htmlFor="annualDevidendSwitch" style={{ marginLeft: 10 }}>
                {" "}
                Line Chart
              </label>
              <Switch
                id="annualDevidendSwitch"
                checked={annualDevidendSwitch}
                onChange={handleDevidendSwitch}
                inputProps={{ "aria-label": "controlled" }}
              />
              <label htmlFor="annualDevidendSwitch"> Bar Chart</label>
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 3,
                marginTop: 6,
              }}
            >
              <LineRaceChart
                chartId={"LR-chart-2"}
                chartData={strategyData}
                years={years}
                type="dividend"
                chartSwitch={annualDevidendSwitch}
              />
            </Box>
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

                  <TableCell
                    padding="normal"
                    sx={{ fontFamily: "Montserrat", color: "#427878" }}
                  >
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
                {strategyData.map((strategy, index) => (
                  <StyledTableRow hover key={index} sx={{ ml: 3 }}>
                    <StyledTableCell
                      onClick={() => {
                        handleDataVisualization(strategy);
                      }}
                      sx={{
                        cursor: "pointer",
                        ":hover": {
                          textDecoration: "underline",
                          color: "blue",
                        },
                      }}
                    >
                      {strategy?.strategy_label}
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{
                        color: "green",
                      }}
                    >
                      {claculateTrend(strategy, "dividend")}
                    </StyledTableCell>
                    {years.map((year, index) => (
                      <StyledTableCell
                        key={index}
                        sx={{
                          color:
                            parseFloat(strategy[year]?.annual_dividend) >= 0
                              ? "green"
                              : "red",
                        }}
                      >
                        {strategy[year]?.annual_dividend
                          ? strategy[year]?.annual_dividend
                          : "-"}
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
