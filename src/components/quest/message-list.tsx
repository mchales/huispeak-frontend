import type { Message } from 'src/types/quest-types';

import React from 'react';

import { Box, Typography } from '@mui/material';

import MessageItem from './message-item';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  transcriptionLoading: boolean;
  playingAssistantAudio: boolean;
  onUpdateMessage: (updatedMessage: Message, index: number) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  transcriptionLoading,
  playingAssistantAudio,
  onUpdateMessage,
}) => (
    <Box
      overflow="auto"
      height="100%"
      maxHeight={520}
      sx={{ pb: 2, pl: 1, width: '100%', overscrollBehavior: 'contain' }}
    >
      {messages.map((msg, index) => (
        <MessageItem key={msg.id} message={msg} onUpdateMessage={onUpdateMessage} index={index} />
      ))}
      {(loading || transcriptionLoading || playingAssistantAudio) && (
        <Box sx={{ mb: 1, p: 1, borderRadius: 1, backgroundColor: 'grey.200' }}>
          <Typography variant="body2">
            {playingAssistantAudio ? 'Assistant is speaking...' : <em>Processing...</em>}
          </Typography>
        </Box>
      )}
    </Box>
  );

export default MessageList;
