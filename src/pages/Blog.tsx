import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';

// interface BlogPost {
//   title: string;
//   date: string;
//   category: string;
//   description: string;
//   image: string;
//   tags: string[];
//   content: string;
// }

const Blog = () => {
  const [expanded, setExpanded] = useState<string | false>('system-architecture');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // const blogPosts: BlogPost[] = [
  //   {
  //     title: 'System Architecture: Two-Device AR Dance Fitness Setup',
  //     date: '2024-03-19',
  //     category: 'Development Plan',
  //     description: 'Outlining our planned system architecture for the AR dance fitness application using a two-device setup.',
  //     image: '/images/architecture.png',
  //     tags: ['Architecture', 'Development Plan', 'AR', 'WebSocket'],
  //     content: `
  //       We're implementing a two-device system architecture for our AR dance fitness application:

  //       1. AR Device (iOS)
  //       - Uses ARKit for real-time pose tracking
  //       - Captures user's movements and pose data
  //       - Sends pose data via WebSocket connection
  //       - Primary device for user interaction and movement

  //       2. Web Device (Any Machine)
  //       - Hosts our website interface
  //       - Receives real-time pose data from AR device
  //       - Displays dance moves that need to be performed
  //       - Shows real-time feedback and scoring

  //       3. Data Flow
  //       - ARKit captures pose data on iOS device
  //       - Unity script processes and transmits data via WebSocket
  //       - Website receives and processes pose data
  //       - System calculates pose matching score
  //       - Real-time feedback displayed on web interface

  //       4. Key Components
  //       - ARKit for iOS pose tracking
  //       - Unity for AR development and WebSocket communication
  //       - Web interface for displaying moves and feedback
  //       - Pose matching algorithm for scoring
  //       - WebSocket server for real-time data transfer

  //       This architecture enables a seamless experience where users can follow dance moves displayed on one device while their movements are tracked and scored through the AR device.
  //     `
  //   },
  //   // ... existing code ...
  // ];

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
            establishing the product landing page, unity framework, and a project roadmap. 
          </Typography>
        </motion.div>

        <Accordion
          expanded={expanded === 'system-architecture'}
          onChange={handleChange('system-architecture')}
          sx={{ mb: 2, bgcolor: 'transparent', boxShadow: 'none' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                margin: '0',
                padding: '0',
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                letterSpacing: '-0.02em',
              }}
            >
             project roadmap & overview
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, pl: 4 }}>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '1rem',
                letterSpacing: '-0.01em',
                maxWidth: '600px',
                mb: 4,
              }}
            >
              We're implementing a two-device system architecture for our AR dance fitness application:
            </Typography>
            <Box
              component="ul"
              sx={{
                listStyle: 'none',
                p: 0,
                m: 0,
                display: 'grid',
                gap: 4,
                mb: 8,
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
                  AR Device (iOS)
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
                  - Uses ARKit for real-time pose tracking
                  - Captures user's movements and pose data
                  - Sends pose data via WebSocket connection
                  - Primary device for user interaction and movement
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
                  Web Device (Any Machine)
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
                  - Hosts our website interface
                  - Receives real-time pose data from AR device
                  - Displays dance moves that need to be performed
                  - Shows real-time feedback and scoring
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
                  Data Flow
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
                  - ARKit captures pose data on iOS device
                  - Unity script processes and transmits data via WebSocket
                  - Website receives and processes pose data
                  - System calculates pose matching score
                  - Real-time feedback displayed on web interface
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
                  Key Components
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
                  - ARKit for iOS pose tracking
                  - Unity for AR development and WebSocket communication
                  - Web interface for displaying moves and feedback
                  - Pose matching algorithm for scoring
                  - WebSocket server for real-time data transfer
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '1rem',
                letterSpacing: '-0.01em',
                maxWidth: '600px',
                mb: 8,
              }}
            >
              This architecture enables a seamless experience where users can follow dance moves displayed on one device while their movements are tracked and scored through the AR device.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === 'product-management'}
          onChange={handleChange('product-management')}
          sx={{ mb: 2, bgcolor: 'transparent', boxShadow: 'none' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                margin: '0',
                padding: '0',
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                letterSpacing: '-0.02em',
              }}
            >
              product management
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, pl: 4 }}>
            <Box
              component="ul"
              sx={{
                listStyle: 'none',
                p: 0,
                m: 0,
                display: 'grid',
                gap: 4,
                mb: 8,
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
                  Unity Development (GitLab)
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
                  Using GitLab for Unity project version control, managing Unity-specific assets and dependencies and tracking AR development milestones and features.
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
                  Frontend Development (GitHub)
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
                  GitHub serves as our repository for the React frontend, enabling automated deployments through Netlify, managing web-specific dependencies and assets, and tracking UI/UX improvements and features.
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
                  Project Management (Jira)
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
                  Jira provides centralized project tracking, enabling sprint planning and task management, facilitating cross-team coordination between Unity and web development, and tracking project milestones and deadlines.
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '1rem',
                letterSpacing: '-0.01em',
                maxWidth: '600px',
                mb: 8,
              }}
            >
              This multi-platform approach allows us to leverage the strengths of each tool while maintaining clear separation between Unity and web development workflows.
            </Typography>
          </AccordionDetails>
        </Accordion>
{/* 
        <Accordion
          expanded={expanded === 'tldr'}
          onChange={handleChange('tldr')}
          sx={{ mb: 2, bgcolor: 'transparent', boxShadow: 'none' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                margin: '0',
                padding: '0',
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                letterSpacing: '-0.02em',
              }}
            >
              tldr
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, pl: 4 }}>
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
          </AccordionDetails>
        </Accordion> */}

        <Accordion
          expanded={expanded === 'product-page'}
          onChange={handleChange('product-page')}
          sx={{ mb: 2, bgcolor: 'transparent', boxShadow: 'none' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                margin: '0',
                padding: '0',
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                letterSpacing: '-0.02em',
              }}
            >
              product page development
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, pl: 4 }}>
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
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === 'pose-tracking'}
          onChange={handleChange('pose-tracking')}
          sx={{ mb: 2, bgcolor: 'transparent', boxShadow: 'none' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                margin: '0',
                padding: '0',
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                letterSpacing: '-0.02em',
              }}
            >
              pose tracking development
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, pl: 4 }}>
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
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === 'unity-integration'}
          onChange={handleChange('unity-integration')}
          sx={{ mb: 2, bgcolor: 'transparent', boxShadow: 'none' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                margin: '0',
                padding: '0',
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                letterSpacing: '-0.02em',
              }}
            >
              unity integration
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, pl: 4 }}>
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
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === 'next-steps'}
          onChange={handleChange('next-steps')}
          sx={{ mb: 2, bgcolor: 'transparent', boxShadow: 'none' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                margin: '0',
                padding: '0',
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                letterSpacing: '-0.02em',
              }}
            >
              next steps
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, pl: 4 }}>
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
          </AccordionDetails>
        </Accordion>

      </Container>
    </Box>
  );
};

export default Blog; 