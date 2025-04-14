import { NormalizedLandmark, PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface PoseFrame {
  landmarks: NormalizedLandmark[];
  timestamp: number;
}

export const calculatePoseSimilarity = (pose1: NormalizedLandmark[], pose2: NormalizedLandmark[]): number => {
  if (!pose1.length || !pose2.length) return 0;

  let totalDistance = 0;
  const numLandmarks = Math.min(pose1.length, pose2.length);

  for (let i = 0; i < numLandmarks; i++) {
    const landmark1 = pose1[i];
    const landmark2 = pose2[i];

    // Calculate Euclidean distance between corresponding landmarks
    const distance = Math.sqrt(
      Math.pow(landmark1.x - landmark2.x, 2) +
      Math.pow(landmark1.y - landmark2.y, 2) +
      Math.pow(landmark1.z - landmark2.z, 2)
    );

    totalDistance += distance;
  }

  // Convert distance to similarity score (0-100)
  // Lower distance means higher similarity
  const avgDistance = totalDistance / numLandmarks;
  const similarity = Math.max(0, 100 - (avgDistance * 100));

  return Math.round(similarity);
};

const createPoseLandmarker = async (): Promise<PoseLandmarker> => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );
  
  return await PoseLandmarker.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
      },
      numPoses: 1,
      runningMode: 'VIDEO'
    }
  );
};

const waitForVideoReady = async (video: HTMLVideoElement): Promise<void> => {
  if (video.readyState >= 2) return;
  return new Promise((resolve) => {
    const handler = () => {
      if (video.readyState >= 2) {
        video.removeEventListener('loadeddata', handler);
        resolve();
      }
    };
    video.addEventListener('loadeddata', handler);
  });
};

export const extractPoseFrames = async (
  video: HTMLVideoElement,
  onProgress: (progress: number) => void
): Promise<PoseFrame[]> => {
  const frames: PoseFrame[] = [];
  const frameInterval = 1000 / 30; // 30 fps

  // Create a new landmarker instance for this video
  const landmarker = await createPoseLandmarker();

  // Ensure video is ready and get its dimensions
  await waitForVideoReady(video);
  const { videoWidth, videoHeight } = video;

  // Create a temporary canvas for frame extraction
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  if (!ctx) throw new Error('Could not get canvas context');

  video.currentTime = 0;
  await new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }));

  const duration = video.duration;
  let currentTime = 0;
  let lastTimestamp = 0;

  while (currentTime < duration) {
    video.currentTime = currentTime;
    await new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }));

    // Draw the current frame to canvas
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
    
    try {
      // Ensure timestamps are strictly increasing
      const timestampMs = Math.max(lastTimestamp + 1, Math.round(currentTime * 1000));
      lastTimestamp = timestampMs;
      
      // Detect poses in the current frame
      const results = await landmarker.detectForVideo(video, timestampMs);
      
      if (results.landmarks && results.landmarks[0]) {
        frames.push({
          landmarks: results.landmarks[0],
          timestamp: timestampMs
        });
      }
    } catch (error) {
      console.warn(`Failed to process frame at ${currentTime}s:`, error);
    }

    currentTime += frameInterval / 1000;
    onProgress((currentTime / duration) * 100);
  }

  // Clean up
  landmarker.close();

  return frames;
};

export const comparePoseSequences = (
  benchmarkFrames: PoseFrame[],
  userFrames: PoseFrame[]
): number => {
  if (!benchmarkFrames.length || !userFrames.length) return 0;

  let totalSimilarity = 0;
  const numComparisons = Math.min(benchmarkFrames.length, userFrames.length);

  for (let i = 0; i < numComparisons; i++) {
    const benchmarkIndex = Math.floor((i / numComparisons) * benchmarkFrames.length);
    const userIndex = Math.floor((i / numComparisons) * userFrames.length);

    const similarity = calculatePoseSimilarity(
      benchmarkFrames[benchmarkIndex].landmarks,
      userFrames[userIndex].landmarks
    );
    totalSimilarity += similarity;
  }

  return Math.round(totalSimilarity / numComparisons);
}; 