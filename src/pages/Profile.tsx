import React, { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  const { user } = useUser();
  const [tabValue, setTabValue] = useState(0);
  const [dances, setDances] = useState<Dance[]>([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [newDanceTitle, setNewDanceTitle] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleUploadDance = async () => {
    if (!user || !newDanceTitle) return;

    setLoading(true);
    try {
      // Here you would typically:
      // 1. Upload the video file to Firebase Storage
      // 2. Create a thumbnail
      // 3. Save the metadata to Firestore
      
      // For now, we'll just create a placeholder
      const newDance = {
        userId: user.uid,
        title: newDanceTitle,
        thumbnailUrl: 'https://via.placeholder.com/300x200',
        createdAt: new Date(),
        duration: '0:00',
        videoUrl: '',
      };

      await addDoc(collection(db, 'dances'), newDance);
      setDances([...dances, { id: 'temp', ...newDance }]);
      setOpenUpload(false);
      setNewDanceTitle('');
    } catch (error) {
      console.error('Error uploading dance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
              onClick={() => setOpenUpload(true)}
            >
              Upload Dance
            </Button>
          </Box>
          <DanceGrid dances={dances} onDelete={handleDeleteDance} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            Favorite Dances
          </Typography>
          <Typography color="text.secondary">
            Your favorite dances will appear here
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Account Settings
          </Typography>
          <Typography color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </TabPanel>
      </Box>

      <Dialog open={openUpload} onClose={() => setOpenUpload(false)}>
        <DialogTitle>Upload New Dance</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Dance Title"
            fullWidth
            value={newDanceTitle}
            onChange={(e) => setNewDanceTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpload(false)}>Cancel</Button>
          <Button
            onClick={handleUploadDance}
            variant="contained"
            disabled={loading || !newDanceTitle}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 