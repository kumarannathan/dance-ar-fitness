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
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useUser } from '../contexts/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { BugReport } from '@mui/icons-material';
import styled from '@emotion/styled';

export const NAVBAR_HEIGHT = '80px';

const StyledAppBar = styled(AppBar)`
  background-color: #000000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: ${NAVBAR_HEIGHT};
  display: flex;
  justify-content: center;
`;

const LogoText = styled(Typography)`
  font-family: 'Space Mono', monospace;
  text-decoration: none;
  color: #FFFFFF;
  font-size: 1.125rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    opacity: 0.7;
  }
`;

const NavLink = styled(Button)`
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  padding: 8px 16px;
  margin: 0 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;

  &:hover {
    color: #FFFFFF;
    border-color: rgba(255, 255, 255, 0.3);
    background: transparent;
  }
` as typeof Button;

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    background-color: #000000;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    width: 280px;
  }
`;

const MobileMenuButton = styled(IconButton)`
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: transparent;
  }
`;

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    background-color: #000000;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0;
    margin-top: 8px;
  }

  .MuiMenuItem-root {
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
    padding: 12px 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      color: #FFFFFF;
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
`;

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: border-color 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const AuthButtons = styled(Box)`
  display: flex;
  gap: 1rem;
`;

const LoginButton = styled(Button)`
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: #FFFFFF;
    border-color: rgba(255, 255, 255, 0.3);
    background: transparent;
  }
`;

const SignupButton = styled(Button)`
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: #000000;
  background: #FFFFFF;
  padding: 8px 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

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

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
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
    { text: 'Blog', path: '/blog' },
    { text: 'Pricing', path: '/pricing' },
    ...(user ? [
      // { text: 'Workout', path: '/workout' },
      // { text: 'Create Dance', path: '/create' },
      // { text: 'Beta Dance Battle', path: '/beta' },
      { text: 'Upload Dance', path: '/dance/upload' },
      { text: 'Profile', path: '/profile' },
    ] : []),
  ];

  const toolsMenuItems = [
    { text: 'Live Pose Tracking', path: '/debug/pose-tracking' },
    { text: 'Video Analysis', path: '/debug/video-pose-tracking' },
    { text: 'Image Analysis', path: '/debug/image-pose-tracking' },
    { text: 'Pose Scoring', path: '/debug/grade-debugger' },
    { text: 'Dance Battle', path: '/debug/dance-battle' },
  ];

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem
          key={item.text}
          component={RouterLink}
          to={item.path}
          onClick={handleDrawerToggle}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            py: 2,
            '&:hover': {
              color: '#FFFFFF',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          <ListItemText 
            primary={item.text}
            primaryTypographyProps={{
              sx: {
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.75rem',
                fontWeight: 400,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }
            }}
          />
        </ListItem>
      ))}
      <ListItem
        sx={{
          color: 'rgba(255, 255, 255, 0.5)',
          mt: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          pt: 3,
        }}
      >
        <ListItemText 
          primary="Debug Tools"
          primaryTypographyProps={{
            sx: {
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.75rem',
              fontWeight: 400,
              letterSpacing: 1,
              textTransform: 'uppercase',
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
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            pl: 4,
            py: 2,
            '&:hover': {
              color: '#FFFFFF',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          <ListItemText 
            primary={item.text}
            primaryTypographyProps={{
              sx: {
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.75rem',
                fontWeight: 400,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        maxWidth: '1200px', 
        width: '100%', 
        mx: 'auto', 
        px: { xs: 2, sm: 4 },
        height: '100%'
      }}>
        <Link component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
          <LogoText>
            DanceAR
          </LogoText>
        </Link>

        {isMobile ? (
          <>
            <MobileMenuButton
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </MobileMenuButton>
            <StyledDrawer
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
            >
              {drawer}
            </StyledDrawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {menuItems.map((item) => (
              <Link 
                key={item.text} 
                component={RouterLink} 
                to={item.path}
                sx={{ textDecoration: 'none' }}
              >
                <NavLink disableRipple>
                  {item.text}
                </NavLink>
              </Link>
            ))}
            <NavLink
              onClick={handleToolsClick}
              endIcon={<BugReport sx={{ fontSize: 16 }} />}
              disableRipple
            >
              Debug
            </NavLink>
            {user ? (
              <>
                <StyledAvatar
                  onClick={handleProfileClick}
                  src={user.photoURL || undefined}
                  alt={user.displayName || 'User'}
                />
                <StyledMenu
                  anchorEl={userMenuAnchorEl}
                  open={Boolean(userMenuAnchorEl)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleUserMenuClose}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleUserMenuClose();
                      handleLogout();
                    }}
                    sx={{
                      color: 'error.main',
                      '&:hover': {
                        bgcolor: 'error.dark',
                        color: 'white',
                      },
                    }}
                  >
                    Logout
                  </MenuItem>
                </StyledMenu>
              </>
            ) : (
              <AuthButtons>
                <Link component={RouterLink} to="/login" sx={{ textDecoration: 'none' }}>
                  <LoginButton disableRipple>
                    Login
                  </LoginButton>
                </Link>
                <Link component={RouterLink} to="/signup" sx={{ textDecoration: 'none' }}>
                  <SignupButton disableRipple>
                    Sign Up
                  </SignupButton>
                </Link>
              </AuthButtons>
            )}
            <StyledMenu
              anchorEl={toolsAnchorEl}
              open={Boolean(toolsAnchorEl)}
              onClose={handleToolsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {toolsMenuItems.map((item) => (
                <MenuItem
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  onClick={handleToolsClose}
                >
                  {item.text}
                </MenuItem>
              ))}
            </StyledMenu>
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar; 