import type { Message, OpenAIMessage } from 'src/types/quest-types';

import { useState } from 'react';

import { runThreadApi, createThreadApi, addMessageToThreadApi } from 'src/utils/api/threads';

const useThread = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [creatingThread, setCreatingThread] = useState<boolean>(false);

  const createThread = async (messages?: OpenAIMessage[]): Promise<string> => {
    try {
      setCreatingThread(true);
      const response = await createThreadApi(messages);
      const { id } = response.data;
      setThreadId(id);
      setCreatingThread(false);

      return id;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  };

  const addMessageToThread = async (messageContent: string, thread: string): Promise<Message> => {
    try {
      const userMessageResponse = await addMessageToThreadApi(thread, messageContent);

      return {
        id: userMessageResponse.id,
        role: userMessageResponse.role,
        content: userMessageResponse.content[0].text.value,
        created_at: userMessageResponse.created_at,
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const runThread = async (
    thread: string,
    assistantId: string,
    additionalInstructions?: string
  ): Promise<Message> => {
    try {
      const runResponse = await runThreadApi(thread, assistantId, additionalInstructions);
      console.log('Run response:', runResponse);
      const assistantMessageResponse = runResponse.data;

      return {
        id: assistantMessageResponse.message_id,
        role: 'assistant',
        content: assistantMessageResponse.message,
        created_at: Date.now(),
      };
    } catch (error) {
      console.error('Error running thread:', error);
      throw error;
    }
  };

  return {
    threadId,
    setThreadId,
    creatingThread,
    setCreatingThread,
    createThread,
    addMessageToThread,
    runThread,
  };
};

export default useThread;
