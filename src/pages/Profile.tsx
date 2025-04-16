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
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from '../contexts/UserContext';
import DanceGrid from '../components/DanceGrid';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
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

const Profile = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const [tabValue, setTabValue] = useState(0);
  const [dances, setDances] = useState<Dance[]>([]);

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

  useEffect(() => {
    if (user) {
      fetchDances();
    }
  }, [user, fetchDances]);

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