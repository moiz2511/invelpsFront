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
import { FaBuilding } from "react-icons/fa";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Constants from "../../../Constants.json";

const RisksTab = ({
  showVisualData,
  setShowVisualData,
  selectedStrategyLabel,
  setSelectedStrategyLabel,
  setSelectedCompany,
}) => {
  console.log(showVisualData);
  console.log(selectedStrategyLabel);

  let pageLoc = window.location.pathname;
  // const [selectedStrategy, setSelectedStrategy] = useState(null);

  const authCtx = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const [riskReturn, setRiskReturn] = useState([]);
  const [riskReturnCopy, setRiskReturnCopy] = useState([]);

  // const [showVisualData, setShowVisualData] = useState(false);
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
    console.log(strategy);
    setShowVisualData(!showVisualData);
    // setSelectedStrategy(strategy.name);
    setSelectedStrategyLabel(strategy.name);

    console.log(strategy.name)
    console.log(strategy.startegy_label)

    console.log(strategy);
    const params = new URLSearchParams({
      selectedStrategy: strategy.name,
      selectedStrategyLabel: strategy.startegy_label,
      setSelectedCompany: setSelectedCompany,
    });
    navigate(`/riskVisualization?${params.toString()}`);

    // navigate("/riskVisualization", {
    //   // state: {
    //     selectedStrategy: strategy.name,
    //     selectedStrategyLabel: strategy.startegy_label,
    //     setSelectedCompany: setSelectedCompany,
    //   // },
    // });
  };


  console.log(selectedStrategyLabel)
  console.log(setSelectedCompany)


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

  console.log(showVisualData);

  return (
    <>
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
          <Table
            sx={{ minWidth: "100%", maxWidth: "100%", mt: 1 }} // Move sx inside the Table component
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
                {headCategories.map((category, index) => (
                  <TableCell key={index} sx={{ fontFamily: "Montserrat" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <span>{category.label}</span>
                    </Box>
                  </TableCell>
                ))}
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
                      {data.startegy_label}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.annualized_return > 0 ? "green" : "red",
                      }}
                    >
                      {data.annualized_return}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.stdev_return > 0 ? "green" : "red",
                      }}
                    >
                      {data.stdev_return}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* { showVisualData ? (
      ) : (
        <></>
      )} */}
    </>
  );
};

export default RisksTab;

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
