import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button, Loading } from '../common';
import { Character, ChatMessage } from '../../types';
import { useVoiceRecorder, useVoicePlayer } from '../../hooks';

interface ChatInterfaceProps {
  character: Character;
  sessionId?: number;
  onSendMessage?: (message: string, type: 'text' | 'voice') => void;
  onVoiceMessage?: (audioData: string) => void;
  messages?: ChatMessage[];
  loading?: boolean;
  isTyping?: boolean;
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  character,
  sessionId,
  onSendMessage,
  onVoiceMessage,
  messages = [],
  loading = false,
  isTyping = false,
  className = '',
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 使用语音hooks
  const { 
    isRecording, 
    isSupported: recordingSupported, 
    startRecording, 
    stopRecording, 
    error: recordingError 
  } = useVoiceRecorder();
  
  const { 
    isPlaying, 
    playAudio, 
    stopAudio, 
    error: playingError 
  } = useVoicePlayer();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage(inputMessage.trim(), 'text');
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceRecord = async () => {
    if (!isRecording) {
      try {
        await startRecording();
        // 3秒后自动停止录音
        setTimeout(async () => {
          try {
            const audioData = await stopRecording();
            if (onVoiceMessage) {
              onVoiceMessage(audioData);
            }
          } catch (error) {
            console.error('停止录音失败:', error);
          }
        }, 3000);
      } catch (error) {
        console.error('录音失败:', error);
      }
    }
  };

  const handlePlayAudio = (audioData: string) => {
    playAudio(audioData);
  };

  const handleStopAudio = () => {
    stopAudio();
  };

  return (
    <div className={`flex flex-col h-full dark-card rounded-lg dark-border ${className}`}>
      {/* 聊天头部 */}
      <div className="flex items-center p-4 border-b dark-border dark-bg-surface">
        <div className="flex items-center space-x-3">
          {character.image_url ? (
            <img
              src={character.image_url}
              alt={character.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center">
              <span className="dark-text-secondary font-medium">
                {character.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-medium dark-text-primary">{character.name}</h3>
            <p className="text-sm dark-text-muted">{character.series}</p>
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isUser={message.role === 'user'}
            character={character}
            onPlayAudio={handlePlayAudio}
            onStopAudio={handleStopAudio}
            isPlaying={isPlaying}
          />
        ))}
        
        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
              <span className="dark-text-secondary text-sm font-medium">
                {character.name.charAt(0)}
              </span>
            </div>
            <div className="dark-bg-surface rounded-lg p-3">
              <Loading size="sm" text="" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t dark-border">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`与 ${character.name} 聊天...`}
              className="w-full px-3 py-2 dark-input rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={2}
              disabled={loading}
            />
          </div>
          
          <Button
            onClick={handleVoiceRecord}
            variant={isRecording ? "primary" : "outline"}
            size="md"
            className="px-3"
            disabled={loading || !recordingSupported}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || loading}
            size="md"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 错误提示 */}
      {(recordingError || playingError) && (
        <div className="p-2 bg-red-900/20 border border-red-500/30 rounded-md mx-4 mb-2">
          <p className="text-sm text-red-400">
            {recordingError || playingError}
          </p>
        </div>
      )}

    </div>
  );
};

interface MessageBubbleProps {
  message: ChatMessage;
  isUser: boolean;
  character: Character;
  onPlayAudio?: (audioData: string) => void;
  onStopAudio?: () => void;
  isPlaying?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isUser,
  character,
  onPlayAudio,
  onStopAudio,
  isPlaying = false,
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* 头像 */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">我</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
              <span className="dark-text-secondary text-sm font-medium">
                {character.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* 消息内容 */}
        <div className={`rounded-lg px-3 py-2 ${isUser ? 'bg-primary-500 text-white' : 'dark-bg-surface dark-text-primary'}`}>
          <div className="text-sm">
            {message.content}
          </div>
          
          {/* 语音消息控制 */}
          {message.message_type === 'voice' && message.message_metadata && (
            <div className="mt-2 flex items-center space-x-2">
              <Button
                onClick={() => {
                  if (isPlaying) {
                    onStopAudio?.();
                  } else {
                    onPlayAudio?.(message.message_metadata!);
                  }
                }}
                variant={isUser ? "secondary" : "outline"}
                size="sm"
                className="px-2 py-1"
              >
                {isPlaying ? (
                  <VolumeX className="w-3 h-3" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
              </Button>
              <span className="text-xs opacity-75">语音消息</span>
            </div>
          )}
          
          <div className={`text-xs mt-1 ${isUser ? 'text-primary-100' : 'dark-text-muted'}`}>
            {formatTime(message.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};
