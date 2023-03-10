import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
// import CustomizedTableHead from './TableHeadComponent';
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Constants from "../../../Constants.json";
import { MenuItem, TableHead, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import BigBoxTooltip from "../../DataAnalysis/components/Tooltip";
// import { useNavigate } from 'react-router';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#CB6843",
    color: theme.palette.common.white,
    padding: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 12,
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

function CustomizedTable(props) {
  // const navigate = useNavigate();
  console.log(props);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const navigateToPageOnClick = (data) => {
    if (data.page === "profile") {
      window.open(
        Constants.APP_BASE_URL +
          "/dataanalysis/profile?company=" +
          encodeURIComponent(data.company_name) +
          "&exchange=" +
          encodeURIComponent(data.exchange),
        "_blank",
        "noopener,noreferrer"
      );
    } else if (data.page === "financials") {
      window.open(
        Constants.APP_BASE_URL +
          "/dataanalysis/financials?company=" +
          encodeURIComponent(data.company_name) +
          "&exchange=" +
          encodeURIComponent(data.exchange),
        "_blank",
        "noopener,noreferrer"
      );
    } else if (data.page === "keymetricsttm") {
      window.open(
        Constants.APP_BASE_URL +
          "/dataanalysis/keymetrics?company=" +
          encodeURIComponent(data.company_name) +
          "&exchange=" +
          encodeURIComponent(data.exchange),
        "_blank",
        "noopener,noreferrer"
      );
    } else if (data.page === "marketData") {
      window.open(
        Constants.APP_BASE_URL +
          "/dataanalysis/marketdata?company=" +
          encodeURIComponent(data.company_name) +
          "&exchange=" +
          encodeURIComponent(data.exchange),
        "_blank",
        "noopener,noreferrer"
      );
    } else if (data.page === "deepanalysis") {
      let style = props.data.style
        ? "&style=" + encodeURIComponent(props.data.style)
        : "";
      let mentor = props.data.mentor
        ? "&mentor=" + encodeURIComponent(props.data.mentor)
        : "";
      let screenModel = props.data.screenModel
        ? "&screenModel=" + encodeURIComponent(props.data.screenModel)
        : "";
      window.open(
        Constants.APP_BASE_URL +
          "/context/analysismodel?company=" +
          encodeURIComponent(data.company_name) +
          "&exchange=" +
          encodeURIComponent(data.exchange) +
          style +
          mentor +
          screenModel,
        "_blank",
        "noopener,noreferrer"
      );
    } else if (data.page === "display") {
      let tool = data.tool ? "&tool=" + encodeURIComponent(data.tool) : "";
      let measure = data.measure
        ? "&measure=" + encodeURIComponent(data.measure)
        : "";
      let category = data.category
        ? "&category=" + encodeURIComponent(data.category)
        : "";
      let from = data.model_from
        ? "&from=" + encodeURIComponent(getTextToYeaaNotation(data.model_from))
        : "";
      let to = data.model_to
        ? "&to=" + encodeURIComponent(getTextToYeaaNotation(data.model_to))
        : "";
      let range = data.range ? "&range=" + encodeURIComponent(data.range) : "";
      window.open(
        Constants.APP_BASE_URL +
          "/dataanalysis/fundamentalchart?company=" +
          encodeURIComponent(props.company.value) +
          "&exchange=" +
          encodeURIComponent(data.exchange) +
          tool +
          measure +
          category +
          from +
          to +
          range,
        "_blank",
        "noopener,noreferrer"
      );
    } else if (data.page === "investingStyleLink") {
      window.open(data.video_url, "_blank", "noopener,noreferrer");
    }
  };

  const getTextToYeaaNotation = (input) => {
    if (input.toLowerCase().trim().startsWith("current y")) {
      let res = parseInt(
        input.toLowerCase().replace("current y", "").replace("-", "").trim()
      );
      const d = new Date();
      return d.getFullYear() - res;
    }
  };

  const OnColumnLinkClick = (event) => {
    const data = JSON.parse(event.target.value);
    navigateToPageOnClick(data);
  };

  const CustomSelectField = (props) => {
    let row = props.row;
    let item = props.item;
    const [selectedDropDownValue, setSelectedDropDownValue] = useState("");
    const handleOnChangeEvent = (event) => {
      setSelectedDropDownValue(event.target.value);
      row.page = event.target.value;
      navigateToPageOnClick(row);
    };
    return (
      <TextField
        select
        label={item.label}
        // value={JSON.stringify(row)}
        // select
        id={row.id + item.id}
        variant="standard"
        onChange={handleOnChangeEvent}
        value={selectedDropDownValue}
        margin="none"
        SelectProps={{ margin: "none" }}
        // sx={{margin: 0, padding: 0}}
      >
        {item.dropDownValues.map((dropDown) => {
          return (
            <MenuItem key={dropDown.id} value={dropDown.id}>
              {dropDown.label}
            </MenuItem>
          );
        })}
      </TextField>
    );
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - props.tableRows.length)
      : 0;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(props.headCells.data[0].id);
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  let tableData = props.enableSorting
    ? stableSort(props.tableRows, getComparator(order, orderBy))
    : props.tableRows;

  if (!props?.disablePagination) {
    tableData = tableData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* <Paper sx={{ width: '100%', mb: 2 }}> */}
      <TableContainer>
        <Table
          sx={{ minWidth: "100%", mt: 1 }}
          aria-labelledby="tableTitle"
          size="medium"
        >
          {/* <CustomizedTableHead HeadCells={props.headCells.data} /> */}

          <TableHead>
            <TableRow>
              {props.headCells.data.map((headCell) => (
                <StyledTableCell
                  key={headCell.id}
                  padding="normal"
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {props.enableSorting && !headCell.isDropDown && (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={createSortHandler(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  )}
                  {(!props.enableSorting || headCell.isDropDown) &&
                    headCell.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => {
              // const labelId = `enhanced-table-checkbox-${index}`;
              // let actions = props.headCells.actions ? true : false;
              return (
                <StyledTableRow hover tabIndex={-1} key={index} sx={{ ml: 3 }}>
                  {props.headCells.data.map((item) => {
                    row.page = item.id;
                    return (
                      <StyledTableCell
                        key={item.id + row.id}
                        padding="normal"
                        sx={{
                          "& .MuiTextField-root": {
                            minWidth: "20ch",
                          },
                        }}
                      >
                        {/* {console.log(item)} */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {!item.isValueLink && row[item.id]}{" "}
                          {props.showTool == 1 && item.id == "field" ? (
                            <BigBoxTooltip
                              item={item}
                              row={row}
                              keyMatric={true}
                            />
                          ) : props.showTool == 0 && item.id == "metric" ? (
                            <BigBoxTooltip
                              item={item}
                              keyMatric={false}
                              row={row.details[0]}
                            />
                          ) : (
                            ""
                          )}
                        </Box>

                        {/* { console.log("x",item.id)} */}
                        {item.isValueLink && (
                          <Button
                            size="small"
                            onClick={OnColumnLinkClick}
                            value={JSON.stringify(row)}
                          >
                            {"heere"}
                            {item.label}
                          </Button>
                        )}
                        {item.isDropDown && (
                          // <TextField
                          //     select
                          //     label={item.label}
                          //     value={JSON.stringify(row)}
                          //     select
                          //     id={row.id + item.id}
                          //     variant="standard"
                          //     onChange={(event) => setSelectedDropDownValue(event.target.value)}
                          //     value={selectedDropDownValue}
                          // // value=""
                          // >
                          //     {item.dropDownValues.map((dropDown) => {
                          //         console.log(dropDown);
                          //         return (
                          //             <MenuItem value={dropDown.id} onClick={(event) => { dropDownSelectedValue = event.target.value; console.log(dropDownSelectedValue) }}>
                          //                 {dropDown.label}
                          //             </MenuItem>
                          //         );
                          //     })}
                          // </TextField>
                          <CustomSelectField row={row} item={item} />
                        )}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!props?.disablePagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={props.tableRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
      {/* </Paper> */}
    </Box>
  );
}

CustomizedTable.defaultProps = {
  enableSorting: true,
};

export default CustomizedTable;
