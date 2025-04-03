// apparently mediapipe does not provide an enum for all of the points and
// everything, so i'm going to define them in here.

import { Landmark, PoseLandmarker } from '@mediapipe/tasks-vision'
import { getAngleFromDistances, getEuclideanDistance } from './math';

export enum BodyLandmarkType {
  Nose = 0,
  LeftEyeInner = 1,
  LeftEye = 2,
  LeftEyeOuter = 3,
  RightEyeInner = 4,
  RightEye = 5,
  RightEyeOuter = 6,
  LeftEar = 7,
  RightEar = 8,
  MouthLeft = 9,
  MouthRight = 10,
  LeftShoulder = 11,
  RightShoulder = 12,
  LeftElbow = 13,
  RightElbow = 14,
  LeftWrist = 15,
  RightWrist = 16,
  LeftPinky = 17,
  RightPinky = 18,
  LeftIndex = 19,
  RightIndex = 20,
  LeftThumb = 21,
  RightThumb = 22,
  LeftHip = 23,
  RightHip = 24,
  LeftKnee = 25,
  RightKnee = 26,
  LeftAnkle = 27,
  RightAnkle = 28,
  LeftHeel = 29,
  RightHeel = 30,
  LeftFootIndex = 31,
  RightFootIndex = 32
};

export const getConnectedLandmarks = (landmark: number, detectedLandmarks: Landmark[]) => {
  return PoseLandmarker.POSE_CONNECTIONS
    .filter((x, i) => (x.start === landmark || x.end === landmark))
    .map(x => x.start === landmark ? x.end : x.start);
};

export const isLandmarkEligibleForAngles = (landmark: number, detectedLandmarks: Landmark[]) => {
  return getConnectedLandmarks(landmark, detectedLandmarks).length >= 2;
};

export const getLandmarkAngle = (target: Landmark, start: Landmark, end: Landmark) => {
  const a = getEuclideanDistance(start, target);
  const b = getEuclideanDistance(target, end);
  const c = getEuclideanDistance(end, start);
  return getAngleFromDistances(a, b, c);
};