import React, { useRef, useEffect, useState } from 'react';
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

const VideoBackground = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5));
    z-index: 1;
  }
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [danceTitle, setDanceTitle] = useState('');

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // Slow down the video slightly
    }
  }, []);

  return (
    <Box 
      className="page-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      <VideoBackground>
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          src="/background.mov"
        />
      </VideoBackground>
      
      <Container 
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1.5,
          py: 8
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
            Anywhere
          </Typography>

          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 6,
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Empowering movement through simple, accessible technology. Whether you're a first-timer or a lifelong dancer, DanceAR helps you move, connect, and grow — no studio required.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              mb: 4,
            }}
          >
    
            <SecondaryButton
              onClick={() => navigate('/blog')}
              startIcon={<motion.span>📝</motion.span>}
            >
              Dev Blog
            </SecondaryButton>
            <PrimaryButton
              onClick={() => navigate('/fyp')}
              startIcon={<motion.span>🎵</motion.span>}
            >
              Start Dancing
            </PrimaryButton>
            <SecondaryButton
              onClick={() => navigate('/mission')}
              startIcon={<motion.span>🎯</motion.span>}
            >
              Our Mission
            </SecondaryButton>
          </Box>
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 12
            }}
          >
            <iframe width="1120" height="630" src="https://www.youtube.com/embed/F4TN4-9_lTI" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{border: 'none'}}></iframe>
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
                    Built for Access
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    All you need is a device with a camera. No app downloads, no expensive gear. Just dance.
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
                    Movement, Not Perfection
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Real-time guidance helps you improve at your own pace — not with pressure, but with support.
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
                    Move Together
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Join a welcoming, diverse community of dancers around the world. Learn routines, share your moves, and lift each other up.
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