import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Features from './pages/Features';
import Workout from './pages/Workout';
import CreateDance from './pages/CreateDance';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PoseTracking from './pages/debug/PoseTracking';
import VideoPoseTracking from './pages/debug/VideoPoseTracking';
import LiveVideoScoreDebugger from './pages/debug/LiveVideoScoreDebugger';
import GradeDebugger from './pages/debug/GradeDebugger';
import ImagePoseTracking from './pages/debug/ImagePoseTracking';
import BetaDanceBattle from './pages/BetaDanceBattle';
import ProgressCheck from './pages/ProgressCheck';
import DanceBattle from './pages/DanceBattle';
import { UserProvider, useUser } from './contexts/UserContext';
import PricingOverview from './pages/PricingPanel';
import './App.css';
import DanceEditor from './pages/dances/DanceEditor';
import DancePlayer from './pages/dances/DancePlayer';
import { NAVBAR_HEIGHT } from './components/Navbar';
import FYP from './pages/FYP';
import Mission from './pages/Mission';
import Chat from './pages/Chat';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#000000',
      paper: '#000000',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 400,
      fontSize: '4rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 400,
      fontSize: '3rem',
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 400,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '0.5rem 1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

const globalStyles = {
  '.page-container': {
    minHeight: '100vh',
    paddingTop: NAVBAR_HEIGHT,
    backgroundColor: '#000000',
    color: '#FFFFFF',
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <AuthProvider>
        <UserProvider>
          <Router>
            <div className="App">
              <Navbar />
              <Box sx={{ pt: NAVBAR_HEIGHT }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path='/pricing' element={<PricingOverview />} />
                  <Route path="/fyp" element={<FYP />} />
                  <Route path="/workout" element={<PrivateRoute><Workout /></PrivateRoute>} />
                  <Route path="/create" element={<PrivateRoute><CreateDance /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/mission" element={<Mission />} />
                  <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                  <Route path="/beta" element={<PrivateRoute><BetaDanceBattle /></PrivateRoute>} />
                  <Route path="/dance/upload" element={<PrivateRoute><DanceEditor /></PrivateRoute>} />
                  <Route path="/dance/play/:danceId" element={<PrivateRoute><DancePlayer /></PrivateRoute>} />
                  <Route path="/dance-battle" element={<PrivateRoute><DanceBattle /></PrivateRoute>} />
                  <Route path="/debug/pose-tracking" element={<PoseTracking />} />
                  <Route path="/debug/video-pose-tracking" element={<VideoPoseTracking />} />
                  <Route path="/debug/image-pose-tracking" element={<ImagePoseTracking />} />
                  <Route path="/debug/live-video-scoring-test" element={<LiveVideoScoreDebugger />} />
                  <Route path="/debug/grade-debugger" element={<GradeDebugger />} />
                  <Route path="/debug/dance-battle" element={<ProgressCheck />} />
                </Routes>
              </Box>
            </div>
          </Router>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
