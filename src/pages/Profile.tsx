import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const Profile = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography>Total Workouts</Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography>Total Time</Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography>Achievements</Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography>Favorite Dances</Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 