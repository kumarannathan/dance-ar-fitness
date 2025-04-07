import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { DrawingUtils, FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { BodyLandmarkType, getLandmarkAngle, isLandmarkEligibleForAngles } from '../utils/landmark';
import { radToDeg } from '../utils/math';

const BetaDanceBattle: React.FC = () => {
  const { user } = useUser();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [landmarker, setLandmarker] = useState<PoseLandmarker | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [handsUp, setHandsUp] = useState(false);
  const [elbowAngle, setElbowAngle] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Initialize MediaPipe and camera
  useEffect(() => {
    console.log('Starting MediaPipe and camera initialization...');
    let cancel = false;

    const initializeCameraAndPoseTracking = async () => {
      try {
        // Request camera access
        console.log('Requesting camera access...');
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: 'user'
          }
        });
        
        if (!mediaStream || !videoRef.current) {
          console.error('Camera access denied or video element not available');
          setError('Camera access denied. Please grant camera permissions.');
          setLoading(false);
          return;
        }
        
        console.log('Camera access granted, setting up video stream');
        videoRef.current.srcObject = mediaStream;
        
        // Initialize MediaPipe
        console.log('Loading MediaPipe vision tasks...');
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );
        console.log('Vision tasks loaded successfully');

        if (cancel) {
          console.log('Initialization cancelled');
          return;
        }

        console.log('Creating PoseLandmarker...');
        const poseLandmarker = await PoseLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
            },
            numPoses: 3,
            runningMode: 'VIDEO'
          }
        );
        
        console.log('PoseLandmarker created successfully');
        setLandmarker(poseLandmarker);
        setLoading(false);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize camera or pose detection. Please check permissions and refresh the page.');
        setLoading(false);
      }
    };

    initializeCameraAndPoseTracking();
    return () => {
      console.log('Cleaning up initialization');
      cancel = true;
    };
  }, []);

  // Process video frames for pose detection
  useEffect(() => {
    if (loading) return;

    let cancel = false;
    let videoTime = 0;

    const processVideo = () => {
      if (!landmarker || !videoRef.current || cancel) {
        window.requestAnimationFrame(processVideo);
        return;
      }
      
      let time = videoRef.current.currentTime * 1000;
      if (videoTime >= time) {
        window.requestAnimationFrame(processVideo);
        return;
      }
      
      videoTime = time;
      landmarker.detectForVideo(videoRef.current, time, (result) => {
        if (result.landmarks.length === 0) return;
        if (videoTime >= time + 2) return;
        
        const landmark = result.landmarks[0];
        
        // Draw pose on canvas
        if (canvasRef.current) {
          const canvasCtx = canvasRef.current.getContext('2d');
          if (canvasCtx) {
            const drawingUtils = new DrawingUtils(canvasCtx);
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
              color: '#ff00ff'
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, {
              color: '#ff00ff'
            });
            canvasCtx.restore();
          }
        }
        
        // Check if hands are up
        if (
          landmark[BodyLandmarkType.LeftWrist].y < landmark[BodyLandmarkType.Nose].y && 
          landmark[BodyLandmarkType.RightWrist].y < landmark[BodyLandmarkType.Nose].y
        ) {
          setHandsUp(true);
        } else {
          setHandsUp(false);
        }
        
        // Calculate right elbow angle
        if (!isLandmarkEligibleForAngles(BodyLandmarkType.RightElbow, landmark)) {
          setElbowAngle(0);
        } else {
          setElbowAngle(getLandmarkAngle(
            landmark[BodyLandmarkType.RightElbow],
            landmark[BodyLandmarkType.RightShoulder],
            landmark[BodyLandmarkType.RightWrist]
          ));
        }
      });
      
      window.requestAnimationFrame(processVideo);
    };
    
    window.requestAnimationFrame(processVideo);
    return () => {
      cancel = true;
    };
  }, [videoRef, canvasRef, landmarker, loading]);

  // Cleanup on unmount
  useEffect(() => {
    // Store the current value of the ref
    const currentVideoRef = videoRef.current;
    
    const handleVideoEnded = () => {
      console.log('Video ended');
      if (currentVideoRef) {
        currentVideoRef.currentTime = 0;
      }
    };

    if (currentVideoRef) {
      currentVideoRef.addEventListener('ended', handleVideoEnded);
    }

    return () => {
      if (currentVideoRef) {
        currentVideoRef.removeEventListener('ended', handleVideoEnded);
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    // Store the current value of the ref
    const currentVideoRef = videoRef.current;
    
    return () => {
      if (currentVideoRef?.srcObject) {
        const stream = currentVideoRef.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        currentVideoRef.srcObject = null;
      }
    };
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Beta Dance Battle
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Live pose tracking with camera
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr',
            },
            gap: 3,
          }}
        >
          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Camera Feed
            </Typography>
            <Box sx={{ width: '100%', position: 'relative' }}>
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: 400,
                  borderRadius: 8,
                  transform: 'scale(-1, 1)'
                }}
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: 8,
                  transform: 'scale(-1, 1)'
                }}
                width={640}
                height={480}
              />
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Pose Analysis
            </Typography>
            <Box sx={{ width: '100%', p: 2, textAlign: 'center' }}>
              <Typography variant="body1" color={handsUp ? 'success.main' : 'error.main'} gutterBottom>
                {handsUp ? 'Hands are up!' : 'Hands are down'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {elbowAngle === 0 
                  ? '(Not eligible to detect angle)' 
                  : `Current right elbow angle: ${radToDeg(elbowAngle)}°`}
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default BetaDanceBattle;
