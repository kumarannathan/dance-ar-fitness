import type { ScoringPoseData } from '../utils/landmark';

interface DanceScoringDataPoints {
  t: number;
  p: ScoringPoseData[];
};

export interface FirestoreDanceTrackObject {
  /**
   * Firebase auto-generated ID of the Dance Track
   */
  id?: string;
  /**
   * The uploader's Firebase ID
   */
  userId: string;
  /**
   * The dance's title
   */
  title: string;
  /**
   * A description shown to the users similar to a YouTube description
   */
  description: string;
  /**
   * The song's title
   */
  songTitle: string;
  /**
   * The song's author
   */
  songAuthor: string;
  /**
   * How long the video is
   */
  duration: string;
  /**
   * Whether the dance is visible to others or if the dance is only viewable by
   * the author
   */
  visibility: 'public'|'private';
  /**
   * A Firestore URL to the video for the dance
   */
  videoUrl: string;
  /**
   * The tracking scoring data used by the player
   */
  scoreData: DanceScoringDataPoints[];
};