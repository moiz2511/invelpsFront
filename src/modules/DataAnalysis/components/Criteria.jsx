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

const Criteria = ({ investor, investorDetails, investorTableData }) => {
  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  // const [investorTableData, setInvestorTableData] = useState();

  useEffect(() => {
    const CheckUserSession = () => {
      return authCtx.isLoggedIn ? authCtx.token : "";
    };

    const userToken = CheckUserSession();
    setAuthToken(userToken);
  }, []);

  // useEffect(() => {
  //   const fetchInvestorDetails = async () => {
  //     try {
  //       const body = {
  //         investor: investor,
  //       };
  //       const response = await fetch(
  //         `https://api.invelps.com/api/strategies/getInvestorBottomTable`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${authToken}`,
  //           },
  //           body: JSON.stringify(body),
  //         }
  //       );

  //       const data = await response.json();

  //       if (response.status === 200) {
  //         console.log("Data:", data);
  //         setInvestorTableData(data.investor_details);
  //       } else {
  //         console.log("Unexpected status code:", response.status);
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   if (authToken && investor) {
  //     fetchInvestorDetails();
  //   }
  // }, [authToken, investor]);

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

  console.log(investor);
  console.log(investorDetails);
  console.log(investorTableData);

  const headCategories = [
    "Strategy",
    "Investing style",
    "Total Return",
    "Annualized Return",
    "Rolling Return",
    "Standard Deviation",
    "Max Drawdown",
    "Sharpe Ratio",
    "Sortino Ratio",
  ];
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
          <text style={{ color: "black", fontWeight: 600, fontSize: 20 }}>
            Outlook
          </text>
          <text>{investorDetails.description}</text>
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
                    colSpan={2}
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
                    colSpan={4}
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
                    colSpan={2}
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
                    colSpan={2}
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
              <TableBody>
                {investorTableData.map((data, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{investor}</StyledTableCell>
                    <StyledTableCell>{data.strategy_label}</StyledTableCell>
                    <StyledTableCell>{data.investing_style}</StyledTableCell>
                    <StyledTableCell>10%</StyledTableCell>
                    <StyledTableCell>{data.annualized_return}</StyledTableCell>
                    <StyledTableCell>{data.rolling_return}</StyledTableCell>
                    <StyledTableCell>{data.stdev_return}</StyledTableCell>
                    <StyledTableCell>{data.max_drawdown}</StyledTableCell>
                    <StyledTableCell>{data.sharpe_ratio}</StyledTableCell>
                    <StyledTableCell>{data.sortino_ratio}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
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
          <text style={{ color: "black", fontSize: 25, fontWeight: 600 }}>
            Contributions & Legacy
          </text>
          <text>{investorDetails.contributions_and_legacy}</text>
        </div>
      </div>
    </div>
  );
};

export default Criteria;
