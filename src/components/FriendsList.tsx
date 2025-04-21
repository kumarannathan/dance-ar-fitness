import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Button,
} from '@mui/material';
import { Close, Delete, Message } from '@mui/icons-material';
import styled from '@emotion/styled';
import { collection, query, where, getDocs, doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';
import Chat from './Chat';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #000000;
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-width: 400px;
  }
`;

const UserListItem = styled(ListItem)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  &:last-child {
    border-bottom: none;
  }
`;

interface FriendsListProps {
  open: boolean;
  onClose: () => void;
}

interface FriendData {
  id: string;
  email: string;
}

const FriendsList: React.FC<FriendsListProps> = ({ open, onClose }) => {
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState<FriendData | null>(null);
  const { user } = useUser();

  const fetchFriends = async () => {
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
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchFriends();
    }
  }, [open, user]);

  const removeFriend = async (friendId: string) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const friendRef = doc(db, 'users', friendId);

      // Remove friend from user's friends list
      await updateDoc(userRef, {
        friends: arrayRemove(friendId)
      });

      // Remove user from friend's friends list
      await updateDoc(friendRef, {
        friends: arrayRemove(user.uid)
      });

      // Update local state
      setFriends(prev => prev.filter(friend => friend.id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const handleStartChat = (friend: FriendData) => {
    setSelectedFriend(friend);
  };

  const handleCloseChat = () => {
    setSelectedFriend(null);
  };

  return (
    <>
      <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          color: '#FFFFFF',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Friends List
          <IconButton onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          ) : friends.length > 0 ? (
            <List>
              {friends.map((friend) => (
                <UserListItem key={friend.id} sx={{ py: 2 }}>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: '#FFFFFF' }}>
                        {friend.email}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleStartChat(friend)}
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        mr: 1,
                        '&:hover': {
                          color: '#FFFFFF'
                        }
                      }}
                    >
                      <Message />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      onClick={() => removeFriend(friend.id)}
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          color: '#ff4444'
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </UserListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', py: 4 }}>
              No friends added yet
            </Typography>
          )}
        </DialogContent>
      </StyledDialog>

      {selectedFriend && (
        <StyledDialog 
          open={true} 
          onClose={handleCloseChat}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent sx={{ p: 2 }}>
            <Chat 
              friendId={selectedFriend.id}
              friendEmail={selectedFriend.email}
            />
          </DialogContent>
        </StyledDialog>
      )}
    </>
  );
};

export default FriendsList; 