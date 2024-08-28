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
} from "@mui/material";

// Example data setup
const rankingsData = [
  {
    rank: 1,
    data: {
      2018: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2019: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2020: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2021: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2022: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2023: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
    },
  },
  {
    rank: 2,
    data: {
      2018: {
        company: "International Business Machines Corporation",
        marketShare: "15.37%",
      },
      2019: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2020: {
        company: "International Business Machines Corporation",
        marketShare: "25.37%",
      },
      2021: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2022: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2023: {
        company: "International Business Machines Corporation",
        marketShare: "15.37%",
      },
    },
  },
  {
    rank: 3,
    data: {
      2018: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2019: {
        company: "International Business Machines Corporation",
        marketShare: "15.37%",
      },
      2020: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2021: {
        company: "International Business Machines Corporation",
        marketShare: "15.37%",
      },
      2022: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2023: {
        company: "International Business Machines Corporation",
        marketShare: "15.37%",
      },
    },
  },
  {
    rank: 4,
    data: {
      2018: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2019: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2020: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2021: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2022: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2023: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
    },
  },
  {
    rank: 5,
    data: {
      2018: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2019: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2020: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2021: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2022: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2023: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
    },
  },
  {
    rank: 6,
    data: {
      2018: {
        company: "International Business Machines Corporation",
        marketShare: "15.37%",
      },
      2019: {
        company: "International Business Machines Corporation",
        marketShare: "30.37%",
      },
      2020: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2021: {
        company: "International Business Machines Corporation",
        marketShare: "15.37%",
      },
      2022: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2023: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
    },
  },
  {
    rank: 7,
    data: {
      2018: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2019: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2020: {
        company: "International Business Machines Corporation",
        marketShare: "30.37%",
      },
      2021: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2022: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
      2023: {
        company: "International Business Machines Corporation",
        marketShare: "35.37%",
      },
    },
  },
];


const getColor = (marketShare) => {
  const share = parseFloat(marketShare);
  if (share > 35) return "#4CAF50"; // Green
  if (share > 30) return "#E7713B"; // Yellow
  return "#F44336"; // Red
};

function MarketShareTable() {
  return (
    <Box sx={{ overflowX: "auto" }}>
        <Typography fontWeight={'bolder'} padding={4}>Market Share Evaluation</Typography>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="market share table">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              {Object.keys(rankingsData[0].data).map((year) => (
                <TableCell key={year} align="center">
                  {year}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rankingsData.map((row) => (
              <TableRow key={row.rank}>
                <TableCell component="th" scope="row">
                  {row.rank}
                </TableCell>
                {Object.entries(row.data).map(
                  ([year, { company, marketShare }]) => (
                    <TableCell
                      key={year}
                      align="center"
                      sx={{
                        backgroundColor: getColor(marketShare),
                        color: "#fff",
                      }}
                    >
                      {company}
                      <br />
                      {marketShare}
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MarketShareTable;
