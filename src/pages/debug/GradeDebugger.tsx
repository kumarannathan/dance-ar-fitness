import { useEffect, useRef, useState } from 'react';
import { DrawingUtils, FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { Button, Container, Typography } from '@mui/material';
import { BodyLandmarkType, getLandmarkAngle, gradePose, ScoringPoseData } from '../../utils/landmark';

const GradeDebugger = () => {

  const [landmarker, setLandmarker] = useState<PoseLandmarker|null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [countdown, setCountdown] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [poseCaptureTime, setPoseCaptureTime] = useState(0);
  const [targets, setTargets] = useState<ScoringPoseData[]>([
    {
      a: BodyLandmarkType.LeftShoulder,
      b: BodyLandmarkType.LeftElbow,
      c: BodyLandmarkType.LeftWrist,
      y: 0,
      i: 125
    },
    {
      a: BodyLandmarkType.LeftHip,
      b: BodyLandmarkType.LeftShoulder,
      c: BodyLandmarkType.LeftElbow,
      y: 0,
      i: 125
    },
    {
      a: BodyLandmarkType.RightShoulder,
      b: BodyLandmarkType.RightElbow,
      c: BodyLandmarkType.RightWrist,
      y: 0,
      i: 125
    },
    {
      a: BodyLandmarkType.RightHip,
      b: BodyLandmarkType.RightShoulder,
      c: BodyLandmarkType.RightElbow,
      y: 0,
      i: 125
    }
  ]);

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
        
        if (poseCaptureTime !== 0) {
          if (Date.now() >= poseCaptureTime) {
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
            let newTargets = targets;
            for (let target of newTargets) {
              target.y = getLandmarkAngle(landmark[target.b], landmark[target.a], landmark[target.c]);
            }
            setCountdown(0);
            setPoseCaptureTime(0);
            setTargets(newTargets);
          } else {
            setCountdown(Math.ceil((poseCaptureTime - Date.now()) / 1000));
          }
        }

        setCurrentScore(gradePose(landmark, targets));
        
      });
      window.requestAnimationFrame(processVideo);
    };
    window.requestAnimationFrame(processVideo);
    return () => {
      cancel = true;
    };
  }, [videoRef, canvasRef, landmarker, loading, targets, poseCaptureTime]);

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

  const startCapturePose = () => {
    if (poseCaptureTime !== 0) return;
    setPoseCaptureTime(Date.now() + 3000);
  }

  const getColorForScore = (score: number) => {
    if (score >= 450) {
      return '#ff00ff';
    } else if (score >= 400) {
      return '#00ff00';
    } else if (score >= 350) {
      return '#ffff00';
    } else if (score >= 250) {
      return '#ffbb00';
    } else if (score >= 150) {
      return '#ff0000';
    }
    return '#ffffff';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {loading ? "please wait..." : "grade debugger"}
      </Typography>
      <center>
        <Typography variant="h1" style={{color: getColorForScore(currentScore)}}>
          {Math.round(currentScore)}
        </Typography>
        <Button style={{marginTop: '4px', marginBottom: '4px'}}component="label" variant="outlined" hidden={loading} onClick={startCapturePose}>
          Capture Pose
        </Button>
        
      </center>

      <div style={{
        position: 'relative'
      }} hidden={loading}>
        <video ref={videoRef} autoPlay playsInline style={{transform: 'scale(-1,1)'}} />
        <canvas ref={canvasRef} height={videoRef.current?.clientHeight} width={videoRef.current?.clientWidth} style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 1, transform: 'scale(-1,1)'}}></canvas>
        <div style={{position: 'absolute', display: countdown === 0 ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', left: 0, top: 0, right: 0, bottom: 0, zIndex: 2, backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div>
            <Typography variant="h1">
              {countdown}
            </Typography>
          </div>
        </div>
      </div>
      
    </Container>
  );
};

export default GradeDebugger; 