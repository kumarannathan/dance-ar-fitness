import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Paper,
  Grid,
  Chip,
  LinearProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useUser } from '../contexts/UserContext';
import DanceGrid from '../components/DanceGrid';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, and, or } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, deleteObject } from 'firebase/storage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface Dance {
  id: string;
  title: string;
  thumbnailUrl: string;
  createdAt: Date;
  duration: string;
  videoUrl: string;
}

interface DanceBattleHistory {
  id: string;
  creatorId: string;
  challengerId: string;
  benchmarkVideoUrl: string;
  creatorScore: number;
  challengerScore: number;
  status: 'complete';
  winner: string | 'draw';
  createdAt: Date;
}

const Profile = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const [tabValue, setTabValue] = useState(0);
  const [dances, setDances] = useState<Dance[]>([]);
  const [battleHistory, setBattleHistory] = useState<DanceBattleHistory[]>([]);
  const [stats, setStats] = useState({
    totalBattles: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    averageScore: 0
  });

  const fetchDances = useCallback(async () => {
    if (!user) return;
    
    try {
      const q = query(collection(db, 'dances'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const dancesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Dance[];
      
      setDances(dancesData);
    } catch (error) {
      console.error('Error fetching dances:', error);
    }
  }, [user]);

  const fetchBattleHistory = useCallback(async () => {
    if (!user) return;
    
    try {
      const battlesRef = collection(db, 'danceBattles');
      const q = query(
        battlesRef,
        and(
          where('status', '==', 'complete'),
          or(
            where('creatorId', '==', user.uid),
            where('challengerId', '==', user.uid)
          )
        )
      );
      const querySnapshot = await getDocs(q);
      const battles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as DanceBattleHistory[];
      
      // Sort battles by date, newest first
      battles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setBattleHistory(battles);

      // Calculate stats
      const totalBattles = battles.length;
      const wins = battles.filter(battle => battle.winner === user.uid).length;
      const draws = battles.filter(battle => battle.winner === 'draw').length;
      const losses = totalBattles - wins - draws;
      
      const userScores = battles.map(battle => 
        battle.creatorId === user.uid ? battle.creatorScore : battle.challengerScore
      );
      const averageScore = userScores.length > 0 
        ? userScores.reduce((a, b) => a + b, 0) / userScores.length 
        : 0;

      setStats({
        totalBattles,
        wins,
        losses,
        draws,
        averageScore
      });
    } catch (error) {
      console.error('Error fetching battle history:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDances();
      fetchBattleHistory();
    }
  }, [user, fetchDances, fetchBattleHistory]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeleteDance = async (danceId: string) => {
    if (!user) return;

    try {
      const dance = dances.find(d => d.id === danceId);
      if (dance) {
        // Delete video from storage
        const videoRef = ref(storage, `dances/${user.uid}/${danceId}`);
        await deleteObject(videoRef);

        // Delete document from Firestore
        await deleteDoc(doc(db, 'dances', danceId));

        // Update local state
        setDances(dances.filter(d => d.id !== danceId));
      }
    } catch (error) {
      console.error('Error deleting dance:', error);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Box className="page-container">
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {user.email?.[0].toUpperCase()}
            </Avatar>
            <Box sx={{ ml: 4 }}>
              <Typography variant="h4" gutterBottom>
                {user.email}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Member since {user.metadata.creationTime}
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="My Dances" />
              <Tab label="Favorites" />
              <Tab label="Dance Battle History" />
              <Tab label="Settings" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">My Dances</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/dance/upload')}
              >
                Upload Dance
              </Button>
            </Box>
            <DanceGrid dances={dances} onDelete={handleDeleteDance} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" color="text.secondary" textAlign="center">
              No favorites yet
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Battle Statistics
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
                    <Typography variant="h4" color="primary">
                      {stats.totalBattles}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Battles
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                    <Typography variant="h4" sx={{ color: 'success.contrastText' }}>
                      {stats.wins}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'success.contrastText' }}>
                      Victories
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                    <Typography variant="h4" sx={{ color: 'error.contrastText' }}>
                      {stats.losses}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'error.contrastText' }}>
                      Defeats
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                    <Typography variant="h4" sx={{ color: 'warning.contrastText' }}>
                      {stats.draws}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'warning.contrastText' }}>
                      Draws
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Average Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((stats.averageScore / 100) * 100, 100)} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Typography variant="h6" color="primary">
                    {stats.averageScore.toFixed(1)}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h5" gutterBottom>
                Battle History
              </Typography>
              <Grid container spacing={3}>
                {battleHistory.map((battle) => (
                  <Grid item xs={12} key={battle.id}>
                    <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                          Battle #{battle.id.substring(0, 6)}
                        </Typography>
                        <Chip
                          icon={<EmojiEventsIcon />}
                          label={
                            battle.winner === user?.uid ? 'Victory' :
                            battle.winner === 'draw' ? 'Draw' : 'Defeat'
                          }
                          color={
                            battle.winner === user?.uid ? 'success' :
                            battle.winner === 'draw' ? 'warning' : 'error'
                          }
                        />
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Your Score
                            </Typography>
                            <Typography variant="h4" color="primary">
                              {battle.creatorId === user?.uid ? battle.creatorScore : battle.challengerScore}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Opponent's Score
                            </Typography>
                            <Typography variant="h4" color="primary">
                              {battle.creatorId === user?.uid ? battle.challengerScore : battle.creatorScore}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                        {battle.createdAt.toLocaleDateString()}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" color="text.secondary" textAlign="center">
              Settings coming soon
            </Typography>
          </TabPanel>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile; 