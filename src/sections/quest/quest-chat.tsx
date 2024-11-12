import type { Message } from 'src/types/quest-types';

import React, { useState, useEffect, useCallback } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Box, Stack, Button, Container, IconButton } from '@mui/material';

import useThread from 'src/hooks/quest/use-thread';
import useTranscribe from 'src/hooks/quest/use-transcribe';
import useSpeechSynthesis from 'src/hooks/quest/use-speech';
import useAudioRecorder from 'src/hooks/quest/use-audio-recorder';

import MessageList from 'src/components/quest/message-list';
import MessageBubble from 'src/components/quest/message-bubble';

interface TalkToAssistantProps {
  assistantId: string | undefined | null;
}

const QuestChat: React.FC<TalkToAssistantProps> = ({ assistantId }) => {
  const { isRecording, toggleRecording, setOnStopCallback } = useAudioRecorder();
  const { playingAssistantAudio, generateAssistantSpeech } = useSpeechSynthesis();
  const { threadId, creatingThread, createThread, addMessageToThread, runThread } = useThread();
  const { transcribeAudio, transcriptionLoading } = useTranscribe();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isUserProcessing, setIsUserProcessing] = useState(false);
  const [isAssistantProcessing, setIsAssistantProcessing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const loadThread = async () => {
      try {
        await createThread();
      } catch (error) {
        console.error('Error creating thread:', error);
      }
    };
    if (!threadId && !creatingThread) {
      loadThread();
    }
  }, [threadId, creatingThread, createThread]);

  const sendMessageToAssistant = useCallback(
    async (messageContent: string) => {
      setIsAssistantProcessing(true);
      try {
        const threadIdToUse = threadId || (await createThread());
        console.log('Thread ID:', threadIdToUse);

        await addMessageToThread(messageContent, threadIdToUse!);

        const assistantMessage = await runThread(threadId!, assistantId!);

        // Generate assistant speech and get the audio URL
        const assistantAudioURL = await generateAssistantSpeech(assistantMessage.content);
        assistantMessage.audioURL = assistantAudioURL!;

        // Add the assistant message with the audio URL
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error: any) {
        console.error('Error sending message or creating run:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: 'Sorry, there was an error processing your request.',
            created_at: Date.now(),
          },
        ]);
      } finally {
        setIsAssistantProcessing(false);
      }
    },
    [addMessageToThread, generateAssistantSpeech, runThread, threadId, assistantId, createThread]
  );

  const handleTranscription = useCallback(
    async (blob: Blob) => {
      setIsUserProcessing(true);
      try {
        const transcription = await transcribeAudio(blob);

        const audioURL = URL.createObjectURL(blob);

        setMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now()}`,
            role: 'user',
            content: transcription,
            created_at: Date.now(),
            audioURL,
          },
        ]);
        setIsUserProcessing(false);
        await sendMessageToAssistant(transcription);
      } catch (error: any) {
        console.error('Transcription error:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: error.message || 'Error transcribing audio.',
            created_at: Date.now(),
          },
        ]);
      }
    },
    [transcribeAudio, sendMessageToAssistant]
  );

  const handleUpdateMessage = async (updatedMessage: Message, index: number) => {
    // Remove audioURL from the edited message
    const newMessage: Message = {
      ...updatedMessage,
      audioURL: undefined,
    };

    // Delete messages after the edited message
    const updatedMessages = messages.slice(0, index + 1);
    updatedMessages[index] = newMessage; // Update the edited message

    setMessages(updatedMessages);

    // Create a new thread with the updated messages
    try {
      setIsAssistantProcessing(true);
      // Extract the content and role from messages
      const messagesContent = updatedMessages.map(({ content, role }) => ({
        content,
        role,
      }));

      // Create a new thread with the existing messages
      const newThreadId = await createThread(messagesContent);

      // Since we're starting a new thread, we need to run the assistant's response again
      const assistantMessage = await runThread(newThreadId, assistantId!);

      // Generate assistant speech and get the audio URL
      const assistantAudioURL = await generateAssistantSpeech(assistantMessage.content);
      assistantMessage.audioURL = assistantAudioURL!;

      // Add the assistant message with the audio URL
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error updating thread:', error);
    } finally {
      setIsAssistantProcessing(false);
    }
  };

  useEffect(() => {
    setOnStopCallback(handleTranscription);
  }, [handleTranscription, setOnStopCallback]);

  const latestUserMessage = messages.filter((msg) => msg.role === 'user').slice(-1)[0];
  const latestAssistantMessage = messages.filter((msg) => msg.role === 'assistant').slice(-1)[0];

  const handleStart = async () => {
    setHasStarted(true);
    setIsAssistantProcessing(true);
    try {
      await sendMessageToAssistant('你好');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsAssistantProcessing(false);
    }
  };

  if (!hasStarted) {
    return (
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Stack direction="row" height={530}>
          <Box sx={{ position: 'relative', width: '80%' }}>
            {/* Currently hardcoded, but in future will be fetched from s3 */}
            <img
              src="/images/teashop-with-person.png"
              alt="Background"
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
            <Box sx={{ overflowY: 'auto', pb: 2, pl: 1, width: '100%' }} />
          </Box>
        </Stack>

        <Button
          variant="contained"
          onClick={handleStart}
          sx={{
            position: 'absolute',
            top: '54%',
            left: '52%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          Start
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
      <Stack direction="row" height={530}>
        <Box sx={{ position: 'relative', width: '80%' }}>
          {/* Background Image */}
          <img
            src="/images/teashop-with-person.png"
            alt="Background"
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />

          {/* User Bubble */}
          <MessageBubble
            message={latestUserMessage}
            isLoading={isUserProcessing}
            isUser
            onMicrophoneClick={toggleRecording}
            isRecording={isRecording}
            sx={{ position: 'absolute', bottom: '20%', right: '5%' }}
          />

          {/* Assistant Bubble */}
          <MessageBubble
            message={latestAssistantMessage}
            isLoading={isAssistantProcessing}
            isUser={false}
            sx={{ position: 'absolute', bottom: '20%', left: '5%' }}
          />

          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ position: 'absolute', top: '5%', right: '5%', backgroundColor: 'white' }}
          >
            {!expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {/* Expandable Message List */}
        <Box sx={{ width: 250, height: '100%' }}>
          {expanded ? (
            <MessageList
              messages={messages}
              loading={isUserProcessing || isAssistantProcessing}
              transcriptionLoading={transcriptionLoading}
              playingAssistantAudio={playingAssistantAudio}
              onUpdateMessage={handleUpdateMessage}
            />
          ) : (
            <Box sx={{ overflowY: 'auto', pb: 2, pl: 1, width: '100%' }}>
              <Box
                sx={{
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: 'grey.200',
                  position: 'relative',
                }}
              />
            </Box>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default QuestChat;
