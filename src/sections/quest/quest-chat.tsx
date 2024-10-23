// TODO: refactoring

import axios from 'axios';
import React, { useRef, useState } from 'react';

import { Mic, MicOff } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: number;
}

interface TalkToAssistantProps {
  assistantId: string | undefined | null;
}

const QuestChat: React.FC<TalkToAssistantProps> = ({ assistantId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [assistantAudioURL, setAssistantAudioURL] = useState<string | null>(null);
  const [playingAssistantAudio, setPlayingAssistantAudio] = useState<boolean>(false);

  const startRecording = async () => {
    if (!navigator.mediaDevices) {
      alert('Media Devices API not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        // Now, transcribe the audio and process it
        await handleTranscription(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone', err);
      alert('Could not access your microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const transcribeAudio = async (blob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', blob, `recording_${Date.now()}.webm`);

    console.log('Sending file:', formData.get('file'));

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Failed to transcribe audio';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('Transcription Data: ', data);
      if (data && data.data.text) {
        return data.data.text;
      }
      throw new Error('No transcription received');
    } catch (error: any) {
      console.error('Network error:', error);
      throw new Error(error.message || 'Network error');
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setLoading(true);
    try {
      const transcription = await transcribeAudio(blob);

      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: transcription,
        created_at: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Now send the message to the assistant
      await sendMessageToAssistant(transcription);
    } catch (error: any) {
      console.error('Transcription error:', error);
      const errorMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: error.message || 'Error transcribing audio.',
        created_at: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  const createThread = async () => {
    try {
      const response = await axios.post('/api/threads', {
        messages: [],
      });

      setThreadId(response.data.id);
      return response; // Return the response object
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error; // Throw error to handle it in sendMessageToAssistant
    }
  };

  const sendMessageToAssistant = async (messageContent: string) => {
    // Create thread if it doesn't exist and wait for its ID
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const response = await createThread();
      currentThreadId = response?.data?.id;
      setThreadId(currentThreadId); // Update the state
    }

    try {
      // Use the currentThreadId for the API requests
      console.log(assistantId);

      await axios.post(`/api/threads/${currentThreadId}/messages`, {
        role: 'user',
        content: messageContent,
        assistant_id: assistantId,
      });
      console.log('Message sent successfully');

      const runResponse = await axios.post(`/api/threads/${currentThreadId}/runs`, {
        assistant_id: assistantId,
      });
      console.log('Run created successfully');

      // Assuming the assistant's response is in runResponse.data.message
      const assistantResponseText = runResponse.data.message;
      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: assistantResponseText,
        created_at: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Now, generate speech from assistant's response
      await generateAssistantSpeech(assistantResponseText);
    } catch (error: any) {
      console.error('Error sending message or creating run:', error);
      const errorMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        created_at: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const generateAssistantSpeech = async (text: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('model', 'tts-1');
      formData.append('input', text);
      formData.append('voice', 'alloy');

      const response = await fetch('/api/speech', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        const error = data.error || 'Error generating speech';
        console.error(error);
        return;
      }

      const blob = await response.blob();
      const audioURL = URL.createObjectURL(blob);
      setAssistantAudioURL(audioURL);
      console.log('Assistant audio URL:', assistantAudioURL);

      // Play the audio
      const audio = new Audio(audioURL);
      audio.onended = () => {
        setPlayingAssistantAudio(false);
      };
      setPlayingAssistantAudio(true);
      audio.play();
    } catch (error) {
      console.error('An error occurred while generating speech', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Talk with Assistant
      </Typography>
      <Button
        variant="contained"
        color={isRecording ? 'secondary' : 'primary'}
        startIcon={isRecording ? <MicOff /> : <Mic />}
        onClick={toggleRecording}
        style={{ marginBottom: 16 }}
      >
        {isRecording ? 'Stop Recording' : 'Push to Talk'}
      </Button>

      <Box
        sx={{
          height: 300,
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: 2,
          borderRadius: 2,
          marginBottom: 2,
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              mb: 1,
              p: 1,
              borderRadius: 1,
              backgroundColor: msg.role === 'user' ? 'primary.light' : 'grey.200',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Typography variant="subtitle2">
              <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
            </Typography>
            <Typography variant="body1">{msg.content}</Typography>
          </Box>
        ))}
        {loading && (
          <Box sx={{ mb: 1, p: 1, borderRadius: 1, backgroundColor: 'grey.200' }}>
            <Typography variant="body2">
              {playingAssistantAudio ? 'Assistant is speaking...' : <em>Processing...</em>}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default QuestChat;
