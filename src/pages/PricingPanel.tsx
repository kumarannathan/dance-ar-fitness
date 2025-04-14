import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Switch, Button } from '@mui/material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';

const PricingCard = styled(Paper)<{ isHighlighted?: boolean }>`
  background: ${props => props.isHighlighted ? '#4169e1' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.isHighlighted ? '#5478e4' : 'rgba(255, 255, 255, 0.1)'};
  padding: 2rem;
  height: 100%;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const FeatureItem = styled(Box)<{ isHighlighted?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: ${props => props.isHighlighted ? 'white' : 'rgba(255, 255, 255, 0.7)'};

  svg {
    color: ${props => props.isHighlighted ? 'white' : '#4169e1'};
  }
`;

const StyledButton = styled(Button)<{ isHighlighted?: boolean }>`
  width: 100%;
  padding: 1rem;
  margin-top: auto;
  text-transform: none;
  border-radius: 4px;
  background: ${props => props.isHighlighted ? 'white' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isHighlighted ? '#4169e1' : 'white'};

  &:hover {
    background: ${props => props.isHighlighted ? '#f5f5f5' : 'rgba(255, 255, 255, 0.15)'};
  }
`;

const PricingToggle = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const PricingOverview = () => {
  const [isYearly, setIsYearly] = useState(false);

  const subscriptionPlans = [
    {
      name: 'Free Plan',
      price: '0.00',
      period: '/month',
      features: [
        { text: 'Try out dances from the community' },
        { text: 'Add and participate in challenges with friends' },
        { text: 'Keep track of your personal high score on each track' },
        { text: 'Maintain a daily Dance Streak and get notified when it is about to expire' },
        { text: 'Upload and publish your own dances for the community' },
      ],
      description: 'Try out DanceAR and use basic features for free!'
    },
    {
      name: 'Premium Plan',
      price: '9.99',
      period: '/month',
      isHighlighted: true,
      features: [
        { text: 'Access exclusive dance content for DanceAR Premium members' },
        { text: 'Get one free Dance Streak revival per month' },
        { text: 'Freely request a Streak Pause for vacations' },
        { text: 'Play workouts with custom accuracy scoring' },
        { text: 'Record and rewatch with advanced feedback' },
      ],
      description: 'Get access to more DanceAR features to get the most out of your experience!'
    },
  ];

  const oneTimePurchases = [
    {
      name: 'Dance Streak Revival',
      price: '2.50',
      period: 'per use',
      features: [
        { text: 'Revives your Dance Streak from where you left off' },
        { text: 'Only works once per purchase' },
        { text: 'Can only be purchased once per week' },
        { text: 'Allows you to restart your streak at any time' },
      ],
      description: 'Dance Streaks are designed to help motivate you to be consistent with your workout routines. To motivate you to keep a consistent streak, the only way to recover a lost streak is to use a Dance Streak Revival.',
      note: 'Note: If you become injured, temporarily unable to complete dances, or unable to play due to a platform outage, please contact our support team who will be happy to grant you a free Dance Streak Revival! Safety is our top priority, and we want to ensure users are never encouraged to play when they are injured!'
    },
    {
      name: 'Streak Pause',
      price: '0.50',
      period: 'per day (up to $5.00)',
      features: [
        { text: 'Keep your Dance Streak while you\'re gone' },
        { text: 'Pause will only last the duration you specify' },
        { text: 'Requires support agents to approve your reason' },
        { text: 'If rejected, you will be completely refunded' },
        { text: 'Free for DanceAR Premium members!' },
      ],
      description: 'If you\'re going away for a while and won\'t have access to a reliable internet connection, you can pause your Dance Streak while you\'re away for a specified time frame. To prevent abuse, you will also need to explain the reason you need a Streak Pause at time of purchase, which will be reviewed by our support staff to determine if you are eligible.',
      note: 'Note: Similar to Dance Streak Revivals, our support staff will also give you a Streak Pause at no cost if you experience an unexpected injury that prevents you from playing so you don\'t have to worry about your Dance Streak while you recover!'
    }
  ];

  return (
    <Box className="page-container">
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            align="center"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Pricing
          </Typography>

          <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 6,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Subscriptions
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 4,
              mb: 8,
            }}
          >
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PricingCard isHighlighted={plan.isHighlighted} elevation={0}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: plan.isHighlighted ? 'white' : 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 600,
                    }}
                  >
                    {plan.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: plan.isHighlighted ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)',
                      mb: 3,
                    }}
                  >
                    {plan.description}
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    {plan.features.map((feature, i) => (
                      <FeatureItem key={i} isHighlighted={plan.isHighlighted}>
                        <CheckIcon fontSize="small" />
                        <Typography>
                          {feature.text}
                        </Typography>
                      </FeatureItem>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 4 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        color: plan.isHighlighted ? 'white' : 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 700,
                      }}
                    >
                      ${plan.price}
                    </Typography>
                    <Typography
                      sx={{
                        color: plan.isHighlighted ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)',
                        ml: 1,
                      }}
                    >
                      {plan.period}
                    </Typography>
                  </Box>
                  <StyledButton
                    variant={plan.isHighlighted ? 'contained' : 'outlined'}
                    isHighlighted={plan.isHighlighted}
                  >
                    Get started
                  </StyledButton>
                </PricingCard>
              </motion.div>
            ))}
          </Box>

          <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 6,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            One-time use purchases
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 4,
            }}
          >
            {oneTimePurchases.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PricingCard elevation={0}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 600,
                    }}
                  >
                    {plan.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      mb: 3,
                    }}
                  >
                    {plan.description}
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    {plan.features.map((feature, i) => (
                      <FeatureItem key={i}>
                        <CheckIcon fontSize="small" />
                        <Typography>
                          {feature.text}
                        </Typography>
                      </FeatureItem>
                    ))}
                  </Box>
                  {plan.note && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        mb: 4,
                        fontSize: '0.875rem',
                        fontStyle: 'italic',
                      }}
                    >
                      {plan.note}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 4 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 700,
                      }}
                    >
                      ${plan.price}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        ml: 1,
                      }}
                    >
                      {plan.period}
                    </Typography>
                  </Box>
                  <StyledButton
                    variant="outlined"
                  >
                    Purchase
                  </StyledButton>
                </PricingCard>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PricingOverview;