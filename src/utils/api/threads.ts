import type { OpenAIMessage } from 'src/types/quest-types';

import axios from 'axios';

export const createThreadApi = async (messages?: OpenAIMessage[]) =>
  axios.post('/api/threads', { messages });

export const addMessageToThreadApi = async (threadId: string, content: string) => {
  const response = await axios.post(`/api/threads/${threadId}/messages`, {
    role: 'user',
    content,
  });
  return response.data;
};

export const runThreadApi = async (
  threadId: string,
  assistant_id: string,
  additionalInstructions?: string
) =>
  axios.post(`/api/threads/${threadId}/runs`, {
    assistant_id,
    additional_instructions: additionalInstructions || null,
  });
