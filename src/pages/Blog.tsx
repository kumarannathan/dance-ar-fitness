import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { BlogPost, loadBlogPosts } from '../utils/markdownLoader';
import rehypeRaw from 'rehype-raw';

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
  const [expanded, setExpanded] = useState<string | false>(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const posts = loadBlogPosts();
        setBlogPosts(posts);
        if (posts.length > 0) {
          setExpanded(posts[0].slug);
        }
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography variant="h4" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Container>
    );
  }

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
            {blogPosts.length > 0 ? formatDate(blogPosts[0].date) : 'Latest Updates'}
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
            development blog
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 12,
              color: 'text.secondary',
              maxWidth: '600px',
            }}
          >
            Tracking our progress as we build an AR dance fitness application.
          </Typography>
        </motion.div>

        {blogPosts.map((post, index) => (
          <Accordion
            key={post.slug}
            expanded={expanded === post.slug}
            onChange={handleChange(post.slug)}
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
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    letterSpacing: '-0.02em',
                  }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mt: 1,
                  }}
                >
                  {formatDate(post.date)} • {post.category}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, pl: 4 }}>
              <Box
                sx={{
                  color: 'text.primary',
                  fontSize: '1rem',
                  letterSpacing: '-0.01em',
                  maxWidth: '800px',
                  mb: 4,
                }}
              >
                {/* do not allow user content in here, raw html is allowed */}
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {post.content}
                </ReactMarkdown>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

export default Blog; 