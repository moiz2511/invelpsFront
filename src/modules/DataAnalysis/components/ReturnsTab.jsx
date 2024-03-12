import React, { useState, useEffect, useContext } from "react";

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
} from "@mui/material";

import AuthContext from "../../Core/store/auth-context";
import { styled } from "@mui/material/styles";
import PageInfoBreadCrumbs from "../../Core/components/Layout/PageInfoBreadCrumbs";
import LineRaceChart from "./LineRaceChart";
import NegativeBarChart from "./NegativeBarChart";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ColorConstants from "../../Core/constants/ColorConstants.json";

import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { IoArrowUpOutline } from "react-icons/io5";
import PieChart from "./PieChart";

const headYears = [
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
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

const headCategories1 = [
  "Avg",
  "Best",
  "Worst",
  "Negative Periods",
  "Duration",
];
const headCategories = [
  { title: "Avg", key: "rolling_return" },
  { title: "Best", key: "best_return" },
  { title: "Worst", key: "worst_return" },
  { title: "Negative Periods", key: "negative_annual_returns" },
  { title: "Duration", key: "duration" },
];

const sortingFields = [
  { key: "none", label: "None" },
  { key: "name", label: "Strategy" },
  { key: "rolling_return", label: "Average Returns" },
  { key: "best_return", label: "Best Returns" },
  { key: "worst_return", label: "Worst Returns" },
  { key: "negative_annual_returns", label: "Negative Returns" },
];

const ReturnsTab = () => {
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

  const [bestWorstDataCopy, setBestWorstDataCopy] = useState([]);
  const [selectedSort, setSelectedSort] = useState(0);
  const [selectedField, setSelectedField] = useState();

  const [perExchangeKPI, setPerExhangeKPI] = useState([]);
  const [perSectorKPI, setPerSectorKPI] = useState([]);
  const [perMarketKPI, setPerMarketKPI] = useState([]);

  useEffect(() => {
    const CheckUserSession = () => {
      return authCtx.isLoggedIn ? authCtx.token : "";
    };

    const userToken = CheckUserSession();
    setAuthToken(userToken);
  }, []);

  useEffect(() => {
    const fetchStrategyAnnualPerformance = async () => {
      try {
        const response = await fetch(
          `
              https://api.invelps.com/api/strategies/getStrategiesAnnualPerformance`,
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

    const fetchStrategyBestWorstPerformance = async () => {
      try {
        const response = await fetch(
          `
              https://api.invelps.com/api/strategies/getStrategiesBestWorstPerformance`,
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
          setBestWorstData(data.data);
          setBestWorstDataCopy(data.data);
        } else {
          console.log("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (authToken) {
      fetchStrategyAnnualPerformance();
      fetchStrategyBestWorstPerformance();
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

  console.log(strategyData);

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
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchGraphData();
    }
    return () => {
      isMounted = false;
    };
    // fetchGraphData();
  }, [selectedStrategy]);

  const handleDataVisualization = (strategy) => {
    setShowVisualData(!showVisualData);
    setSelectedStrategy(strategy);
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

  const handleSortingFieldChange = (field) => {
    setSelectedField(field);
  };

  const sorting = (data) => {
    console.log(data);
    console.log(selectedSort);
    if (data) {
      switch (selectedSort) {
        case 0:
          return bestWorstDataCopy;
        case 1:
          return data.slice().sort((a, b) => {
            const valueA = a[selectedField];
            const valueB = b[selectedField];
            console.log(valueA, valueB);

            const alphabetRegex = /[a-zA-Z]/;
            if (alphabetRegex.test(valueA.toString())) {
              return valueA.localeCompare(valueB, undefined, { numeric: true });
            } else {
              return parseFloat(valueA) - parseFloat(valueB);
            }
          });
        case 2:
          return data.slice().sort((a, b) => {
            const valueA = a[selectedField];
            const valueB = b[selectedField];

            const alphabetRegex = /[a-zA-Z]/;
            if (alphabetRegex.test(valueA.toString())) {
              return valueB.localeCompare(valueA, undefined, { numeric: true });
            } else {
              return parseFloat(valueB) - parseFloat(valueA);
            }
          });
        default:
          return data;
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (selectedSort !== 0 && isMounted) {
      const sorted = sorting(bestWorstDataCopy);
      setBestWorstDataCopy(sorted);
    }
    return () => {
      isMounted = false;
    };
  }, [selectedSort, selectedField]);

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
            <text style={{ fontSize: 25, fontWeight: "bold" }}>
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
          </Card>
        </>
      ) : (
        <>
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
                      Annual Returns (%)
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
                  {strategyData.map((strategy, index) => (
                    <StyledTableRow hover key={index} sx={{ ml: 3 }}>
                      <StyledTableCell
                        onClick={() =>
                          handleDataVisualization(strategy.strategy_name_here)
                        }
                        sx={{
                          cursor: "pointer",
                          ":hover": {
                            textDecoration: "underline",
                            color: "blue",
                          },
                        }}
                      >
                        {strategy.strategy_name_here}
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
                              parseFloat(strategy[year].anual_return) >= 0
                                ? "green"
                                : "red",
                          }}
                        >
                          {strategy[year].anual_return
                            ? strategy[year].anual_return
                            : "-"}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                      }}
                    >
                      Rolling Returns (%)
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
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <span>Strategy</span>
                        {selectedSort === 1 ? (
                          <button
                            onClick={() => {
                              handleSortingFieldChange("name");
                              setSelectedSort(2);
                            }}
                            style={{
                              color: "white",
                              background: "rgba(0, 0, 0, 0.3)",
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
                              background: "rgba(0, 0, 0, 0.3)",
                              border: "none",
                              borderRadius: "9999px",
                              width: "24px",
                              height: "24px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={() => {
                              handleSortingFieldChange("name");
                              setSelectedSort(1);
                            }}
                          >
                            <IoArrowUp />
                          </button>
                        )}
                      </Box>
                    </TableCell>
                    {headCategories.map((category, index) => (
                      <TableCell key={index} padding="normal">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <span>{category.title}</span>
                          {category.key.trim() !== "" &&
                            (selectedSort === 1 ? (
                              <button
                                onClick={() => {
                                  handleSortingFieldChange(category.key);
                                  setSelectedSort(2);
                                }}
                                style={{
                                  color: "white",
                                  background: "rgba(0, 0, 0, 0.3)",
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
                                  background: "rgba(0, 0, 0, 0.3)",
                                  border: "none",
                                  borderRadius: "9999px",
                                  width: "24px",
                                  height: "24px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={() => {
                                  handleSortingFieldChange(category.key);
                                  setSelectedSort(1);
                                }}
                              >
                                <IoArrowUp />
                              </button>
                            ))}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bestWorstDataCopy.map((data, index) => (
                    <StyledTableRow hover key={index} sx={{ ml: 3 }}>
                      <StyledTableCell
                        onClick={() => handleDataVisualization(data.name)}
                        sx={{
                          cursor: "pointer",
                          ":hover": {
                            textDecoration: "underline",
                            color: "blue",
                          },
                        }}
                      >
                        {data.name}
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
                      <StyledTableCell
                        sx={{
                          color:
                            parseFloat(data.duration) >= 0 ? "green" : "red",
                        }}
                      >
                        {data.duration}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>{" "}
        </>
      )}
      {/* <Card sx={{ m: 1, position: "relative" }}>
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
                          color: data.annualized_return >= 0 ? "green" : "red",
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
      </Card> */}
    </>
  );
};

export default ReturnsTab;
