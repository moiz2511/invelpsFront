
import React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

const ErrorCard = ({ textToDisplay }) => {
    return (<Box
        sx={{
            margin: 'auto'
        }}
    >
        <Box sx={{
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Card elevation={12}>
                <CardContent>
                    <Typography  gutterBottom variant="h6" component="div">
                        {textToDisplay}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    </Box>
    );
};

export default ErrorCard;