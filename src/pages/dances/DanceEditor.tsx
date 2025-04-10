import { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { DrawingUtils, FilesetResolver, Landmark, PoseLandmarker } from '@mediapipe/tasks-vision';
import { Box, Button, Container, IconButton, Paper, Slider, Typography } from '@mui/material';
import { BodyLandmarkType, getLandmarkAngle, isLandmarkEligibleForAngles } from '../../utils/landmark';
import { getEuclideanDistance, radToDeg } from '../../utils/math';
import { Pause, PlayArrow, UploadFile } from '@mui/icons-material';

const DanceEditor = () => {

  const [landmarker, setLandmarker] = useState<PoseLandmarker|null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paused, setPaused] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const gVideoFrame = useRef(0);
  const gPose = useRef<Landmark[]>([]);

  useEffect(() => {
    if (loading) return;
    let cancel = false;

    let videoFrame = gVideoFrame.current;

    const processVideo = () => {
      if (videoFrame > gVideoFrame.current) {
        gVideoFrame.current = videoFrame;
      }
      if (cancel || paused) {
        return;
      }
      if (!landmarker || !videoRef.current || !sliderRef.current) {
        window.requestAnimationFrame(processVideo);
        return;
      }
      let nextFrame = videoFrame++;
      landmarker.detectForVideo(videoRef.current, nextFrame, (result) => {
        if (result.landmarks.length === 0) return;
        const landmark = result.landmarks[0];
        gPose.current = landmark;
        
        if (canvasRef.current) {
          const canvasCtx = canvasRef.current.getContext('2d');
          if (canvasCtx) {
            const drawingUtils = new DrawingUtils(canvasCtx);
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            for (const joint of landmark) {
              canvasCtx.beginPath();
              canvasCtx.arc(canvasRef.current.width * joint.x, canvasRef.current.height * joint.y, 5, 0, 2 * Math.PI);
              canvasCtx.strokeStyle = 'white';
              canvasCtx.stroke();
            }
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, {
              color: '#ffffff',
              lineWidth: 2
            });
            canvasCtx.restore();
          }
        };

      });

      sliderRef.current.value = '' + videoRef.current.currentTime;
      window.requestAnimationFrame(processVideo);
    };
    window.requestAnimationFrame(processVideo);

    return () => {
      cancel = true;
    };
  }, [landmarker, loading, paused]);

  const handleVideoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length || !videoRef.current) return;

    const videoFile = event.target.files[0];
    const localVideoUrl = URL.createObjectURL(videoFile);

    videoRef.current.src = localVideoUrl;

    const loadPoseTracking = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      const poseLandmarker = await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
            // modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task"
          },
          runningMode: 'VIDEO'
        }
      );
      setLandmarker(poseLandmarker);
      setLoading(false);
    };

    // setVideoFile(videoFile);
    // setLocalVideoUrl(URL.createObjectURL(videoFile));
    loadPoseTracking();
  };

  const togglePause = () => {
    if (!videoRef.current) return;
    if (paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setPaused(!paused);
  };

  const updateVideoTime = (event: ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = parseFloat(event.target.value);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !videoRef.current) return;
    const cvsRect = canvasRef.current.getBoundingClientRect();
    const clickX = (event.clientX - cvsRect.left) / videoRef.current.clientWidth;
    const clickY = (event.clientY - cvsRect.top) / videoRef.current.clientHeight;
    const clickDistance = 0.01;

    let maxDist = Infinity;
    let selectedLandmark: Landmark | null = null;

    for (const landmark of gPose.current) {
      let distance = getEuclideanDistance(landmark, {
        x: clickX,
        y: clickY
      });
      if (distance <= clickDistance && distance < maxDist) {
        selectedLandmark = landmark;
      }
    }

    console.log(selectedLandmark);

  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <div hidden={loading}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr',
            },
            gap: 3,
          }}
          hidden={loading}
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
                  borderRadius: 8
                }}
                autoPlay
                playsInline
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: 8
                }}
                width={videoRef.current?.clientWidth ?? 600}
                height={videoRef.current?.clientHeight ?? 400}
                onClick={handleCanvasClick}
              />
            </Box>
            <input
              type="range"
              min={0}
              max={videoRef.current?.duration}
              onChange={updateVideoTime}
              ref={sliderRef}
              step={0.01}
              style={{
                width: '100%'
              }}
            />
            <IconButton aria-label="Pause" onClick={togglePause}>
              {paused ? (
                <PlayArrow />
              ) : (
                <Pause />
              )}
            </IconButton>
          </Paper>

          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Pose Analysis
            </Typography>
            <Box sx={{ width: '100%', p: 2, textAlign: 'center' }}>
              <Typography variant="body1" gutterBottom>
                Testing stuff
              </Typography>
            </Box>
          </Paper>
        </Box>
      </div>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div hidden={!loading}>
          <Typography variant="h4" gutterBottom>
            Dance Uploader
          </Typography>
          <Typography variant='body1' gutterBottom>
            Upload a dance here. (TODO: decent upload UI)
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFile />}
          >
            Upload Video
            <input type="file" accept="video/*" hidden onChange={handleVideoUpload} />
          </Button>
        </div>
      </Container>
    </Container>
  );
};

export default DanceEditor; 