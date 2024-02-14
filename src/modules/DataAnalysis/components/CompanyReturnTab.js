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

// getAnnualAndRollingRtrnsForCompany

import AuthContext from "../../Core/store/auth-context";
import { styled } from "@mui/material/styles";

import LineRaceChart from "./LineRaceChart";
import NegativeBarChart from "./NegativeBarChart";
import CompanyLineRace from "./CompanyLineRace";
import CompanyNegativeBar from "./CompanyNegativeBar";

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
const CompanyReturnTab = ({ companySymbol, companyName }) => {
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
  const [annualReturn, setAnnualReturn] = useState([]);
  const [rollingReturn, setRollingReturn] = useState([]);

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
        const body = {
          symbol: companySymbol,
        };
        const response = await fetch(
          `
              https://api.invelps.com/api/strategies/getAnnualAndRollingRtrnsForCompany`,
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
          console.log("Data:", data);
          setAnnualReturn(data.data.annualRtn);
          setRollingReturn(data.data.rollingRtn);
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
    if (annualReturn && annualReturn.length > 0) {
      const filteredYears = annualReturn.map((entry) => entry.date_year);
      setYears(filteredYears);
    }
  }, [annualReturn]);

  console.log(years);
  console.log(annualReturn);
  console.log(rollingReturn);

  return (
    <>
      <Card sx={{ m: 1, position: "relative", fontFamily: "Montserrat" }}>
        <Box p={3}>
          <Box
            spacing={1}
            sx={{ mt: 0.5, display: "flex", flexDirection: "row", gap: 10 }}
          >
            <text
              style={{
                padding: "5px",
                fontSize: "27px",
                fontWeight: "bold",
              }}
            >
              {companyName}
              <br />({companySymbol})
            </text>
            <text
              style={{
                padding: "5px",
                fontSize: "27px",
                fontWeight: "bold",
              }}
            >
              Annual Returns
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
            <CompanyLineRace
              chartId={"CLR-chart-1"}
              chartData={annualReturn}
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
                  Screener
                </TableCell>
                {annualReturn.map((ann, index) => (
                  <TableCell
                    key={index}
                    padding="normal"
                    sx={{ fontFamily: "Montserrat", color: "#427878" }}
                  >
                    {ann.date_year}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {strategyNames.map((strategy, idx) => (
                <StyledTableRow hover key={idx}>
                  <StyledTableCell
                    sx={{
                      cursor: "pointer",
                      ":hover": { textDecoration: "underline", color: "blue" },
                    }}
                  >
                    {strategy}
                  </StyledTableCell>
                  {annualReturn.map((ann, index) => (
                    <StyledTableCell
                      key={index}
                      sx={{
                        color:
                          parseFloat(ann.annual_return) >= 0 ? "green" : "red",
                      }}
                    >
                      {ann.annual_return ? ann.annual_return.toFixed(2) : "N/A"}
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
          <Box
            spacing={1}
            sx={{
              mt: 0.5,
              display: "flex",
              flexDirection: "row",
              gap: 10,
              fontFamily: "Montserrat",
            }}
          >
            <text
              style={{
                padding: "5px",
                fontSize: "27px",
                fontWeight: "bold",
              }}
            >
              {companyName}
              <br />({companySymbol})
            </text>
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
            <CompanyNegativeBar
              chartId={"CompNeg-chart-1"}
              chartData={rollingReturn}
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
                  Screener
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
                <TableCell>Screener</TableCell>
                {headCategories.map((category, index) => (
                  <TableCell key={index} padding="normal">
                    {category}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow hover sx={{ ml: 3 }}>
                <StyledTableCell
                  sx={{
                    cursor: "pointer",
                    ":hover": {
                      textDecoration: "underline",
                      color: "blue",
                    },
                  }}
                >
                  {rollingReturn.company_name}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    color:
                      parseFloat(rollingReturn.rolling_return) >= 0
                        ? "green"
                        : "red",
                  }}
                >
                  {rollingReturn.rolling_return}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    color:
                      parseFloat(rollingReturn.best_return) >= 0
                        ? "green"
                        : "red",
                  }}
                >
                  {rollingReturn.best_return}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    color:
                      parseFloat(rollingReturn.worst_return) >= 0
                        ? "green"
                        : "red",
                  }}
                >
                  {rollingReturn.worst_return}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    color:
                      parseFloat(rollingReturn.negative_returns) >= 0
                        ? "green"
                        : "red",
                  }}
                >
                  {rollingReturn.negative_returns}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};

export default CompanyReturnTab;
