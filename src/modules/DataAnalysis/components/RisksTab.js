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
  { key: "duration", label: "Duration" },
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

  const fetchGraphData = async () => {
    try {
      const body = {
        strategy_name: selectedStrategy,
      };
      const response = await fetch(
        `
            https://api.invelps.com/api/strategies/getStrategyGraphData`,
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
        console.log(data);
        setPerExhangeKPI(data.data.companies_per_exchanges_KPI);
        setPerSectorKPI(data.data.companies_per_sector_KPI);
        setPerMarketKPI(data.data.companies_per_market_cap_KPI);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    if(selectedStrategy !== null){
      fetchGraphData();
    }

  }, [selectedStrategy]);

  const handleDataVisualization = (strategy) => {
    setShowVisualData(!showVisualData);
    setSelectedStrategy(strategy);
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
      {showVisualData ? (
        <Box ml={2} mb={4}>
          <Typography color={"rgba(0, 0, 0, 0.6)"}>
            Strategies Overview / {selectedStrategy.name}
          </Typography>
        </Box>
      ) : (
        <PageInfoBreadCrumbs data={pageLoc} />
      )}
      {showVisualData ? (
        <>
          <Button
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
          <Card
            sx={{
              margin: 1,
              display: "flex",
              flexDirection: "column",
              padding: 2,
            }}
          >
            <text style={{ fontSize: 25, fontWeight: "bold" }}>
              {" "}
              {selectedStrategy.name}{" "}
            </text>
            <Card
              sx={{
                margin: 2,
                display: "flex",
                flexDirection: "column",
                gap: 5,
                padding: 3,
              }}
            >
              <text style={{ fontSize: 20, fontWeight: "bold" }}>
                Companies Passing Criteria Statistics
              </text>
              <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                <Card
                  sx={{
                    padding: 4,
                    gap: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <text> Companies Per Exchanges (%) </text>
                  <PieChart
                    graphData={perExchangeKPI}
                    nameData={(item) => item.exchange}
                  />
                </Card>
                <Card
                  sx={{
                    padding: 4,
                    gap: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <text> Companies Per Sector (%) </text>
                  <PieChart
                    graphData={perSectorKPI}
                    nameData={(item) => item.sector}
                  />
                </Card>
                <Card
                  sx={{
                    padding: 4,
                    gap: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <text> Companies Per Market Cap (%) </text>
                  <PieChart
                    graphData={perMarketKPI}
                    nameData={(item) => item.market_cap_class}
                  />
                </Card>
              </Box>
            </Card>
          </Card>
        </>
      ) : (
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
                Risk Adjusted Return ({riskReturn[0]?.duration} years)
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
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: "Montserrat",
                      fontSize: 18,
                      color: "white",
                      bgcolor: "#272727",
                    }}
                  >
                    Strategy Models
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
              </TableHead>
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
                        {category.key.trim() !== "" &&
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
                          ))}
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
                        onClick={() => handleDataVisualization(data.name)}
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
      )}
    </>
  );
};

export default RisksTab;
