import React, { useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

const FilterModal = ({
  openFilter,
  setOpenFilter,
  title,
  items,
  selectedItems,
  setSelectedItems,
  isLoading,
  companySortBy,
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

  useEffect(() => {
    setSelectedItems([]);
  }, [companySortBy]);

  return (
    <Modal
      open={openFilter}
      onClose={() => setOpenFilter(false)}
      aria-labelledby="filter-modal-title"
      aria-describedby="filter-modal-description"
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          width: 500,
          minHeight: "auto",
          maxHeight: 500,
          bgcolor: "background.paper",
          border: "1px solid black",
          p: 3,
          borderRadius: 2,
          overflowY: "auto",
        }}
      >
        <Typography id="filter-modal-title" variant="h6" fontWeight="bold">
          {title}
        </Typography>

        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {items?.map((item, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedItems.indexOf(item) !== -1}
                    onChange={() => handleToggle(item)}
                    color="success"
                  />
                }
                label={item}
              />
            ))}
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Button onClick={() => setOpenFilter(false)} sx={{ color: "black" }}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterModal;
