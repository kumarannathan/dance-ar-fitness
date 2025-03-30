import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const MotionBox = motion(Box);

// Mock data - would be replaced with actual user data
const userStats = {
  totalWorkouts: 25,
  totalTime: '12h 30m',
  achievements: 8,
  favoriteDances: 5,
};

const recentDances = [
  {
    id: 1,
    name: 'Hip Hop Basics',
    duration: '15m',
    date: '2024-03-15',
    style: 'Hip Hop',
  },
  {
    id: 2,
    name: 'Ballet Flow',
    duration: '20m',
    date: '2024-03-14',
    style: 'Ballet',
  },
  {
    id: 3,
    name: 'Zumba Energy',
    duration: '30m',
    date: '2024-03-13',
    style: 'Zumba',
  },
];

const Profile = () => {
  const theme = useTheme();

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