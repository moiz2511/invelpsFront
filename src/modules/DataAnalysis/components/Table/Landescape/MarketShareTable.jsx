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
  styled,
  IconButton,
} from "@mui/material";

import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

// Define custom TableCell styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.text.primary,
  padding: theme.spacing(1),
}));

const StyledMarketShareCell = styled(TableCell)(({ value }) => ({
  color: value.startsWith("-") ? "red" : "green",
  fontWeight: "bold",
}));

const data = [
  {
    peer: "Samsung Electronic Co.",
    marketShare: "2.88%, 14.39%",
    range: 1,
    yoyDirection: "right",
  },
  {
    peer: "LG Electronics Inc.",
    marketShare: "0.94%, 0.91%",
    range: 2,
    yoyDirection: "right",
  },
  {
    peer: "LG Display Co.",
    marketShare: "0.24%, 18.43%",
    range: 3,
    yoyDirection: "right",
  },
  {
    peer: "Sony group Corporation",
    marketShare: "0.13%, 16.31%",
    range: 4,
    yoyDirection: "right",
  },
  {
    peer: "LG Group",
    marketShare: "0.07%, -8.90%",
    range: 5,
    yoyDirection: "right",
  },
  {
    peer: "JVCKENWOOD Corporation",
    marketShare: "0.00%, 14.56%",
    range: 10,
    yoyDirection: "right",
  },
  {
    peer: "JVCKENWOOD Corporation",
    marketShare: "0.00%, 14.56%",
    range: 10,
    yoyDirection: "right",
  },
  {
    peer: "JVCKENWOOD Corporation",
    marketShare: "0.00%, 14.56%",
    range: 10,
    yoyDirection: "right",
  },
];

function MarketShareTable() {
  return (
    <Paper sx={{ overflowX: "auto"  }}>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Peers</StyledTableCell>
              <StyledTableCell>LY Market Share</StyledTableCell>
              <StyledTableCell>Range</StyledTableCell>
              <StyledTableCell>YOY</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <StyledTableCell>{row.peer}</StyledTableCell>
                <StyledMarketShareCell value={row.marketShare.split(",")[1]}>
                  {row.marketShare}
                </StyledMarketShareCell>
                <StyledTableCell>{row.range}</StyledTableCell>
                <StyledTableCell>
                  <IconButton>
                    <ArrowForwardOutlinedIcon color="primary" />
                  </IconButton>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default MarketShareTable;
