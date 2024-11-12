import React, { useEffect } from 'react';

import { Button } from '@mui/material';
import { Mic, MicOff } from '@mui/icons-material';

import useTranscribe from 'src/hooks/quest/use-transcribe';
import useAudioRecorder from 'src/hooks/quest/use-audio-recorder';

interface AudioRecorderProps {
  onTranscriptionComplete: (transcription: string, audioURL: string) => void;
  onTranscriptionStatusChange?: (isTranscribing: boolean) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTranscriptionComplete,
  onTranscriptionStatusChange,
}) => {
  const { isRecording, toggleRecording, setOnStopCallback } = useAudioRecorder();
  const { transcribeAudio, transcriptionLoading } = useTranscribe();

  useEffect(() => {
    if (onTranscriptionStatusChange) {
      onTranscriptionStatusChange(transcriptionLoading);
    }
  }, [transcriptionLoading, onTranscriptionStatusChange]);

  useEffect(() => {
    setOnStopCallback(async (blob: Blob) => {
      try {
        const transcription = await transcribeAudio(blob);
        const audioURL = URL.createObjectURL(blob);
        onTranscriptionComplete(transcription, audioURL);
      } catch (error) {
        console.error('Transcription error:', error);
      }
    });
  }, [setOnStopCallback, transcribeAudio, onTranscriptionComplete]);

  return (
    <Button
      variant="contained"
      color={isRecording ? 'secondary' : 'primary'}
      startIcon={isRecording ? <MicOff /> : <Mic />}
      onClick={toggleRecording}
      disabled={transcriptionLoading}
    >
      {isRecording ? 'Stop Recording' : 'Record'}
    </Button>
  );
};

export default AudioRecorder;
