import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import GroupsIcon from '@mui/icons-material/Groups';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const StyledButton = styled(Button)`
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 1px;
  padding: 12px 24px;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
  }
`;

const PrimaryButton = styled(StyledButton)`
  background-color: #4169e1;
  color: white;
  border: none;

  &:hover {
    background-color: #3154b3;
  }
`;

const SecondaryButton = styled(StyledButton)`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ValueProp = styled(Box)`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-4px);
  }

  svg {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #4169e1;
  }
`;

const DottedWorldMap = () => (
  <Box
    component="div"
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      height: '100%',
      opacity: 0.4,
      background: 'url(/world-map-dots.svg) no-repeat center center',
      backgroundSize: 'contain',
      zIndex: 0,
      filter: 'brightness(0.7)',
    }}
  />
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box 
      className="page-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <DottedWorldMap />
      
      <Container 
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            Dance for Everyone,<br />
            Powered by AI
          </Typography>

          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 6,
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Breaking down barriers to dance and fitness through accessible technology.
            Learn, create, and connect with our AI-powered platform.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              mb: 12,
            }}
          >
            <PrimaryButton
              onClick={() => navigate('/features')}
              startIcon={<motion.span>🎵</motion.span>}
            >
              Start Dancing
            </PrimaryButton>
            <SecondaryButton
              onClick={() => navigate('/blog')}
              startIcon={<motion.span>📝</motion.span>}
            >
              Dev Blog
            </SecondaryButton>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ValueProp>
                  <AccessibilityNewIcon />
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                    Accessible to All
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    No special equipment needed. Just your device's camera and our web-based platform.
                  </Typography>
                </ValueProp>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ValueProp>
                  <FitnessCenterIcon />
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                    Real-time Feedback
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Advanced AI technology provides instant, personalized guidance on your movements.
                  </Typography>
                </ValueProp>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <ValueProp>
                  <GroupsIcon />
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                    Community-Driven
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Share, learn, and grow with a supportive community of dancers at all skill levels.
                  </Typography>
                </ValueProp>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home; 