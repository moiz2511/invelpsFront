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

const OverviewSortingPopover = ({
  setSSortBy,
  setSOrderBy,
  sSortBy,
  sOrderBy,
  setIsSort,
}) => {
  console.log(sSortBy);
  console.log(sOrderBy);

  const [anchorEl, setAnchorEl] = useState(null);

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
    setSSortBy(event.target.value);
    setIsSort(false);
  };

  const handleOrderChange = (event) => {
    setSOrderBy(event.target.value);
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
            value={sSortBy}
            onChange={handleSortChange}
            style={{ marginBottom: "16px" }}
          >
            <FormControlLabel
              value="total_return"
              control={<Radio />}
              label="Total Return (%)"
            />
            <FormControlLabel
              value="annualized_return"
              control={<Radio />}
              label="Annualized Return (%)"
            />
            <FormControlLabel
              value="rolling_return"
              control={<Radio />}
              label="Rolling Return (%)"
            />
            <FormControlLabel
              value="standard_deviation"
              control={<Radio />}
              label="Standard Deviation (%)"
            />
            <FormControlLabel
              value="max_drawdown"
              control={<Radio />}
              label="Max Drawdown (%)"
            />
            <FormControlLabel
              value="sharpe_ratio"
              control={<Radio />}
              label="Sharpe Ratio"
            />
            <FormControlLabel
              value="sortino_ratio"
              control={<Radio />}
              label="Sortino Ratio"
            />
          </RadioGroup>

          <FormLabel component="legend">Order</FormLabel>
          <RadioGroup value={sOrderBy} onChange={handleOrderChange}>
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

export default OverviewSortingPopover;
