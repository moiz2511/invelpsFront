import React, { useState, useEffect, useContext } from "react";

import {
  Card,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { styled } from "@mui/material/styles";
import ColorConstants from "../../Core/constants/ColorConstants.json";
import ScatterChart from "./ScatterChart";
import AuthContext from "../../Core/store/auth-context";

import PageInfoBreadCrumbs from "../../Core/components/Layout/PageInfoBreadCrumbs";
import PieChart from "./PieChart";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import GeoChartComponent from "./charts/GeoCharts";
import HorizontalBarChart from "./charts/HorizontalBar";
import DonutPieChart from "./charts/DonoutChart";
import { useNavigate } from "react-router-dom";
import Constants from "../../../Constants.json";

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

const headCategories = [
  { key: "name", label: "Strategy" },
  { key: "annualized_return", label: "Annualized Return %" },
  { key: "stdev_return", label: "Standard Deviation %" },
  // { key: "duration", label: "Duration" },
];

const RisksTab = () => {
  let pageLoc = window.location.pathname;

  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const [riskReturn, setRiskReturn] = useState([]);
  const [riskReturnCopy, setRiskReturnCopy] = useState([]);

  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [showVisualData, setShowVisualData] = useState(false);
  const [perExchangeKPI, setPerExhangeKPI] = useState([]);
  const [perSectorKPI, setPerSectorKPI] = useState([]);
  const [perMarketKPI, setPerMarketKPI] = useState([]);

  const [selectedSort, setSelectedSort] = useState(0);
  const [selectedField, setSelectedField] = useState(null);
  const navigate = useNavigate();

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
          Constants.BACKEND_SERVER_BASE_URL +
            "/strategies/getStrategiesRiskAdjustedReturns",
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
          setRiskReturnCopy(data.data);
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

  console.log(riskReturnCopy);

  // useEffect(() => {
  //   if (selectedStrategy !== null) {
  //     fetchGraphData();
  //   }
  // }, [selectedStrategy]);

  const handleDataVisualization = (strategy) => {
    setShowVisualData(!showVisualData);
    setSelectedStrategy(strategy.name);
    console.log("visual", strategy);
    navigate("/riskVisualization", {
      state: {
        selectedStrategy: strategy.name,
        selectedStrategyLabel: strategy.startegy_label,
      },
    });
  };

  const handleSortingFieldChange = (field) => {
    setSelectedField(field);
  };

  const sorting = (data) => {
    // console.log(data);
    // console.log(selectedSort);
    if (data) {
      switch (selectedSort) {
        case 0:
          return riskReturnCopy;
        case 1:
          return data.slice().sort((a, b) => {
            const valueA = a[selectedField];
            const valueB = b[selectedField];
            // console.log(valueA, valueB);

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
      const sorted = sorting(riskReturnCopy);
      setRiskReturnCopy(sorted);
    }
    return () => {
      isMounted = false;
    };
  }, [selectedSort, selectedField]);

  return (
    <>
      {/* {showVisualData ? (
        <Box ml={2} mb={4}>
          <Typography color={"rgba(0, 0, 0, 0.6)"}>
            Strategies Overview / {selectedStrategy.name}
          </Typography>
        </Box>
      ) : (
        <PageInfoBreadCrumbs data={pageLoc} />
      )} */}
      {showVisualData ? (
        <>
          {/* <Button
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
          <Box
            sx={{
              display: "grid",
              justifyContent: "space-around",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr",
                md: "1.5fr 1fr",
              },
              gap: 2,
              my: 2,
            }}
          >
            <Card
              sx={{
                padding: 4,
                gap: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <text style={{ fontWeight: "bolder" }}>
                {" "}
                Companies Per Exchanges (%){" "}
              </text>
              
              <GeoChartComponent data={perExchangeKPI} />
            </Card>
            <Box style={{ display: "flex", gap: 6, flexDirection: "column" }}>
              <Card
                sx={{
                  padding: 2,
                }}
              >
                <text style={{ fontWeight: "bolder" }}>
                  {" "}
                  Companies Per Sector (%){" "}
                </text>
                <HorizontalBarChart data={perSectorKPI} />
              </Card>
              <Card
                sx={{
                  padding: 4,
                  paddingBottom: { xs: 8, md: 4 },
                  display: "flex",
                  flexDirection: "column",
                  height: 250,
                }}
              >
                <text style={{ fontWeight: "bolder" }}>
                  {" "}
                  Companies Per Market Cap (%){" "}
                </text>
                <DonutPieChart
                  data={perMarketKPI}
                  dataKey={"total_count"}
                  nameKey={"market_cap_class"}
                ></DonutPieChart>
                
              </Card>
            </Box>
          </Box> */}
        </>
      ) : (
        <Card
          sx={{
            m: 1,
            position: "relative",
            fontFamily: "Montserrat",
            width: "50%",
          }}
        >
          <Box p={3}>
            <Box spacing={1} sx={{ mt: 0.5 }}>
              <text
                style={{
                  padding: "5px",
                  fontSize: "27px",
                  fontWeight: "bold",
                }}
              >
                Risk Adjusted Return ({riskReturnCopy[0]?.duration} years)
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
            {/* <Box
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
            </Box> */}
            <Table
              sx={{ minWidth: "100%", maxWidth: "100%", mt: 1 }}
              size="medium"
            >
              {/* <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: "Montserrat",
                      fontSize: 18,
                      color: "white",
                      bgcolor: "#272727",
                    }}
                  >
                    Strategy Models ({riskReturnCopy[0]?.duration} years)
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    sx={{
                      fontFamily: "Montserrat",
                      textAlign: "center",
                      fontSize: 18,
                      color: "white",
                      bgcolor: "#407879",
                    }}
                  >
                    Risk Returns
                  </TableCell>
                </TableRow>
              </TableHead> */}
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
                  {headCategories.map((category, index) => (
                    <TableCell key={index} sx={{ fontFamily: "Montserrat" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <span>{category.label}</span>
                        {/* {category.key.trim() !== "" &&
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
                          ))} */}
                      </Box>
                    </TableCell>
                  ))}
                  {/* <TableCell sx={{ fontFamily: "Montserrat" }}>
                    Strategy
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Montserrat" }}>
                    Annualized Return %
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Montserrat" }}>
                    Standard Deviation %
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Montserrat" }}>
                    Duration
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {riskReturnCopy.map((data, index) => {
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
                        {data.startegy_label}{" "}
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
                      {/* <StyledTableCell
                        sx={{
                          color: data.duration > 0 ? "green" : "red",
                        }}
                      >
                        {" "}
                        {data.duration}{" "}
                      </StyledTableCell> */}
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </>
  );
};

export default RisksTab;
