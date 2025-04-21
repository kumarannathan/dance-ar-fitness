import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  IconButton, 
  Box, 
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #000;
    max-width: 90vw;
    max-height: 90vh;
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 0;
  }
`;

const VideoContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 16px;
  right: 16px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const VideoInfo = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  z-index: 5;
`;

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  videoSrc: string;
  title: string;
  creator: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ 
  open, 
  onClose, 
  videoSrc, 
  title,
  creator
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      aria-labelledby="video-modal-title"
    >
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <VideoContainer>
          <video 
            src={videoSrc} 
            controls 
            autoPlay
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              objectFit: 'contain'
            }} 
          />
          <CloseButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </CloseButton>
          <VideoInfo>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <Typography variant="body2">
              by {creator}
            </Typography>
          </VideoInfo>
        </VideoContainer>
      </DialogContent>
    </StyledDialog>
  );
};

export default VideoModal; 