---
title: "Milestone 1: Frontend & Unity Setup"
date: "2024-03-30"
category: "Development"
description: "Establishing the product landing page, Unity framework, and project roadmap"
---

# Milestone 1: Frontend & Unity Setup

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
4. Optimize loading and performance for web environment