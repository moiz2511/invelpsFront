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

const RisksTab = () => {
  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const [riskReturn, setRiskReturn] = useState([]);

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
        const response = await fetch(
          `
              https://api.invelps.com/api/strategies/getStrategiesRiskAdjustedReturns`,
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
              Risk Adjusted
              <br /> return
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
            <ScatterChart chartId="scatterChart" data={riskReturn} />
          </Box>
        </Box>

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
              Strategy Models{" "}
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
                  Strategy
                </TableCell>
                <TableCell sx={{ fontFamily: "Montserrat" }}>
                  Annualized Return
                </TableCell>
                <TableCell sx={{ fontFamily: "Montserrat" }}>
                  Standard Deviation
                </TableCell>
                <TableCell sx={{ fontFamily: "Montserrat" }}>
                  Duration
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {riskReturn.map((data, index) => {
                return (
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
                      {" "}
                      {data.name}{" "}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.annualized_return > 0 ? "green" : "red",
                      }}
                    >
                      {" "}
                      {data.annualized_return}{" "}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.stdev_return > 0 ? "green" : "red",
                      }}
                    >
                      {" "}
                      {data.stdev_return}{" "}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.duration > 0 ? "green" : "red",
                      }}
                    >
                      {" "}
                      {data.duration}{" "}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};

export default RisksTab;
