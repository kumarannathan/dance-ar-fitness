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
} from '@mui/material';
import { DrawingUtils, PoseLandmarker } from '@mediapipe/tasks-vision';
import { UploadFile, Help, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import styled from '@emotion/styled';
import { extractPoseFrames, comparePoseSequences, PoseFrame } from '../../utils/poseComparison';
import { NAVBAR_HEIGHT } from '../../components/Navbar';
import DanceAIChat from '../../components/DanceAIChat';

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

const VideoContainer = styled(Paper)`
  background-color: #000000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  background: #000000;
  border: 1px solid #FFFFFF;
  border-radius: 2px;
  padding: 16px 32px;
  font-family: 'Space Mono', monospace;
  font-size: 0.875rem;
  font-weight: 400;
  text-transform: uppercase;
  color: white;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: #FFFFFF;
    color: #000000;
    transform: none;
  }

  &:disabled {
    background: #000000;
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.3);
  }

  .MuiSvgIcon-root {
    font-size: 1.2rem;
    margin-right: 8px;
  }
` as typeof Button;

const HelpButton = styled(Button)`
  color: #FFFFFF;
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  font-size: 0.75rem;
  padding: 8px 16px;
  border-radius: 0;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;

  &:hover {
    color: white;
    border-color: rgba(255, 255, 255, 0.5);
  }

  .MuiSvgIcon-root {
    font-size: 1rem;
    margin-right: 6px;
  }
` as typeof Button;

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

const ScoreDisplay = styled(motion.div)`
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

const ContentContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'isChatExpanded'
})<{ isChatExpanded: boolean }>`
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: ${props => props.isChatExpanded ? '320px' : '0'};
  width: ${props => props.isChatExpanded ? 'calc(100% - 320px)' : '100%'};
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

const DanceBattle = () => {
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
  const [isChatExpanded, setIsChatExpanded] = useState(true);

  const benchmarkVideoRef = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const benchmarkCanvasRef = useRef<HTMLCanvasElement>(null);
  const userCanvasRef = useRef<HTMLCanvasElement>(null);

  // Set up drawing utils when videos are loaded
  useEffect(() => {
    const setupCanvas = (videoRef: HTMLVideoElement | null, canvasRef: HTMLCanvasElement | null) => {
      if (!videoRef || !canvasRef) return null;
      
      // Wait for video metadata to be loaded
      if (!videoRef.videoWidth || !videoRef.videoHeight) {
        return null;
      }
      
      const aspectRatio = videoRef.videoWidth / videoRef.videoHeight;
      const width = videoRef.clientWidth;
      const height = width / aspectRatio;
      
      canvasRef.width = width;
      canvasRef.height = height;
      
      const ctx = canvasRef.getContext('2d');
      return ctx ? new DrawingUtils(ctx) : null;
    };

    const handleBenchmarkLoad = () => {
      if (benchmarkVideoRef.current && benchmarkCanvasRef.current) {
        const utils = setupCanvas(benchmarkVideoRef.current, benchmarkCanvasRef.current);
        setBenchmarkDrawingUtils(utils);
      }
    };

    const handleUserLoad = () => {
      if (userVideoRef.current && userCanvasRef.current) {
        const utils = setupCanvas(userVideoRef.current, userCanvasRef.current);
        setUserDrawingUtils(utils);
      }
    };

    // Set up event listeners for video loading
    benchmarkVideoRef.current?.addEventListener('loadedmetadata', handleBenchmarkLoad);
    userVideoRef.current?.addEventListener('loadedmetadata', handleUserLoad);

    // Also try to set up immediately in case videos are already loaded
    handleBenchmarkLoad();
    handleUserLoad();

    return () => {
      // Store refs in variables to avoid the exhaustive-deps warning
      const benchmarkVideo = benchmarkVideoRef.current;
      const userVideo = userVideoRef.current;
      
      if (benchmarkVideo) {
        benchmarkVideo.pause();
        benchmarkVideo.srcObject = null;
      }
      
      if (userVideo) {
        userVideo.pause();
        userVideo.srcObject = null;
      }
    };
  }, [/* other dependencies */]);

  const handleBenchmarkVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setBenchmarkVideo(file);
      
      if (benchmarkVideoRef.current) {
        const url = URL.createObjectURL(file);
        benchmarkVideoRef.current.src = url;
        
        // Clean up the URL when the video source changes
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
        
        // Clean up the URL when the video source changes
        return () => URL.revokeObjectURL(url);
      }
    }
  };

  const clearCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const updateScoreAndEffects = (score: number) => {
    setCurrentScore(score);
    const { grade, emojis, message } = getGradeAndEmojis(score);
    setCurrentGrade(grade);
    setMotivationalMessage(message || '');
    if (score >= 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const startComparison = async () => {
    if (!benchmarkVideo || !userVideo || !benchmarkVideoRef.current || !userVideoRef.current) return;
    
    setIsComparing(true);
    setProgress(0);
    setCurrentScore(0);
    setCurrentGrade('');
    setMotivationalMessage('');

    try {
      // Clear previous drawings
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

      console.log('Benchmark frames:', benchmarkFrames.length);
      console.log('User frames:', userFrames.length);

      if (benchmarkFrames.length === 0 || userFrames.length === 0) {
        throw new Error('No poses detected in one or both videos');
      }

      // Compare the sequences
      const similarity = comparePoseSequences(benchmarkFrames, userFrames);
      console.log('Similarity score:', similarity);

      // Update the score with effects
      updateScoreAndEffects(similarity);

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

  const handleChatToggle = (expanded: boolean) => {
    setIsChatExpanded(expanded);
  };

  return (
    <>
      <DanceAIChat onToggle={handleChatToggle} />
      <ContentContainer isChatExpanded={isChatExpanded}>
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
          </AnimatePresence>

          <Typography 
            variant="h1" 
            gutterBottom 
            sx={{ 
              color: '#FFFFFF', 
              textAlign: 'center', 
              mb: 6,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              fontSize: '4rem',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.2
            }}
          >
            Dance Battle
          </Typography>

          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <HelpButton
              startIcon={<Help />}
              endIcon={showHelp ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              onClick={() => setShowHelp(!showHelp)}
            >
              Need help?
            </HelpButton>
            
            <Collapse in={showHelp}>
              <Box sx={{ 
                mt: 3, 
                p: 4, 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxWidth: '960px',
                mx: 'auto'
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#FFFFFF',
                    mb: 4,
                    fontSize: '1.125rem',
                    letterSpacing: '0.5px',
                    lineHeight: 1.6,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 300
                  }}
                >
                  Challenge yourself by comparing your dance moves with a benchmark video
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 8, 
                  flexWrap: 'wrap'
                }}>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      color: '#FFFFFF', 
                      mb: 1, 
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      fontFamily: 'Space Mono, monospace',
                      textTransform: 'uppercase',
                      fontSize: '0.875rem'
                    }}>
                      1. Upload Videos
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#FFFFFF', 
                      opacity: 0.7,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 300
                    }}>
                      Add a benchmark video and your dance attempt
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      color: '#FFFFFF', 
                      mb: 1, 
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      fontFamily: 'Space Mono, monospace',
                      textTransform: 'uppercase',
                      fontSize: '0.875rem'
                    }}>
                      2. Start Battle
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#FFFFFF', 
                      opacity: 0.7,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 300
                    }}>
                      Click 'Start Battle' to compare the moves
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      color: '#FFFFFF', 
                      mb: 1, 
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      fontFamily: 'Space Mono, monospace',
                      textTransform: 'uppercase',
                      fontSize: '0.875rem'
                    }}>
                      3. Get Scored
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#FFFFFF', 
                      opacity: 0.7,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 300
                    }}>
                      Receive your grade and performance feedback
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Collapse>
          </Box>
          
          <Grid container spacing={4} sx={{ mb: 6, flex: 1, overflow: 'hidden', maxWidth: '1200px', mx: 'auto' }}>
            <Grid item xs={12} md={6} sx={{ height: '100%' }}>
              <VideoContainer elevation={0}>
                <Box sx={{ p: 4 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: '#FFFFFF',
                      fontWeight: 500,
                      mb: 3,
                      letterSpacing: '1px',
                      fontFamily: 'Space Mono, monospace',
                      textTransform: 'uppercase',
                      fontSize: '0.875rem'
                    }}
                  >
                    Benchmark Video
                  </Typography>
                  <StyledButton
                    component="label"
                    variant="contained"
                    startIcon={<UploadFile />}
                    fullWidth
                  >
                    Upload Benchmark
                    <input
                      type="file"
                      accept="video/*"
                      hidden
                      onChange={handleBenchmarkVideoUpload}
                    />
                  </StyledButton>
                </Box>
                <Box sx={{ position: 'relative', width: '100%', flex: 1, overflow: 'hidden' }}>
                  <video
                    ref={benchmarkVideoRef}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    controls
                    playsInline
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
              </VideoContainer>
            </Grid>

            <Grid item xs={12} md={6} sx={{ height: '100%' }}>
              <VideoContainer elevation={0}>
                <Box sx={{ p: 4 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: '#FFFFFF',
                      fontWeight: 500,
                      mb: 3,
                      letterSpacing: '1px',
                      fontFamily: 'Space Mono, monospace',
                      textTransform: 'uppercase',
                      fontSize: '0.875rem'
                    }}
                  >
                    Your Video
                  </Typography>
                  <StyledButton
                    component="label"
                    variant="contained"
                    startIcon={<UploadFile />}
                    fullWidth
                  >
                    Upload Your Dance
                    <input
                      type="file"
                      accept="video/*"
                      hidden
                      onChange={handleUserVideoUpload}
                    />
                  </StyledButton>
                </Box>
                <Box sx={{ position: 'relative', width: '100%', flex: 1, overflow: 'hidden' }}>
                  <video
                    ref={userVideoRef}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    controls
                    playsInline
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
              </VideoContainer>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <StyledButton
              variant="contained"
              onClick={startComparison}
              disabled={!benchmarkVideo || !userVideo || loading || isComparing}
              sx={{ 
                minWidth: 240
              }}
            >
              Start Battle
            </StyledButton>
            
            {(isComparing || progress > 0) && (
              <Box sx={{ width: '100%', maxWidth: '960px', mx: 'auto', mt: 4 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress}
                  sx={{
                    height: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: '#FFFFFF',
                    }
                  }}
                />
              </Box>
            )}
            
            {progress === 100 && (
              <ScoreDisplay
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {currentScore}%
              </ScoreDisplay>
            )}
          </Box>
        </GameContainer>
      </ContentContainer>
    </>
  );
};

export default DanceBattle; 