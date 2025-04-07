interface Keypoint {
  x: number;
  y: number;
  score: number;
}

interface Pose {
  keypoints: Keypoint[];
}

export function calculateSimilarity(pose1: Pose, pose2: Pose): number {
  if (!pose1.keypoints || !pose2.keypoints) return 0;

  let totalDistance = 0;
  let validKeypoints = 0;

  // Calculate total distance between corresponding keypoints
  for (let i = 0; i < pose1.keypoints.length; i++) {
    const kp1 = pose1.keypoints[i];
    const kp2 = pose2.keypoints[i];

    if (kp1.score > 0.5 && kp2.score > 0.5) {
      const dx = kp1.x - kp2.x;
      const dy = kp1.y - kp2.y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
      validKeypoints++;
    }
  }

  if (validKeypoints === 0) return 0;

  // Normalize the distance and convert to similarity score (0-1)
  const averageDistance = totalDistance / validKeypoints;
  const maxDistance = Math.sqrt(2); // Maximum possible distance in normalized coordinates
  const similarity = 1 - (averageDistance / maxDistance);
  
  return Math.max(0, Math.min(1, similarity));
} 