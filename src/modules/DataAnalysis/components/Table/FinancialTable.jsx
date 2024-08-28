import React, { useState } from "react";
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
  IconButton,
  Collapse,
  styled,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  AddCircleOutlineOutlined,
  RemoveCircleOutline,
  ArrowDropUp,
  ArrowDropDown,
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
  BarChartOutlined,GraphicEqOutlined
} from "@mui/icons-material";
import tableCellClasses from "@mui/material/TableCell/tableCellClasses";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#FAFAFC",
    color: theme.palette.common.black,
    padding: 12,
    border: `1px solid ${theme.palette.divider}`,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 12,
    
   
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

const TrendIcon = ({ value }) => {
  if (value > 0) {
    return (
      <ArrowUpwardOutlined
        style={{ color: "green", background: "#DEF2E8", borderRadius: 15 , padding:2 }}
      />
    );
  } else if (value < 0) {
    return (
      <ArrowDownwardOutlined
        style={{
          color: "red",
          borderRadius: 15,
          padding: 2,
          background: "#FDE6E7",
        }}
      />
    );
  } else {
    return <Box style={{ width: 24, height: 24 }} />; // Empty space for no change
  }
};

const data = [
  {
    metric: "Revenues",
    values: [1178353, 705113, 1040108],
    trend: 0,
    children: [
      {
        metric: "Total Revenues",
        values: [289730, 90123, 45148],
        trend: 1,
      },
      {
        metric: "Pensions",
        values: [9252.32, 60964.4, 40952.52],
        trend: -1,
      },
      {
        metric: "Insurance Dividends Premiums",
        values: [0, 0, 0],
        trend: 0,
      },
      {
        metric: "Other Revenues",
        values: [5910.0, 4992.46, 4762.23],
        trend: 1,
      },
      {
        metric: "YoY Growth %",
        values: [0.06, 2891.47, 0.08],
        trend: 1,
      },
    ],
  },
  {
    metric: "Cost & Expenses",
    values: [987654, 123456, 234567],
    trend: 0,
    children: [
      {
        metric: "Cost of Revenues",
        values: [287000, 90000, 45000],
        trend: -1,
      },
      {
        metric: "Gross Profit Loss",
        values: [9500.32, 60000.4, 40000.52],
        trend: 1,
      },
      {
        metric: "Selling General & Admin Expenses",
        values: [287000, 90000, 45000],
        trend: 0,
      },
      {
        metric: "R&D Expenses",
        values: [9500.32, 60000.4, 40000.52],
        trend: 1,
      },
      {
        metric: "Depreciation & Amortization",
        values: [500, 800, 100],
        trend: -1,
      },
      {
        metric: "Other operating expenses",
        values: [200, 300, 100],
        trend: 0,
      },
    ],
  },
  {
    metric: "Net Results",
    values: [1111111, 222222, 333333],
    trend: 0,
    children: [
      {
        metric: "Operating Income",
        values: [895.66, 805.87, -800.08],
        trend: -1,
      },
      {
        metric: "Net Interest Expense",
        values: [1111111, 222222, 333333],
        trend: 1,
      },
      {
        metric: "Interest & Investment Income",
        values: [100, 200, 300],
        trend: 1,
      },
    ],
  },
];


const Row = ({ row }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell component="th" scope="row">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <RemoveCircleOutline /> : <AddCircleOutlineOutlined />}
          </IconButton>
          {row.metric}
        </StyledTableCell>
        <StyledTableCell align="right">
          <TrendIcon value={row.trend} />
        </StyledTableCell>
        {row.values.map((value, index) => (
          <StyledTableCell align="center" key={index}>
            {value}
          </StyledTableCell>
        ))}
      </StyledTableRow>
      <TableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 , padding:0 }}
          colSpan={5} // Span all columns
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin:0}}>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {row.children.map((childRow) => (
                    <StyledTableRow key={childRow.metric}>
                      <StyledTableCell width={463} align="left" >
                      <BarChartOutlined sx={{color:'green'}}/>  {childRow.metric}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <TrendIcon value={childRow.trend} />
                      </StyledTableCell>
                      {childRow.values.map((value, index) => (
                        <StyledTableCell align="center" key={index}>
                          {value}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
};

const FinancialTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 750 }} aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Metrics</StyledTableCell>
            <StyledTableCell align="center">Trend</StyledTableCell>
            <StyledTableCell align="center">2021 ($)</StyledTableCell>
            <StyledTableCell align="center">2022 ($)</StyledTableCell>
            <StyledTableCell align="center">2023 ($)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row key={row.metric} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FinancialTable;
