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

const headCategories = ["Avg", "Best", "Worst", "Negative Periods"];
const BackTestTab = () => {
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

    if (authToken) {
      fetchStrategyAnnualPerformance();
    }
  }, [authToken]);

  useEffect(() => {
    if (strategyData && strategyData.length > 0) {
      const firstStrategy = strategyData[0];
      const strategyKeys = Object.keys(firstStrategy);
      const filteredYears = strategyKeys.filter((key) => key !== "strategy_name_here");
      setYears(filteredYears);
    }
  }, [strategyData]);

  console.log(years);
  console.log(bestWorstData);

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
              Annual Returns (10 years)
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
            <LineRaceChart chartId={"LR-chart-1"} chartData={strategyData} years={years} />
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
                      {strategy[year].anual_return ? strategy[year].anual_return : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};

export default BackTestTab;
