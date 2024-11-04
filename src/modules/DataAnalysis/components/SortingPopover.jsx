import React, { useState } from "react";
import {
  Button,
  Popover,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
} from "@mui/material";
import { RiArrowUpDownLine } from "react-icons/ri";

const SortingPopover = ({
  setCompanySortBy,
  setCompanyOrderBy,
  companySortBy,
  companyOrderBy,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  console.log(companySortBy);
  console.log(companyOrderBy);

  const toggleSortingPopover = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (event) => {
    setCompanySortBy(event.target.value);
  };

  const handleOrderChange = (event) => {
    setCompanyOrderBy(event.target.value);
  };

  const open = Boolean(anchorEl); // Open popover if anchorEl is not null
  const id = open ? "sorting-popover" : undefined;

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<RiArrowUpDownLine />}
        onClick={toggleSortingPopover}
      >
        Sorting
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          marginTop: {
            "2xl": "30px",
            "3xl": "50px",
          },
        }}
      >
        <FormControl component="fieldset" style={{ padding: "16px" }}>
          <FormLabel component="legend">Sort Options</FormLabel>
          <RadioGroup
            value={companySortBy}
            onChange={handleSortChange}
            style={{ marginBottom: "16px" }}
          >
            <FormControlLabel
              value="company_name"
              control={<Radio />}
              label="Company Name"
            />
            <FormControlLabel
              value="symbol"
              control={<Radio />}
              label="Symbol"
            />
            <FormControlLabel
              value="exchange"
              control={<Radio />}
              label="Exchange"
            />
            <FormControlLabel
              value="sector"
              control={<Radio />}
              label="Sector"
            />
            <FormControlLabel
              value="industry"
              control={<Radio />}
              label="Industry"
            />
            <FormControlLabel
              value="total_return"
              control={<Radio />}
              label="Total Return"
            />
            <FormControlLabel
              value="annualized_return"
              control={<Radio />}
              label="Annualized Return"
            />
            <FormControlLabel
              value="rolling_return"
              control={<Radio />}
              label="Rolling Return"
            />
            <FormControlLabel
              value="standard_deviation"
              control={<Radio />}
              label="Standard Deviation"
            />
            <FormControlLabel
              value="max_drawdown"
              control={<Radio />}
              label="Max Drawdown"
            />
          </RadioGroup>

          <FormLabel component="legend">Order</FormLabel>
          <RadioGroup value={companyOrderBy} onChange={handleOrderChange}>
            <FormControlLabel
              value="asc"
              control={<Radio />}
              label="Ascending"
            />
            <FormControlLabel
              value="des"
              control={<Radio />}
              label="Descending"
            />
          </RadioGroup>
        </FormControl>
      </Popover>
    </>
  );
};

export default SortingPopover;
