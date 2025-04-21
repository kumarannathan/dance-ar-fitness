// apparently mediapipe does not provide an enum for all of the points and
// everything, so i'm going to define them in here.

import { Landmark, NormalizedLandmark, PoseLandmarker } from '@mediapipe/tasks-vision'
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

export const BODY_LANDMARK_NAMES: string[] = [
  "Nose",
  "Left Eye (Inner)",
  "Left Eye",
  "Left Eye (Outer)",
  "Right Eye (Inner)",
  "Right Eye",
  "Right Eye (Outer)",
  "Left Ear",
  "Right Ear",
  "Mouth (Left)",
  "Mouth (Right)",
  "Left Shoulder",
  "Right Shoulder",
  "Left Elbow",
  "Right Elbow",
  "Left Wrist",
  "Right Wrist",
  "Left Pinky",
  "Right Pinky",
  "Left Index",
  "Right Index",
  "Left Thumb",
  "Right Thumb",
  "Left Hip",
  "Right Hip",
  "Left Knee",
  "Right Knee",
  "Left Ankle",
  "Right Ankle",
  "Left Heel",
  "Right Heel",
  "Left Foot Index",
  "Right Foot Index"
];

export enum FramePresenceType {
  OutOfFrame = 0,
  PartialInFrame = 1,
  CompleteInFrame = 2
};

export interface ScoringPoseData {
  // The BodyLandmarkType to be starting from
  a: number;
  // The root BodyLandmarkType
  b: number;
  // The end BodyLandmarkType
  c: number;
  // The targeted angle
  y: number;
  // The importance of this angle in the calculation
  i: number;
};

export const BASIC_SCORING_CONNECTIONS: ScoringPoseData[] = [
  {
    a: BodyLandmarkType.LeftHip,
    b: BodyLandmarkType.LeftKnee,
    c: BodyLandmarkType.LeftFootIndex,
    y: Math.PI,
    i: 100
  },
  {
    a: BodyLandmarkType.RightHip,
    b: BodyLandmarkType.RightKnee,
    c: BodyLandmarkType.RightFootIndex,
    y: Math.PI,
    i: 100
  },
  {
    a: BodyLandmarkType.RightHip,
    b: BodyLandmarkType.RightShoulder,
    c: BodyLandmarkType.RightElbow,
    y: 0,
    i: 100
  },
  {
    a: BodyLandmarkType.RightShoulder,
    b: BodyLandmarkType.RightElbow,
    c: BodyLandmarkType.RightWrist,
    y: Math.PI,
    i: 100
  },
  {
    a: BodyLandmarkType.LeftHip,
    b: BodyLandmarkType.LeftShoulder,
    c: BodyLandmarkType.LeftElbow,
    y: 0,
    i: 100
  },
  {
    a: BodyLandmarkType.LeftShoulder,
    b: BodyLandmarkType.LeftElbow,
    c: BodyLandmarkType.LeftWrist,
    y: Math.PI,
    i: 100
  }
];

export const getConnectedLandmarks = (landmark: number, detectedLandmarks: Landmark[]) => {
  return PoseLandmarker.POSE_CONNECTIONS
    .filter((x) => (x.start === landmark || x.end === landmark))
    .map(x => x.start === landmark ? x.end : x.start);
};

export const isLandmarkEligibleForAngles = (landmark: number, detectedLandmarks: Landmark[]) => {
  return getConnectedLandmarks(landmark, detectedLandmarks).length >= 2;
};

export const getLandmarkEligibleConnections = () => {
  return PoseLandmarker.POSE_CONNECTIONS
    .filter((x) => isLandmarkEligibleForAngles(x.start, []) || isLandmarkEligibleForAngles(x.end, []));
};

export const getLandmarkAngle = (target: Landmark, start: Landmark, end: Landmark) => {
  const a = getEuclideanDistance(start, target);
  const b = getEuclideanDistance(target, end);
  const c = getEuclideanDistance(end, start);
  return getAngleFromDistances(a, b, c);
};

export const gradePose = (userPose: Landmark[], targets: ScoringPoseData[]) => {
  // const importanceSum = targets.map(x => x.i).reduce((sum, i) => sum + i);
  let overallScore = 0;
  for (const target of targets) {
    const angle = getLandmarkAngle(
      userPose[target.b],
      userPose[target.a],
      userPose[target.c]
    );
    // dividing by Math.PI ensures that our score is between zero and one since
    // getLandmarkAngle returns the angle in radians and the max angle is PI
    let score = 1 - (Math.abs(angle - target.y) / Math.PI);
    // squaring the scores makes it so they have to be closer to the actual values
    score *= score;
    overallScore += score * target.i;
  }
  // overallScore /= importanceSum;
  return overallScore;
};

export const isJointInFrame = (joint: Landmark) => {
  // TODO: fine tune this!
  return joint.visibility > 0.15;
};

export const getPresenceForFrame: (pose: Landmark[]) => FramePresenceType = (pose) => {
  const selectedPose = pose.slice(BodyLandmarkType.LeftShoulder, BodyLandmarkType.LeftHeel);
  let detectedOneInFrame = false;
  let detectedOneOutOfFrame = false;

  for (const landmark of selectedPose) {
    if (isJointInFrame(landmark)) {
      detectedOneInFrame = true;
    } else {
      detectedOneOutOfFrame = true;
    }
  }

  if (!detectedOneInFrame) {
    return FramePresenceType.OutOfFrame;
  }
  
  return detectedOneOutOfFrame ? FramePresenceType.PartialInFrame : FramePresenceType.CompleteInFrame;
};

export const isHandsUp = (pose: Landmark[]) => {
  const requiredJoints = [
    BodyLandmarkType.LeftWrist,
    BodyLandmarkType.RightWrist,
    BodyLandmarkType.LeftEye,
    BodyLandmarkType.RightEye
  ];

  for (const requiredJoint of requiredJoints) {
    if (!isJointInFrame(pose[requiredJoint])) {
      return false;
    }
  }

  return (
    (pose[BodyLandmarkType.LeftWrist].y < pose[BodyLandmarkType.LeftEye].y) &&
    (pose[BodyLandmarkType.RightWrist].y < pose[BodyLandmarkType.RightEye].y)
  );
};