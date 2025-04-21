import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Divider, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';

const PricingCard = styled(motion(Paper))`
  padding: 32px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
  }
`;

const FeatureItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);

  & svg {
    color: #4ECDC4;
    font-size: 1.2rem;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 8px;
  padding: 12px 24px;
  text-transform: none;
  font-weight: 600;
  font-size: 1rem;
  background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
  color: white;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.2);

  &:hover {
    background: linear-gradient(45deg, #FF5252, #3DBEB6);
    box-shadow: 0 6px 20px rgba(78, 205, 196, 0.3);
  }
`;

const PricingOverview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const subscriptionPlans = [
    {
      title: 'Free Plan',
      price: '$0.00',
      period: '/month',
      features: [
        'Try out dances from the community',
        'Add and participate in challenges with friends',
        'Keep track of your personal high score on each track',
        'Maintain a daily Dance Streak and get notified when it is about to expire',
        'Upload and publish your own dances for the community'
      ],
      description: 'Try out DanceAR and use basic features for free!',
      buttonText: 'Get Started',
      buttonVariant: 'outlined' as const,
      isPopular: false
    },
    {
      title: 'Premium Plan',
      price: '$9.99',
      period: '/month',
      features: [
        'Access exclusive dance content for DanceAR Premium members',
        'Get one free Dance Streak revival per month',
        'Freely request a Streak Pause for vacations',
        'Play workouts with custom accuracy scoring',
        'Record and rewatch with advanced feedback'
      ],
      description: 'Get access to more DanceAR features to get the most out of your experience!',
      buttonText: 'Subscribe Now',
      buttonVariant: 'contained' as const,
      isPopular: true
    }
  ];

  const oneTimePurchases = [
    {
      title: 'Dance Streak Revival',
      price: '$2.50',
      period: 'per use',
      features: [
        'Revives your Dance Streak from where you left off',
        'Only works once per purchase',
        'Can only be purchased once per week',
        'Allows you to restart your streak at any time'
      ],
      description: 'Dance Streaks are designed to help motivate you to be consistent with your workout routines. To motivate you to keep a consistent streak, the only way to recover a lost streak is to use a Dance Streak Revival.',
      note: 'Note: If you become injured, temporarily unable to complete dances, or unable to play due to a platform outage, please contact our support team who will be happy to grant you a free Dance Streak Revival! Safety is our top priority, and we want to ensure users are never encouraged to play when they are injured!',
      buttonText: 'Purchase',
      buttonVariant: 'outlined' as const,
      isPopular: false
    },
    {
      title: 'Streak Pause',
      price: '$0.50',
      period: 'per day (up to $5.00)',
      features: [
        'Keep your Dance Streak while you\'re gone',
        'Pause will only last the duration you specify',
        'Requires support agents to approve your reason',
        'If rejected, you will be completely refunded',
        'Free for DanceAR Premium members!'
      ],
      description: 'If you\'re going away for a while and won\'t have access to a reliable internet connection, you can pause your Dance Streak while you\'re away for a specified time frame. To prevent abuse, you will also need to explain the reason you need a Streak Pause at time of purchase, which will be reviewed by our support staff to determine if you are eligible.',
      note: 'Note: Similar to Dance Streak Revivals, our support staff will also give you a Streak Pause at no cost if you experience an unexpected injury that prevents you from playing so you don\'t have to worry about your Dance Streak while you recover!',
      buttonText: 'Purchase',
      buttonVariant: 'outlined' as const,
      isPopular: false
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#000000',
      py: { xs: 4, md: 8 },
      px: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Space Mono, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            DanceAR
          </Typography>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              color: 'white',
              fontFamily: 'Space Mono, monospace'
            }}
          >
            Pricing
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            sx={{ 
              mb: 6,
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Subscriptions
          </Typography>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          {subscriptionPlans.map((plan, index) => (
            <Grid item xs={12} sm={6} key={plan.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <PricingCard
                  elevation={0}
                  sx={{
                    transform: plan.isPopular ? 'scale(1.05)' : 'none',
                    border: plan.isPopular ? '2px solid rgba(78, 205, 196, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: plan.isPopular ? '0 12px 40px rgba(78, 205, 196, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {plan.isPopular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 12,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.5px'
                      }}
                    >
                      Most Popular
                    </Box>
                  )}
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      color: 'white',
                      fontFamily: 'Space Mono, monospace'
                    }}
                  >
                    {plan.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      mb: 3,
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {plan.description}
                  </Typography>
                  <Box sx={{ my: 3 }}>
                    <Typography 
                      variant="h3" 
                      component="div" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'white',
                        fontFamily: 'Space Mono, monospace'
                      }}
                    >
                      {plan.price}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary"
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {plan.period}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    {plan.features.map((feature, index) => (
                      <FeatureItem key={index}>
                        <CheckCircleOutline sx={{ fontSize: '1.2rem' }} />
                        <Typography 
                          variant="body1"
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {feature}
                        </Typography>
                      </FeatureItem>
                    ))}
                  </Box>
                  <Box sx={{ mt: 4 }}>
                    <StyledButton
                      fullWidth
                      variant={plan.buttonVariant}
                      size="large"
                    >
                      {plan.buttonText}
                    </StyledButton>
                  </Box>
                </PricingCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              color: 'white',
              fontFamily: 'Space Mono, monospace'
            }}
          >
            One-time use purchases
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {oneTimePurchases.map((purchase, index) => (
            <Grid item xs={12} sm={6} key={purchase.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <PricingCard elevation={0}>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      color: 'white',
                      fontFamily: 'Space Mono, monospace'
                    }}
                  >
                    {purchase.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      mb: 3,
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {purchase.description}
                  </Typography>
                  <Box sx={{ my: 3 }}>
                    <Typography 
                      variant="h3" 
                      component="div" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'white',
                        fontFamily: 'Space Mono, monospace'
                      }}
                    >
                      {purchase.price}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary"
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {purchase.period}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    {purchase.features.map((feature, index) => (
                      <FeatureItem key={index}>
                        <CheckCircleOutline sx={{ fontSize: '1.2rem' }} />
                        <Typography 
                          variant="body1"
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {feature}
                        </Typography>
                      </FeatureItem>
                    ))}
                  </Box>
                  {purchase.note && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        mt: 3,
                        mb: 3,
                        fontStyle: 'italic',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {purchase.note}
                    </Typography>
                  )}
                  <Box sx={{ mt: 4 }}>
                    <StyledButton
                      fullWidth
                      variant={purchase.buttonVariant}
                      size="large"
                    >
                      {purchase.buttonText}
                    </StyledButton>
                  </Box>
                </PricingCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PricingOverview;