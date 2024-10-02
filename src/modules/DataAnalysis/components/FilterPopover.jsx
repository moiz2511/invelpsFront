import React, { useState } from "react";
import {
  Box,
  Popover,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const FilterPopover = ({
  openFilter,
  setOpenFilter,
  anchorEl,
  title,
  items,
  selectedItems,
  setSelectedItems,
}) => {
  const handleToggle = (item) => {
    const currentIndex = selectedItems.indexOf(item);
    const newSelectedItems = [...selectedItems];

    if (currentIndex === -1) {
      newSelectedItems.push(item);
    } else {
      newSelectedItems.splice(currentIndex, 1);
    }

    setSelectedItems(newSelectedItems);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Popover
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          {items.map((item, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedItems.indexOf(item) !== -1}
                  onChange={() => handleToggle(item)}
                  color="success" // Green checkbox
                />
              }
              label={item}
            />
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Button
              onClick={() => setOpenFilter(false)}
              sx={{ color: "black" }}
            >
              Close
            </Button>
            {/* <Button
              variant="contained"
              color="success" // Green filter button
              onClick={() => {
                console.log(selectedItems);
              }}
            >
              Filter
            </Button> */}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default FilterPopover;
