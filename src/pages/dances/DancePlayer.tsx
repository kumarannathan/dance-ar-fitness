import { ChangeEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DrawingUtils, FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { Alert, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { FramePresenceType, getPresenceForFrame, gradePose, isHandsUp, ScoringPoseData } from '../../utils/landmark';
import { UploadFile } from '@mui/icons-material';
import { useParams, useSearchParams } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import type { FirestoreDanceTrackObject } from '../../types/firestoreDataTypes';

// How many seconds to allow a maximum score to be reached
const DANCE_SCORING_PERIOD = 0.75;
// How long to wait until we start the scoring process, this gives the user
// some time to see the dance move and try to make it on their own. We may want
// to make this configurable by the user so more advanced dancers don't lose points
// for being on time.
const DANCE_SCORING_START_DELAY = 0.0;
// This shows how many seconds we will display scoring feedback to the user.
const DANCE_SCORING_FEEDBACK_PERIOD = 1.5;
const DANCE_HANDS_UP_DURATION = 3.0;

interface DanceScoringDataPoints {
  t: number;
  p: ScoringPoseData[];
};

const getScoreData = (ratio: number) => {
  console.log(ratio);
  // TODO: change these ratios after testing!
  if (ratio >= 0.95) {
    return {
      color: '#c98a1c',
      status: 'perfect'
    };
  } else if (ratio >= 0.90) {
    return {
      color: '#a0a0f0',
      status: 'amazing'
    };
  } else if (ratio >= 0.80) {
    return {
      color: '#056312',
      status: 'great'
    }
  } else if (ratio >= 0.50) {
    return {
      color: '#61038c',
      status: 'okay'
    };
  }
  return {
    color: '#888888',
    status: 'x'
  };
};

const getColorForPresence = (presence: FramePresenceType) => {
  switch (presence) {
    case FramePresenceType.OutOfFrame:
      return '#ff695e';
    case FramePresenceType.PartialInFrame:
      return '#ffdd8c';
    case FramePresenceType.CompleteInFrame:
      return '#deffb8';
  }
  return 'white';
}

const DancePlayer = () => {

  const { danceId } = useParams();
  const [searchParams] = useSearchParams();
  const debugMode = danceId === 'debug';
  const debugVideoSrc = searchParams.get('video');

  const [landmarker, setLandmarker] = useState<PoseLandmarker|null>(null);
  const [cameraLandmarker, setCameraLandmarker] = useState<PoseLandmarker|null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentScore, setCurrentScore] = useState(0);
  const [scoringData, setScoringData] = useState<DanceScoringDataPoints[]>([]);
  const [hasLoadedVideo, setHasLoadedVideo] = useState(false);
  const [loadError, setHasLoadError] = useState(false);
  const [trackInfo, setTrackInfo] = useState<FirestoreDanceTrackObject>({
    userId: '0',
    title: 'Locally Uploaded File',
    description: 'This file was provided by a local debug upload',
    songTitle: 'Local File',
    songAuthor: 'Debug Mode',
    duration: '00:00',
    visibility: 'private',
    videoUrl: '--',
    scoreData: []
  });
  const [starting, setStarting] = useState(true);
  const [startingTimeRemaining, setStartingTimeRemaining] = useState(0);
  const [framePresence, setFramePresence] = useState<FramePresenceType>(FramePresenceType.CompleteInFrame);
  const [totalScore, setTotalScore] = useState(0);
  const [userMediaStream, setUserMediaStream] = useState<MediaStream|null>(null);
  const [reachedEndOfDance, setReachedEndOfDance] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camVideoRef = useRef<HTMLVideoElement>(null);
  const camCanvasRef = useRef<HTMLCanvasElement>(null);
  const camDebugCanvasRef = useRef<HTMLCanvasElement>(null);
  // This is a ref so we don't cause a re-render every time we update it in useEffect
  const scoringStatisticsRef = useRef<number[]>([]);
  const hasLoadedRef = useRef(false);
  const handsUpStartTimeRef = useRef(0);
  const camVideoTimeRef = useRef(0);

  useEffect(() => {
    if (loading) return;

    let cancel = false;

    // camera
    let camVideoTime = camVideoTimeRef.current;
    const processCamera = () => {
      if (!cameraLandmarker || !camVideoRef.current || !camCanvasRef.current || cancel) return;
      let time = camVideoRef.current.currentTime * 1000;
      if (camVideoTime >= time) {
        window.requestAnimationFrame(processCamera);
        return;
      }
      camVideoTime = time;
      // we do this to mirror the webcam video, since it's provided to us unmirrored which is very annoying.
      const camCanvasCtx = camCanvasRef.current.getContext('2d');
      if (camCanvasCtx) {
        camCanvasCtx.save();
        camCanvasCtx.clearRect(0, 0, camCanvasRef.current.width, camCanvasRef.current.height);
        camCanvasCtx.translate(camCanvasRef.current.width, 0);
        camCanvasCtx.scale(-1, 1);
        camCanvasCtx.drawImage(camVideoRef.current, 0, 0, camCanvasRef.current.width, camCanvasRef.current.height);
        camCanvasCtx.restore();
      }
      // we also process the video in mirrored form, which is why this cant just be a simple CSS hack
      cameraLandmarker.detectForVideo(camCanvasRef.current, time, (result) => {
        if (result.landmarks.length === 0) {
          setFramePresence(FramePresenceType.OutOfFrame);
          return;
        }
        if (!videoRef.current || !camVideoRef.current) return;
        if (videoRef.current.ended && videoRef.current.currentTime > 0.1) {
          setReachedEndOfDance(true);
          camVideoTime = Infinity;
          return;
        }
        if (camVideoTime >= time + 2) return;
        const landmark = result.landmarks[0];
        if (camDebugCanvasRef.current) {
          const canvasCtx = camDebugCanvasRef.current.getContext('2d');
          if (canvasCtx) {
            const drawingUtils = new DrawingUtils(canvasCtx);
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, camDebugCanvasRef.current.width, camDebugCanvasRef.current.height);
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1)
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            canvasCtx.restore();
          }
        }
        if (!cancel && starting) {
          if (handsUpStartTimeRef.current === 0) {
            if (isHandsUp(landmark)) {
              handsUpStartTimeRef.current = Date.now();
              setStartingTimeRemaining(DANCE_HANDS_UP_DURATION);
            }
          } else if (handsUpStartTimeRef.current !== 0) {
            if (!isHandsUp(landmark)) {
              handsUpStartTimeRef.current = 0;
              setStartingTimeRemaining(0);
              return;
            }
            const danceStartTime = (handsUpStartTimeRef.current + (DANCE_HANDS_UP_DURATION * 1000));
            if (danceStartTime - Date.now() < 0) {
              setStarting(false);
              videoRef.current.play();
            } else {
              setStartingTimeRemaining(Math.ceil((danceStartTime - Date.now())/1000));
            }
          }
          return;
        }
        setFramePresence(getPresenceForFrame(landmark));
        let feedbackEligibilityCount = 0;
        for (let i = 0; i < scoringData.length; ++i) {
          const scoreTimestamp = scoringData[i];
          const danceStartTime = scoreTimestamp.t + DANCE_SCORING_START_DELAY;
          const danceEndTime = scoreTimestamp.t + DANCE_SCORING_START_DELAY + DANCE_SCORING_PERIOD;
          if (danceEndTime < videoRef.current.currentTime && danceEndTime + DANCE_SCORING_FEEDBACK_PERIOD > videoRef.current.currentTime) {
            setCurrentScore(scoringStatisticsRef.current[i] / scoreTimestamp.p.map(x => x.i).reduce((a, b) => a + b));
            setTotalScore(scoringStatisticsRef.current.reduce((a, b) => a + b, 0));
            ++feedbackEligibilityCount;
            continue;
          }
          if (danceStartTime > videoRef.current.currentTime || danceEndTime < videoRef.current.currentTime) continue;
          
          // find their current score
          const userScore = gradePose(landmark, scoreTimestamp.p);
          if (userScore > scoringStatisticsRef.current[i]) {
            scoringStatisticsRef.current[i] = userScore;
          }
        }
        if (feedbackEligibilityCount === 0) {
          setCurrentScore(0);
        }
      });
      camVideoTimeRef.current = camVideoTime;
      window.requestAnimationFrame(processCamera);
    };
    window.requestAnimationFrame(processCamera);

    return () => {
      cancel = true;
    };
  }, [videoRef, canvasRef, scoringStatisticsRef, scoringData, landmarker, cameraLandmarker, loading, starting]);

  const fetchFirebaseData = useCallback(async () => {
    const result = await getDoc(doc(collection(db, 'dances'), danceId));
    if (!result.exists) {
      throw new Error('document does not exist!');
    }
    const data = result.data();
    if (!data) {
      throw new Error('document data not found!');
    }
    return data as FirestoreDanceTrackObject;
  }, [danceId]);

  const loadFirebaseData = useCallback((data: FirestoreDanceTrackObject) => {
    setTrackInfo(data);
    setScoringData(data.scoreData);
    scoringStatisticsRef.current = Array(data.scoreData.length).fill(0);
    if (videoRef.current) {
      videoRef.current.src = data.videoUrl;
    }
  }, []);

  useEffect(() => {
    // This only fetches data when given a Firebase Dance ID
    if (debugMode || hasLoadedRef.current) return;

    // let cancel = false;
    hasLoadedRef.current = true;

    const fetchWrapper = async () => {
      try {
        const data = await fetchFirebaseData();
        // if (cancel) return;
        loadFirebaseData(data);
        loadPoseTracking();
      } catch (error) {
        console.error(error);
        setHasLoadError(true);
      }
    };

    fetchWrapper();
    /*
    return () => {
      cancel = true;
    };
    */
  }, [debugMode, fetchFirebaseData, loadFirebaseData, loadError]);

  // Add a new effect to handle debug video source
  useEffect(() => {
    if (debugMode && debugVideoSrc && videoRef.current) {
      videoRef.current.src = debugVideoSrc;
      setHasLoadedVideo(true);
      if (scoringData.length !== 0) {
        loadPoseTracking();
      }
    }
  }, [debugMode, debugVideoSrc, scoringData.length]);

  // Use another effect to handle end of dance logic, specifically turning off the webcam stream
  useEffect(() => {
    if (reachedEndOfDance && userMediaStream) {
      userMediaStream.getTracks().map(x => x.stop());
    }
  }, [reachedEndOfDance, userMediaStream]);

  const loadPoseTracking = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
    if (!mediaStream || !camVideoRef.current || !videoRef.current) {
      setHasLoadError(true);
      return;
    }
    setUserMediaStream(mediaStream);
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
    videoRef.current.load();
  };

  const handleVideoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length || !videoRef.current) return;

    const videoFile = event.target.files[0];
    const localVideoUrl = URL.createObjectURL(videoFile);

    videoRef.current.src = localVideoUrl;

    // setVideoFile(videoFile);
    // setLocalVideoUrl(URL.createObjectURL(videoFile));
    setHasLoadedVideo(true);
    if (scoringData.length !== 0)
      loadPoseTracking();
  };

  const handleJsonUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length || !videoRef.current) return;

    const scoringFile = event.target.files[0];
    const scoringDataText = await scoringFile.text();
    let scoringData: DanceScoringDataPoints[] = [];
    
    try {
      scoringData = JSON.parse(scoringDataText);
    } catch (ex) {
      alert(`encountered error while parsing dance JSON: ${ex}`);
      return;
    }

    setScoringData(scoringData);
    scoringStatisticsRef.current = Array(scoringData.length).fill(0);
    if (hasLoadedVideo)
      loadPoseTracking();
  }

  if (reachedEndOfDance) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* TODO: end of round design here */}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading ? (
        (debugMode ? (
          <>
            <Typography variant="h4" gutterBottom>
              Dance Player Debug Mode
            </Typography>
            <Typography>
              This is a debug screen that allows you to test from local files. Upload a video and a scoring data file to get started.
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFile />}
            >
              Upload Video
              <input type="file" accept="video/*" hidden onChange={handleVideoUpload} />
            </Button>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFile />}
            >
              Upload Scoring Data
              <input type="file" accept="application/json" hidden onChange={handleJsonUpload} />
            </Button>
          </>
        ) : (loadError ? (
          <center>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', my: 4 }}>
              <Alert severity='error' sx={{mb: 3, textAlign: 'left'}}>
                Sorry, it looks like we had trouble loading the dance. Try again by clicking the button below! If the issue is
                not resolved shortly, it may mean that the dance has been deleted or you do not have permission to play it.
              </Alert>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center' }}>
                <Button
                  onClick={() => {
                    hasLoadedRef.current = false;
                    setHasLoadError(false);
                  }}
                  variant='outlined'
                >
                  Retry
                </Button>
              </Box>
            </Box>
          </center>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ))
      )) : ''}
      {(debugMode ? currentScore !== 0 : getScoreData(currentScore).status !== 'x') ? (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: getScoreData(currentScore).color,
          margin: '10px',
          zIndex: 4,
          padding: '5px 30px',
          borderRadius: 10
        }} hidden={loading}>
          <div style={{
            fontSize: '50px',
            fontWeight: 'bolder',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
          }}>
            {getScoreData(currentScore).status.toUpperCase()}
          </div>
        </div>
      ) : ''}
      <div style={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        bottom: '0px',
        right: '0px',
        textAlign: 'center',
        backgroundColor: '#000000',
        zIndex: 3
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
        maxWidth: '200px',
        zIndex: 5
      }}>
        <video ref={camVideoRef} width={"100%"} playsInline style={{opacity: 0}} />
        <canvas ref={camCanvasRef} height={camVideoRef.current?.clientHeight} width={camVideoRef.current?.clientWidth} style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}></canvas>
        <canvas
          ref={camDebugCanvasRef}
          height={camVideoRef.current?.clientHeight}
          width={camVideoRef.current?.clientWidth}
          style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 6}} 
          hidden={!debugMode && !window.location.hostname.includes('localhost')}
        ></canvas>
      </div>
      {!starting ? (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            borderLeft: '5px solid ' + getColorForPresence(framePresence),
            display: loading ? 'none' : 'flex',
            flexDirection: 'column',
            paddingLeft: 20
          }}
        >
          <div style={{
            fontSize: '2.0em',
            fontWeight: 'bolder',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
          }}>
            Score: {Math.round(totalScore).toLocaleString()}
          </div>
          <div style={{
            fontSize: '1.5em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
          }}>
            {framePresence === FramePresenceType.OutOfFrame ? `We can't see you right now! Try making sure you are in frame!` : 
              (framePresence === FramePresenceType.PartialInFrame) ? `It looks like you are a little out of frame!` : 
                `You're in frame!`}
          </div>
        </div>
      ) : ''}
      {(starting && !loading) ? (
        <div style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          bottom: '0px',
          right: '0px',
          zIndex: 4,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{margin: '0 auto', textAlign: 'center'}}>
            <div style={{
              fontSize: '4em',
              fontWeight: 'bolder',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
            }}>
              {startingTimeRemaining === 0 ? 'Get your hands up!' : `Starting in ${startingTimeRemaining} second${startingTimeRemaining !== 1 ? 's' : ''}`}
            </div>
            <div style={{
              fontSize: '2em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
            }}>
              {startingTimeRemaining === 0 ? 'To start playing, put your hands in the air for three seconds!' : `Keep your hands up to start playing!`}
            </div>
          </div>
        </div>
      ) : ''}
    </Container>
  );
};

export default DancePlayer;