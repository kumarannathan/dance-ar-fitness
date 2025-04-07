import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DrawingUtils, FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { Button, Container, Typography } from '@mui/material';
import { BodyLandmarkType, getLandmarkAngle, gradePose, ScoringPoseData } from '../../utils/landmark';
import { UploadFile } from '@mui/icons-material';

const LiveVideoScoreDebugger = () => {

  const [landmarker, setLandmarker] = useState<PoseLandmarker|null>(null);
  const [cameraLandmarker, setCameraLandmarker] = useState<PoseLandmarker|null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentScore, setCurrentScore] = useState(0);

  // const [videoFile, setVideoFile] = useState<File|null>(null);
  // const [localVideoUrl, setLocalVideoUrl] = useState<string|null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camVideoRef = useRef<HTMLVideoElement>(null);
  const camCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (loading) return;

    let cancel = false;
    let targets: ScoringPoseData[] = [
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
    ];

    // video
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
      let nextFrame = videoFrame++;
      videoTime = time;
      landmarker.detectForVideo(videoRef.current, nextFrame, (result) => {
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
              color: '#00ff00'
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, {
              color: '#00ff00'
            });
            canvasCtx.restore();
          }
        }
        
        for (let target of targets) {
          target.y = getLandmarkAngle(landmark[target.b], landmark[target.a], landmark[target.c]);
        }
      });
      window.requestAnimationFrame(processVideo);
    };
    window.requestAnimationFrame(processVideo);

    // camera
    let camVideoTime = 0;
    const processCamera = () => {
      if (!cameraLandmarker || !camVideoRef.current || cancel) return;
      let time = camVideoRef.current.currentTime * 1000;
      if (camVideoTime >= time) {
        window.requestAnimationFrame(processCamera);
        return;
      }
      camVideoTime = time;
      cameraLandmarker.detectForVideo(camVideoRef.current, time, (result) => {
        if (result.landmarks.length === 0) return;
        if (camVideoTime >= time + 2) return;
        const landmark = result.landmarks[0];
        if (camCanvasRef.current) {
          const canvasCtx = camCanvasRef.current.getContext('2d');
          if (canvasCtx) {
            const drawingUtils = new DrawingUtils(canvasCtx);
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, camCanvasRef.current.width, camCanvasRef.current.height);
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1)
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            canvasCtx.restore();
          }
        }
        setCurrentScore(gradePose(landmark, targets));
      });
      window.requestAnimationFrame(processCamera);
    };
    window.requestAnimationFrame(processCamera);

    return () => {
      cancel = true;
    };
  }, [videoRef, canvasRef, landmarker, cameraLandmarker, loading]);

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

  const handleVideoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length || !videoRef.current) return;

    const videoFile = event.target.files[0];
    const localVideoUrl = URL.createObjectURL(videoFile);

    videoRef.current.src = localVideoUrl;

    const loadPoseTracking = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      if (!mediaStream || !camVideoRef.current || !videoRef.current) {
        alert("must grant camera access!");
        return;
      }
      camVideoRef.current.srcObject = mediaStream;

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
      const camLandmarker = await PoseLandmarker.createFromOptions(
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
      setCameraLandmarker(camLandmarker);
      setLoading(false);
      camVideoRef.current.play();
      videoRef.current.play();
    };

    // setVideoFile(videoFile);
    // setLocalVideoUrl(URL.createObjectURL(videoFile));
    loadPoseTracking();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading ? (
        <>
          <Typography variant="h4" gutterBottom>
            live video score debugger (pls use chrome thx)
          </Typography>
          <Typography>
            this test will play a video file next to live video of the camera and compare the scores.
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFile />}
          >
            Upload Video
            <input type="file" accept="video/*" hidden onChange={handleVideoUpload} />
          </Button>
        </>
      ) : (
        <>
          <center>
            <Typography variant="h1" style={{color: getColorForScore(currentScore)}}>
              {Math.round(currentScore)}
            </Typography>
          </center>
        </>
      )}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: '#000000',
        margin: '10px',
        zIndex: 2
      }} hidden={loading}>
        <Typography variant="h1" style={{color: getColorForScore(currentScore)}}>
          {Math.round(currentScore)}
        </Typography>
      </div>
      <div style={{
        position: 'absolute',
        transform: 'scale(-1, 1)',
        top: '0px',
        left: '0px',
        bottom: '0px',
        right: '0px',
        textAlign: 'center',
        backgroundColor: '#000000'
      }} hidden={loading}>
        <video ref={videoRef} height={"100%"} playsInline />
        <canvas
          ref={canvasRef}
          height={videoRef.current?.clientHeight}
          width={videoRef.current?.clientWidth}
          style={{
            position: 'absolute',
            left: '0px',
            right: '0px',
            margin: '0 auto'
          }}></canvas>
      </div>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        maxWidth: '200px'
      }}>
        <video ref={camVideoRef} width={"100%"} playsInline style={{transform: 'scale(-1, 1)'}} />
        <canvas ref={camCanvasRef} height={camVideoRef.current?.clientHeight} width={camVideoRef.current?.clientWidth} style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, transform: 'scale(-1, 1)'}}></canvas>
      </div>
    </Container>
  );
};

export default LiveVideoScoreDebugger; 