import { Card, Box, Typography } from "@mui/material";
import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

function MeterChart() {
  return (
    <Card
      sx={{
        height: 283,
        padding: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center", // Center horizontally in the card
        boxShadow: 2, // Use the theme's default shadow
      }}
    >
      <Typography variant="subtitle1" component="div" fontWeight="bold">
        Fair Value: $274.06
      </Typography>

      <Box
        sx={{
          width: 1, // 100% width
          height: 270, // Fixed height to maintain aspect ratio
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginY: 2, // Margin top and bottom for spacing
        }}
      >
        <ReactSpeedometer
          width={260} // Reduced width
          height={160} // Reduced height
          maxValue={100}
          value={72.12}
          needleColor="black"
          startColor="#EA4228"
          endColor="#5BE12C"
          segments={5}
          segmentColors={[
            "#EA4228",
            "#F9C802",
            "#F7E700",
            "#A8E05F",
            "#5BE12C",
          ]}
          needleHeightRatio={0.7}
          ringWidth={15} // Adjusted ring width to match the reduced size
          needleTransitionDuration={3333}
          needleTransition="easeElastic"
          currentValueText="Margin of Safety: 72.12%"
          customSegmentStops={[0, 20, 40, 60, 80, 100]}
          customSegmentLabels={[
            {
              text: "",
              position: "INSIDE",
              color: "#333",
            },
            {
              text: "",
              position: "INSIDE",
              color: "#333",
            },
            {
              text: "",
              position: "INSIDE",
              color: "#333",
            },
            {
              text: "",
              position: "INSIDE",
              color: "#333",
            },
            {
              text: "",
              position: "INSIDE",
              color: "#333",
            },
          ]}
        />
      </Box>
    </Card>
  );
}

export default MeterChart;
