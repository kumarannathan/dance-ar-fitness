import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const CreateDance = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Dance
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        <Paper sx={{ p: 2, minHeight: 400 }}>
          <Typography>Camera Preview Placeholder</Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography>Dance Details Placeholder</Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateDance; 