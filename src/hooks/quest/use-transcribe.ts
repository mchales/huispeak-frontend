import { useState } from 'react';

const useTranscribe = () => {
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);

  const transcribeAudio = async (blob: Blob): Promise<string> => {
    setTranscriptionLoading(true);
    const formData = new FormData();
    formData.append('file', blob, `recording_${Date.now()}.webm`);

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
        setTranscriptionLoading(false); // Ensure loading state is reset
        throw new Error(errorMsg);
      }

      const data = await response.json();
      if (data && data.data.text) {
        setTranscriptionLoading(false);
        return data.data.text;
      }
      setTranscriptionLoading(false); // Ensure loading state is reset
      throw new Error('No transcription received');
    } catch (error: any) {
      console.error('Transcription error:', error);
      setTranscriptionLoading(false); // Ensure loading state is reset
      throw new Error(error.message || 'Network error');
    }
  };

  return {
    transcribeAudio,
    transcriptionLoading,
  };
};

export default useTranscribe;
