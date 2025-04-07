import * as posenet from '@tensorflow-models/posenet';

export class PoseDetector {
  private net: posenet.PoseNet | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.net = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 640, height: 480 },
        multiplier: 0.75,
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing PoseNet:', error);
      throw new Error('Failed to initialize pose detector');
    }
  }

  async detectPose(video: HTMLVideoElement) {
    if (!this.net || !this.isInitialized) {
      throw new Error('Pose detector not initialized');
    }

    try {
      const pose = await this.net.estimateSinglePose(video, {
        flipHorizontal: false
      });

      return {
        keypoints: pose.keypoints.map(keypoint => ({
          x: keypoint.position.x / video.width,
          y: keypoint.position.y / video.height,
          score: keypoint.score,
          name: keypoint.part
        }))
      };
    } catch (error) {
      console.error('Error detecting pose:', error);
      return null;
    }
  }

  dispose() {
    if (this.net) {
      this.net = null;
      this.isInitialized = false;
    }
  }
} 