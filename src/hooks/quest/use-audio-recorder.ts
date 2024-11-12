import { useRef, useState } from 'react';

type OnStopCallback = (blob: Blob) => void;

const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const onStopCallbackRef = useRef<OnStopCallback | null>(null);

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
        if (onStopCallbackRef.current) {
          onStopCallbackRef.current(blob);
        }
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

  const setOnStopCallback = (callback: OnStopCallback) => {
    onStopCallbackRef.current = callback;
  };

  return {
    isRecording,
    toggleRecording,
    setOnStopCallback,
  };
};

export default useAudioRecorder;
