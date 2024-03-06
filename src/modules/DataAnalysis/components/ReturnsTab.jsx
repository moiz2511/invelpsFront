import React, { useState, useEffect, useContext } from "react";

import {
  Card,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";

import AuthContext from "../../Core/store/auth-context";
import { styled } from "@mui/material/styles";

import LineRaceChart from "./LineRaceChart";
import NegativeBarChart from "./NegativeBarChart";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ColorConstants from "../../Core/constants/ColorConstants.json";

import { IoArrowDown } from "react-icons/io5";
import { IoArrowUpOutline } from "react-icons/io5";

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

const headCategories = ["Avg", "Best", "Worst", "Negative Periods", 'Duration'];
const ReturnsTab = () => {
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

  return (
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
                <TableCell sx={{ fontFamily: "Montserrat" }}>Trends</TableCell>
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
                    0
                      ? <IoArrowUpOutline color="green" size={18} />
                      : <IoArrowDown color="red" size={18} />}
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
                <TableCell>Strategy</TableCell>
                {headCategories.map((category, index) => (
                  <TableCell key={index} padding="normal">
                    {category}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bestWorstData.map((data, index) => (
                <StyledTableRow hover key={index} sx={{ ml: 3 }}>
                  <StyledTableCell
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
                        parseFloat(data.rolling_return) >= 0 ? "green" : "red",
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
                        parseFloat(data.worst_return) >= 0 ? "green" : "red",
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
                        parseFloat(data.duration) >= 0
                          ? "green"
                          : "red",
                    }}
                  >
                    {data.duration}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
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
