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
  setSortOption,
  setSortOrder,
  sortOption,
  sortOrder,
}) => {
  console.log(sortOption);
  console.log(sortOrder);

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
    setSortOption(event.target.value);
  };

  const handleOrderChange = (event) => {
    setSortOrder(event.target.value);
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
            value={sortOption}
            onChange={handleSortChange}
            style={{ marginBottom: "16px" }}
          >
            {/* <FormControlLabel
              value="name"
              control={<Radio />}
              label="Strategy"
            /> */}
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
          <RadioGroup value={sortOrder} onChange={handleOrderChange}>
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
