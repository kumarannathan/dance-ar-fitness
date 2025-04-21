import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, TextField, IconButton, Paper, Avatar, List, ListItem, ListItemText, ListItemAvatar, Divider, Badge, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { NAVBAR_HEIGHT } from '../components/Navbar';

const StyledContainer = styled(Container)`
  background-color: #000000;
  min-height: 100vh;
  height: 100vh;
  padding: 0.5rem;
  padding-top: calc(${NAVBAR_HEIGHT} + 0.5rem);
  padding-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ChatLayout = styled(Box)`
  display: flex;
  width: 100%;
  height: calc(100vh - ${NAVBAR_HEIGHT} - 1rem);
  gap: 0.5rem;
  overflow: hidden;
`;

const FriendsList = styled(Paper)`
  width: 300px;
  background-color: #000000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ChatArea = styled(Paper)`
  flex: 1;
  background-color: #000000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MessageList = styled(List)`
  flex: 1;
  overflow: auto;
  padding: 1rem;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const MessageInput = styled(Box)`
  display: flex;
  padding: 1rem;
  background-color: #000000;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    color: #FFFFFF;
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
    
    & fieldset {
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    &:hover fieldset {
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    &.Mui-focused fieldset {
      border-color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const MessageBubble = styled(Paper)<{ isOwn: boolean }>`
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  max-width: 70%;
  background-color: ${props => props.isOwn ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.isOwn ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 4px;
  margin-left: ${props => props.isOwn ? 'auto' : '0'};
`;

const FriendItem = styled(ListItem)<{ selected?: boolean }>`
  cursor: pointer;
  background-color: ${props => props.selected ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const ChatHeader = styled(Box)`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #000000;
`;

const PageTitle = styled(Typography)`
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.25rem;
  font-weight: 400;
  color: #FFFFFF;
  margin-bottom: 2rem;
  text-align: center;
`;

const SectionTitle = styled(Typography)`
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const MessageText = styled(Typography)`
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: #FFFFFF;
`;

const FriendName = styled(Typography)`
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: #FFFFFF;
`;

const FriendEmail = styled(Typography)`
  font-family: 'Space Mono', monospace;
  font-size: 0.625rem;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.5);
`;

const SendButton = styled(IconButton)`
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px;
  
  &:hover {
    color: #FFFFFF;
    border-color: rgba(255, 255, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const EmptyStateText = styled(Typography)`
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
`;

interface Message {
  id: string;
  text: string;
  userId: string;
  userEmail: string;
  timestamp: any;
}

interface Friend {
  id: string;
  email: string;
  lastMessage?: string;
  unreadCount?: number;
}

const Chat: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  // Add a ref for the message list
  const messageListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFriends = async () => {
      try {
        // Get the user document which contains the friends array
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const friendIds = userDoc.data().friends || [];
          
          // If there are no friends, set empty array and return
          if (friendIds.length === 0) {
            setFriends([]);
            setLoading(false);
            return;
          }
          
          // Fetch all friend documents
          const friendsPromises = friendIds.map((friendId: string) => 
            getDoc(doc(db, 'users', friendId))
          );
          
          const friendDocs = await Promise.all(friendsPromises);
          
          // Map friend documents to Friend objects
          const friendsList = friendDocs
            .filter(doc => doc.exists())
            .map(doc => ({
              id: doc.id,
              email: doc.data().email,
              lastMessage: '',
              unreadCount: 0
            }));
            
          setFriends(friendsList);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user, navigate]);

  useEffect(() => {
    if (!selectedFriend || !user) return;

    // Create a unique conversation ID by sorting and joining user IDs
    const conversationId = [user.uid, selectedFriend.id].sort().join('_');
    
    console.log('Setting up message listener for conversation:', conversationId);
    
    const q = query(
      collection(db, 'messages'),
      where('participants', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Received message update, count:', snapshot.docs.length);
      
      const newMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Message data:', data);
        return {
          id: doc.id,
          text: data.text,
          userId: data.userId,
          userEmail: data.userEmail,
          timestamp: data.timestamp
        };
      }) as Message[];
      
      console.log('Processed messages:', newMessages);
      setMessages(newMessages);
    }, (error) => {
      console.error('Error in message listener:', error);
    });

    return () => {
      console.log('Cleaning up message listener');
      unsubscribe();
    };
  }, [selectedFriend, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedFriend) return;

    try {
      // Create a temporary message object with a temporary ID
      const tempId = `temp-${Date.now()}`;
      const tempMessage: Message = {
        id: tempId,
        text: newMessage,
        userId: user.uid,
        userEmail: user.email || '',
        timestamp: new Date()
      };
      
      // Add the temporary message to the messages state immediately
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      
      // Clear the input field
      setNewMessage('');
      
      // Create a unique conversation ID by sorting and joining user IDs
      const conversationId = [user.uid, selectedFriend.id].sort().join('_');
      
      console.log('Sending message to conversation:', conversationId);
      
      // Send the message to Firestore
      const messageRef = await addDoc(collection(db, 'messages'), {
        text: newMessage,
        userId: user.uid,
        userEmail: user.email,
        timestamp: serverTimestamp(),
        participants: conversationId
      });
      
      console.log('Message sent with ID:', messageRef.id);
      
      // Update the temporary message with the real ID from Firestore
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === tempId ? { ...msg, id: messageRef.id } : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the temporary message if there was an error
      setMessages(prevMessages => 
        prevMessages.filter(msg => !msg.id.startsWith('temp-'))
      );
    }
  };

  return (
    <StyledContainer maxWidth={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ChatLayout>
          <FriendsList>
            <SectionTitle>
              Friends
            </SectionTitle>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </Box>
            ) : (
              <List sx={{ overflow: 'auto', p: 0 }}>
                {friends.map((friend) => (
                  <FriendItem
                    key={friend.id}
                    selected={selectedFriend?.id === friend.id}
                    onClick={() => setSelectedFriend(friend)}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="error"
                        badgeContent={friend.unreadCount}
                        invisible={!friend.unreadCount}
                      >
                        <Avatar sx={{ 
                          bgcolor: 'rgba(255, 255, 255, 0.1)', 
                          color: '#FFFFFF',
                          fontFamily: 'Space Mono, monospace',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px'
                        }}>
                          {friend.email[0].toUpperCase()}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<FriendName>{friend.email.split('@')[0]}</FriendName>}
                      secondary={<FriendEmail>{friend.email}</FriendEmail>}
                      primaryTypographyProps={{
                        sx: { 
                          fontFamily: 'Space Mono, monospace',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px'
                        }
                      }}
                      secondaryTypographyProps={{
                        sx: { 
                          fontFamily: 'Space Mono, monospace',
                          fontSize: '0.625rem',
                          letterSpacing: '0.5px'
                        }
                      }}
                    />
                  </FriendItem>
                ))}
              </List>
            )}
          </FriendsList>

          <ChatArea>
            {selectedFriend ? (
              <>
                <ChatHeader>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px'
                  }}>
                    {selectedFriend.email[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <FriendName>{selectedFriend.email.split('@')[0]}</FriendName>
                    <FriendEmail>{selectedFriend.email}</FriendEmail>
                  </Box>
                </ChatHeader>

                <MessageList ref={messageListRef}>
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MessageBubble isOwn={message.userId === user?.uid}>
                          <MessageText>
                            {message.text}
                          </MessageText>
                        </MessageBubble>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </MessageList>

                <MessageInput component="form" onSubmit={handleSendMessage}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{ mr: 2 }}
                  />
                  <SendButton 
                    type="submit"
                  >
                    <SendIcon />
                  </SendButton>
                </MessageInput>
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
              }}>
                <EmptyStateText>
                  Select a friend to start chatting
                </EmptyStateText>
              </Box>
            )}
          </ChatArea>
        </ChatLayout>
      </motion.div>
    </StyledContainer>
  );
};

export default Chat; 