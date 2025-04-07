import { useEffect, useRef, useState } from 'react';
import { DrawingUtils, FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { Box, Container, Typography } from '@mui/material';
import { BodyLandmarkType, getLandmarkAngle, isLandmarkEligibleForAngles } from '../../utils/landmark';
import { radToDeg } from '../../utils/math';

const PoseTracking = () => {

  const [landmarker, setLandmarker] = useState<PoseLandmarker|null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [handsUp, setHandsUp] = useState(true);
  const [elbowAngle, setElbowAngle] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (loading) return;

    let cancel = false;
    let videoTime = 0;

    const processVideo = () => {
      if (!landmarker || !videoRef.current || cancel) return;
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
        if (canvasRef.current) {
          const canvasCtx = canvasRef.current.getContext('2d');
          if (canvasCtx) {
            const drawingUtils = new DrawingUtils(canvasCtx);
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1)
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

  useEffect(() => {
    let cancel = false;
    const loadPoseTracking = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      if (!mediaStream || !videoRef.current) {
        alert("must grant camera access!");
        return;
      }
      videoRef.current.srcObject = mediaStream;
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );
      if (cancel) return;
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
      setLandmarker(poseLandmarker);
      setLoading(false);
    };
    loadPoseTracking();
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {loading ? "please wait..." : "debug pose visualizer"}
      </Typography>
      <Typography variant='body1' gutterBottom>
        {handsUp ? 'hands are up' : 'hands are down'}
      </Typography>
      <Typography variant='body1' gutterBottom>
        {elbowAngle === 0 ? '(not eligible to detect angle)' : `current right elbow angle: ${radToDeg(elbowAngle)}˚`}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        <div style={{
          position: 'relative'
        }}>
          <video ref={videoRef} width={"100%"} autoPlay playsInline />
          <canvas ref={canvasRef} height={videoRef.current?.clientHeight} width={videoRef.current?.clientWidth} style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}></canvas>
        </div>
      </Box>
    </Container>
  );
};

export default PoseTracking; 