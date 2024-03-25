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
} from "@mui/material";

import AuthContext from "../../Core/store/auth-context";
import { styled } from "@mui/material/styles";

import LineRaceChart from "./LineRaceChart";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ColorConstants from "../../Core/constants/ColorConstants.json";
import PageInfoBreadCrumbs from "../../Core/components/Layout/PageInfoBreadCrumbs";
import PieChart from "./PieChart";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

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

  useEffect(() => {
    if (selectedStrategy !== null) {
      fetchGraphData();
      fetchDividendTableData();
    }
  }, [selectedStrategy]);

  const handleDataVisualization = (strategy) => {
    setSelectedStrategy(null);
    setShowVisualData(!showVisualData);
    setSelectedStrategy(strategy);
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
        ? data[lastYear]?.anualPrice
        : data[lastYear]?.annual_dividend
    );
    let secondLastYearValue = parseInt(
      type === "price"
        ? data[secondLastYear]?.anualPrice
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
          <Typography color={"rgba(0, 0, 0, 0.6)"}>
            Strategies Overview / {selectedStrategy.name}
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
            Back
          </Button>
          <Card
            sx={{
              margin: 1,
              display: "flex",
              flexDirection: "column",
              padding: 2,
            }}
          >
            <text
              style={{
                fontFamily: "Montserrat",
                fontSize: 25,
                fontWeight: "bold",
              }}
            >
              {selectedStrategy.split("_").join(" ")}
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
                        Annual Dividends (USD)
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
                      <StyledTableCell>{selectedStrategy}</StyledTableCell>
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
                Annual Prices ({years.length} years)
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
                type="price"
              />
            </Box>
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
                Annual Devidend ({years.length} years)
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
                chartId={"LR-chart-2"}
                chartData={strategyData}
                years={years}
                type="dividend"
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
                    Strategy Models ({years?.length} years)
                  </TableCell>
                  <TableCell
                    padding="normal"
                    colSpan={8}
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
                  <TableCell
                    padding="normal"
                    colSpan={8}
                    align="center"
                    sx={{
                      backgroundColor: "#42787890",
                      color: "white",
                      fontSize: 18,
                      fontFamily: "Montserrat",
                    }}
                  >
                    Annual Dividend
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
                            parseFloat(strategy[year]?.anualPrice) >= 0
                              ? "green"
                              : "red",
                        }}
                      >
                        {strategy[year]?.anualPrice
                          ? strategy[year]?.anualPrice
                          : "-"}
                      </StyledTableCell>
                    ))}
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
