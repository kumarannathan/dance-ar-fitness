import React, { useState } from 'react';
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
import { BugReport, People, PersonAdd } from '@mui/icons-material';
import styled from '@emotion/styled';
import zIndex from '@mui/material/styles/zIndex';
import FriendSearch from './FriendSearch';
import FriendsList from './FriendsList';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export const NAVBAR_HEIGHT = '80px';

const StyledAppBar = styled(AppBar)`
  background-color: #000000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: ${NAVBAR_HEIGHT};
  display: flex;
  justify-content: center;
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
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
  const [friendSearchOpen, setFriendSearchOpen] = useState(false);
  const [friendsListOpen, setFriendsListOpen] = useState(false);

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
    { text: 'For You', path: '/fyp' },
    { text: 'Upload Dance', path: '/dance/upload' },
    { text: 'Dance Battle', path: '/debug/dance-battle' },
    { text: 'Pricing', path: '/pricing' },
  ];

  const toolsMenuItems = [
    { text: 'Live Pose Tracking', path: '/debug/pose-tracking' },
    { text: 'Video Analysis', path: '/debug/video-pose-tracking' },
    { text: 'Image Analysis', path: '/debug/image-pose-tracking' },
    { text: 'Pose Scoring', path: '/debug/grade-debugger' },
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
    <StyledAppBar position="fixed" sx={{zIndex: 2}}>
      <StyledToolbar>
        {/* Left section - Logo */}
        <Box sx={{ width: '200px' }}>
          <Link component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
            <LogoText>
              DanceAR
            </LogoText>
          </Link>
        </Box>

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
          <>
            {/* Center section - Navigation */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              justifyContent: 'center',
              flex: 1
            }}>
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
            </Box>

            {/* Right section - Profile and Friends */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user ? (
                <>
                  <IconButton 
                    color="inherit" 
                    onClick={() => setFriendSearchOpen(true)}
                    sx={{ mr: 1 }}
                  >
                    <PersonAddIcon />
                  </IconButton>
                  <IconButton 
                    color="inherit" 
                    onClick={() => setFriendsListOpen(true)}
                    sx={{ mr: 1 }}
                  >
                    <PeopleIcon />
                  </IconButton>
                  <IconButton 
                    color="inherit" 
                    onClick={() => navigate('/chat')}
                    sx={{ mr: 1 }}
                  >
                    <ChatIcon />
                  </IconButton>
                  <StyledAvatar
                    onClick={handleProfileClick}
                    src={user?.photoURL || undefined}
                    alt={user?.displayName || 'User'}
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
            </Box>
          </>
        )}
      </StyledToolbar>

      <FriendSearch 
        open={friendSearchOpen} 
        onClose={() => setFriendSearchOpen(false)} 
      />
      <FriendsList 
        open={friendsListOpen} 
        onClose={() => setFriendsListOpen(false)} 
      />
    </StyledAppBar>
  );
};

export default Navbar; 