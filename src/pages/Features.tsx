import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import VideocamIcon from '@mui/icons-material/Videocam';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const FeatureCard = styled(Paper)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  height: 100%;
  transition: all 0.3s ease-in-out;
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const IconWrapper = styled(Box)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    font-size: 2rem;
    color: white;
  }
`;

const features = [
  {
    icon: <VideocamIcon />,
    title: 'Real-time Dance Analysis',
    description: 'Advanced pose tracking technology analyzes your movements in real-time, providing instant feedback on your dance performance.'
  },
  {
    icon: <SportsScoreIcon />,
    title: 'Precision Scoring',
    description: 'Get detailed scores based on your accuracy, timing, and fluidity. Our AI compares your moves with the original choreography.'
  },
  {
    icon: <EmojiEventsIcon />,
    title: 'Dance Battles',
    description: 'Challenge friends or the community to dance battles. Upload your performance and see who can score higher!'
  },
  {
    icon: <ShowChartIcon />,
    title: 'Progress Tracking',
    description: 'Monitor your improvement over time with detailed analytics and performance history.'
  },
  {
    icon: <GroupsIcon />,
    title: 'Community',
    description: 'Join a vibrant community of dancers. Share your progress, learn from others, and participate in challenges.'
  },
  {
    icon: <AutoFixHighIcon />,
    title: 'AR Technology',
    description: 'Experience dance training like never before with our augmented reality technology that guides your movements.'
  }
];

const Features = () => {
  return (
    <Box className="page-container">
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 2,
              textAlign: 'center',
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Features
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 8,
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Discover how DanceAR is revolutionizing dance training with cutting-edge technology
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <FeatureCard elevation={0}>
                    <IconWrapper>
                      {feature.icon}
                    </IconWrapper>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: 'white',
                        fontWeight: 600
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Features; 