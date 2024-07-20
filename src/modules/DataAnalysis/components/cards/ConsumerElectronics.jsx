import React from "react";
import { Typography, Box } from "@mui/material";

function ConsumerCard({ heading, value }) {
  // Function to extract the first number found in a string and check if it is greater than 1
  const getColor = (valueString) => {
    const numbers = valueString.match(/-?\d*\.?\d+/); // Regex to find numbers, including decimals and negatives
    if (!numbers) return "black"; // Return default color if no numbers found

    const number = parseFloat(numbers[0]); // Convert the first found number to a float
    return number > 1 ? "green" : number < 1 ? "red" : "black"; // Conditional color based on number
  };

  return (
    <Box sx={{ margin: 1, textAlign: "left" }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "gray" }}
      >
        {heading}
      </Typography>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bolder", color: getColor(value) }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// ConsumerElectronics component definition
function ConsumerElectronics() {
  return (
    <Box
      sx={{
        padding: 2,
    
     
      }}
    >
      <Typography variant="h5" fontWeight="bolder" sx={{ marginBottom: 2 }}>
        Consumer Electronics
      </Typography>
      <Box sx={{display:'grid' , gridTemplateColumns:'1fr 1fr'}}>
        <ConsumerCard heading="GLOBAL SIZE BY REVENUE" value="5M USD 20%" />
        <ConsumerCard heading="YEAR OVER YEAR REVENUE GROWTH" value="-14.01%" />
        <ConsumerCard heading="CONCENTRATION" value="HIGH" />
        <ConsumerCard heading="Compounded Annual GROWTH RATE" value="2.35%" />
     
      </Box>
    </Box>
  );
}

export default ConsumerElectronics;
