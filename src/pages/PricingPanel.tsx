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
              <Typography>Upload and publish your own dances for the community</Typography>
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
              <Typography>Freely request a Streak Pause for vacations or periods of time where you won't be able to access the internet</Typography>
            </li>
            <li>
              <Typography>Play workouts that feature custom accuracy scoring, including form accuracy for weight training and Pilates</Typography>
            </li>
            <li>
              <Typography>Record your playthrough of dances and workouts and rewatch it with advanced feedback</Typography>
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
              <Typography>Revives your Dance Streak from where you left off</Typography>
            </li>
            <li>
              <Typography>Only works once per purchase, ensuring you stay motivated to keep the streak</Typography>
            </li>
            <li>
              <Typography>Can only be purchased once per week to prevent abuse</Typography>
            </li>
            <li>
              <Typography>Allows you to restart your streak at any time you feel comfortable to do so</Typography>
            </li>
          </ul>
          <Typography variant="body2">
            Note: If you become injured, temporarily unable to complete dances, or unable to play due to a platform
            outage, please contact our support team who will be happy to grant you a free Dance Streak Revival! Safety is our
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
            If you're going away for a while and won't have access to a reliable internet connection, you can pause
            your Dance Streak while you're away for a specified time frame. To prevent abuse, you will also need to
            explain the reason you need a Streak Pause at time of purchase, which will be reviewed by our support
            staff to determine if you are eligible.
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
          <Typography variant="body2">
            Note: Similar to Dance Streak Revivals, our support staff will also give you a Streak Pause at no
            cost if you experience an unexpected injury that prevents you from playing so you don't have to
            worry about your Dance Streak while you recover!
          </Typography>
          <center>
            <Typography variant="h6" sx={{mt: '10px'}}>
              $0.50 per day paused (up to $5.00)
            </Typography>
          </center>
        </Paper>
      </Box>
    </Container>
  );
};

export default PricingOverview;