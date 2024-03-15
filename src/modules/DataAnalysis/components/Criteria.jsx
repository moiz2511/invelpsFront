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
  const [strategyOutlooks, setStrategyOutlooks] = useState([]);

  const CheckUserSession = () => {
    return authCtx.isLoggedIn ? authCtx.token : "";
  };

  const userToken = CheckUserSession();
  // setAuthToken(userToken);
  // useEffect(() => {
  // }, []);

  console.log(userToken);

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

  const fetchOutlookPageData = async (strategy) => {
    try {
      const body = {
        strategy_name: strategy,
      };
      const response = await fetch(
        `https://api.invelps.com/api/strategies/getOutlookPageData`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (response.status) {
        // Return data for aggregation
        return data;
      } else {
        console.log("Unexpected status code:", response.status);
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  console.log(strategyOutlooks);

  useEffect(() => {
    const strategies = investorTableData.map((item) => item.strategy_name);
    console.log(strategies);

    const fetchAllStrategiesData = async () => {
      const allData = await Promise.all(
        strategies.map((strategy) => fetchOutlookPageData(strategy))
      );

      // Flatten the array of arrays and filter out nulls if any request failed
      const flattenedData = allData.flat().filter((item) => item !== null);

      // Deduplicate the flattened data
      const uniqueData = Array.from(
        new Map(
          flattenedData.map((item) => [JSON.stringify(item), item])
        ).values()
      );

      setStrategyOutlooks(uniqueData);
    };

    fetchAllStrategiesData();
  }, []);

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
    "Measure",
    "Metric",
    "Description",
    "Range",
    "Interpretation",
  ];

  return (
    <div style={{ padding: 20, fontFamily: "Montserrat" }}>
      {strategyOutlooks.map((outlook, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #aaa",
            height: "100%",
            padding: 20,
            marginBottom: 10,
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
            <text>{outlook.strategies_per_group.outlook}</text>
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
                <CriteriaPie data={outlook.strategies_per_group} />
              </div>
              <div style={{ padding: 10, flex: 1 }}>
                <CriteriaBar data={outlook.strategies_per_group} />
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
            <text
              style={{
                color: "black",
                fontWeight: 600,
                fontSize: 20,
                fontFamily: "Montserrat",
              }}
            >
              Selection Criterias
            </text>
            <TableContainer>
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
                      fontFamily: "Montserrat",
                    }}
                  >
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
                  {outlook.criterias_per_strategy_obj.map((data, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{data.measure}</StyledTableCell>
                      <StyledTableCell>{data.category}</StyledTableCell>
                      <StyledTableCell>{data.metric}</StyledTableCell>
                      <StyledTableCell>{data.range_limit}</StyledTableCell>
                      <StyledTableCell>{data.interpretation}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {/* <div
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
        </div> */}
        </div>
      ))}
    </div>
  );
};

export default Criteria;
