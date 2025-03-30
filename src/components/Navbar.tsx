import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CreateIcon from '@mui/icons-material/Create';
import PersonIcon from '@mui/icons-material/Person';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <FitnessCenterIcon />
          DanceAR
        </Typography>

        {isMobile ? (
          <IconButton color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/workout"
              color="inherit"
              startIcon={<FitnessCenterIcon />}
            >
              Workout
            </Button>
            <Button
              component={RouterLink}
              to="/create"
              color="inherit"
              startIcon={<CreateIcon />}
            >
              Create Dance
            </Button>
            <Button
              component={RouterLink}
              to="/profile"
              color="inherit"
              startIcon={<PersonIcon />}
            >
              Profile
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 