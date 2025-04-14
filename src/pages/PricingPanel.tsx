import React from 'react';
import { Box, Container, Typography, Paper, Divider } from '@mui/material';

const PricingOverview = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Pricing
      </Typography>
      <center>
        <Typography variant="h5" sx={{mb: '10px'}}>Subscriptions</Typography>
      </center>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        <Paper sx={{ p: 2, minHeight: 400 }}>
          <center>
            <Typography variant="h5">
              Free Plan
            </Typography>
          </center>
          <Divider sx={{mt: '5px', mb: '20px'}}/>
          <Typography>
            Try out DanceAR and use basic features for free!
          </Typography>
          <ul>
            <li>
              <Typography>Try out dances from the community</Typography>
            </li>
            <li>
              <Typography>Add and participate in challenges with friends</Typography>
            </li>
            <li>
              <Typography>Keep track of your personal high score on each track</Typography>
            </li>
            <li>
              <Typography>Maintain a daily Dance Streak and get notified when it is about to expire</Typography>
            </li>
            <li>
              <Typography>Upload and publish your own dances for the community with up to 1 GB of storage space for your videos</Typography>
            </li>
          </ul>
          <center>
            <Typography variant="h6">
              $0.00 per month
            </Typography>
          </center>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <center>
            <Typography variant="h5">
              Premium Plan
            </Typography>
          </center>
          <Divider sx={{mt: '5px', mb: '20px'}}/>
          <Typography>
            Get access to more DanceAR features to get the most out of your experience!
          </Typography>
          <ul>
            <li>
              <Typography>Access exclusive dance content for DanceAR Premium members</Typography>
            </li>
            <li>
              <Typography>Get one free Dance Streak revival per month</Typography>
            </li>
            <li>
              <Typography>Streak Pause days can be earned based on the number of likes a published dance receives from the community</Typography>
            </li>
            <li>
              <Typography>Play workouts that feature custom accuracy scoring, including form accuracy for weight training and Pilates</Typography>
            </li>
            <li>
              <Typography>Record your playthrough of dances and workouts and rewatch it with advanced feedback</Typography>
            </li>
            <li>
              <Typography>Upload and publish your own dances for the community with up to 10 GB of storage space for your videos</Typography>
            </li>
          </ul>
          <center>
            <Typography variant="h6">
              $9.99 per month
            </Typography>
          </center>
        </Paper>
      </Box>
      <center>
        <Typography variant="h5" sx={{mt: '20px', mb: '10px'}}>One-time use purchases</Typography>
      </center>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        <Paper sx={{ p: 2, minHeight: 400 }}>
          <center>
            <Typography variant="h5">
              Dance Streak Revival
            </Typography>
          </center>
          <Divider sx={{mt: '5px', mb: '20px'}}/>
          <Typography>
            Dance Streaks are designed to help motivate you to be consistent with your workout routines. To motivate you
            to keep a consistent streak, the only way to recover a lost streak is to use a Dance Streak Revival.
          </Typography>
          <ul>
            <li>
              <Typography>Revives your Dance Streak from where your last Dance Streak</Typography>
            </li>
            <li>
              <Typography>One revival per purchase, ensuring you stay motivated to keep the streak</Typography>
            </li>
            <li>
              <Typography>Restart a lost streak when you feel comfortable</Typography>
            </li>
          </ul>
          <Typography variant="body2">
            Note: If you become injured, temporarily unable to complete dances, or unable to play due to a platform
            outage, please contact our support team to apply for a free Dance Streak Revival! Safety is our
            top priority, and we want to ensure users are never encouraged to play when they are injured!
          </Typography>
          <center>
            <Typography variant="h6" sx={{mt: '10px'}}>
              $2.50 per use
            </Typography>
          </center>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <center>
            <Typography variant="h5">
              Streak Pause
            </Typography>
          </center>
          <Divider sx={{mt: '5px', mb: '20px'}}/>
          <Typography>
            Going on vacation? Experiencing an internet outage? Or just simply need a break? You can pause
            your Dance Streak while you're away for a specified time frame.
          </Typography>
          <ul>
            <li>
              <Typography>Keep your Dance Streak while you're gone</Typography>
            </li>
            <li>
              <Typography>Pause will only last the duration you specify upon sign up</Typography>
            </li>
            <li>
              <Typography>Requires support agents to approve your reason for pausing the streak</Typography>
            </li>
            <li>
              <Typography>If rejected, you will be completely refunded</Typography>
            </li>
            <li>
              <Typography>Free for DanceAR Premium members!</Typography>
            </li>
          </ul>
          <center>
            <Typography variant="h6" sx={{mt: '10px'}}>
              $0.50 per day paused
            </Typography>
          </center>
        </Paper>
      </Box>
    </Container>
  );
};

export default PricingOverview;