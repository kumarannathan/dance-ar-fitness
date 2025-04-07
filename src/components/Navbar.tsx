import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Button,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useUser } from '../contexts/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [toolsAnchorEl, setToolsAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleToolsClick = (event: React.MouseEvent<HTMLElement>) => {
    setToolsAnchorEl(event.currentTarget);
  };

  const handleToolsClose = () => {
    setToolsAnchorEl(null);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'blog', path: '/blog' },
    ...(user ? [
      { text: 'Workout', path: '/workout' },
      { text: 'Create Dance', path: '/create' },
      { text: 'Beta Dance Battle', path: '/beta' },
      { text: 'Profile', path: '/profile' },
    ] : []),
  ];

  const toolsMenuItems = [
    { text: 'Live Pose Tracking', path: '/debug/pose-tracking' },
    { text: 'Video Analysis', path: '/debug/video-pose-tracking' },
    { text: 'Image Analysis', path: '/debug/image-pose-tracking' },
    { text: 'Pose Scoring', path: '/debug/grade-debugger' },
  ];

  const drawer = (
    <List sx={{ bgcolor: 'background.default', height: '100%' }}>
      {menuItems.map((item) => (
        <ListItem
          key={item.text}
          component={RouterLink}
          to={item.path}
          onClick={handleDrawerToggle}
          sx={{
            cursor: 'pointer',
            color: 'text.primary',
            textDecoration: 'none',
            '&:hover': {
              color: 'text.secondary',
            },
          }}
        >
          <ListItemText 
            primary={item.text}
            primaryTypographyProps={{
              sx: {
                fontSize: '1rem',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }
            }}
          />
        </ListItem>
      ))}
      <ListItem
        sx={{
          color: 'text.primary',
          mt: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          pt: 2,
        }}
      >
        <ListItemText 
          primary="Tools"
          primaryTypographyProps={{
            sx: {
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              color: 'text.secondary',
            }
          }}
        />
      </ListItem>
      {toolsMenuItems.map((item) => (
        <ListItem
          key={item.text}
          component={RouterLink}
          to={item.path}
          onClick={handleDrawerToggle}
          sx={{
            cursor: 'pointer',
            color: 'text.primary',
            textDecoration: 'none',
            pl: 4,
            '&:hover': {
              color: 'text.secondary',
            },
          }}
        >
          <ListItemText 
            primary={item.text}
            primaryTypographyProps={{
              sx: {
                fontSize: '0.875rem',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: 'background.default',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        py: 2,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            fontSize: '1rem',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            '&:hover': {
              color: 'text.secondary',
            },
          }}
        >
          dance ar
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                '&:hover': {
                  color: 'text.secondary',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              PaperProps={{
                sx: {
                  bgcolor: 'background.default',
                  width: 240,
                }
              }}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Typography
                key={item.text}
                component={RouterLink}
                to={item.path}
                sx={{
                  color: 'text.primary',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  '&:hover': {
                    color: 'text.secondary',
                  },
                }}
              >
                {item.text}
              </Typography>
            ))}
            <Button
              startIcon={<FitnessCenterIcon />}
              onClick={handleToolsClick}
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                '&:hover': {
                  color: 'text.secondary',
                },
              }}
            >
              Tools
            </Button>
            <Menu
              anchorEl={toolsAnchorEl}
              open={Boolean(toolsAnchorEl)}
              onClose={handleToolsClose}
              PaperProps={{
                sx: {
                  bgcolor: 'background.default',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              {toolsMenuItems.map((item) => (
                <MenuItem
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  onClick={handleToolsClose}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      color: 'text.secondary',
                    },
                  }}
                >
                  {item.text}
                </MenuItem>
              ))}
            </Menu>
            {user ? (
              <>
                <IconButton
                  onClick={handleUserMenuClick}
                  sx={{
                    '&:hover': {
                      color: 'text.secondary',
                    },
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32 }} />
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchorEl}
                  open={Boolean(userMenuAnchorEl)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    sx: {
                      bgcolor: 'background.default',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleUserMenuClose}
                    sx={{
                      color: 'text.primary',
                      '&:hover': {
                        color: 'text.secondary',
                      },
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleUserMenuClose();
                      handleLogout();
                    }}
                    sx={{
                      color: 'text.primary',
                      '&:hover': {
                        color: 'text.secondary',
                      },
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      color: 'text.secondary',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 