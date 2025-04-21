  import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
  import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    CircularProgress,
    Alert,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
  } from '@mui/material';
  import { Person, EmojiEvents, Close, Send, ExpandMore } from '@mui/icons-material';
  import { motion, AnimatePresence } from 'framer-motion';
  import ReactConfetti from 'react-confetti';
  import styled from '@emotion/styled';
  import { useUser } from '../contexts/UserContext';
  import { doc, collection, query, where, getDocs, setDoc, updateDoc, getDoc, and, or } from 'firebase/firestore';
  import { db } from '../firebase';
  import { extractPoseFrames, comparePoseSequences, PoseFrame } from '../utils/poseComparison';
  import { ref, uploadBytes, getDownloadURL, getBlob } from 'firebase/storage';
  import { storage } from '../firebase';

  const GameContainer = styled(Container)`
    background-color: #000000;
    min-height: 100vh;
    padding: 2rem;
    padding-top: calc(64px + 2rem);
    padding-bottom: 120px;
    display: flex;
    flex-direction: column;
    font-family: 'Inter', sans-serif;
  `;

  const StyledButton = styled(Button)`
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 12px 24px;
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    font-weight: 400;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 1px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.5);
      color: #FFFFFF;
    }

    &:disabled {
      background: transparent;
      border-color: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.3);
    }
  `;

  const BattleCard = styled(Paper)`
    background-color: #000000;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s ease;
    margin-bottom: 2rem;
    padding: 1.5rem;

    &:hover {
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  `;

  const VideoGrid = styled(Grid)`
    aspect-ratio: 16/9;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    margin-bottom: 1rem;
  `;

  const UploadButton = styled(Button)`
    background: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 12px 24px;
    margin-top: 1rem;
    width: 100%;
    font-family: 'Space Mono', monospace;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    height: 48px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `;

  const ScoreBadge = styled(Chip)`
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #FFFFFF;
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 1px;
  `;

  const ProcessingOverlay = styled(Box)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    color: white;
  `;

  interface DanceBattleData {
    id: string;
    creatorId: string;
    challengerId: string | null;
    benchmarkVideoUrl: string;
    creatorScore: number | null;
    challengerScore: number | null;
    status: 'pending' | 'active' | 'complete';
    winner: string | 'draw' | null;
    createdAt: Date;
  }

  interface Friend {
    id: string;
    email: string;
  }

  const DanceBattle: React.FC = () => {
    const { user } = useUser();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [battleInvites, setBattleInvites] = useState<DanceBattleData[]>([]);
    const [activeBattles, setActiveBattles] = useState<DanceBattleData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [benchmarkVideo, setBenchmarkVideo] = useState<File | null>(null);
    const [benchmarkVideoUrl, setBenchmarkVideoUrl] = useState<string | null>(null);
    const [processingVideo, setProcessingVideo] = useState(false);
    const [progress, setProgress] = useState(0);
    const [benchmarkFrames, setBenchmarkFrames] = useState<Record<string, PoseFrame[]>>({});
    const [loadingBenchmark, setLoadingBenchmark] = useState<Record<string, boolean>>({});
    const [processingReady, setProcessingReady] = useState(false);
    const [processingTimeout, setProcessingTimeout] = useState<NodeJS.Timeout | null>(null);

    const fetchFriends = useCallback(async () => {
      if (!user) return;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData?.friends?.length) {
          const friendPromises = userData.friends.map(async (friendId: string) => {
            const friendDoc = await getDoc(doc(db, 'users', friendId));
            return {
              id: friendDoc.id,
              email: friendDoc.data()?.email || ''
            };
          });

          const friendsData = await Promise.all(friendPromises);
          setFriends(friendsData);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Failed to load friends list');
      }
    }, [user]);

    const fetchBattleInvites = useCallback(async () => {
      if (!user) return;
      try {
        const battlesRef = collection(db, 'danceBattles');
        const q = query(battlesRef, where('challengerId', '==', user.uid), where('status', '==', 'pending'));
        const snapshot = await getDocs(q);
        const invites = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DanceBattleData[];
        setBattleInvites(invites);
      } catch (error) {
        console.error('Error fetching battle invites:', error);
        setError('Failed to load battle invites');
      }
    }, [user]);

    const fetchActiveBattles = useCallback(async () => {
      if (!user) return;
      try {
        const battlesRef = collection(db, 'danceBattles');
        const q = query(
          battlesRef,
          and(
            where('status', 'in', ['active', 'complete']),
            or(
              where('creatorId', '==', user.uid),
              where('challengerId', '==', user.uid)
            )
          )
        );
        const snapshot = await getDocs(q);
        const battles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DanceBattleData[];
        setActiveBattles(battles);
      } catch (error) {
        console.error('Error fetching active battles:', error);
        setError('Failed to load active battles');
      }
    }, [user]);

    useEffect(() => {
      if (user) {
        fetchFriends();
        fetchBattleInvites();
        fetchActiveBattles();
      }
    }, [user, fetchFriends, fetchBattleInvites, fetchActiveBattles]);

    useEffect(() => {
      return () => {
        if (processingTimeout) {
          clearTimeout(processingTimeout);
        }
      };
    }, [processingTimeout]);

    const handleBenchmarkVideoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || !event.target.files.length) return;
      
      const file = event.target.files[0];
      setBenchmarkVideo(file);
      setBenchmarkVideoUrl(URL.createObjectURL(file));
    };

    const handleCreateBattle = async (friendId: string) => {
      if (!user || !benchmarkVideo) return;
      
      try {
        setProcessingVideo(true);
        setProgress(0);

        // Upload benchmark video to Firebase Storage
        const benchmarkVideoRef = ref(storage, `battle-videos/${user.uid}/${Date.now()}_benchmark.mp4`);
        await uploadBytes(benchmarkVideoRef, benchmarkVideo);
        const benchmarkVideoUrl = await getDownloadURL(benchmarkVideoRef);

        // Create battle document
        const battleRef = doc(collection(db, 'danceBattles'));
        await setDoc(battleRef, {
          creatorId: user.uid,
          challengerId: friendId,
          benchmarkVideoUrl,
          creatorScore: null,
          challengerScore: null,
          status: 'pending',
          winner: null,
          createdAt: new Date()
        });

        setShowInviteDialog(false);
        setSelectedFriend(null);
        setBenchmarkVideo(null);
        setBenchmarkVideoUrl(null);
        fetchActiveBattles();
      } catch (error) {
        console.error('Error creating battle:', error);
        setError('Failed to create battle');
      } finally {
        setProcessingVideo(false);
      }
    };

    const handleAcceptBattle = async (battle: DanceBattleData) => {
      if (!user) return;
      try {
        const battleRef = doc(db, 'danceBattles', battle.id);
        await updateDoc(battleRef, {
          status: 'active'
        });
        setBattleInvites(prev => prev.filter(b => b.id !== battle.id));
        fetchActiveBattles();
      } catch (error) {
        console.error('Error accepting battle:', error);
        setError('Failed to accept battle');
      }
    };

    const loadBenchmarkFrames = async (battleId: string, videoUrl: string): Promise<PoseFrame[]> => {
      if (benchmarkFrames[battleId]) {
        return benchmarkFrames[battleId];
      }

      setLoadingBenchmark(prev => ({ ...prev, [battleId]: true }));
      
      try {
        // Create a video element and wait for it to be ready
        const video = document.createElement('video');
        video.src = videoUrl;
        
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
            video.play();
            resolve(true);
          };
          video.onerror = reject;
        });

        // Extract pose frames
        const frames = await extractPoseFrames(video, (progress) => {
          setProgress(progress);
        });

        // Store the frames for future use
        setBenchmarkFrames(prev => ({ ...prev, [battleId]: frames }));
        return frames;
      } catch (error) {
        console.error('Error loading benchmark frames:', error);
        throw error;
      } finally {
        setLoadingBenchmark(prev => ({ ...prev, [battleId]: false }));
      }
    };

    // Update utility function to use Firebase Storage SDK
    const downloadVideoAsBlob = async (url: string): Promise<File> => {
      console.log('Downloading video from URL:', url);
      try {
        // Extract the path from the full URL
        const urlObj = new URL(url);
        const path = decodeURIComponent(urlObj.pathname.split('/o/')[1].split('?')[0]);
        console.log('Extracted storage path:', path);

        // Get a reference to the file in Firebase Storage
        const storageRef = ref(storage, path);
        
        // Download the file as a blob
        const blob = await getBlob(storageRef);
        console.log('Successfully downloaded blob:', { size: blob.size, type: blob.type });
        
        return new File([blob], 'benchmark.mp4', { type: blob.type });
      } catch (error) {
        console.error('Error downloading video:', error);
        throw error;
      }
    };

    // Add utility function to create and load video element
    const createVideoElement = async (file: File): Promise<HTMLVideoElement> => {
      console.log('Creating video element from file:', { fileSize: file.size, fileType: file.type });
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          console.log('Video metadata loaded:', {
            duration: video.duration,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight
          });
          video.play();
          resolve(true);
        };
        video.onerror = (error) => {
          console.error('Video error:', error);
          reject(error);
        };
      });

      return video;
    };

    const handleUploadDance = async (battleId: string, isCreator: boolean) => {
      if (!user) return;

      try {
        console.log('Starting dance upload process...', { battleId, isCreator });
        setProcessingVideo(true);
        setProgress(0);
        setProcessingReady(false);

        // Set a fallback timeout to ensure the overlay disappears
        const timeout = setTimeout(() => {
          console.log('Processing timeout reached, forcing reset...');
          setProcessingVideo(false);
          setProgress(0);
          setProcessingReady(true);
        }, 30000); // 30 second timeout
        setProcessingTimeout(timeout);

        // Get the battle document to access the benchmark video URL
        const battleRef = doc(db, 'danceBattles', battleId);
        const battleDoc = await getDoc(battleRef);
        const battleData = battleDoc.data() as DanceBattleData;

        if (!battleData) {
          console.error('Battle not found:', battleId);
          throw new Error('Battle not found');
        }

        // Create file input for user's video
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';

        input.onchange = async (e) => {
          const userFile = (e.target as HTMLInputElement).files?.[0];
          if (!userFile) {
            console.log('No file selected, resetting states...');
            setProcessingVideo(false);
            setProgress(0);
            setProcessingReady(true);
            return;
          }

          let benchmarkVideo: HTMLVideoElement | null = null;
          let userVideo: HTMLVideoElement | null = null;

          try {
            // Download and process benchmark video
            console.log('Downloading benchmark video...');
            const benchmarkFile = await downloadVideoAsBlob(battleData.benchmarkVideoUrl);
            benchmarkVideo = await createVideoElement(benchmarkFile);
            console.log('Benchmark video loaded successfully');

            // Process user's video
            console.log('Processing user video...');
            userVideo = await createVideoElement(userFile);
            console.log('User video loaded successfully');

            // Extract pose frames from both videos
            console.log('Extracting pose frames from benchmark video...');
            const benchmarkFrames = await extractPoseFrames(benchmarkVideo, (progress) => {
              console.log('Benchmark processing progress:', progress);
              setProgress(progress * 0.5); // First half of progress
            });
            console.log('Benchmark frames extracted:', { frameCount: benchmarkFrames.length });

            if (!benchmarkFrames || benchmarkFrames.length === 0) {
              throw new Error('Failed to extract benchmark frames');
            }

            console.log('Extracting pose frames from user video...');
            const userFrames = await extractPoseFrames(userVideo, (progress) => {
              console.log('User video processing progress:', progress);
              setProgress(50 + progress * 0.5); // Second half of progress
            });
            console.log('User frames extracted:', { frameCount: userFrames.length });

            if (!userFrames || userFrames.length === 0) {
              throw new Error('Failed to extract user frames');
            }

            // Calculate score
            console.log('Calculating score...', {
              benchmarkFrameCount: benchmarkFrames.length,
              userFrameCount: userFrames.length
            });
            const score = comparePoseSequences(benchmarkFrames, userFrames);
            console.log('Score calculated:', score);

            if (score === 0) {
              console.warn('Score is 0, this might indicate a problem with the comparison');
            }

            // Update battle document
            console.log('Updating battle document...', { isCreator, score });
            const updateData = isCreator ? {
              creatorScore: score,
              status: battleData.challengerScore !== null ? 'complete' : 'active',
              winner: battleData.challengerScore !== null ? 
                (score > battleData.challengerScore ? user.uid : 
                score < battleData.challengerScore ? 
                battleData.challengerId : 'draw') : null
            } : {
              challengerScore: score,
              status: battleData.creatorScore !== null ? 'complete' : 'active',
              winner: battleData.creatorScore !== null ? 
                (score > battleData.creatorScore ? user.uid : 
                score < battleData.creatorScore ? 
                battleData.creatorId : 'draw') : null
            };

            await updateDoc(battleRef, updateData);
            console.log('Battle document updated successfully');

            // Show confetti if battle is complete
            if (battleData.creatorScore !== null && battleData.challengerScore !== null) {
              console.log('Battle complete, showing confetti...');
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 5000);
            }

            // Clear timeout and reset states
            if (processingTimeout) {
              clearTimeout(processingTimeout);
              setProcessingTimeout(null);
            }
            setProcessingVideo(false);
            setProgress(0);
            setProcessingReady(true);
            await fetchActiveBattles();

          } catch (error) {
            console.error('Error processing videos:', error);
            // Clear timeout and reset states
            if (processingTimeout) {
              clearTimeout(processingTimeout);
              setProcessingTimeout(null);
            }
            setProcessingVideo(false);
            setProgress(0);
            setProcessingReady(true);
          } finally {
            console.log('Cleaning up video resources...');
            if (benchmarkVideo) {
              URL.revokeObjectURL(benchmarkVideo.src);
            }
            if (userVideo) {
              URL.revokeObjectURL(userVideo.src);
            }
          }
        };

        console.log('Opening file picker...');
        input.click();
      } catch (error) {
        console.error('Error in handleUploadDance:', error);
        // Clear timeout and reset states
        if (processingTimeout) {
          clearTimeout(processingTimeout);
          setProcessingTimeout(null);
        }
        setProcessingVideo(false);
        setProgress(0);
        setProcessingReady(true);
      }
    };

    const getBattleStatus = (battle: DanceBattleData) => {
      if (battle.status === 'complete') {
        if (battle.winner === user?.uid) return 'You won! 🎉';
        if (battle.winner === 'draw') return 'It\'s a draw! 🤝';
        return 'You lost 😢';
      }
      if (battle.status === 'active') {
        if (battle.creatorScore === null && battle.creatorId === user?.uid) return 'Upload your dance!';
        if (battle.challengerScore === null && battle.challengerId === user?.uid) return 'Upload your dance!';
        return 'Waiting for opponent...';
      }
      return 'Pending...';
    };

    return (
      <GameContainer maxWidth="lg">
        <AnimatePresence>
          {showConfetti && <ReactConfetti colors={['#FFFFFF']} />}
        </AnimatePresence>

        <Typography 
          variant="h1" 
          gutterBottom 
          sx={{ 
            color: '#FFFFFF', 
            textAlign: 'center', 
            mb: 4,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            fontSize: '2.5rem',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.2
          }}
        >
          Dance Battle
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Battle Invites Section */}
          <Grid item xs={12} md={4}>
            <BattleCard sx={{ p: 3, height: '100%' }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: '#FFFFFF',
                  fontWeight: 500,
                  mb: 2,
                  letterSpacing: '0.5px',
                  fontFamily: 'Space Mono, monospace',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem'
                }}
              >
                Battle Invites
              </Typography>
              <List>
                {battleInvites.map((battle) => (
                  <ListItem
                    key={battle.id}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 1,
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                    onClick={() => handleAcceptBattle(battle)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="New Battle Invite"
                      secondary={`From: ${battle.creatorId}`}
                    />
                    <IconButton edge="end">
                      <EmojiEvents />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <StyledButton
                fullWidth
                startIcon={<Send />}
                onClick={() => setShowInviteDialog(true)}
              >
                Challenge a Friend
              </StyledButton>
            </BattleCard>
          </Grid>

          {/* Active Battles Section */}
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: '#FFFFFF',
                fontWeight: 500,
                mb: 2,
                letterSpacing: '0.5px',
                fontFamily: 'Space Mono, monospace',
                textTransform: 'uppercase',
                fontSize: '0.75rem'
              }}
            >
              Active Battles
            </Typography>
            
            {activeBattles.length === 0 ? (
              <BattleCard sx={{ p: 3, textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 2 }}>
                  No active battles. Challenge a friend to start one!
                </Typography>
                <StyledButton
                  startIcon={<Send />}
                  onClick={() => setShowInviteDialog(true)}
                >
                  Create Battle
                </StyledButton>
              </BattleCard>
            ) : (
              <>
                {/* Completed Battles Section */}
                {activeBattles.filter(battle => battle.status === 'complete').length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Accordion 
                      sx={{ 
                        bgcolor: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:before': { display: 'none' },
                        mb: 2
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore sx={{ color: '#FFFFFF' }} />}
                        sx={{
                          '& .MuiAccordionSummary-content': {
                            my: 2
                          }
                        }}
                      >
                        <Typography 
                          sx={{ 
                            color: '#FFFFFF',
                            fontFamily: 'Space Mono, monospace',
                            fontSize: '0.75rem',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase'
                          }}
                        >
                          Completed Battles
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0 }}>
                        {activeBattles
                          .filter(battle => battle.status === 'complete')
                          .map((battle) => (
                            <BattleCard key={battle.id}>
                              <Box sx={{ mb: 2 }}>
                                <Typography 
                                  variant="h5" 
                                  sx={{ 
                                    color: '#FFFFFF',
                                    mb: 2,
                                    fontFamily: 'Space Mono, monospace',
                                    fontSize: '1rem',
                                    letterSpacing: '0.5px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}
                                >
                                  <span>Battle #{battle.id.substring(0, 6)}</span>
                                  <Chip 
                                    label={getBattleStatus(battle)} 
                                    sx={{ 
                                      bgcolor: battle.winner === user?.uid ? 'rgba(0, 255, 0, 0.2)' : 
                                              battle.winner === 'draw' ? 'rgba(255, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
                                      color: '#FFFFFF',
                                      fontFamily: 'Space Mono, monospace',
                                      fontSize: '0.75rem'
                                    }} 
                                  />
                                </Typography>
                              </Box>
                              
                              <Grid container spacing={3}>
                                {/* Benchmark Video */}
                                <Grid item xs={12}>
                                  <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', mb: 2 }}>
                                    <video
                                      src={battle.benchmarkVideoUrl}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                      controls
                                    />
                                    <Typography
                                      sx={{
                                        position: 'absolute',
                                        top: 8,
                                        left: 8,
                                        bgcolor: 'rgba(0, 0, 0, 0.8)',
                                        color: '#FFFFFF',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                      }}
                                    >
                                      Benchmark Video
                                    </Typography>
                                  </Box>
                                </Grid>
                                
                                {/* Scores Section */}
                                <Grid item xs={12}>
                                  <Grid container spacing={2}>
                                    {/* Creator's Score */}
                                    <Grid item xs={6}>
                                      <Box 
                                        sx={{ 
                                          p: 2, 
                                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                                          borderRadius: '4px',
                                          height: '100%',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          minHeight: '120px'
                                        }}
                                      >
                                        <Typography sx={{ color: '#FFFFFF', mb: 1, fontSize: '0.875rem' }}>
                                          {battle.creatorId === user?.uid ? 'Your Score' : 'Creator Score'}
                                        </Typography>
                                        <Typography sx={{ color: '#FFFFFF', fontSize: '2rem', fontWeight: 'bold' }}>
                                          {battle.creatorScore}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    
                                    {/* Challenger's Score */}
                                    <Grid item xs={6}>
                                      <Box 
                                        sx={{ 
                                          p: 2, 
                                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                                          borderRadius: '4px',
                                          height: '100%',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          minHeight: '120px'
                                        }}
                                      >
                                        <Typography sx={{ color: '#FFFFFF', mb: 1, fontSize: '0.875rem' }}>
                                          {battle.challengerId === user?.uid ? 'Your Score' : 'Challenger Score'}
                                        </Typography>
                                        <Typography sx={{ color: '#FFFFFF', fontSize: '2rem', fontWeight: 'bold' }}>
                                          {battle.challengerScore}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </BattleCard>
                          ))}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )}

                {/* Active Battles Section */}
                {activeBattles
                  .filter(battle => battle.status === 'active')
                  .map((battle) => (
                    <BattleCard key={battle.id}>
                      <Box sx={{ mb: 2 }}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            color: '#FFFFFF',
                            mb: 2,
                            fontFamily: 'Space Mono, monospace',
                            fontSize: '1rem',
                            letterSpacing: '0.5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <span>Battle #{battle.id.substring(0, 6)}</span>
                          <Chip 
                            label={getBattleStatus(battle)} 
                            sx={{ 
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                              color: '#FFFFFF',
                              fontFamily: 'Space Mono, monospace',
                              fontSize: '0.75rem'
                            }} 
                          />
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={3}>
                        {/* Benchmark Video */}
                        <Grid item xs={12}>
                          <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', mb: 2 }}>
                            <video
                              src={battle.benchmarkVideoUrl}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                              controls
                            />
                            <Typography
                              sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                bgcolor: 'rgba(0, 0, 0, 0.8)',
                                color: '#FFFFFF',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                              }}
                            >
                              Benchmark Video
                            </Typography>
                          </Box>
                        </Grid>
                        
                        {/* Scores Section */}
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            {/* Creator's Score */}
                            <Grid item xs={6}>
                              <Box 
                                sx={{ 
                                  p: 2, 
                                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                                  borderRadius: '4px',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minHeight: '120px'
                                }}
                              >
                                <Typography sx={{ color: '#FFFFFF', mb: 1, fontSize: '0.875rem' }}>
                                  {battle.creatorId === user?.uid ? 'Your Score' : 'Creator Score'}
                                </Typography>
                                
                                {battle.creatorScore !== null ? (
                                  <Typography sx={{ color: '#FFFFFF', fontSize: '2rem', fontWeight: 'bold' }}>
                                    {battle.creatorScore}
                                  </Typography>
                                ) : battle.creatorId === user?.uid ? (
                                  <UploadButton
                                    variant="contained"
                                    onClick={() => handleUploadDance(battle.id, true)}
                                  >
                                    Upload Your Dance
                                  </UploadButton>
                                ) : (
                                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                    Waiting for upload
                                  </Typography>
                                )}
                              </Box>
                            </Grid>
                            
                            {/* Challenger's Score */}
                            <Grid item xs={6}>
                              <Box 
                                sx={{ 
                                  p: 2, 
                                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                                  borderRadius: '4px',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minHeight: '120px'
                                }}
                              >
                                <Typography sx={{ color: '#FFFFFF', mb: 1, fontSize: '0.875rem' }}>
                                  {battle.challengerId === user?.uid ? 'Your Score' : 'Challenger Score'}
                                </Typography>
                                
                                {battle.challengerScore !== null ? (
                                  <Typography sx={{ color: '#FFFFFF', fontSize: '2rem', fontWeight: 'bold' }}>
                                    {battle.challengerScore}
                                  </Typography>
                                ) : battle.challengerId === user?.uid ? (
                                  <UploadButton
                                    variant="contained"
                                    onClick={() => handleUploadDance(battle.id, false)}
                                  >
                                    Upload Your Dance
                                  </UploadButton>
                                ) : (
                                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                    Waiting for upload
                                  </Typography>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </BattleCard>
                  ))}
              </>
            )}
          </Grid>
        </Grid>

        {/* Friend Selection Dialog */}
        <Dialog
          open={showInviteDialog}
          onClose={() => setShowInviteDialog(false)}
          PaperProps={{
            sx: {
              bgcolor: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <DialogTitle sx={{ color: '#FFFFFF' }}>Challenge a Friend</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Upload Benchmark Video
              </Typography>
              <Button
                component="label"
                variant="contained"
                fullWidth
                startIcon={<Send />}
              >
                Choose Benchmark Video
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={handleBenchmarkVideoUpload}
                />
              </Button>
              {benchmarkVideoUrl && (
                <Box sx={{ mt: 2 }}>
                  <video
                    src={benchmarkVideoUrl}
                    style={{ width: '100%', borderRadius: 4 }}
                    controls
                  />
                </Box>
              )}
            </Box>
            <List>
              {friends.map((friend) => (
                <ListItem
                  key={friend.id}
                  button
                  onClick={() => setSelectedFriend(friend)}
                  sx={{
                    bgcolor: selectedFriend?.id === friend.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={friend.email}
                    sx={{ color: '#FFFFFF' }}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={() => setShowInviteDialog(false)}>
              Cancel
            </StyledButton>
            <StyledButton
              onClick={() => selectedFriend && handleCreateBattle(selectedFriend.id)}
              disabled={!selectedFriend || !benchmarkVideo}
            >
              Send Challenge
            </StyledButton>
          </DialogActions>
        </Dialog>

        {/* Processing Overlay */}
        {processingVideo && !processingReady && (
          <ProcessingOverlay>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>
              Processing video... {Math.round(progress)}%
            </Typography>
          </ProcessingOverlay>
        )}

        {/* Benchmark Loading Overlay */}
        {Object.values(loadingBenchmark).some(loading => loading) && (
          <ProcessingOverlay>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>
              Loading benchmark video... {Math.round(progress)}%
            </Typography>
          </ProcessingOverlay>
        )}
      </GameContainer>
    );
  };

  export default DanceBattle; 