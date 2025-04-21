import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

interface Dance {
  id: string;
  title: string;
  thumbnailUrl: string;
  createdAt: Date;
  duration: string;
  videoUrl: string;
}

interface DanceGridProps {
  dances: Dance[];
  onDelete?: (id: string) => void;
}

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

const DanceGrid: React.FC<DanceGridProps> = ({ dances, onDelete }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedDance, setSelectedDance] = React.useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, danceId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedDance(danceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDance(null);
  };

  const handleDelete = () => {
    if (selectedDance && onDelete) {
      onDelete(selectedDance);
      handleMenuClose();
    }
  };

  const handleDanceClick = (danceId: string) => {
    navigate(`/dance/play/${danceId}`);
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {dances.map((dance) => (
          <DanceCard
            key={dance.id}
            elevation={0}
            onClick={() => handleDanceClick(dance.id)}
          >
            <Box sx={{ position: 'relative' }}>
              <VideoThumbnail>
                <video src={dance.videoUrl} preload="metadata" />
                <PlayButton />
              </VideoThumbnail>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
                onClick={(e) => handleMenuClick(e, dance.id)}
              >
                <MoreVertIcon />
              </IconButton>
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption">{dance.duration}</Typography>
              </Box>
            </Box>
            <CardContent sx={{ flexGrow: 1, p: 0 }}>
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
                  fontSize: '0.875rem',
                }}
              >
                {new Date(dance.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </DanceCard>
        ))}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: 'background.default',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <MenuItem
          onClick={handleDelete}
          sx={{
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.dark',
              color: 'white',
            },
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default DanceGrid; 