import React, { useState, useEffect, useContext } from "react";

import {
  Card,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
} from "@mui/material";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { styled } from "@mui/material/styles";
import ColorConstants from "../../Core/constants/ColorConstants.json";
import ScatterChart from "./ScatterChart";
import CompanyScatterChart from "./CompanyScatterChart";
import AuthContext from "../../Core/store/auth-context";

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

const CompanyRiskTab = ({ companySymbol, companyName }) => {
  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const [riskReturn, setRiskReturn] = useState(null);

  useEffect(() => {
    const CheckUserSession = () => {
      return authCtx.isLoggedIn ? authCtx.token : "";
    };

    const userToken = CheckUserSession();
    setAuthToken(userToken);
  }, []);

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

  console.log(riskReturn);

  return (
    <>
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

export default CompanyRiskTab;
