import type { SxProps } from '@mui/material';
import type { Message } from 'src/types/quest-types';

import React, { useState } from 'react';

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';

interface MessageBubbleProps {
  message?: Message;
  isLoading: boolean;
  isUser: boolean;
  onMicrophoneClick?: () => void;
  isRecording?: boolean;
  sx?: SxProps;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLoading,
  isUser,
  onMicrophoneClick,
  isRecording,
  sx,
}) => {
  const [isBlurred, setIsBlurred] = useState(!isUser);

  // Function to toggle blur state
  const toggleBlur = () => {
    setIsBlurred((prev) => !prev);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '200px',
        height: '90px',
        p: 1,
        pl: 1.5,
        borderRadius: 1,
        opacity: 0.9,
        backgroundColor: isUser ? 'primary.light' : 'grey.300',
        display: 'flex',
        alignItems: 'center',
        boxShadow: 2,
        ...sx,
      }}
    >
      {/* Microphone Button for User Messages */}
      {isUser && (
        <IconButton
          onClick={onMicrophoneClick}
          color={isRecording ? 'secondary' : 'default'}
          size="small"
          sx={{ position: 'absolute', bottom: 2, left: -4 }}
          aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {isRecording ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
        </IconButton>
      )}

      {/* Toggle Blur Button for Assistant Messages */}
      {!isUser && (
        <IconButton
          onClick={toggleBlur}
          size="small"
          sx={{ position: 'absolute', top: 2, right: 2 }}
          aria-label={isBlurred ? 'Show Message' : 'Hide Message'}
        >
          {isBlurred ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      )}

      <Box
        sx={{
          overflowY: 'auto',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: isLoading ? 'center' : 'flex-start',
          display: 'flex',
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography
            variant="body1"
            sx={{
              ml: isUser ? 1 : 0,
              filter: !isUser && isBlurred ? 'blur(5px)' : 'none',
              transition: 'filter 0.3s ease',
              userSelect: !isUser && isBlurred ? 'none' : 'auto',
              width: '100%',
              wordWrap: 'break-word',
            }}
          >
            {message ? message.content : isUser ? 'Tap to speak' : '...'}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MessageBubble;
