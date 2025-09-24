import { useState, useRef, useCallback } from 'react';
import { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types';

interface VoiceRecorderHook {
  isRecording: boolean;
  isSupported: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
  error: string | null;
}

export const useVoiceRecorder = (): VoiceRecorderHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 检查浏览器是否支持录音
  const isSupported = typeof window !== 'undefined' && 
    'MediaRecorder' in window && 
    'getUserMedia' in navigator.mediaDevices;

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('浏览器不支持录音功能');
      return;
    }

    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('无法访问麦克风，请检查权限设置');
      console.error('录音启动失败:', err);
    }
  }, [isSupported]);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current || !isRecording) {
        reject(new Error('没有正在进行的录音'));
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // 转换为Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // 移除data:audio/webm;base64,前缀
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = () => reject(new Error('音频转换失败'));
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.stop();
      
      // 停止所有音频轨道
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
    });
  }, [isRecording]);

  return {
    isRecording,
    isSupported,
    startRecording,
    stopRecording,
    error,
  };
};

interface VoicePlayerHook {
  isPlaying: boolean;
  playAudio: (audioData: string) => Promise<void>;
  stopAudio: () => void;
  error: string | null;
}

export const useVoicePlayer = (): VoicePlayerHook => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback(async (audioData: string) => {
    try {
      setError(null);
      
      // 停止当前播放
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // 创建新的音频元素
      const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setError('音频播放失败');
        setIsPlaying(false);
      };

      await audio.play();
    } catch (err) {
      setError('无法播放音频');
      setIsPlaying(false);
      console.error('音频播放失败:', err);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  return {
    isPlaying,
    playAudio,
    stopAudio,
    error,
  };
};

// 语音转文字Hook（使用Web Speech API）
interface SpeechToTextHook {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  error: string | null;
}

export const useSpeechToText = (): SpeechToTextHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('浏览器不支持语音识别');
      return;
    }

    try {
      setError(null);
      setTranscript('');

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'zh-CN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`语音识别错误: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setError('无法启动语音识别');
      console.error('语音识别启动失败:', err);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    error,
  };
};

// 文字转语音Hook（使用Web Speech API）
interface TextToSpeechHook {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string, options?: SpeechSynthesisUtterance) => void;
  stop: () => void;
  error: string | null;
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text: string, options?: Partial<SpeechSynthesisUtterance>) => {
    if (!isSupported) {
      setError('浏览器不支持语音合成');
      return;
    }

    try {
      setError(null);
      
      // 停止当前播放
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // 设置默认选项
      utterance.lang = 'zh-CN';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // 应用自定义选项
      if (options) {
        Object.assign(utterance, options);
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        setError(`语音合成错误: ${event.error}`);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch (err) {
      setError('无法播放语音');
      console.error('语音合成失败:', err);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
    error,
  };
};
