import type { Message } from 'src/types/quest-types';

import React, { useState, useEffect } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Stack,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import { translateChineseText } from 'src/utils/api/translate';

import AudioRecorder from 'src/components/quest/audio-recorder';

interface MessageItemProps {
  message: Message;
  onUpdateMessage: (updatedMessage: Message, index: number) => void;
  index: number;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onUpdateMessage, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [editedAudioURL, setEditedAudioURL] = useState<string | undefined>(message.audioURL);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false); // New state
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [showTranslated, setShowTranslated] = useState(false);
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  useEffect(() => {
    // Reset translation when message content changes
    setTranslatedText(null);
    setShowTranslated(false);
  }, [message.content]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedAudioURL(message.audioURL); // Set the initial audioURL
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(message.content);
    setEditedAudioURL(message.audioURL);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    const updatedMessage = {
      ...message,
      content: editedContent,
      audioURL: editedAudioURL,
    };
    onUpdateMessage(updatedMessage, index);
  };

  const handleTranslateClick = async () => {
    if (!translatedText) {
      // Fetch the translation
      setLoadingTranslation(true);
      try {
        const translation = await translateChineseText(message.content);
        setTranslatedText(translation);
        setShowTranslated(true);
      } catch (error) {
        console.error('Error translating message:', error);
      } finally {
        setLoadingTranslation(false);
      }
    } else {
      // Toggle between original and translated text
      setShowTranslated((prev) => !prev);
    }
  };

  const handleTranscriptionComplete = (transcription: string, audioURL: string) => {
    setEditedContent(transcription);
    setEditedAudioURL(audioURL);
  };

  const handleTranscriptionStatusChange = (isTranscribing: boolean) => {
    setTranscriptionLoading(isTranscribing);
  };

  return (
    <Box
      key={message.id}
      sx={{
        mb: 1,
        p: 1,
        borderRadius: 1,
        backgroundColor: message.role === 'user' ? 'primary.light' : 'grey.200',
        alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
        position: 'relative',
      }}
    >
      {message.role === 'user' && !isEditing && (
        <IconButton
          size="small"
          onClick={handleEditClick}
          sx={{ position: 'absolute', top: 2, right: 2 }}
        >
          <EditIcon />
        </IconButton>
      )}

      {isEditing ? (
        <>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            sx={{ mt: 1 }}
          />

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {/* Audio Recorder */}
            <AudioRecorder
              onTranscriptionComplete={handleTranscriptionComplete}
              onTranscriptionStatusChange={handleTranscriptionStatusChange}
            />

            {/* Play Edited Audio Button */}
            {editedAudioURL && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const audio = new Audio(editedAudioURL);
                  audio.play();
                }}
              >
                Play Audio
              </Button>
            )}
          </Stack>

          <Box sx={{ mt: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleSaveEdit}
              sx={{ mr: 1 }}
              disabled={transcriptionLoading} // Disable when transcription is in progress
            >
              Save
            </Button>
            <Button variant="outlined" size="small" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="subtitle2">
            <strong>{message.role === 'user' ? 'You' : 'Assistant'}:</strong>
          </Typography>
          <Typography variant="body1">
            {showTranslated && translatedText ? translatedText : message.content}
          </Typography>

          {/* Play Audio Button - Only show if audioURL exists */}
          {message.audioURL && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                const audio = new Audio(message.audioURL!);
                audio.play();
              }}
              sx={{ mt: 1, mr: 1 }}
            >
              Play Audio
            </Button>
          )}

          <Button
            variant="outlined"
            size="small"
            onClick={handleTranslateClick}
            sx={{ mt: 1 }}
            disabled={loadingTranslation}
          >
            {loadingTranslation ? (
              <CircularProgress size={16} />
            ) : translatedText ? (
              'Switch'
            ) : (
              'Translate'
            )}
          </Button>
        </>
      )}
    </Box>
  );
};

export default MessageItem;
