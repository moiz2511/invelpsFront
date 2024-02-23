import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ColorConstants from "../../Core/constants/ColorConstants.json";
import { styled } from "@mui/material/styles";
import CriteriaPie from "./CriteriaPie";
import CriteriaBar from "./CriteriaBar";
import AuthContext from "../../Core/store/auth-context";

const Criteria = ({ investor }) => {
  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const CheckUserSession = () => {
      return authCtx.isLoggedIn ? authCtx.token : "";
    };

    const userToken = CheckUserSession();
    setAuthToken(userToken);
  }, []);

  useEffect(() => {
    const fetchInvestorDetails = async () => {
      try {
        const body = {
          investor: investor,
        };
        const response = await fetch(
          `https://api.invelps.com/api/strategies/getInvestorBottomTable`,
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
          console.log("Data:", data);
        } else {
          console.log("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (authToken && investor) {
      fetchInvestorDetails();
    }
  }, [authToken, investor]);

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
  return (
    <div style={{ padding: 20, fontFamily: "Montserrat" }}>
      <div
        style={{
          border: "1px solid #aaa",
          height: "100%",
          padding: 20,
          borderRadius: 15,
          gap: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            backgroundColor: "#F3F3F3",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            borderRadius: 15,
            gap: 8,
          }}
        >
          <text>Warren Buffet</text>
          <text>
            Warren Buffett, widely regarded as one of the most successful
            investors of all time, is the chairman and CEO of Berkshire
            Hathaway. Renowned for his value investing approach and long-term
            perspective, Buffett's keen insights and financial acumen have made
            him a global icon in the world of finance. His annual shareholder
            letters and timeless investment principles continue to inspire
            investors worldwide.
          </text>
        </div>
        <div
          style={{
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            borderRadius: 15,
            border: "1px solid #aaa",
            gap: 8,
          }}
        >
          <div style={{ borderBottom: "1px solid #aaa", padding: 30 }}>
            <text style={{ color: "black", fontWeight: 600, fontSize: 25 }}>
              Selection Criteria Statistics
            </text>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              width: "100%",
              padding: 20,
            }}
          >
            <div
              style={{
                padding: 10,
                backgroundColor: "#F5F5F5",
                flex: 1,
                borderRadius: 10,
              }}
            >
              <CriteriaPie />
            </div>
            <div style={{ padding: 10, flex: 1 }}>
              <CriteriaBar />
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#F3F3F3",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            borderRadius: 15,
            gap: 8,
          }}
        >
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
                    Return %
                  </TableCell>
                  <TableCell
                    padding="normal"
                    colSpan={12}
                    align="center"
                    sx={{
                      backgroundColor: "orange",
                      color: "white",
                      fontSize: 18,
                      fontFamily: "Montserrat",
                    }}
                  >
                    Risk %
                  </TableCell>
                  <TableCell
                    padding="normal"
                    colSpan={12}
                    align="center"
                    sx={{
                      backgroundColor: "blue",
                      color: "white",
                      fontSize: 18,
                      fontFamily: "Montserrat",
                    }}
                  >
                    Risk Adjusted Return %
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
                    Investor
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
              {/* <TableBody>
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
              </TableBody> */}
            </Table>
          </TableContainer>
        </div>
        <div
          style={{
            backgroundColor: "#F3F3F3",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            borderRadius: 15,
            gap: 8,
          }}
        >
          <text>Warren Buffet</text>
          <text>
            Warren Buffett, widely regarded as one of the most successful
            investors of all time, is the chairman and CEO of Berkshire
            Hathaway. Renowned for his value investing approach and long-term
            perspective, Buffett's keen insights and financial acumen have made
            him a global icon in the world of finance. His annual shareholder
            letters and timeless investment principles continue to inspire
            investors worldwide.
          </text>
        </div>
      </div>
    </div>
  );
};

export default Criteria;
