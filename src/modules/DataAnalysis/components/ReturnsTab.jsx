import React from "react";

import {
  TextField,
  MenuItem,
  Grid,
  Card,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  Button,
  IconButton,
  Typography,
} from "@mui/material";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { styled } from "@mui/material/styles";
import ColorConstants from "../../Core/constants/ColorConstants.json";

import LineRaceChart from "./LineRaceChart";

const headYears = [
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
];
const ReturnsTab = () => {
  const strategyNames = [
    "Buffett: Hangstrom",
    "Philip Fisher Screen",
    "Defensive Investor",
  ];
  const generateRandomInvestmentData = () => {
    const data = [];

    for (let year = 2012; year <= 2023; year++) {
      strategyNames.forEach((strategy) => {
        data.push({
          year: year,
          strategy: strategy,
          performance: Math.floor(Math.random() * 100), // Random performance value for demonstration
        });
      });
    }

    return data;
  };

  const investmentData = generateRandomInvestmentData();
  console.log(investmentData);

  return (
    <>
      <Card sx={{ m: 1, position: "relative" }}>
        <Box p={3}>
          <Box spacing={1} sx={{ mt: 0.5 }}>
            <text
              style={{
                padding: "5px",
                fontSize: "27px",
                fontWeight: "bold",
              }}
            >
              Strategies Performances and
              <br /> Risks (10 years)
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
            <LineRaceChart chartId={"LR-chart-1"} />
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
                  }}
                >
                  Annual Returns (%)
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
                <TableCell>Strategy</TableCell>
                {headYears.map((year, index) => (
                  <TableCell key={index} padding="normal">
                    {year}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {/* <TableBody>
              {filteredStrategies.map((data, index) => {
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
                      {data.name}{" "}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.total_return >= 0 ? "green" : "red",
                      }}
                    >
                      {" "}
                      {data.total_return}{" "}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.annualized_return >= 0 ? "green" : "red",
                      }}
                    >
                      {" "}
                      {data.annualized_return}{" "}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.rolling_return >= 0 ? "green" : "red",
                      }}
                    >
                      {" "}
                      {data.rolling_return}{" "}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.stdev_return >= 0 ? "green" : "red",
                      }}
                    >
                      {" "}
                      {data.stdev_return}{" "}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.max_drawdown >= 0 ? "green" : "red",
                      }}
                    >
                      {" "}
                      {data.max_drawdown}{" "}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.sharpe_ratio >= 0 ? "green" : "red",
                      }}
                    >
                      {" "}
                      {data.sharpe_ratio}{" "}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: data.sortino_ratio >= 0 ? "green" : "red",
                      }}
                    >
                      {" "}
                      {data.sortino_ratio}{" "}
                    </StyledTableCell>
                    <StyledTableCell> {data.duration} </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody> */}
          </Table>
        </TableContainer>
      </Card>
      {/* <Card sx={{ m: 1, position: "relative" }}>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 3,
            }}
          >
            <Box spacing={1} sx={{ mt: 0.5 }}>
              <text
                style={{
                  padding: "5px",
                  fontSize: "27px",
                  fontWeight: "bold",
                }}
              >
                {" "}
                Overview{" "}
              </text>
            </Box>
            <Box spacing={1} sx={{ mt: 0.5 }}>
              <TextField
                sx={{ borderRadius: 10 }}
                placeholder="Search"
                value={searchValue}
                onChange={handleSearchChange}
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
                  {headCells.data.map((headCell, index) => (
                    <StyledTableCell key={headCell.id} padding="normal">
                      {headCell.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStrategies.map((data, index) => {
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
                        {data.name}{" "}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color: data.total_return >= 0 ? "green" : "red",
                        }}
                      >
                        {" "}
                        {data.total_return}{" "}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color: data.annualized_return >= 0 ? "green" : "red",
                        }}
                      >
                        {" "}
                        {data.annualized_return}{" "}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color: data.rolling_return >= 0 ? "green" : "red",
                        }}
                      >
                        {" "}
                        {data.rolling_return}{" "}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color: data.stdev_return >= 0 ? "green" : "red",
                        }}
                      >
                        {" "}
                        {data.stdev_return}{" "}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color: data.max_drawdown >= 0 ? "green" : "red",
                        }}
                      >
                        {" "}
                        {data.max_drawdown}{" "}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color: data.sharpe_ratio >= 0 ? "green" : "red",
                        }}
                      >
                        {" "}
                        {data.sharpe_ratio}{" "}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color: data.sortino_ratio >= 0 ? "green" : "red",
                        }}
                      >
                        {" "}
                        {data.sortino_ratio}{" "}
                      </StyledTableCell>
                      <StyledTableCell> {data.duration} </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card> */}
    </>
  );
};

export default ReturnsTab;
