import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  styled,
  tableCellClasses,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RemoveIcon from "@mui/icons-material/Remove";
import ColorConstants from "../../../Core/constants/ColorConstants.json"; // Make sure this path is correct and the JSON file is properly formatted

// Custom styles for TableCell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor:
      ColorConstants.APP_TABLE_HEAD_COLOR || theme.palette.primary.main, // Fallback to primary color if constant is undefined
    color: theme.palette.common.black,
    padding: theme.spacing(1),
    fontFamily: "Montserrat",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: theme.spacing(1),
    fontFamily: "Montserrat",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Data array
const rows = [
  {
    rank: 1,
    change: "increase",
    company: "Samsung Electronics Co.",
    revenue: "258,935,494,000,000",
    yoyGrowth: "14.33",
    cagr: "2.29",
    marketShare: "11.187",
  },
  {
    rank: 2,
    change: "stable",
    company: "LG Display Inc.",
    revenue: "84,227,765,000,000",
    yoyGrowth: "0.91",
    cagr: "6.19",
    marketShare: "3.639",
  },
  {
    rank: 3,
    change: "decrease",
    company: "Apple Inc.",
    revenue: "274,515,000,000",
    yoyGrowth: "-2.5",
    cagr: "4.1",
    marketShare: "6.5",
  },
  {
    rank: 4,
    change: "increase",
    company: "Intel Corporation",
    revenue: "77,867,000,000",
    yoyGrowth: "3.2",
    cagr: "2.3",
    marketShare: "2.9",
  },
  {
    rank: 5,
    change: "decrease",
    company: "Microsoft Corp.",
    revenue: "143,015,000,000",
    yoyGrowth: "-1.3",
    cagr: "7.2",
    marketShare: "5.7",
  },
];

function ChangeIcon({ change }) {
  switch (change) {
    case "increase":
      return <ArrowUpwardIcon style={{ color: "red" }} />;
    case "decrease":
      return <ArrowDownwardIcon style={{ color: "green" }} />;
    default:
      return <RemoveIcon style={{ color: "grey" }} />;
  }
}

function RevenueTable() {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ p: 2, fontWeight: "bolder" }}>
        Top 10 Countries per revenue in M$ FY 2023
      </Typography>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Rank</StyledTableCell>
            <StyledTableCell>Change in Rank</StyledTableCell>
            <StyledTableCell>Company Name</StyledTableCell>
            <StyledTableCell>Revenue (M USD)</StyledTableCell>
            <StyledTableCell>YOY Revenue Growth (%)</StyledTableCell>
            <StyledTableCell>CAGR Revenue Growth (%)</StyledTableCell>
            <StyledTableCell>Market Share (%)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.rank}>
              <StyledTableCell component="th" scope="row">
                {row.rank}
              </StyledTableCell>
              <StyledTableCell>
                <ChangeIcon change={row.change} />
              </StyledTableCell>
              <StyledTableCell>{row.company}</StyledTableCell>
              <StyledTableCell>{row.revenue}</StyledTableCell>
              <StyledTableCell>{row.yoyGrowth}</StyledTableCell>
              <StyledTableCell>{row.cagr}</StyledTableCell>
              <StyledTableCell>{row.marketShare}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RevenueTable;
