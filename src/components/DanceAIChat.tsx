import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import styled from '@emotion/styled';
import { Send, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { getDanceCoachResponse } from '../services/geminiService';

const StyledMotionDiv = styled(motion.div)`
  position: fixed;
  top: 80px;
  bottom: 0;
  width: 320px;
  background: #000000;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 100;
`;

const ToggleButton = styled(IconButton)`
  position: absolute;
  right: -40px;
  top: 20px;
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ChatHeader = styled(Box)`
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const MessagesContainer = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;

const StyledMessage = styled(Paper, {
  shouldForwardProp: prop => prop !== 'isUser'
})<{ isUser?: boolean }>`
  padding: 12px 16px;
  max-width: 85%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.isUser ? '#4169e1' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.isUser ? '#5478e4' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  border-bottom-right-radius: ${props => props.isUser ? '4px' : '12px'};
  border-bottom-left-radius: ${props => !props.isUser ? '4px' : '12px'};
`;

const InputContainer = styled(Box)`
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 8px;
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #4169e1;
    }
  }

  .MuiOutlinedInput-input {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const SendButton = styled(IconButton)`
  background: #4169e1;
  border: none;
  color: white;
  padding: 8px;
  
  &:hover {
    background: #5478e4;
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.3);
  }
`;

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: number;
}

interface DanceAIChatProps {
  onToggle?: (isExpanded: boolean) => void;
}

const DanceAIChat: React.FC<DanceAIChatProps> = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "Hi! I'm your AI dance coach. I'll help you improve your dance moves. What would you like to know?",
      isUser: false,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggle?.(!isExpanded);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getDanceCoachResponse(input);
      
      setMessages(prev => [...prev, {
        text: aiResponse,
        isUser: false,
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        isUser: false,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <StyledMotionDiv
      initial={false}
      animate={{ 
        left: isExpanded ? 0 : -320,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <ToggleButton onClick={handleToggle}>
        {isExpanded ? <ChevronLeft /> : <ChevronRight />}
      </ToggleButton>
      
      <ChatHeader>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.875rem',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          AI Dance Coach
        </Typography>
      </ChatHeader>

      <MessagesContainer>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.timestamp}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <StyledMessage isUser={message.isUser}>
                <Typography variant="body2">
                  {message.text}
                </Typography>
              </StyledMessage>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <StyledTextField
          fullWidth
          placeholder="Ask for dance tips..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          disabled={isLoading}
          size="small"
        />
        <SendButton
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : <Send />}
        </SendButton>
      </InputContainer>
    </StyledMotionDiv>
  );
};

export default DanceAIChat; 