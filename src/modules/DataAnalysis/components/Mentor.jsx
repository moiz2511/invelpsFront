import React from "react";
import {
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Autocomplete,
  TextField,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ColorConstants from "../../Core/constants/ColorConstants.json";
import { styled } from "@mui/material/styles";

const Mentor = ({ investorDetails, investorTableData }) => {
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

  console.log(investorDetails);
  console.log(investorTableData);

  const headCategories = [
    "Strategy",
    "Investing style",
    "Total Return",
    "Annualized Return",
    "Rolling Return",
    "Standard Deviation",
    "Max Drawdown",
    "Sharpe Ratio",
    "Sortino Ratio",
  ];

  function formatText(inputText) {
    // Split text by double line breaks to get paragraphs
    const paragraphs = inputText.split("\n\n");
    console.log(paragraphs);

    const cleanedArray = paragraphs
      .map((item) => {
        // let x = item.split("\n")[0];
        let y = item.trim().replace(/(\\n\\n|\\n)/g, "");

        // console.log(y);
        return y;
      })
      .filter(Boolean);

    console.log(cleanedArray);

    // Map each paragraph to a JSX element, further processing for bullet points
    const formattedText = cleanedArray.map((paragraph, index) => {
      if (paragraph.includes("**")) {
        // Split paragraph by '**' to identify bullet points
        const parts = paragraph.replace(/"/g, "").split("**").filter(Boolean); // Filter out empty strings
        console.log(parts);

        return (
          <ul key={index}>
            {parts.map((part, partIndex) =>
              part.endsWith(":") ? (
                <li
                  style={{ listStyleType: "none", marginTop: 12 }}
                  key={partIndex}
                >
                  <strong>{part}</strong>
                </li>
              ) : (
                <li key={partIndex}>{part}</li>
              )
            )}
          </ul>
        );
      } else {
        // Regular paragraph without bullet points
        return <text key={index}>{paragraph}</text>;
      }
    });

    return formattedText;
  }

  return (
    <div style={{ padding: 20, fontFamily: "Montserrat" }}>
      {investorDetails && (
        <div
          style={{
            border: "1px solid #aaa",
            height: "100%",
            padding: 20,
            borderRadius: 15,
            gap: 20,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              backgroundColor: "#F3F3F3",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              borderRadius: 15,
              gap: 8,
            }}
          >
            <text style={{ fontWeight: 600, fontSize: 20 }}>
              {investorDetails.investors}
            </text>
            <text>{investorDetails.description}</text>
          </div>
          <div
            style={{
              backgroundColor: "#F3F3F3",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              borderRadius: 15,
              gap: 8,
            }}
          >
            <text style={{ fontWeight: 600, fontSize: 20 }}>Background</text>
            <text>{investorDetails.background}</text>
          </div>
          <div
            style={{
              backgroundColor: "#F3F3F3",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              borderRadius: 15,
              gap: 8,
            }}
          >
            <text style={{ fontWeight: 600, fontSize: 20 }}>Philosophy</text>
            <text>{formatText(investorDetails.philosophy)}</text>
          </div>
          <div
            style={{
              backgroundColor: "#F3F3F3",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              borderRadius: 15,
              gap: 8,
              fontFamily: "Montserrat",
            }}
          >
            <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              options={investorTableData.map((option) => option.strategy_label)}
              sx={{
                width: "50%",
                fontFamily: "Montserrat",
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search input"
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
            />
            <TableContainer>
              <Table
                sx={{ minWidth: "100%", maxWidth: "100%", mt: 1 }}
                size="medium"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      padding="normal"
                      colSpan={2}
                      sx={{
                        backgroundColor: "#272727",
                        color: "white",
                        fontSize: 18,
                        fontFamily: "Montserrat",
                      }}
                    >
                      Strategy Models
                    </TableCell>
                    <TableCell
                      padding="normal"
                      colSpan={4}
                      align="center"
                      sx={{
                        backgroundColor: "#427878",
                        color: "white",
                        fontSize: 18,
                        fontFamily: "Montserrat",
                      }}
                    >
                      Return %
                    </TableCell>
                    <TableCell
                      padding="normal"
                      colSpan={2}
                      align="center"
                      sx={{
                        backgroundColor: "orange",
                        color: "white",
                        fontSize: 18,
                        fontFamily: "Montserrat",
                      }}
                    >
                      Risk %
                    </TableCell>
                    <TableCell
                      padding="normal"
                      colSpan={2}
                      align="center"
                      sx={{
                        backgroundColor: "blue",
                        color: "white",
                        fontSize: 18,
                        fontFamily: "Montserrat",
                      }}
                    >
                      Risk Adjusted Return %
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#e7ecef",
                      color: "#272727",
                      fontSize: 14,
                      fontFamily: "Montserrat",
                    }}
                  >
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      Investor
                    </TableCell>
                    {headCategories.map((category, index) => (
                      <TableCell
                        key={index}
                        padding="normal"
                        sx={{ fontFamily: "Montserrat" }}
                      >
                        {category}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {investorTableData.length > 0 &&
                    investorTableData.map((investor, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>
                          {investorDetails.investors}
                        </StyledTableCell>
                        <StyledTableCell>
                          {investor.strategy_label}
                        </StyledTableCell>
                        <StyledTableCell>
                          {investor.investing_style}
                        </StyledTableCell>
                        <StyledTableCell>10%</StyledTableCell>
                        <StyledTableCell>
                          {investor.annualized_return}
                        </StyledTableCell>
                        <StyledTableCell>
                          {investor.rolling_return}
                        </StyledTableCell>
                        <StyledTableCell>
                          {investor.stdev_return}
                        </StyledTableCell>
                        <StyledTableCell>
                          {investor.max_drawdown}
                        </StyledTableCell>
                        <StyledTableCell>
                          {investor.sharpe_ratio}
                        </StyledTableCell>
                        <StyledTableCell>
                          {investor.sortino_ratio}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div
            style={{
              backgroundColor: "#F3F3F3",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              borderRadius: 15,
              gap: 8,
            }}
          >
            <text style={{ fontWeight: 600, fontSize: 20 }}>
              Contribution and Legacy
            </text>
            <text>{investorDetails.contributions_and_legacy}</text>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentor;
