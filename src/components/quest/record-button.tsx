// No longer in use

import React from 'react';

import { Button } from '@mui/material';
import { Mic, MicOff } from '@mui/icons-material';

interface RecordButtonProps {
  isRecording: boolean;
  toggleRecording: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ isRecording, toggleRecording }) => (
    <Button
      variant="contained"
      color={isRecording ? 'secondary' : 'primary'}
      startIcon={isRecording ? <MicOff /> : <Mic />}
      onClick={toggleRecording}
      style={{ marginBottom: 16 }}
    >
      {isRecording ? 'Stop Recording' : 'Push to Talk'}
    </Button>
  );

export default RecordButton;
