import { Box, Typography, Card } from '@mui/material';
import React from 'react';

function Description() {
  return (
    <Card sx={{
    height:300,
      padding: 2,

     
    }}>
      <Typography variant='h5' component="h2" fontWeight='bold' sx={{ marginBottom: 2 }}>
        Description
      </Typography>
      <Typography variant='body1' sx={{ 
        textAlign: 'justify', // Improves readability
        textJustify: 'inter-word' // Ensures proper justification
      }}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti in quibusdam dicta adipisci magni odio, minus minima labore aliquid? Voluptas itaque perspiciatis atque voluptatem repellendus fugit nam laboriosam doloribus similique.
      </Typography>
    </Card>
  );
}

export default Description;
