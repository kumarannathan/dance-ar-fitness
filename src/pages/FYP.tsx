import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import VideoModal from '../components/VideoModal';

const DanceCard = styled(Paper)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  height: 100%;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const VideoThumbnail = styled(Box)`
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 1rem;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4));
  }
`;

const PlayButton = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  
  &::before {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 0 10px 15px;
    border-color: transparent transparent transparent white;
    margin-left: 5px;
  }
`;

const FYP = () => {
  const [selectedDance, setSelectedDance] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // This would be replaced with actual data from your backend
  const recommendedDances = [
    {
      id: '1',
      title: 'Beginner Hip Hop',
      creator: 'DanceMaster123',
      difficulty: 'Beginner',
      duration: '3:45',
      likes: 234,
      videoSrc: '/fyp1.mp4'
    },
    {
      id: '2',
      title: 'Cardio Dance Workout',
      creator: 'FitnessPro',
      difficulty: 'Intermediate',
      duration: '5:20',
      likes: 567,
      videoSrc: '/fyp2.mp4'
    },
    {
      id: '3',
      title: 'Latin Dance Basics',
      creator: 'SalsaQueen',
      difficulty: 'Beginner',
      duration: '4:15',
      likes: 345,
      videoSrc: '/fyp3.mp4'
    },
    {
      id: '4',
      title: 'Advanced Ballet',
      creator: 'BalletMaster',
      difficulty: 'Advanced',
      duration: '6:30',
      likes: 789,
      videoSrc: '/fyp4.mp4'
    },
    {
      id: '5',
      title: 'Zumba Fitness',
      creator: 'ZumbaPro',
      difficulty: 'Intermediate',
      duration: '5:00',
      likes: 432,
      videoSrc: '/fyp5.mp4'
    },
    // Add more as you upload more videos
  ];

  const handleDanceClick = (dance: any) => {
    setSelectedDance(dance);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

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
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            For You
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              mb: 6,
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '800px',
            }}
          >
            Personalized dance recommendations based on your preferences and history
          </Typography>

          <Grid container spacing={3}>
            {recommendedDances.map((dance, index) => (
              <Grid item xs={12} sm={6} key={dance.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <DanceCard 
                    elevation={0}
                    onClick={() => handleDanceClick(dance)}
                  >
                    <VideoThumbnail>
                      <video src={dance.videoSrc} preload="metadata" />
                      <PlayButton />
                    </VideoThumbnail>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        mb: 1,
                        fontSize: '1rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {dance.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 1,
                        fontSize: '0.875rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      by {dance.creator}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {dance.difficulty} • {dance.duration}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.75rem',
                        }}
                      >
                        ❤️ {dance.likes}
                      </Typography>
                    </Box>
                  </DanceCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {selectedDance && (
        <VideoModal
          open={modalOpen}
          onClose={handleCloseModal}
          videoSrc={selectedDance.videoSrc}
          title={selectedDance.title}
          creator={selectedDance.creator}
        />
      )}
    </Box>
  );
};

export default FYP; 