---
title: "Milestone 4: Dance Battle & Social Features"
date: "2025-04-21"
category: "Development"
description: "Implementing dance battles and social features for community engagement for final product"
---

[Read our playtesting report (requires UM Google login)](https://drive.google.com/file/d/1tIXja0qBHOnfKIGU3O4Y_oi3fNZrLIl7/view?usp=sharing)

## Overview

In this milestone, we have worked to make significant progress towards the final "gold" version of the product. We've made the project more usable, more enjoyable, and more impactful through the changes we made in this milestone.

## Key Achievements

### Dance Editor

The [Dance Creator](/dance/upload) has been polished to become less complicated and more intuitive. The user now only has to upload the video and write some details about the dance to be able to play and share it with others! Attaching and processing is now done automatically without the user having to sit and click on each point they want to track. This will make creating dances much more accessible and easier to use. 

### Dance Player

The Dance Player has been updated to be more polished and easy to use, including changes that show the total score and provide indicators as to whether or not you are currently in frame. We have also implemented gesture detection that requires the user raise their hands for 3 seconds before starting, allowing users to have the time to prepare before they start the dance.

### Social Features

We have added more social features to the app, including adding friends, chats, and the ability to share dances and battles.

### Dance Battle

We've implemented a comprehensive Dance Battle system that allows users to challenge friends and compete in dance-offs! The system includes:

- **Battle Creation**: Users can create battles by uploading a benchmark video and selecting friends to challenge
- **Battle Invites**: Users receive and can accept battle invites from friends
- **Active Battles**: Users can participate in ongoing battles, upload their dance videos, and see real-time scores
- **Battle History**: A dedicated section in the profile page shows battle statistics and history
- **Privacy-Focused Design**: Only benchmark videos are uploaded to the server; user dance videos are processed locally
- **Score Calculation**: Scores are calculated by comparing pose sequences between the benchmark and user videos
- **Visual Feedback**: Confetti animations celebrate completed battles, and color-coded status indicators show battle outcomes

The Dance Battle feature encourages social interaction and friendly competition while maintaining user privacy. Users can track their progress over time with detailed statistics showing their victories, defeats, and average scores.

