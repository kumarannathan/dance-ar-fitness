import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { PersonAdd, Close } from '@mui/icons-material';
import styled from '@emotion/styled';
import { collection, query as firestoreQuery, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #000000;
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-width: 400px;
  }
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    color: #FFFFFF;
    font-size: 0.875rem;
    fieldset {
      border-color: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }
    &:hover fieldset {
      border-color: rgba(255, 255, 255, 0.3);
    }
    &.Mui-focused fieldset {
      border-color: #FFFFFF;
    }
  }
  .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
    &.Mui-focused {
      color: #FFFFFF;
    }
  }
`;

const UserListItem = styled(ListItem)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  &:last-child {
    border-bottom: none;
  }
`;

interface FriendSearchProps {
  open: boolean;
  onClose: () => void;
}

interface UserResult {
  id: string;
  email: string;
  friends: string[];
}

const FriendSearch: React.FC<FriendSearchProps> = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2 || !user) {
      setSearchResults([]);
      console.log('Search cancelled - invalid input:', { searchTerm, user: !!user });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting search with term:', searchTerm);
      const usersRef = collection(db, 'users');
      
      // Get all users first to verify we can access the collection
      const snapshot = await getDocs(usersRef);
      
      console.log('Retrieved users:', snapshot.size);
      snapshot.forEach(doc => {
        console.log('User found:', {
          id: doc.id,
          data: doc.data()
        });
      });

      // Filter users client-side
      const results = snapshot.docs
        .filter(doc => {
          const data = doc.data();
          return doc.id !== user.uid && // Not current user
                 data.email && // Has email
                 data.email.toLowerCase().includes(searchTerm.toLowerCase()); // Matches search
        })
        .map(doc => ({
          id: doc.id,
          email: doc.data().email,
          friends: doc.data().friends || []
        }));

      console.log('Search results:', results);
      setSearchResults(results);
    } catch (error: any) {
      console.error('Search error:', {
        message: error.message,
        code: error.code,
        details: error
      });
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async (friendId: string) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const friendRef = doc(db, 'users', friendId);

      // Add friend to user's friends list
      await updateDoc(userRef, {
        friends: arrayUnion(friendId)
      });

      // Add user to friend's friends list
      await updateDoc(friendRef, {
        friends: arrayUnion(user.uid)
      });

      // Update search results to reflect the new friend status
      setSearchResults(prev => 
        prev.map(result => 
          result.id === friendId 
            ? { ...result, friends: [...result.friends, user.uid] }
            : result
        )
      );
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        color: '#FFFFFF',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Find Friends
        <IconButton onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <StyledTextField
          fullWidth
          label="Search by email"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
        />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : searchResults.length > 0 ? (
          <List>
            {searchResults.map((result) => (
              <UserListItem key={result.id} sx={{ py: 2 }}>
                <ListItemText
                  primary={
                    <Typography sx={{ color: '#FFFFFF' }}>
                      {result.email}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  {!result.friends.includes(user?.uid || '') && (
                    <IconButton 
                      edge="end" 
                      onClick={() => addFriend(result.id)}
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          color: '#FFFFFF'
                        }
                      }}
                    >
                      <PersonAdd />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </UserListItem>
            ))}
          </List>
        ) : searchQuery.length > 0 && (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', py: 4 }}>
            No users found
          </Typography>
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default FriendSearch; 