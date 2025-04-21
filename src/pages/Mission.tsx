import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button, Container, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NAVBAR_HEIGHT } from '../components/Navbar';

// Styled components
const MissionContainer = styled(Box)`
  background-color: #000000;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
  padding-top: ${NAVBAR_HEIGHT};
`;

const Section = styled(Box)`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const IntroSection = styled(Section)`
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/dance-bg.jpg');
  background-size: cover;
  background-position: center;
  color: white;
`;

const ProblemSection = styled(Section)`
  background-color: #111111;
  color: white;
`;

const ImpactSection = styled(Section)`
  background-color: #0a0a0a;
  color: white;
`;

const SolutionSection = styled(Section)`
  background-color: #111111;
  color: white;
`;

const CtaSection = styled(Section)`
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/images/dance-community.jpg');
  background-size: cover;
  background-position: center;
  color: white;
`;

const SectionContent = styled(Container)`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  z-index: 1;
`;

const StatBox = styled(Box)`
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2rem;
  margin: 1rem;
  width: 100%;
  max-width: 350px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatNumber = styled(Typography)`
  font-family: 'Space Mono', monospace;
  font-size: 3rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled(Typography)`
  font-family: 'Space Mono', monospace;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
`;

const StatDescription = styled(Typography)`
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
`;

const FeatureBox = styled(Box)`
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2rem;
  margin: 1rem;
  width: 100%;
  max-width: 350px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureTitle = styled(Typography)`
  font-family: 'Space Mono', monospace;
  font-size: 1.25rem;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled(Typography)`
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
`;

const CtaButton = styled(Button)`
  background-color: #FFFFFF;
  color: #000000;
  font-family: 'Space Mono', monospace;
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 4px;
  margin-top: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }
`;

const ScrollIndicator = styled(Box)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  z-index: 2;
`;

const ScrollText = styled(Typography)`
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
`;

const ScrollArrow = styled(Box)`
  width: 20px;
  height: 20px;
  border-right: 2px solid rgba(255, 255, 255, 0.7);
  border-bottom: 2px solid rgba(255, 255, 255, 0.7);
  transform: rotate(45deg);
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0) rotate(45deg);
    }
    40% {
      transform: translateY(-10px) rotate(45deg);
    }
    60% {
      transform: translateY(-5px) rotate(45deg);
    }
  }
`;

const SectionTitle = styled(Typography)`
  font-family: 'Space Mono', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SectionSubtitle = styled(Typography)`
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

const StatsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
`;

const FeaturesContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
`;

const Citation = styled(Typography)`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.5rem;
  font-style: italic;
`;

const Mission: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // Animation hooks
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Refs for scroll animations
  const introRef = useRef(null);
  const problemRef = useRef(null);
  const impactRef = useRef(null);
  const solutionRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Check if elements are in view
  const introInView = useInView(introRef, { once: true });
  const problemInView = useInView(problemRef, { once: true });
  const impactInView = useInView(impactRef, { once: true });
  const solutionInView = useInView(solutionRef, { once: true });
  const ctaInView = useInView(ctaRef, { once: true });
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };
  
  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const handleTryDanceAR = () => {
    navigate('/signup');
  };
  
  return (
    <MissionContainer>
      {/* Progress bar */}
      <Box
        sx={{
          position: 'fixed',
          top: NAVBAR_HEIGHT,
          left: 0,
          right: 0,
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 1000
        }}
      >
        <motion.div
          style={{
            scaleX,
            transformOrigin: '0%',
            height: '100%',
            background: 'white'
          }}
        />
      </Box>
      
      {/* Intro Section */}
      <IntroSection ref={introRef}>
        <SectionContent>
          <motion.div
            initial="hidden"
            animate={introInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <SectionTitle>
              Dance and Fitness Aren't Accessible to Everyone. Here's Why.
            </SectionTitle>
            <SectionSubtitle>
              Too many people are left behind by traditional dance and fitness programs. 
              The majority of Americans aren't getting the exercise they need, and critical 
              barriers keep high-quality dance education out of reach for millions.
            </SectionSubtitle>
          </motion.div>
        </SectionContent>
        <ScrollIndicator>
          <ScrollText>Scroll to explore</ScrollText>
          <ScrollArrow />
        </ScrollIndicator>
      </IntroSection>
      
      {/* Problem Section */}
      <ProblemSection ref={problemRef}>
        <SectionContent>
          <motion.div
            initial="hidden"
            animate={problemInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <SectionTitle>The Accessibility Gap</SectionTitle>
            <SectionSubtitle>
              From cost prohibitions to geographical limitations, these barriers prevent millions from experiencing the joy and benefits of dance and fitness.
            </SectionSubtitle>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate={problemInView ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            <StatsContainer>
              <StatBox>
                <StatNumber>61%</StatNumber>
                <StatLabel>Cost Barrier</StatLabel>
                <StatDescription>
                  Of people cite cost as a major barrier to joining fitness programs, making it the most significant obstacle to participation.
                </StatDescription>
                <Citation>Health & Fitness Association</Citation>
              </StatBox>
              
              <StatBox>
                <StatNumber>$100K+</StatNumber>
                <StatLabel>Dance Training</StatLabel>
                <StatDescription>
                  A pre-professional ballet education can cost over $100,000, making it inaccessible for many families.
                </StatDescription>
                <Citation>ABC News</Citation>
              </StatBox>
              
              <StatBox>
                <StatNumber>25%</StatNumber>
                <StatLabel>Disability Barriers</StatLabel>
                <StatDescription>
                  Approximately 25% of U.S. adults live with a disability, yet many fitness facilities lack the necessary accommodations.
                </StatDescription>
                <Citation>Institute For Diversity Certification</Citation>
              </StatBox>
              
              <StatBox>
                <StatNumber>18%</StatNumber>
                <StatLabel>Rural Access</StatLabel>
                <StatDescription>
                  Only 18% of nonmetropolitan adults meet exercise guidelines, compared to 28% in urban areas, highlighting geographical disparities.
                </StatDescription>
                <Citation>CDC</Citation>
              </StatBox>
            </StatsContainer>
          </motion.div>
        </SectionContent>
      </ProblemSection>
      
      {/* Impact Section */}
      <ImpactSection ref={impactRef}>
        <SectionContent>
          <motion.div
            initial="hidden"
            animate={impactInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <SectionTitle>The Consequences of Inaccessibility</SectionTitle>
            <SectionSubtitle>
              These barriers contribute to broader health and social disparities that affect millions of Americans.
            </SectionSubtitle>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate={impactInView ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            <StatsContainer>
              <StatBox>
                <StatNumber>75%</StatNumber>
                <StatLabel>Physical Inactivity</StatLabel>
                <StatDescription>
                  Three in four Americans do not meet recommended physical activity guidelines, increasing the risk of chronic diseases.
                </StatDescription>
                <Citation>Club Solutions Magazine</Citation>
              </StatBox>
              
              <StatBox>
                <StatNumber>81%</StatNumber>
                <StatLabel>Exclusion</StatLabel>
                <StatDescription>
                  81% of people with disabilities don't feel welcome in fitness spaces, creating a significant barrier to participation.
                </StatDescription>
                <Citation>ACSM</Citation>
              </StatBox>
              
              <StatBox>
                <StatNumber>14%</StatNumber>
                <StatLabel>Senior Activity</StatLabel>
                <StatDescription>
                  Only about 14% of Americans over 65 meet recommended exercise guidelines, partly because many programs don't cater to seniors.
                </StatDescription>
                <Citation>CDC</Citation>
              </StatBox>
              
              <StatBox>
                <StatNumber>43%</StatNumber>
                <StatLabel>Digital Divide</StatLabel>
                <StatDescription>
                  43% of households earning under $30k have no home broadband, limiting access to digital fitness solutions.
                </StatDescription>
                <Citation>Pew Research Center</Citation>
              </StatBox>
            </StatsContainer>
          </motion.div>
        </SectionContent>
      </ImpactSection>
      
      {/* Solution Section */}
      <SolutionSection ref={solutionRef}>
        <SectionContent>
          <motion.div
            initial="hidden"
            animate={solutionInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <SectionTitle>DanceAR's Solution</SectionTitle>
            <SectionSubtitle>
              We're committed to dismantling these barriers through innovative technology, making dance and fitness accessible to everyone, everywhere.
            </SectionSubtitle>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate={solutionInView ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            <FeaturesContainer>
              <FeatureBox>
                <FeatureTitle>Augmented Reality</FeatureTitle>
                <FeatureDescription>
                  Turn any space into your personal dance studio with AR technology that provides real-time feedback and guidance.
                </FeatureDescription>
              </FeatureBox>
              
              <FeatureBox>
                <FeatureTitle>Affordable Access</FeatureTitle>
                <FeatureDescription>
                  Our platform offers cost-effective dance and fitness instruction, making it accessible to a broader audience.
                </FeatureDescription>
              </FeatureBox>
              
              <FeatureBox>
                <FeatureTitle>Inclusive Design</FeatureTitle>
                <FeatureDescription>
                  Built for every body with modifications and adaptive options for all abilities, ages, and backgrounds.
                </FeatureDescription>
              </FeatureBox>
              
              <FeatureBox>
                <FeatureTitle>Virtual Convenience</FeatureTitle>
                <FeatureDescription>
                  Eliminate geographical barriers by providing virtual classes that can be accessed from anywhere.
                </FeatureDescription>
              </FeatureBox>
              
              <FeatureBox>
                <FeatureTitle>Community Building</FeatureTitle>
                <FeatureDescription>
                  Foster a supportive community where users can connect, share progress, and motivate each other.
                </FeatureDescription>
              </FeatureBox>
              
              <FeatureBox>
                <FeatureTitle>Tech That Connects</FeatureTitle>
                <FeatureDescription>
                  Our platform is lightweight and accessible, designed to work on common devices and even limited bandwidth.
                </FeatureDescription>
              </FeatureBox>
            </FeaturesContainer>
          </motion.div>
        </SectionContent>
      </SolutionSection>
      
      {/* CTA Section */}
      <CtaSection ref={ctaRef}>
        <SectionContent>
          <motion.div
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <SectionTitle>Join the Movement</SectionTitle>
            <SectionSubtitle>
              DanceAR's mission is simple: make high-quality dance and fitness training affordable and available to all, everywhere.
              We're turning what-ifs into reality – one dance at a time.
            </SectionSubtitle>
            
            <CtaButton 
              variant="contained" 
              size="large"
              onClick={handleTryDanceAR}
            >
              Try DanceAR
            </CtaButton>
          </motion.div>
        </SectionContent>
      </CtaSection>
    </MissionContainer>
  );
};

export default Mission; 