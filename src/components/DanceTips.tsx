import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';

const TipsContainer = styled(motion.div)`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 16px 24px;
  max-width: 400px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TipText = styled(Typography)`
  color: #FFFFFF;
  font-family: 'Space Mono', monospace;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  line-height: 1.4;
`;

interface DanceTipsProps {
  tip: string;
  onDismiss: () => void;
}

const DanceTips: React.FC<DanceTipsProps> = ({ tip, onDismiss }) => {
  return (
    <AnimatePresence>
      {tip && (
        <TipsContainer
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <TipText>{tip}</TipText>
          <IconButton
            onClick={onDismiss}
            size="small"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </TipsContainer>
      )}
    </AnimatePresence>
  );
};

export default DanceTips; 