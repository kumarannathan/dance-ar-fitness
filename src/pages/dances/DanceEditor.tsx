import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { DrawingUtils, FilesetResolver, Landmark, PoseLandmarker } from '@mediapipe/tasks-vision';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { BODY_LANDMARK_NAMES, getConnectedLandmarks, getLandmarkAngle, getLandmarkEligibleConnections, isLandmarkEligibleForAngles, ScoringPoseData } from '../../utils/landmark';
import { getEuclideanDistance, radToDeg } from '../../utils/math';
import { ExpandMore, Pause, PlayArrow, UploadFile } from '@mui/icons-material';

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

  const [landmarker, setLandmarker] = useState<PoseLandmarker|null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paused, setPaused] = useState<boolean>(false);
  const [landmarkSelection, setLandmarkSelection] = useState<BodyLandmarkSelectionDetails|null>(null);
  const [scoreData, setScoreData] = useState<DanceScoringDataPoints[]>([]);
  const [editPointsOpen, setEditPointsOpen] = useState(false);
  const [editPointsScore, setEditPointsScore] = useState(0);
  const [editPointsIndex, setEditPointsIndex] = useState(0);

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
            canvasCtx.strokeStyle = '#a0ebf0';
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
      if (cancel || paused) {
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
  }, [landmarker, loading, paused, drawPose, landmarkSelection]);

  useEffect(() => {
    if (!videoRef.current || !paused) return;

    drawPose(gPose.current)
  }, [drawPose, paused, landmarkSelection]);

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
    if (!canvasRef.current || !videoRef.current || !paused) return;

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
                  height: 400,
                  borderRadius: 8
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
              </Box>
            )}
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
    </Container>
  );
};

export default DanceEditor; 