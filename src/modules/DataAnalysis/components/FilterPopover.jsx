import React, { useEffect, useState } from "react";
import {
  Box,
  Popover,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

const FilterPopover = ({
  openFilter,
  setOpenFilter,
  anchorEl,
  title,
  items,
  selectedItems,
  setSelectedItems,
  graphTableDataCopy,
  companySortBy,
  isLoading,
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

  console.log(items);
  console.log(selectedItems);
  console.log(companySortBy);

  // console.log(graphTableDataCopy);
  // console.log(copyGraphData);
  // console.log(uniqueValues);
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
          {isLoading ? (
            <>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <CircularProgress />
              </Box>
            </>
          ) : (
            <>
              {items?.map((item, index) => (
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
            </>
          )}

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
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default FilterPopover;

// const getUniqueExchanges = (data, items) => {
//   return [
//     ...new Set(
//       data
//         ?.map((item) => item[companySortBy])
//         .filter((value) => items?.includes(value))
//     ),
//   ];
// };

// useEffect(() => {
//   if (graphTableDataCopy?.length > 0) {
//     setCopyGraphData([...graphTableDataCopy]);
//   }
// }, [graphTableDataCopy]);

// useEffect(() => {
//   if (copyGraphData?.length > 0) {
//     const uniqueExchanges = getUniqueExchanges(copyGraphData, items);
//     setUniqueValues(uniqueExchanges);
//   }
// }, [copyGraphData, items, companySortBy]);

// const getUniqueExchanges = (graphTableDataCopy, items) => {
//   setCopyGraphData(graphTableDataCopy);
//   const data = [
//     ...new Set(
//       copyGraphData
//         ?.map((item) => item[companySortBy])
//         .filter((value) => items.includes(value))
//     ),
//   ];
//   return data;
// };

// useEffect(() => {
//   const uniqueExchanges = getUniqueExchanges(copyGraphData, items);
//   setUniqueValues(uniqueExchanges);
// }, [copyGraphData, items, companySortBy]);

// const handleToggle = (item) => {
//   const currentIndex = selectedItems.indexOf(item);
//   const newSelectedItems = [...selectedItems];

//   if (currentIndex === -1) {
//     newSelectedItems.push(item);
//   } else {
//     newSelectedItems.splice(currentIndex, 1);
//   }

//   setSelectedItems(newSelectedItems);
// };
