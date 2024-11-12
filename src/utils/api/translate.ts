import axios from 'axios';

export const translateChineseText = async (message: string) => {
  if (!message || typeof message !== 'string') {
    throw new Error('Invalid or missing message');
  }

  console.log('Translating message:', message);

  try {
    const response = await axios.post('/api/translate', { message });
    console.log('Translation response:', response.data);
    return response.data.translation;
  } catch (error) {
    console.error('Error translating message:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to translate message');
    } else {
      throw error;
    }
  }
};
