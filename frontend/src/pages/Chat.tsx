import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, MoreVertical } from 'lucide-react';
import { ChatInterface } from '../components/chat';
import { CharacterInfo } from '../components/character';
import { Button, Loading, ErrorMessage } from '../components/common';
import { useChat } from '../hooks';
import { Character, ChatMessage } from '../types';

interface ChatPageProps {
  character: Character;
  sessionId?: number;
  onBack?: () => void;
  className?: string;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  character,
  sessionId,
  onBack,
  className = '',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const {
    currentSession,
    isTyping,
    sendMessage,
    processVoiceMessage,
    fetchMessages,
    createSession,
  } = useChat();

  // 初始化会话
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setLoading(true);
        setError(undefined);

        let session = currentSession;
        
        // 如果没有会话ID，创建新会话
        if (!sessionId && !session) {
          session = await createSession(character.id, `与 ${character.name} 的对话`);
        }

        // 如果有会话ID，加载消息历史
        if (sessionId) {
          const messageHistory = await fetchMessages(sessionId);
          setMessages(messageHistory);
        }
      } catch (err) {
        setError('初始化聊天失败');
        console.error('初始化聊天失败:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, [character.id, character.name, sessionId, currentSession, createSession, fetchMessages]);

  const handleSendMessage = async (message: string, type: 'text' | 'voice') => {
    try {
      setError(undefined);
      
      const response = await sendMessage({
        message,
        character_id: character.id,
        session_id: currentSession?.id || sessionId,
        message_type: type,
      });

      // 更新消息列表
      const userMessage: ChatMessage = {
        id: Date.now(),
        session_id: response.session_id,
        role: 'user',
        content: message,
        message_type: type,
        created_at: new Date().toISOString(),
      };

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        session_id: response.session_id,
        role: 'assistant',
        content: response.message,
        message_type: response.message_type as 'text' | 'voice' | 'image',
        created_at: response.created_at,
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
    } catch (err) {
      setError('发送消息失败');
      console.error('发送消息失败:', err);
    }
  };

  const handleVoiceMessage = async (audioData: string) => {
    try {
      setError(undefined);
      
      const response = await processVoiceMessage({
        audio_data: audioData,
        character_id: character.id,
        session_id: currentSession?.id || sessionId,
      });

      // 更新消息列表
      const userMessage: ChatMessage = {
        id: Date.now(),
        session_id: response.session_id,
        role: 'user',
        content: response.text,
        message_type: 'voice',
        created_at: new Date().toISOString(),
      };

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        session_id: response.session_id,
        role: 'assistant',
        content: response.text,
        message_type: 'voice',
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
    } catch (err) {
      setError('处理语音消息失败');
      console.error('处理语音消息失败:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="初始化聊天..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-dark-gradient ${className}`}>
      {/* 头部导航 */}
      <div className="acg-glass-effect border-b dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>返回</span>
                </Button>
              )}
              
              <CharacterInfo character={character} />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 聊天界面 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-[calc(100vh-200px)]">
          <ChatInterface
            character={character}
            sessionId={currentSession?.id || sessionId}
            onSendMessage={handleSendMessage}
            onVoiceMessage={handleVoiceMessage}
            messages={messages}
            loading={loading}
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

interface ChatSessionProps {
  sessionId: number;
  onBack?: () => void;
  className?: string;
}

export const ChatSession: React.FC<ChatSessionProps> = ({
  sessionId,
  onBack,
  className = '',
}) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const { getSession } = useChat();

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        setError(undefined);
        
        const session = await getSession(sessionId);
        if (session && session.character_id) {
          // 这里需要根据session获取character信息
          // 暂时使用模拟数据
          setCharacter({
            id: session.character_id,
            name: '角色名称',
            series: '作品名称',
            category: 'Animation',
            popularity_score: 0,
            created_at: new Date().toISOString(),
          });
        } else {
          setCharacter(null);
        }
      } catch (err) {
        setError('加载会话失败');
        console.error('加载会话失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId, getSession]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="加载会话..." />
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error || '会话不存在'} />
      </div>
    );
  }

  return (
    <ChatPage
      character={character}
      sessionId={sessionId}
      onBack={onBack}
      className={className}
    />
  );
};
