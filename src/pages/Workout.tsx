import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const Workout = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Workout
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
        <Paper sx={{ p: 2, minHeight: 400 }}>
          <Typography>AR View Placeholder</Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography>Controls and Stats Placeholder</Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Workout; 