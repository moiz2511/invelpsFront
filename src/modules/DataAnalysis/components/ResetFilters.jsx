import { Button } from "@mui/material";
import React from "react";

const ResetFilters = ({ handleReset }) => {
  return (
    <Button variant="outlined" onClick={handleReset}>
      Reset Filters
    </Button>
  );
};

export default ResetFilters;
