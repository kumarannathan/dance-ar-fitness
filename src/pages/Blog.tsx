import React from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';

const Blog = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 12 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              color: 'text.secondary',
              fontSize: '0.875rem',
              letterSpacing: '-0.01em',
            }}
          >
            march 30, 2024
          </Typography>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              mb: 1,
              fontSize: { xs: '2.5rem', md: '4rem' },
              letterSpacing: '-0.02em',
            }}
          >
            milestone 1: frontend & unity setup
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 12,
              color: 'text.secondary',
              maxWidth: '600px',
            }}
          >
            establishing the product landing page and unity integration framework
          </Typography>
        </motion.div>

        <Box sx={{ mb: 12 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 4,
              fontSize: { xs: '1.5rem', md: '2rem' },
              letterSpacing: '-0.02em',
            }}
          >
            tldr
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: '1rem',
              letterSpacing: '-0.01em',
              maxWidth: '600px',
              mb: 2,
            }}
          >
            developed a minimalist product landing page with react and material-ui, focusing on clean design and user experience. 
          </Typography>
        </Box>

        <Box sx={{ mb: 12 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 4,
              fontSize: { xs: '1.5rem', md: '2rem' },
              letterSpacing: '-0.02em',
            }}
          >
            product page development
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0,
              display: 'grid',
              gap: 6,
            }}
          >
            <Box component="li">
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                design system
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: '1rem',
                  letterSpacing: '-0.01em',
                  maxWidth: '600px',
                }}
              >
                implemented a clean, minimal aesthetic using material-ui's theming system. focused on typography, spacing, and subtle animations to create an engaging user experience.
              </Typography>
            </Box>

            <Box component="li">
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                responsive layout
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: '1rem',
                  letterSpacing: '-0.01em',
                  maxWidth: '600px',
                }}
              >
                developed a mobile-first layout using css grid and flexbox. ensured seamless experience across all device sizes while maintaining visual consistency.
              </Typography>
            </Box>

            <Box component="li">
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                navigation
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: '1rem',
                  letterSpacing: '-0.01em',
                  maxWidth: '600px',
                }}
              >
                created an intuitive navigation system with react-router, featuring smooth transitions and a responsive mobile menu for better accessibility.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 12 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 4,
              fontSize: { xs: '1.5rem', md: '2rem' },
              letterSpacing: '-0.02em',
            }}
          >
            pose tracking development
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: '1rem',
              letterSpacing: '-0.01em',
              maxWidth: '600px',
              mb: 6,
            }}
          >
            implemented real-time pose detection and tracking system using unity, the system accurately identifies key body points and movements for dance tracking.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 4,
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                initial tracking test
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                }}
              >
                <Box
                  component="video"
                  src="/tracking.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                improved tracking
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                }}
              >
                <Box
                  component="video"
                  src="/tracking2.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: 'auto'
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: '1rem',
              letterSpacing: '-0.01em',
              maxWidth: '600px',
            }}
          >
            the videos demonstrate the evolution of our pose tracking system, from initial implementation to improved accuracy and responsiveness.
          </Typography>
        </Box>

        <Box sx={{ mb: 12 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 4,
              fontSize: { xs: '1.5rem', md: '2rem' },
              letterSpacing: '-0.02em',
            }}
          >
            unity integration
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0,
              display: 'grid',
              gap: 2,
            }}
          >
            {[
              'set up unity webgl build configuration for web deployment',
              'established communication bridge between react and unity',
              'implemented basic pose data transfer system',
              'optimized loading and performance for web environment',
            ].map((item, index) => (
              <Box
                component="li"
                key={index}
                sx={{
                  color: 'text.secondary',
                  fontSize: '1rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {item}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 12 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 4,
              fontSize: { xs: '1.5rem', md: '2rem' },
              letterSpacing: '-0.02em',
            }}
          >
            next steps
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: '1rem',
              letterSpacing: '-0.01em',
              maxWidth: '600px',
            }}
          >
            planning to enhance the unity-web integration with more robust data synchronization and add interactive dance tutorials to the product page.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default Blog; 