import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  styled,
  Box,
  LinearProgress,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ColorConstants from '../../../../Core/constants/ColorConstants.json'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.875rem", // 14px
  fontWeight: 500,
  padding: theme.spacing(1),
  color: theme.palette.text.primary,
  border: "none",
  borderBottom: "1px solid #e0e0e0",
}));

const StyledTableHeadCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  backgroundColor:ColorConstants.APP_TABLE_HEAD_COLOR
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const TrendIcon = ({ trend }) => {
  switch (trend) {
    case "up":
      return (
        <ArrowUpwardIcon
          style={{ color: "green", background: "#DEF2E8", borderRadius: "20px",padding:5 }}
        />
      );
    case "down":
      return (
        <ArrowDownwardIcon
          style={{
            color: "red",
            borderRadius: "20px",
            padding: 5,
            background: "#FDE6E7",
          }}
        />
      );
    default:
      return (
        <ArrowDownwardIcon
          style={{
            color: "#FAC73D",
            borderRadius: "20px",
            padding: 5,
            background: "#FEF6DE",
            transform: "rotate(-90deg)",
          }}
        />
      );
  }
};
const GreenLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: "10px",
  borderRadius: "5px",
  backgroundColor: "#E0E0E0",
  "& .MuiLinearProgress-barColorPrimary": {
    backgroundColor: "#4CAF50", // Change this to any green color you prefer,
  },
}));

const GrowthTable = ({ data }) => {
  return (
    <Paper elevation={1} style={{ padding: "16px", borderRadius: "8px" }}>
      <Box
        display={"grid"}
        gridTemplateColumns={"1fr 1fr"}
        alignItems={"center"}
      >
        <Typography
          variant="h6"
          style={{ fontWeight: 600, marginBottom: "12px" }}
        >
          Growth
        </Typography>
        <Box
          display={"grid"}
          gridTemplateColumns={"1fr 11fr"}
          gap={3}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography>75%</Typography>
          <GreenLinearProgress
            variant="determinate"
            value={75}
            style={{
              height: "10px",
              borderRadius: "5px",
              backgroundColor: (theme) => theme.palette.grey[300],
            }}
          />
        </Box>
      </Box>

      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableHeadCell sx={{ fontSize: 13 }}>
             
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{ fontSize: 13 }}>
              TREND
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{ fontSize: 13 }}>
              HISTORICAL AVG
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{ fontSize: 13 }}>
              INDUSTRY AVG
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{ fontSize: 13 }}>
              TARGET
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{ fontSize: 13 }}>
              SCORE
            </StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {row.metric}
              </StyledTableCell>
              <StyledTableCell align="center">
                <TrendIcon trend={row.trend} />
              </StyledTableCell>
              <StyledTableCell>{row.historicalAvg}</StyledTableCell>
              <StyledTableCell>{row.industryAvg}</StyledTableCell>
              <StyledTableCell>{row.target}</StyledTableCell>
              <StyledTableCell>{row.score}% </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default GrowthTable;
