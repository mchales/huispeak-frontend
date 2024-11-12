export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: number;
  audioURL?: string;
}

export interface OpenAIMessage {
  role: 'user' | 'assistant';
  content: string;
}
