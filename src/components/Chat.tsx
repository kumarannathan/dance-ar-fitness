import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import styled from '@emotion/styled';
import { collection, query, orderBy, limit, addDoc, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';

const ChatContainer = styled(Paper)`
  background-color: #000000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 400px;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const MessagesContainer = styled(Box)`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const MessageBubble = styled(Box)<{ isSender: boolean }>`
  background-color: ${props => props.isSender ? '#1976d2' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isSender ? '#fff' : 'rgba(255, 255, 255, 0.9)'};
  padding: 8px 12px;
  border-radius: 12px;
  margin: 4px 0;
  max-width: 70%;
  word-wrap: break-word;
  align-self: ${props => props.isSender ? 'flex-end' : 'flex-start'};
`;

const MessageTime = styled(Typography)`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  margin-top: 2px;
`;

const InputContainer = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    color: #FFFFFF;
    font-size: 0.875rem;
    fieldset {
      border-color: rgba(255, 255, 255, 0.2);
    }
    &:hover fieldset {
      border-color: rgba(255, 255, 255, 0.3);
    }
    &.Mui-focused fieldset {
      border-color: #FFFFFF;
    }
  }
`;

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

interface ChatProps {
  friendId: string;
  friendEmail: string;
}

const Chat: React.FC<ChatProps> = ({ friendId, friendEmail }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user) return;

    // Create a unique chat ID that's the same regardless of who started the chat
    const chatId = [user.uid, friendId].sort().join('_');
    
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessages(newMessages);
      setLoading(false);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [user, friendId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    const chatId = [user.uid, friendId].sort().join('_');
    
    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage.trim(),
        senderId: user.uid,
        chatId,
        timestamp: Timestamp.now()
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: Timestamp) => {
    return new Date(timestamp.seconds * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <ChatContainer>
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Chat with {friendEmail}
      </Typography>
      
      <MessagesContainer>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mb: 1
            }}
          >
            <MessageBubble isSender={message.senderId === user?.uid}>
              {message.text}
            </MessageBubble>
            <MessageTime sx={{ alignSelf: message.senderId === user?.uid ? 'flex-end' : 'flex-start' }}>
              {formatTime(message.timestamp)}
            </MessageTime>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <form onSubmit={sendMessage}>
        <InputContainer>
          <StyledTextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            variant="outlined"
          />
          <IconButton 
            type="submit" 
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Send />
          </IconButton>
        </InputContainer>
      </form>
    </ChatContainer>
  );
};

export default Chat; 