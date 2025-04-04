import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
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
                  Our AR device, running on iOS, utilizes ARKit for real-time pose tracking, capturing user movements and pose data. It serves as the primary device for user interaction and movement, transmitting pose data via WebSocket connection to enable seamless communication with the web interface.
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
                  The web device hosts our website interface, receiving real-time pose data from the AR device. It displays dance moves that need to be performed and provides real-time feedback and scoring to guide users through their workout sessions.
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
                  The system's data flow begins with ARKit capturing pose data on the iOS device. This data is then processed and transmitted via WebSocket through our Unity script. The website receives and processes this data, calculating pose matching scores and displaying real-time feedback on the web interface.
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
                  Our system integrates several key components: ARKit for iOS pose tracking, Unity for AR development and WebSocket communication, a web interface for displaying moves and feedback, a pose matching algorithm for scoring, and a WebSocket server for real-time data transfer.
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
          expanded={expanded === 'financial-sustainability'}
          onChange={handleChange('financial-sustainability')}
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
              financial sustainability
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
              Exploring sustainable monetization strategies through targeted advertising and user engagement:
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
                  Contextual Advertising
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
                  Integrating non-intrusive fitness and wellness-related advertisements during natural breaks in the workout experience. This could include promoting fitness equipment, healthy meal plans, or wellness apps that align with our users' interests.
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
                  Sponsored Content
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
                  Collaborating with fitness influencers and brands to create sponsored dance routines and workout challenges. This approach maintains user engagement while providing value through professional content.
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
                  Premium Features
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
                  Offering an ad-free experience with additional features like custom dance routines, advanced analytics, and exclusive content through a premium subscription model.
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
                  User Experience Balance
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
                  Maintaining a careful balance between monetization and user experience by implementing non-disruptive ad placements and ensuring that sponsored content adds value to the workout experience rather than detracting from it.
                </Typography>
              </Box>
            </Box>
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
                <Box
                  component="img"
                  src="/jira.png"
                  alt="Jira Dashboard"
                  sx={{
                    width: '100%',
                    maxWidth: '600px',
                    height: 'auto',
                    mb: 4,
                    borderRadius: 1,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                />
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
                  screen space joint visualizer
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
                    src="/dancear-demo-visualizer-compressed.mov"
                    autoPlay
                    loop
                    muted
                    playsInline
                    sx={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      mb: 2
                    }}
                  />
                </Box>
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
                  we used Unity and ImGui to display joint values to modify a joint visualizer to
                  show information about each joint's number and position, which will be useful for
                  creating gestures and dances moves. the&nbsp;
                  <Link href='https://github.com/Unity-Technologies/arfoundation-samples/blob/main/Assets/Scripts/Runtime/ScreenSpaceJointVisualizer.cs' underline='always'>
                    original visualizer from Unity
                  </Link>
                  &nbsp;did not include anything to visualize the joints, which is why this feature
                  was added to the visualizer.
                </Typography>
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
                  gesture detection
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
                    src="/dancear-demo-action-compressed.mov"
                    autoPlay
                    loop
                    muted
                    playsInline
                    sx={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      mb: 2
                    }}
                  />
                </Box>
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
                  we also implemented gesture detection, which will be useful for our users since they
                  will not be able to see or interact with the phone screen while they use the app, but
                  will likely still need to perform actions. to ensure reusability, we used C# events to
                  allow any component to listen to an event by referencing the gesture manager and adding
                  a delegate to the event. to avoid inadvertent actions, we also wait a fixed interval
                  before calling the event, allowing the user to stop performing a gesture if necessary.
                  this video shows a debug screen that shows when the action gets triggered.
                </Typography>
              </Box>
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
                'start implementing a frontend site synced to the device that shows instructions to the user',
                'establish communication bridge between react and unity',
                'implement basic pose detection for dance moves',
                'optimize loading and performance for web environment',
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

      </Container>
    </Box>
  );
};

export default Blog; 