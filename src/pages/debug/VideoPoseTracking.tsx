import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DrawingUtils, FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { Box, Button, Container, Typography } from '@mui/material';
import { BodyLandmarkType, getLandmarkAngle, isLandmarkEligibleForAngles } from '../../utils/landmark';
import { radToDeg } from '../../utils/math';
import { UploadFile } from '@mui/icons-material';

const VideoPoseTracking = () => {

  const [landmarker, setLandmarker] = useState<PoseLandmarker|null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [handsUp, setHandsUp] = useState(true);
  const [elbowAngle, setElbowAngle] = useState(0);

  const [videoFile, setVideoFile] = useState<File|null>(null);
  const [localVideoUrl, setLocalVideoUrl] = useState<string|null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (loading) return;

    let cancel = false;
    let videoTime = 0;
    let videoFrame = 0;

    const processVideo = () => {
      if (cancel) {
        return;
      }
      if (!landmarker || !videoRef.current) {
        window.requestAnimationFrame(processVideo);
        return;
      }
      let time = videoRef.current.currentTime * 1000;
      if (videoTime >= time) {
        window.requestAnimationFrame(processVideo);
        return;
      }
      videoFrame++;
      landmarker.detectForVideo(videoRef.current, videoFrame, (result) => {
        if (result.landmarks.length === 0) return;
        const landmark = result.landmarks[0];
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
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            canvasCtx.restore();
          }
        }
        if (
          landmark[BodyLandmarkType.LeftWrist].y < landmark[BodyLandmarkType.Nose].y && 
          landmark[BodyLandmarkType.RightWrist].y < landmark[BodyLandmarkType.Nose].y
        ) {
          setHandsUp(true);
        } else {
          setHandsUp(false);
        }
        if (!isLandmarkEligibleForAngles(BodyLandmarkType.RightElbow, landmark)) {
          setElbowAngle(0);
        } else {
          // in real world, we should test for the existence of each joint, but this works here.
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
  }, [videoRef, canvasRef, landmarker, setHandsUp, loading]);

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

    setVideoFile(videoFile);
    setLocalVideoUrl(URL.createObjectURL(videoFile));
    loadPoseTracking();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        file-based video pose visualizer
      </Typography>
      <Typography variant='body1' gutterBottom>
        {handsUp ? 'hands are up' : 'hands are down'}
      </Typography>
      <Typography variant='body1' gutterBottom>
        {elbowAngle === 0 ? '(not eligible to detect angle)' : `current right elbow angle: ${radToDeg(elbowAngle)}˚`}
      </Typography>
      <Button
        component="label"
        variant="outlined"
        startIcon={<UploadFile />}
      >
        Upload Video
        <input type="file" accept="video/*" hidden onChange={handleVideoUpload} />
      </Button>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        <div style={{
          position: 'relative'
        }} hidden={loading}>
          <video ref={videoRef} width={"100%"} autoPlay playsInline controls />
          <canvas ref={canvasRef} height={videoRef.current?.clientHeight} width={videoRef.current?.clientWidth} style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}></canvas>
        </div>
      </Box>
    </Container>
  );
};

export default VideoPoseTracking; 