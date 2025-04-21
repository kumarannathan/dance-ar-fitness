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
        'Use a Streak Pause for vacations',
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
      title: 'Revenue Sharing',
      price: '30%',
      period: 'commission per user onboarded',
      features: [
        'Show previews of your content on DanceAR to promote your subscription',
        'Allow users to follow along to your tracked content',
        'Unlock the advanced editor for more precise control',
        'Integrates with other platforms via SSO/SAML to allow existing users to onboard by only paying commission',
        'DRM content protection to ensure users cannot reupload your content'
      ],
      description: 'Sell existing dance or workout content on DanceAR and allow members to subscribe to access your content!',
      note: 'This feature is currently under development, but we would love to know if you\'re interested!',
      buttonText: 'Contact us',
      buttonVariant: 'outlined' as const,
      isPopular: false
    },
    {
      title: 'DanceAR Health',
      price: '$9.99',
      period: 'per monthly active user',
      features: [
        'Integrate your SSO/SAML solution to allow customers to login through existing portals, or invite users by email',
        'Access the advanced editor to make content designed specifically for certain types of training',
        'Monitor user progress, which is kept end-to-end encrypted to comply with health requirements'
      ],
      description: 'Help your employees stay healthy by using DanceAR for Organizations! Promote personal health across your organiaztion by allowing your employees to compete in competitions to stay healthy while having fun!',
      note: 'DanceAR Health is currently under development, but we would love to know if you\'re interested! Let us know your requirements so we can ensure we have everything you need!',
      buttonText: 'Contact us',
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
            For Organizations
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
            (coming soon)
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