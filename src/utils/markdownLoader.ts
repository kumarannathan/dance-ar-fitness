export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
  content: string;
}

// This is a temporary solution until we implement proper server-side loading
const blogPosts: BlogPost[] = [
  {
    slug: 'milestone1',
    title: 'Milestone 1: Frontend & Unity Setup',
    date: '2025-03-30',
    category: 'Development',
    description: 'Establishing the product landing page, Unity framework, and project roadmap',
    content: `# Milestone 1: Frontend & Unity Setup

## Project Roadmap & Overview

We're implementing a two-device system architecture for our AR dance fitness application:

### AR Device (iOS)
Our AR device, running on iOS, utilizes ARKit for real-time pose tracking, capturing user movements and pose data. It serves as the primary device for user interaction and movement, transmitting pose data via WebSocket connection to enable seamless communication with the web interface.

### Web Device (Any Machine)
The web device hosts our website interface, receiving real-time pose data from the AR device. It displays dance moves that need to be performed and provides real-time feedback and scoring to guide users through their workout sessions.

### Data Flow
The system's data flow begins with ARKit capturing pose data on the iOS device. This data is then processed and transmitted via WebSocket through our Unity script. The website receives and processes this data, calculating pose matching scores and displaying real-time feedback on the web interface.

### Key Components
Our system integrates several key components:
- ARKit for iOS pose tracking
- Unity for AR development and WebSocket communication
- Web interface for displaying moves and feedback
- Pose matching algorithm for scoring
- WebSocket server for real-time data transfer

## Frontend Development

### Design System
Implemented a clean, minimal aesthetic using Material-UI's theming system. Focused on typography, spacing, and subtle animations to create an engaging user experience.

### Responsive Layout
Developed a mobile-first layout using CSS Grid and Flexbox. Ensured seamless experience across all device sizes while maintaining visual consistency.

### Navigation
Created an intuitive navigation system with React Router, featuring smooth transitions and a responsive mobile menu for better accessibility.

## Unity Framework

### Screen Space Joint Visualizer
<video height="600" controls>
  <source src="dancear-demo-visualizer-compressed.mov" type="video/mp4">
</video>

We used Unity and ImGui to display joint values to modify a joint visualizer to show information about each joint's number and position, which will be useful for creating gestures and dance moves. The original visualizer from Unity did not include anything to visualize the joints, which is why this feature was added to the visualizer.

### Gesture Detection
<video height="600" controls>
  <source src="dancear-demo-action-compressed.mov" type="video/mp4">
</video>

We also implemented gesture detection, which will be useful for our users since they will not be able to see or interact with the phone screen while they use the app, but will likely still need to perform actions. To ensure reusability, we used C# events to allow any component to listen to an event by referencing the gesture manager and adding a delegate to the event. To avoid inadvertent actions, we also wait a fixed interval before calling the event, allowing the user to stop performing a gesture if necessary.

## Project Management

### Unity Development (GitLab)
Using GitLab for Unity project version control, managing Unity-specific assets and dependencies and tracking AR development milestones and features.

### Frontend Development (GitHub)
GitHub serves as our repository for the React frontend, enabling automated deployments through Netlify, managing web-specific dependencies and assets, and tracking UI/UX improvements and features.

### Project Management (Jira)
Jira provides centralized project tracking, enabling sprint planning and task management, facilitating cross-team coordination between Unity and web development, and tracking project milestones and deadlines.

## Next Steps

For Milestone 2, we plan to:
1. Start implementing a frontend site synced to the device that shows instructions to the user
2. Establish communication bridge between React and Unity
3. Implement basic pose detection for dance moves
4. Optimize loading and performance for web environment`
  },
  {
    slug: 'milestone2',
    title: 'Milestone 2: Pose Detection & Scoring Implementation',
    date: '2025-04-07',
    category: 'Development',
    description: 'Implementing real-time pose detection, scoring system, and user authentication',
    content: `# Milestone 2: Pose Detection & Scoring Implementation

[Read our playtesting report (requires UM Google login)](https://drive.google.com/file/d/1C02T5ZAjwalWe8X44gsov40EnNh_p1Ro/view?usp=sharing)

## Overview

In this milestone, we've made significant progress in implementing real-time pose detection and scoring capabilities for our AR dance fitness application. Building upon the foundation established in Milestone 1, we've integrated MediaPipe's pose detection system and developed a sophisticated scoring mechanism.

## Key Achievements

### Exploration and revamped design

We looked more carefully into other options besides using Unity for pose detection, as Unity seems to only support iOS
ARKit. While Unity seems to be more accurate at pose detection than some other methods, we ultimately decided that
[MediaPipe](https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker)'s web framework is more accessible and
easier to work with than the current setup.

MediaPipe runs on WebAssembly, allowing it to have native-like performance on a web environment for pose detection. While
it does not immediately seem as accurate as ARKit, it also runs directly on our website which eliminates the need for a
WebSocket connection and an external device, as it can use whatever camera is already on the device. It also enables us
to support a wider variety of devices, including most modern web browsers with WebAssembly enabled.

This is also ideal because our playtesting session, which involved a quick test where users performed jumping jacks and 
increased a score shown on a laptop while being tracked by a device, seemed to be unintuitive. Many of the testers had
someone else go around and look at the device to see if they were in frame, which is not ideal for a real-world scenario.
As such, this informed us that we need to be showing users a live view of themselves as well, which is not feasible through
WebSockets alone and is much easier to do on the device.

### MediaPipe Pose Detection Demo

MediaPipe's pose detection can work with both live video input (such as from a webcam) and from recorded content (such as from a TikTok or YouTube video). As such, we worked on a few debug utilities to get a base for camera support and gesture detection, and we were quickly able to build up to where we were in Milestone 1 while running directly on the web browser.

### Pose Visualizer

<img src="pose-tracking.png" height="600" />

The first step we worked on was a Pose Visualizer tool that helped us verify that MediaPipe works well on the web and helped us validate two utility functions:

- Hand testing: For our gesture detection, we have a simple hands up detection process that involves verifying if both of the hands are above the user's head for three seconds and then triggering an action. We have verified that MediaPipe can reliably support this feature using the tool.
- Angle detection: We've verified that we can detect angles accurately between different joints, which will be essential for determining scoring. Angles must be calculated by selecting three joints and determining the distances between them and finding the interior angle. This can be seen in the demo where we find the interior angle of the elbow, as shown in the screenshot to be near 90 degrees.

### Video & Image Analysis

We also developed debug tools to run the above tests on static [videos](/debug/video-pose-tracking) and [images](/debug/image-pose-tracking)! This allows us to see what MediaPipe is seeing when a video or image gets processed.

### Live Video Scoring Debuggers

By far our most fun tool, the live video scoring debuggers allow us to try following a dance routine of another video with a
live output of how closely we are matching what is currently in the video. This is a good test of all of our requirements and
introduces our new scoring mechanism that works through angle detection and comparison.

This test revealed a considerable amount of information about what types of videos will and won't work with MediaPipe and the
platform. Specifically, heavily edited videos that remove backgrounds or modify visuals of a human will not be able to be scanned
in realtime video formats.

<center>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/mKIhdpDn73E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  <p>Original Video Credit: Just Dance 4 - Call Me Maybe by Carly Rae Jepsen</p>
</center>

As you can see in the above video, the tracking does not seem to be able to easily grasp movements from Just Dance since
edge and landmark detection fails throughout the video due to how it is edited. However, unedited videos of people do
not seem to be affected by this issue as much.

You can also use the [Live Scoring Grade Debugger](/debug/grade-debugger) take a snapshot of a pose and then see what
your score would be as your real pose changes.

### Website Improvements

We have improved the website to allow sign-in via Firebase and include basic flows for users. We have also included a new
Pricing page, and we plan on making more updates to the home page in the future.

## Next Steps

For Milestone 3, we plan to:
1. Expand the dance routine library
2. Implement social features for sharing scores
3. Add more advanced pose matching algorithms
4. Enhance the user experience with additional feedback mechanisms
5. Move the debug screens into real activities.`
  }
];

export const loadBlogPosts = (): BlogPost[] => {
  return blogPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
};

export const getBlogPostBySlug = (slug: string): BlogPost | null => {
  return blogPosts.find(post => post.slug === slug) || null;
}; 