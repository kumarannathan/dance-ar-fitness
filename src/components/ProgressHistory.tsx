import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styled from '@emotion/styled';

interface ProgressRecord {
  danceTitle: string;
  score: number;
  grade: string;
  timestamp: Date;
  benchmarkVideoUrl: string;
  userVideoUrl: string;
}

const ProgressCard = styled(Paper)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
`;

const GradeBadge = styled(Box)<{ grade: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  background: ${props => {
    switch (props.grade) {
      case 'S': return 'linear-gradient(135deg, #FFD700, #FFA500)';
      case 'A': return 'linear-gradient(135deg, #00FF00, #008000)';
      case 'B': return 'linear-gradient(135deg, #4169E1, #000080)';
      case 'C': return 'linear-gradient(135deg, #FFA500, #FF4500)';
      case 'D': return 'linear-gradient(135deg, #FF4500, #8B0000)';
      default: return 'linear-gradient(135deg, #808080, #404040)';
    }
  }};
  color: white;
  margin-bottom: 1rem;
`;

const ProgressHistory: React.FC = () => {
  const { user } = useUser();
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProgress(userData.progress || []);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        setError('Failed to load progress history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (progress.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No progress records yet. Start practicing to see your progress!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {progress.map((record, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <ProgressCard elevation={0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <GradeBadge grade={record.grade}>
                {record.grade}
              </GradeBadge>
              <Typography variant="h6" gutterBottom>
                {record.danceTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Score: {record.score}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(record.timestamp).toLocaleDateString()}
              </Typography>
            </Box>
          </ProgressCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProgressHistory; 