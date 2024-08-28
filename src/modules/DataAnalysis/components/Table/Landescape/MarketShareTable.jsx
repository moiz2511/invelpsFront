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
import ColorConstants from '../../../../Core/constants/ColorConstants.json'
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

// Define custom TableCell styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.text.primary,
  padding: theme.spacing(1),
}));

const StyledMarketShareCell = styled(TableCell)(({ value }) => ({
  // color: value.startsWith("-") ? "red" : "green",
  fontWeight: "light",
}));
const MarketShareCell = ({ value }) => {
  const [firstValue, secondValue] = value.split(", ");

  return (
    <StyledMarketShareCell>
      <span style={{ color: "black" }}>{firstValue}</span>,{" "}
      <span style={{ color: "red" }}>{secondValue}</span>
    </StyledMarketShareCell>
  );
};

const StyledTableHeadCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  backgroundColor: ColorConstants.APP_TABLE_HEAD_COLOR,
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
    <Paper sx={{ overflowX: "auto" }}>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Peers</StyledTableHeadCell>
              <StyledTableHeadCell>LY Market Share</StyledTableHeadCell>
              <StyledTableHeadCell>Range</StyledTableHeadCell>
              <StyledTableHeadCell>YOY</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <StyledTableCell>{row.peer}</StyledTableCell>
                <MarketShareCell value={row.marketShare} />
                <StyledTableCell>{row.range}</StyledTableCell>
                <StyledTableCell>
                  <IconButton>
                    <ArrowForwardOutlinedIcon
                      color="primary"
                      sx={{
                        background: "#E5F8FE",
                        padding: "5px",
                        borderRadius: "20px",
                      }}
                    />
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
