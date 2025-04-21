import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  LinearProgress,
  Collapse,
  IconButton,
  CircularProgress,
  TextField,
} from '@mui/material';
import { DrawingUtils, PoseLandmarker } from '@mediapipe/tasks-vision';
import { UploadFile, Help, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import styled from '@emotion/styled';
import { extractPoseFrames, comparePoseSequences, PoseFrame } from '../utils/poseComparison';
import { NAVBAR_HEIGHT } from '../components/Navbar';
import DanceTips from '../components/DanceTips';
import { getDanceTips } from '../services/geminiService';
import { useUser } from '../contexts/UserContext';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const GameContainer = styled(Container)`
  background-color: #000000;
  min-height: 100vh;
  padding: 2rem;
  padding-top: calc(${NAVBAR_HEIGHT} + 2rem);
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
`;

const GradeDisplay = styled(motion.div)<{ grade: string }>`
  position: fixed;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 6rem;
  font-weight: 700;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
`;

const MotivationalText = styled(motion.div)`
  position: fixed;
  left: 32px;
  bottom: 32px;
  color: #FFFFFF;
  font-size: 0.875rem;
  font-weight: 400;
  max-width: 300px;
  letter-spacing: 0.5px;
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
`;

const ProcessingText = styled(motion.div)`
  position: fixed;
  right: 32px;
  bottom: 32px;
  background: #000000;
  padding: 16px 24px;
  border: 1px solid #FFFFFF;
  color: #FFFFFF;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 1px;
  font-family: 'Space Mono', monospace;
`;

const getGradeAndEmojis = (score: number): { grade: string; emojis: string[]; message?: string } => {
  if (score >= 90) return { grade: 'S', emojis: ['🌟', '👑', '💫', '✨'] };
  if (score >= 80) return { grade: 'A', emojis: ['🎯', '🎪', '🎭', '🎨'] };
  if (score >= 70) return { grade: 'B', emojis: ['🎉', '🎊', '🎈', '🎵'] };
  if (score >= 60) return { 
    grade: 'C', 
    emojis: ['💪', '🎵', '🎶', '🔥'],
    message: "You're getting there! Keep practicing and you'll nail it!" 
  };
  if (score >= 50) return { 
    grade: 'D', 
    emojis: ['💫', '⭐', '✨', '💫'],
    message: "Not bad! Practice makes perfect - let's try again!" 
  };
  return { 
    grade: 'F', 
    emojis: ['🎯', '🎵', '💪', '✨'],
    message: "Everyone starts somewhere! Keep moving and grooving!" 
  };
};

interface ProgressRecord {
  danceTitle: string;
  score: number;
  grade: string;
  timestamp: Date;
  benchmarkVideoUrl: string;
  userVideoUrl: string;
}

const ProgressCheck: React.FC = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [benchmarkVideo, setBenchmarkVideo] = useState<File | null>(null);
  const [userVideo, setUserVideo] = useState<File | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [isComparing, setIsComparing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [benchmarkDrawingUtils, setBenchmarkDrawingUtils] = useState<DrawingUtils | null>(null);
  const [userDrawingUtils, setUserDrawingUtils] = useState<DrawingUtils | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentGrade, setCurrentGrade] = useState<string>('');
  const [motivationalMessage, setMotivationalMessage] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const [dots, setDots] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [danceTitle, setDanceTitle] = useState('');

  const benchmarkVideoRef = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const benchmarkCanvasRef = useRef<HTMLCanvasElement>(null);
  const userCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isComparing) return;

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isComparing]);

  const saveProgress = async (score: number, grade: string) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const progressRecord: ProgressRecord = {
        danceTitle,
        score,
        grade,
        timestamp: new Date(),
        benchmarkVideoUrl: benchmarkVideo ? URL.createObjectURL(benchmarkVideo) : '',
        userVideoUrl: userVideo ? URL.createObjectURL(userVideo) : '',
      };

      await updateDoc(userRef, {
        progress: arrayUnion(progressRecord)
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      setError('Failed to save progress. Please try again.');
    }
  };

  const updateScoreAndEffects = async (score: number) => {
    setCurrentScore(score);
    const { grade, emojis, message } = getGradeAndEmojis(score);
    setCurrentGrade(grade);
    setMotivationalMessage(message || '');
    
    if (score >= 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    // Save progress to user profile
    await saveProgress(score, grade);

    // Get dance tips if we have a title
    if (danceTitle) {
      setIsLoadingTip(true);
      try {
        const tip = await getDanceTips(danceTitle, score);
        setCurrentTip(tip);
      } catch (error) {
        console.error('Error getting dance tips:', error);
      } finally {
        setIsLoadingTip(false);
      }
    }
  };

  const handleBenchmarkVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setBenchmarkVideo(file);
      
      if (benchmarkVideoRef.current) {
        const url = URL.createObjectURL(file);
        benchmarkVideoRef.current.src = url;
        
        return () => URL.revokeObjectURL(url);
      }
    }
  };

  const handleUserVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUserVideo(file);
      
      if (userVideoRef.current) {
        const url = URL.createObjectURL(file);
        userVideoRef.current.src = url;
        
        return () => URL.revokeObjectURL(url);
      }
    }
  };

  const startComparison = async () => {
    if (!benchmarkVideo || !userVideo || !benchmarkVideoRef.current || !userVideoRef.current || !danceTitle) return;
    
    setIsComparing(true);
    setProgress(0);
    setCurrentScore(0);
    setCurrentGrade('');
    setMotivationalMessage('');
    setCurrentTip('');

    try {
      // Clear previous drawings
      const clearCanvas = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };

      clearCanvas(benchmarkCanvasRef.current);
      clearCanvas(userCanvasRef.current);

      // Make sure videos are loaded
      await Promise.all([
        new Promise(resolve => {
          if (benchmarkVideoRef.current!.readyState >= 2) resolve(null);
          else benchmarkVideoRef.current!.addEventListener('loadeddata', () => resolve(null), { once: true });
        }),
        new Promise(resolve => {
          if (userVideoRef.current!.readyState >= 2) resolve(null);
          else userVideoRef.current!.addEventListener('loadeddata', () => resolve(null), { once: true });
        })
      ]);

      // Extract poses from benchmark video
      const benchmarkFrames = await extractPoseFrames(
        benchmarkVideoRef.current,
        (progress) => setProgress(progress / 2)
      );

      // Extract poses from user video
      const userFrames = await extractPoseFrames(
        userVideoRef.current,
        (progress) => setProgress(50 + progress / 2)
      );

      if (benchmarkFrames.length === 0 || userFrames.length === 0) {
        throw new Error('No poses detected in one or both videos');
      }

      // Compare the sequences
      const similarity = comparePoseSequences(benchmarkFrames, userFrames);

      // Update the score with effects
      await updateScoreAndEffects(similarity);

      // Visualize the poses
      if (benchmarkDrawingUtils && benchmarkFrames.length > 0) {
        benchmarkDrawingUtils.drawConnectors(
          benchmarkFrames[0].landmarks,
          PoseLandmarker.POSE_CONNECTIONS,
          { color: '#00ff00', lineWidth: 2 }
        );
        benchmarkDrawingUtils.drawLandmarks(
          benchmarkFrames[0].landmarks,
          { color: '#ff0000', lineWidth: 1 }
        );
      }

      if (userDrawingUtils && userFrames.length > 0) {
        userDrawingUtils.drawConnectors(
          userFrames[0].landmarks,
          PoseLandmarker.POSE_CONNECTIONS,
          { color: '#00ff00', lineWidth: 2 }
        );
        userDrawingUtils.drawLandmarks(
          userFrames[0].landmarks,
          { color: '#ff0000', lineWidth: 1 }
        );
      }
    } catch (error) {
      console.error('Error during comparison:', error);
      setCurrentScore(0);
    } finally {
      setIsComparing(false);
      setProgress(100);
    }
  };

  return (
    <GameContainer maxWidth="lg">
      <AnimatePresence>
        {showConfetti && <ReactConfetti colors={['#FFFFFF']} />}
        {currentGrade && (
          <GradeDisplay
            grade={currentGrade}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            {currentGrade}
          </GradeDisplay>
        )}
        {motivationalMessage && (
          <MotivationalText
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
          >
            {motivationalMessage}
          </MotivationalText>
        )}
        {isComparing && (
          <ProcessingText
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            Processing{dots}
          </ProcessingText>
        )}
      </AnimatePresence>

      <Typography 
        variant="h1" 
        gutterBottom 
        sx={{ 
          color: '#FFFFFF', 
          textAlign: 'center', 
          mb: 4,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          fontSize: '2.5rem',
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1.2
        }}
      >
        Progress Check
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4, maxWidth: '1000px', mx: 'auto' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ bgcolor: '#000000', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: '#FFFFFF',
                  fontWeight: 500,
                  mb: 2,
                  letterSpacing: '0.5px',
                  fontFamily: 'Space Mono, monospace',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem'
                }}
              >
                Benchmark Video
              </Typography>
              <Button
                component="label"
                variant="contained"
                startIcon={<UploadFile />}
                fullWidth
                sx={{
                  bgcolor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                Upload Benchmark
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={handleBenchmarkVideoUpload}
                />
              </Button>
            </Box>
            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
              <video
                ref={benchmarkVideoRef}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                playsInline
                controlsList="nodownload nofullscreen noremoteplayback"
              />
              <canvas
                ref={benchmarkCanvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ bgcolor: '#000000', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: '#FFFFFF',
                  fontWeight: 500,
                  mb: 2,
                  letterSpacing: '0.5px',
                  fontFamily: 'Space Mono, monospace',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem'
                }}
              >
                Your Video
              </Typography>
              <Button
                component="label"
                variant="contained"
                startIcon={<UploadFile />}
                fullWidth
                sx={{
                  bgcolor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                Upload Your Dance
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={handleUserVideoUpload}
                />
              </Button>
            </Box>
            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
              <video
                ref={userVideoRef}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                playsInline
                controlsList="nodownload nofullscreen noremoteplayback"
              />
              <canvas
                ref={userCanvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', maxWidth: '400px', mx: 'auto', mb: 4 }}>
        <TextField
          label="Dance Title"
          variant="outlined"
          value={danceTitle}
          onChange={(e) => setDanceTitle(e.target.value)}
          sx={{
            mb: 3,
            width: '100%',
            '& .MuiOutlinedInput-root': {
              color: '#FFFFFF',
              fontSize: '0.875rem',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FFFFFF',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.875rem',
              '&.Mui-focused': {
                color: '#FFFFFF',
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={startComparison}
          disabled={!benchmarkVideo || !userVideo || !danceTitle || loading || isComparing}
          sx={{ 
            minWidth: 200,
            bgcolor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            },
            '&:disabled': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          Start Progress Check
        </Button>
      </Box>

      <DanceTips tip={currentTip} onDismiss={() => setCurrentTip('')} />
    </GameContainer>
  );
};

export default ProgressCheck; 