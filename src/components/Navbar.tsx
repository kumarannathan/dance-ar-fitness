import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'home', path: '/' },
    { text: 'workout', path: '/workout' },
    { text: 'create', path: '/create' },
    { text: 'profile', path: '/profile' },
    { text: 'blog', path: '/blog' },
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
          <Box sx={{ display: 'flex', gap: 4 }}>
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
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 