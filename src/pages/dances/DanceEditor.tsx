import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { DrawingUtils, FilesetResolver, Landmark, PoseLandmarker } from '@mediapipe/tasks-vision';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Alert, Box, Button, Checkbox, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { BODY_LANDMARK_NAMES, getConnectedLandmarks, getLandmarkAngle, getLandmarkEligibleConnections, isLandmarkEligibleForAngles, ScoringPoseData } from '../../utils/landmark';
import { getEuclideanDistance, radToDeg } from '../../utils/math';
import { ExpandMore, Pause, PlayArrow, UploadFile } from '@mui/icons-material';
import { FirestoreDanceTrackObject } from '../../types/firestoreDataTypes';
import { useUser } from '../../contexts/UserContext';
import { uploadVideo } from '../../utils/videoUpload';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';

interface BodyLandmarkSelectionDetails extends Landmark {
  landmarkIndex: number;
  clickX: number;
  clickY: number;
  startIndex: number;
  endIndex: number;
  points: number;
}

interface DanceScoringDataPoints {
  t: number;
  p: ScoringPoseData[];
  _poseAtTimestamp: Landmark[];
};

const DanceEditor = () => {
  const { user } = useUser();

  const [landmarker, setLandmarker] = useState<PoseLandmarker|null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paused, setPaused] = useState<boolean>(false);
  const [landmarkSelection, setLandmarkSelection] = useState<BodyLandmarkSelectionDetails|null>(null);
  const [scoreData, setScoreData] = useState<DanceScoringDataPoints[]>([]);
  const [fittingEnabled, setFittingEnabled] = useState(false);
  const [editPointsOpen, setEditPointsOpen] = useState(false);
  const [editPointsScore, setEditPointsScore] = useState(0);
  const [editPointsIndex, setEditPointsIndex] = useState(0);

  const [videoFile, setVideoFile] = useState<File|null>(null);
  const [hasPublishingDialogOpen, setHasPublishingDialogOpen] = useState(false);
  const [uploadDetails, setUploadDetails] = useState<FirestoreDanceTrackObject>({
    userId: '0', // (to be filled out upon sending request)
    title: '',
    description: '',
    songTitle: '',
    songAuthor: '',
    duration: '',
    visibility: 'public',
    videoUrl: '',
    scoreData: []
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [submissionFailure, setSubmissionFailure] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const gVideoFrame = useRef(0);
  const gPose = useRef<Landmark[]>([]);

  const drawPose = useCallback((landmark: Landmark[]) => {
    if (canvasRef.current) {
      const canvasCtx = canvasRef.current.getContext('2d');
      if (canvasCtx) {
        const drawingUtils = new DrawingUtils(canvasCtx);
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        for (const joint in landmark) {
          if (!isLandmarkEligibleForAngles(parseInt(joint), landmark)) {
            continue;
          }

          canvasCtx.beginPath();
          canvasCtx.arc(canvasRef.current.width * landmark[joint].x, canvasRef.current.height * landmark[joint].y, 5, 0, 2 * Math.PI);
          canvasCtx.strokeStyle = 'white';
          if (landmarkSelection && landmarkSelection.landmarkIndex === parseInt(joint)) {
            canvasCtx.strokeStyle = '#00ff00';
          }
          canvasCtx.stroke();
        }
        drawingUtils.drawConnectors(landmark, getLandmarkEligibleConnections(), {
          color: '#ffffff',
          lineWidth: 2
        });
        canvasCtx.restore();
      }
    }
  }, [landmarkSelection]);

  useEffect(() => {
    if (loading) return;
    let cancel = false;

    let videoFrame = gVideoFrame.current;

    const processVideo = () => {
      if (cancel || (paused && !fittingEnabled)) {
        return;
      }
      if (!landmarker || !videoRef.current || !sliderRef.current) {
        window.requestAnimationFrame(processVideo);
        return;
      }
      let nextFrame = videoFrame++;
      if (videoFrame > gVideoFrame.current) {
        gVideoFrame.current = videoFrame + 1;
      }
      landmarker.detectForVideo(videoRef.current, nextFrame, (result) => {
        if (result.landmarks.length === 0) return;
        const landmark = result.landmarks[0];
        gPose.current = landmark;
        drawPose(landmark);
      });

      sliderRef.current.value = '' + videoRef.current.currentTime;
      window.requestAnimationFrame(processVideo);
    };
    window.requestAnimationFrame(processVideo);

    return () => {
      cancel = true;
    };
  }, [landmarker, loading, paused, fittingEnabled, drawPose, landmarkSelection]);

  useEffect(() => {
    if (!videoRef.current || !paused) return;

    drawPose(gPose.current)
  }, [drawPose, paused, landmarkSelection]);

  const handleVideoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length || !videoRef.current) return;

    const videoFile = event.target.files[0];
    setVideoFile(videoFile);
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
      if (landmarkSelection != null) {
        setLandmarkSelection(null);
      }
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
    // Right now, we will only allow clicking while paused.
    if (!canvasRef.current || !videoRef.current || !paused || fittingEnabled) return;

    const cvsRect = canvasRef.current.getBoundingClientRect();
    const clickX = (event.clientX - cvsRect.left) / videoRef.current.clientWidth;
    const clickY = (event.clientY - cvsRect.top) / videoRef.current.clientHeight;
    const clickDistance = 0.01;

    let maxDist = Infinity;
    let selectedLandmark: BodyLandmarkSelectionDetails | null = null;

    for (const landmarkIndex in gPose.current) {
      const landmark = gPose.current[landmarkIndex];
      let distance = getEuclideanDistance(landmark, {
        x: clickX,
        y: clickY
      });
      if (distance <= clickDistance && distance < maxDist) {
        const connected = getConnectedLandmarks(parseInt(landmarkIndex), gPose.current);
        if (connected.length < 2) continue;
        selectedLandmark = {
          landmarkIndex: parseInt(landmarkIndex),
          clickX: event.clientX - cvsRect.left,
          clickY: event.clientY - cvsRect.top,
          startIndex: connected[0],
          endIndex: connected[1],
          points: 100,
          ...landmark
        };
      }
    }

    setLandmarkSelection(selectedLandmark);
  };

  const handleSelectStartAngle = (event: SelectChangeEvent) => {
    if (!landmarkSelection) return;
    let updatedSelection = {...landmarkSelection};
    updatedSelection.startIndex = parseInt(event.target.value);
    setLandmarkSelection(updatedSelection);
  };

  const handleSelectEndAngle = (event: SelectChangeEvent) => {
    if (!landmarkSelection) return;
    let updatedSelection = {...landmarkSelection};
    updatedSelection.endIndex = parseInt(event.target.value);
    setLandmarkSelection(updatedSelection);
  };

  const handleChangePoints = (event: ChangeEvent<HTMLInputElement>) => {
    if (!landmarkSelection || isNaN(parseInt(event.target.value))) return;
    const points = parseInt(event.target.value);
    let updatedSelection = {...landmarkSelection};
    updatedSelection.points = points;
    setLandmarkSelection(updatedSelection);
  };

  const cancelLandmarkSelection = () => {
    setLandmarkSelection(null);
  };

  const saveLandmarkSelection = () => {
    if (!landmarkSelection || !videoRef.current) return;
    const videoTime = (Math.round(videoRef.current.currentTime * 100) / 100);
    let updatedScoreData = [...scoreData];
    // look for existing data for the timestamp
    let existingIndex: number = NaN;
    for (let i = 0; i < updatedScoreData.length; ++i) {
      if (updatedScoreData[i].t === videoTime) {
        existingIndex = i;
        break;
      }
    }
    if (isNaN(existingIndex)) {
      existingIndex = updatedScoreData.length;
      updatedScoreData.push({
        t: videoTime,
        p: [],
        _poseAtTimestamp: gPose.current
      });
    }
    updatedScoreData[existingIndex].p.push({
      a: landmarkSelection.startIndex,
      b: landmarkSelection.landmarkIndex,
      c: landmarkSelection.endIndex,
      y: getLandmarkAngle(
        gPose.current[landmarkSelection.landmarkIndex],
        gPose.current[landmarkSelection.startIndex],
        gPose.current[landmarkSelection.endIndex]
      ),
      i: landmarkSelection.points
    });
    setLandmarkSelection(null);
    setScoreData(updatedScoreData);
  };

  const jumpToTimestamp = (time: number) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = time;
    videoRef.current.pause();
    setPaused(true);

    // check for pose data
    for (const scoringInfo of scoreData) {
      if ((Math.round(scoringInfo.t * 100) / 100) === (Math.round(time * 100) / 100)) {
        gPose.current = scoringInfo._poseAtTimestamp;
        drawPose(scoringInfo._poseAtTimestamp);
      }
    }
  };

  const handleDeleteAngle = (index: number) => {
    // get the current scoring data
    let updatedScoringData = [...scoreData];
    const currentScoringData = updatedScoringData.filter(x => x.t === (Math.round(videoRef.current!.currentTime * 100) / 100))[0];
    currentScoringData.p.splice(index, 1);
    updatedScoringData = updatedScoringData.filter(x => x.p.length !== 0);
    setScoreData(updatedScoringData);
  };

  const handleDeleteTimestamp = (timestamp: number) => {
    setScoreData([...scoreData].filter(x => x.t !== timestamp));
  }

  const handleOpenEditPoints = (index: number) => {
    // get the current scoring data
    const currentScoringData = scoreData.filter(x => x.t === (Math.round(videoRef.current!.currentTime * 100) / 100))[0];
    setEditPointsScore(currentScoringData.p[index].i);
    setEditPointsIndex(index);
    setEditPointsOpen(true);
  };

  const saveEditPoints = () => {
    let updatedScoreData = [...scoreData];
    let currentScoringData = updatedScoreData.filter(x => x.t === (Math.round(videoRef.current!.currentTime * 100) / 100))[0];
    currentScoringData.p[editPointsIndex].i = editPointsScore;
    setScoreData(updatedScoreData);
    handleCloseEditPoints();
  }

  const handleCloseEditPoints = () => {
    setEditPointsOpen(false);
  };

  const handleChangeEditScore = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(parseInt(event.target.value))) return;
    const points = parseInt(event.target.value);
    setEditPointsScore(points);
  };

  const toggleFittingEnabled = () => {
    if (!fittingEnabled && landmarkSelection) {
      setLandmarkSelection(null);
    }
    setFittingEnabled(!fittingEnabled);
  };

  const downloadScoreDataJson = () => {
    // This is isn't react-like but if it's good enough for StackOverflow, it's good enough for this.
    // https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react

    const element = document.createElement('a');
    let exportableScoreData = scoreData.map((score) => {
      const { _poseAtTimestamp: nope, ...rest } = score;
      return rest;
    })
    const file = new Blob([JSON.stringify(exportableScoreData)]);
    element.href = URL.createObjectURL(file);
    element.download = 'scoring-data.json';
    document.body.appendChild(element);
    element.click();
  };

  const handleUploadDetailChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    if (!Object.keys(uploadDetails).includes(field)) {
      return;
    }

    let newUploadDetails = {...uploadDetails};
    // This is just super annoying with typescript
    // @ts-ignore
    newUploadDetails[field] = event.target.value;
    setUploadDetails(newUploadDetails);
  };

  const startUpload = async () => {
    if (!videoRef.current || !user || !videoFile) return;
    // TODO: detail form error checking

    let finalUploadDetails = {...uploadDetails};
    finalUploadDetails.duration = Math.floor(videoRef.current.duration / 60) + ':' + Math.floor(videoRef.current.duration % 60);
    finalUploadDetails.userId = user.uid;
    finalUploadDetails.scoreData = scoreData.map((score) => {
      const { _poseAtTimestamp: nope, ...rest } = score;
      return rest;
    });
    setHasPublishingDialogOpen(false);
    setSubmitting(true);
    try {
      finalUploadDetails.videoUrl = await uploadVideo(videoFile, user.uid);
      const uploadDocRef = await addDoc(collection(db, 'dances'), finalUploadDetails);
      finalUploadDetails.id = uploadDocRef.id;
    } catch (ex) {
      console.error(ex);
      setSubmissionFailure(true);
      return;
    }
    setUploadDetails(finalUploadDetails);
    setSubmissionFailure(false);
    setSubmissionComplete(true);
  }

  return (
    <Box className="page-container">
      <Container maxWidth="xl">
        <div hidden={loading || isSubmitting}>
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
              <Box>
                <div style={{
                  position: 'relative',
                  display: 'inline-block',
                  alignItems: 'center',
                  margin: 'auto'
                }}>
                  <video
                    ref={videoRef}
                    style={{
                      display: 'block',
                      width: '100%',
                      maxHeight: '70vh',
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
                      maxHeight: '70vh',
                      borderRadius: 8,
                      imageRendering: 'crisp-edges'
                    }}
                    width={videoRef.current?.videoWidth ?? 600}
                    height={videoRef.current?.videoHeight ?? 400}
                    onClick={handleCanvasClick}
                  />
                {(landmarkSelection != null && gPose.current) ? (
                  <div
                    style = {{
                      position: 'absolute',
                      zIndex: 2,
                      top: landmarkSelection?.clickY || 0,
                      left: landmarkSelection?.clickX || 0
                    }}
                  >
                    <Paper elevation={3} sx={{ p: 2, width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper' }}>
                      <Typography variant="h6" >
                        {BODY_LANDMARK_NAMES[landmarkSelection.landmarkIndex]}
                      </Typography>
                      <Typography variant="caption" gutterBottom>
                        Angle: {Math.round(radToDeg(getLandmarkAngle(
                          gPose.current[landmarkSelection.landmarkIndex],
                          gPose.current[landmarkSelection.startIndex],
                          gPose.current[landmarkSelection.endIndex]
                        )))}˚
                      </Typography>
                      <div style={{
                        gap: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%'
                      }}>
                        <FormControl variant="standard" fullWidth>
                          <InputLabel id="start-angle-selector">Start Point</InputLabel>
                          <Select
                            labelId="start-angle-selector"
                            value={landmarkSelection.startIndex + ''}
                            variant="standard"
                            label="Start Point"
                            onChange={handleSelectStartAngle}
                          >
                            {getConnectedLandmarks(landmarkSelection.landmarkIndex, []).map(x => (
                              <MenuItem value={x} key={x}>
                                {BODY_LANDMARK_NAMES[x]}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                          <InputLabel id="end-angle-selector">End Point</InputLabel>
                          <Select
                            labelId="end-angle-selector"
                            value={landmarkSelection.endIndex + ''}
                            variant="standard"
                            label="End Point"
                            onChange={handleSelectEndAngle}
                          >
                            {getConnectedLandmarks(landmarkSelection.landmarkIndex, []).map(x => (
                              <MenuItem value={x} key={x}>
                                {BODY_LANDMARK_NAMES[x]}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            label="Points"
                            variant="standard"
                            value={landmarkSelection.points}
                            onChange={handleChangePoints}
                          />
                        </FormControl>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'right',
                          gap: 5
                        }}>
                          <Button
                            variant="outlined"
                            style={{
                              width: '100%'
                            }}
                            onClick={cancelLandmarkSelection}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="outlined"
                            style={{
                              width: '100%'
                            }}
                            disabled={landmarkSelection.startIndex === landmarkSelection.endIndex}
                            onClick={saveLandmarkSelection}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </Paper>
                  </div>
                ) : ''}
              </div>
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
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={fittingEnabled}
                      onClick={toggleFittingEnabled}
                    />
                  }
                  label="Enable fitting while paused" 
                />
              </FormGroup>
              <Typography>
                Note: Points cannot be selected while fitting is enabled. We recommend enabling it temporarily to readjust angles before adding them.
              </Typography>
            </Paper>

            <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper' }}>
              <Typography variant="h6">
                Tracking Points
              </Typography>
              {(scoreData.length === 0 || !videoRef.current) ? (
                <Typography variant="body1" gutterBottom>
                  To get started, pause the video at times you want to add scoring to. Then, click on each point you want to track, enter the scoring information
                  you would like to use, and hit save.
                </Typography>
              ) : (
                <Box sx={{ width: '100%', p: 2, textAlign: 'left' }}>
                  {(!paused || scoreData.filter(x => x.t === (Math.round(videoRef.current!.currentTime * 100) / 100)).length === 0) ? (
                    <Typography variant="body1" gutterBottom>
                      Pause or jump to a specific time to see scoring data at that point.
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Tracked Angles at {(Math.round(videoRef.current!.currentTime * 100) / 100)}s
                      </Typography>
                      {scoreData.filter(x => x.t === (Math.round(videoRef.current!.currentTime * 100) / 100))[0].p.map((p, i) => (
                        <Accordion
                          key={i}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMore />}
                          >
                            {BODY_LANDMARK_NAMES[p.b]} (from {BODY_LANDMARK_NAMES[p.a]} to {BODY_LANDMARK_NAMES[p.c]})
                          </AccordionSummary>
                          <AccordionDetails>
                            Angle: {Math.round(radToDeg(p.y))}˚, Points: {p.i}
                          </AccordionDetails>
                          <AccordionActions>
                            <Button
                              onClick={() => {handleDeleteAngle(i)}}
                            >
                              Delete
                            </Button>
                            <Button
                              onClick={() => {handleOpenEditPoints(i)}}
                            >
                              Edit Points
                            </Button>
                          </AccordionActions>
                        </Accordion>
                      ))}
                    </>
                  )}
                  <Typography variant="subtitle1" gutterBottom>
                    Timestamps with Tracked Data
                  </Typography>
                  {scoreData.map((score, i) => (
                    <Accordion
                      key={i}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                      >
                        {score.t} second{score.t !== 1 ? 's' : ''}
                      </AccordionSummary>
                      <AccordionDetails>
                        This timestamp has {score.p.length} data point{score.p.length !== 1 ? 's' : ''} that can add up to {score.p.map(x => x.i).reduce((a, b) => a + b)} to the total score
                      </AccordionDetails>
                      <AccordionActions>
                        <Button
                          onClick={() => {handleDeleteTimestamp(score.t)}}
                        >
                          Delete data
                        </Button>
                        <Button
                          onClick={() => {jumpToTimestamp(score.t)}}
                        >
                          Jump to {score.t}s
                        </Button>
                      </AccordionActions>
                    </Accordion>
                  ))}
                  <Button
                    onClick={downloadScoreDataJson}
                  >
                    Download Score Data (.json)
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
          <center>
            <Button 
              fullWidth
              variant='outlined'
              sx={{mt: 3, maxWidth: '80vw'}}
              disabled={scoreData.length === 0}
              onClick={() => { setHasPublishingDialogOpen(true) }}
            >
              Add Details & Upload
            </Button>
          </center>
        </div>
      </Container>
      <Container maxWidth="lg">
        <div hidden={!loading}>
          <Typography variant="h4" gutterBottom>
            Dance Uploader
          </Typography>
          <Typography variant='body1' gutterBottom>
            Upload a dance for others to play here! Start by selecting a video file from your device
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
      <Dialog
        open={editPointsOpen}
        onClose={handleCloseEditPoints}
      >
        <DialogTitle>Edit Points</DialogTitle>
        <DialogContent>
          <TextField
            label="Points"
            variant="standard"
            value={editPointsScore}
            onChange={handleChangeEditScore}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditPoints}>
            Cancel
          </Button>
          <Button onClick={saveEditPoints}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={hasPublishingDialogOpen}
        onClose={() => { setHasPublishingDialogOpen(false) }}
      >
        <DialogTitle>
          Add Details & Upload
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{mb: 2}}>
            <TextField
              label="Dance Title"
              variant="filled"
              value={uploadDetails.title}
              required
              onChange={(e) => handleUploadDetailChange(e, 'title')}
            />
          </FormControl>
          <FormControl fullWidth sx={{mb: 2}}>
            <TextField
              label="Description"
              variant="filled"
              value={uploadDetails.description}
              required
              onChange={(e) => handleUploadDetailChange(e, 'description')}
            />
          </FormControl>
          <FormControl fullWidth sx={{mb: 2}}>
            <TextField
              label="Song Title"
              variant="filled"
              value={uploadDetails.songTitle}
              required
              onChange={(e) => handleUploadDetailChange(e, 'songTitle')}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Song Artist"
              variant="filled"
              value={uploadDetails.songAuthor}
              required
              onChange={(e) => handleUploadDetailChange(e, 'songAuthor')}
            />
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => { setHasPublishingDialogOpen(false) }}
          >
            Cancel
          </Button>
          <Button
            onClick={startUpload}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      {isSubmitting ? (
        <>
          {(!submissionComplete && !submissionFailure) ? (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, justifyContent: 'center', my: 4 }}>
                <CircularProgress />
                <Typography variant='h5'>
                  Uploading your dance, please wait...
                </Typography>
              </Box>
            </>
          ) : ''}
          {submissionFailure ? (
            <center>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', my: 4, width: '80vw' }}>
                <Alert severity='error' sx={{mb: 3}}>
                  An error occurred while uploading your dance! Don't worry, your data has not been lost. To continue, you can either
                  go back to the editor to make changes or try uploading again.
                </Alert>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center' }}>
                  <Button
                    onClick={() => {setSubmitting(false)}}
                    variant='outlined'
                  >
                    Back to editor
                  </Button>
                  <Button
                    onClick={() => {
                      setSubmissionFailure(false);
                      startUpload();
                    }}
                    variant='outlined'
                  >
                    Retry upload
                  </Button>
                </Box>
              </Box>
            </center>
          ) : ''}
          {submissionComplete ? (
            <center>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', my: 4, width: '80vw' }}>
                <Alert severity='success' sx={{mb: 3}}>
                  Your dance has been uploaded! You can now view it on your profile!
                </Alert>
              </Box>
            </center>
          ) : ''}
        </>
      ) : ''}
    </Box>
  );
};

export default DanceEditor; 