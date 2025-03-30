import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CreateIcon from '@mui/icons-material/Create';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';

const MotionBox = motion(Box);

const features = [
  {
    icon: <FitnessCenterIcon sx={{ fontSize: 28 }} />,
    title: 'Real-time Pose Detection',
    description: 'Advanced AR technology tracks your movements with precision.',
  },
  {
    icon: <CreateIcon sx={{ fontSize: 28 }} />,
    title: 'Create Your Own Dances',
    description: 'Record and share your own dance routines with the community.',
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
    title: 'Progress Tracking',
    description: 'Monitor your improvement with detailed analytics.',
  },
  {
    icon: <GroupIcon sx={{ fontSize: 28 }} />,
    title: 'Community Features',
    description: 'Connect with other dancers and participate in challenges.',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 8, 
            alignItems: 'center',
            py: { xs: 6, md: 12 }
          }}>
            <Box sx={{ flex: 1, maxWidth: { md: '50%' } }}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography 
                  variant="h1" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '3rem', md: '4.5rem' },
                    fontWeight: 700,
                    lineHeight: 1.1,
                    mb: 3,
                    background: 'linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Dance Your Way to Fitness
                </Typography>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    mb: 4,
                    opacity: 0.8,
                    fontWeight: 400,
                    fontSize: { xs: '1.25rem', md: '1.5rem' }
                  }}
                >
                  Experience the future of dance fitness with AR technology
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/workout')}
                  sx={{
                    backgroundColor: 'white',
                    color: 'black',
                    px: 6,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out',
                    },
                  }}
                >
                  Start Dancing
                </Button>
              </MotionBox>
            </Box>
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center',
              maxWidth: { md: '50%' }
            }}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  aspectRatio: '1',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '30px',
                  backdropFilter: 'blur(20px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.8,
                    fontSize: '1.5rem',
                    fontWeight: 500
                  }}
                >
                  AR Preview
                </Typography>
              </MotionBox>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#000000', py: { xs: 8, md: 16 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            align="center"
            gutterBottom
            sx={{ 
              mb: 8,
              fontWeight: 600,
              fontSize: { xs: '2.5rem', md: '3rem' },
              color: 'white',
              background: 'linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Features
          </Typography>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: { xs: 4, md: 6 },
            px: { xs: 2, md: 0 }
          }}>
            {features.map((feature, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Box sx={{ 
                  color: 'white', 
                  mb: 3,
                  p: 2,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.08)',
                  }
                }}>
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    color: 'white',
                    fontSize: '1.25rem'
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.8,
                    lineHeight: 1.6,
                    color: 'white',
                    fontSize: '0.95rem'
                  }}
                >
                  {feature.description}
                </Typography>
              </MotionBox>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 