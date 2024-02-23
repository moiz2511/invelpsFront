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
import CompanyScatterChart from "./CompanyScatterChart";

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
const CompanyReturnTab = ({ companySymbol, companyName, companyImage }) => {
  // const strategyNames = [
  //   "Buffett: Hangstrom",
  //   "Philip Fisher Screen",
  //   "Defensive Investor",
  // ];

  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const [strategyData, setStrategyData] = useState([]);
  const [years, setYears] = useState([]);
  const [bestWorstData, setBestWorstData] = useState([]);
  const [annualReturn, setAnnualReturn] = useState([]);
  const [rollingReturn, setRollingReturn] = useState([]);
  const [riskReturn, setRiskReturn] = useState(null);

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

  useEffect(() => {
    const fetchStrategyRiskAdjustedReturns = async () => {
      try {
        const body = {
          symbol: companySymbol,
        };
        const response = await fetch(
          `
              https://api.invelps.com/api/strategies/getRisksAgainstCompany`,
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
          setRiskReturn(data.data);
        } else {
          console.log("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (authToken) {
      fetchStrategyRiskAdjustedReturns();
    }
  }, [authToken]);

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
              <img
                src={companyImage}
                style={{ height: "25px", width: "25px" }}
              />{" "}
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
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                    sx={{
                      fontFamily: "Montserrat",
                      color: "#427878",
                      backgroundColor: "#427878",
                    }}
                  >
                    {ann.date_year}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell
                  padding="normal"
                  colSpan={1}
                  sx={{
                    backgroundColor: "#e7ecef",
                    color: "#427878",
                    fontSize: 14,
                    fontFamily: "Montserrat",
                  }}
                >
                  Screener
                </TableCell>
                {annualReturn.map((ann, index) => (
                  <TableCell
                    key={index}
                    padding="normal"
                    sx={{
                      fontFamily: "Montserrat",
                      color: "#427878",
                      backgroundColor: "#e7ecef",
                    }}
                  >
                    {ann.date_year}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow hover>
                <StyledTableCell
                  sx={{
                    cursor: "pointer",
                    ":hover": { textDecoration: "underline", color: "blue" },
                  }}
                >
                  <img
                    src={companyImage}
                    style={{ height: "15px", width: "15px" }}
                  />{" "}
                  {annualReturn[0]?.symbol}
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
              <img
                src={companyImage}
                style={{ height: "25px", width: "25px" }}
              />{" "}
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
        </Box>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} > 

            <CompanyNegativeBar
              chartId={"CompNeg-chart-1"}
              chartData={rollingReturn}
            />


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
                    fontFamily: "Montserrat",
                  }}
                >
                  <TableCell sx={{ fontFamily: "Montserrat" }}>
                    Screener
                  </TableCell>
                  {headCategories.map((category, index) => (
                    <TableCell
                      key={index}
                      padding="normal"
                      sx={{ fontFamily: "Montserrat" }}
                    >
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
                      fontFamily: "Montserrat",
                    }}
                  >
                    <img
                      src={companyImage}
                      style={{ height: "15px", width: "15px" }}
                    />{" "}
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
        </Box>
      </Card>
      {riskReturn && (
        <Card sx={{ m: 1, position: "relative", fontFamily: "Montserrat" }}>
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
                <img
                  src={companyImage}
                  style={{ height: "25px", width: "25px" }}
                />{" "}
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
                Risk Adjusted Return
              </text>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              alignItems: "center",
              fontFamily: "Montserrat",
            }}
          >
            <CompanyScatterChart
              chartId="companyScatterChart"
              data={riskReturn}
            />
            <TableContainer>
              <Box
                sx={{
                  backgroundColor: "black",
                  padding: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <text style={{ color: "#fff", textAlign: "center" }}>
                  {" "}
                  Risk Adjusted Return{" "}
                </text>
              </Box>
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
                    {/* <TableCell sx={{ fontFamily: "Montserrat" }}>
                  Investor
                </TableCell> */}
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      Company Name
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      Exchange
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      Sector
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      Industry
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      Annualized Return
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      Standard Deviation
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow hover sx={{ ml: 3 }}>
                    <StyledTableCell>
                      {" "}
                      {riskReturn.company_name}{" "}
                    </StyledTableCell>
                    <StyledTableCell> {riskReturn.exchange} </StyledTableCell>
                    <StyledTableCell> {riskReturn.sector} </StyledTableCell>
                    <StyledTableCell> {riskReturn.industry} </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color:
                          parseFloat(riskReturn.annualized_return) >= 0
                            ? "green"
                            : "red",
                      }}
                    >
                      {" "}
                      {riskReturn.annualized_return}{" "}
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{
                        color:
                          parseFloat(riskReturn.standard_deviation) >= 0
                            ? "green"
                            : "red",
                      }}
                    >
                      {" "}
                      {riskReturn.standard_deviation}{" "}
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Card>
      )}
    </>
  );
};

export default CompanyReturnTab;
