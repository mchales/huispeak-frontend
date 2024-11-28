import { useState } from 'react';

const useSpeechApi = () => {
  const [assistantAudioURL, setAssistantAudioURL] = useState<string | null>(null);
  const [playingAssistantAudio, setPlayingAssistantAudio] = useState<boolean>(false);

  const generateAssistantSpeech = async (
    text: string,
    speed: number,
    voice?: string
  ): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('model', 'tts-1');
      formData.append('input', text);
      formData.append('voice', voice || 'alloy');
      formData.append('speed', speed.toString());

      const response = await fetch('/api/speech', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        const error = data.error || 'Error generating speech';
        console.error(error);
        return null;
      }

      const blob = await response.blob();
      const audioURL = URL.createObjectURL(blob);
      setAssistantAudioURL(audioURL);

      // Play the audio
      const audio = new Audio(audioURL);
      audio.onended = () => {
        setPlayingAssistantAudio(false);
      };
      setPlayingAssistantAudio(true);
      audio.play();

      return audioURL;
    } catch (error) {
      console.error('An error occurred while generating speech', error);
      return null;
    }
  };

  return {
    assistantAudioURL,
    playingAssistantAudio,
    generateAssistantSpeech,
  };
};

export default useSpeechApi;
