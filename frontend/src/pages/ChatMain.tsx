import React, { useState, useEffect, useRef } from 'react';
import { Plus, MessageSquare, Settings, MoreVertical, Send, Mic, MicOff } from 'lucide-react';
import { Button, Loading } from '../components/common';
import { CharacterSelector } from '../components/character-selector';
import { SessionList } from '../components/session-list';
import { useChat } from '../hooks';
import { ChatSession, ChatMessage, Character } from '../types';

interface ChatMainPageProps {
  className?: string;
}

export const ChatMainPage: React.FC<ChatMainPageProps> = ({ className = '' }) => {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [showSessionList, setShowSessionList] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    sessions,
    loading,
    error,
    createSession,
    sendMessage,
    fetchMessages,
    fetchSessions,
  } = useChat();

  // 加载会话列表
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 创建新会话
  const handleNewChat = async (character?: Character) => {
    try {
      const sessionName = character ? `与 ${character.name} 的对话` : '新对话';
      const session = await createSession(
        character?.id || null,
        sessionName
      );
      setCurrentSession(session);
      setSelectedCharacter(character || null);
      setMessages([]);
      setShowCharacterSelector(false);
    } catch (err) {
      console.error('创建会话失败:', err);
    }
  };

  // 选择会话
  const handleSelectSession = async (session: ChatSession) => {
    try {
      setCurrentSession(session);
      const messageHistory = await fetchMessages(session.id);
      setMessages(messageHistory);
      
      // 如果有角色ID，获取角色信息
      if (session.character_id) {
        // 这里需要从sessions中找到对应的角色信息
        // 暂时设置为null，后续可以从API获取
        setSelectedCharacter(null);
      } else {
        setSelectedCharacter(null);
      }
    } catch (err) {
      console.error('加载会话失败:', err);
    }
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentSession) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await sendMessage({
        message,
        character_id: selectedCharacter?.id || null,
        session_id: currentSession.id,
        message_type: 'text',
      });

      // 更新消息列表
      const userMessage: ChatMessage = {
        id: Date.now(),
        session_id: currentSession.id,
        role: 'user',
        content: message,
        message_type: 'text',
        created_at: new Date().toISOString(),
      };

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        session_id: currentSession.id,
        role: 'assistant',
        content: response.message,
        message_type: 'text',
        created_at: response.created_at,
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
    } catch (err) {
      console.error('发送消息失败:', err);
    } finally {
      setIsTyping(false);
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`min-h-screen bg-dark-gradient flex ${className}`}>
      {/* 侧边栏 */}
      <div className="w-80 bg-dark-800/50 border-r border-white/10 flex flex-col">
        {/* 头部 */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">ACG-AI</h1>
            <Button
              onClick={() => setShowCharacterSelector(true)}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新对话</span>
            </Button>
          </div>
          
          {/* 会话列表 */}
          <SessionList
            sessions={sessions}
            currentSession={currentSession}
            onSelectSession={handleSelectSession}
            loading={loading}
          />
        </div>
      </div>

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 聊天头部 */}
        <div className="bg-dark-800/30 border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-primary-400" />
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {currentSession?.session_name || '选择或创建新对话'}
                </h2>
                {selectedCharacter && (
                  <p className="text-sm text-gray-400">
                    与 {selectedCharacter.name} 对话
                  </p>
                )}
              </div>
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

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {selectedCharacter ? `与 ${selectedCharacter.name} 开始对话` : '开始新的对话'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {selectedCharacter 
                    ? `你可以与 ${selectedCharacter.name} 进行角色扮演对话`
                    : '你可以问我任何问题，或者选择与特定角色对话'
                  }
                </p>
                {!selectedCharacter && (
                  <Button
                    onClick={() => setShowCharacterSelector(true)}
                    className="flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>选择角色对话</span>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  character={selectedCharacter}
                />
              ))}
              
              {isTyping && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">AI</span>
                  </div>
                  <div className="bg-dark-700 rounded-lg p-3">
                    <Loading size="sm" text="" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedCharacter ? `与 ${selectedCharacter.name} 聊天...` : '输入消息...'}
                className="w-full px-4 py-3 dark-input rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={2}
                disabled={!currentSession || isTyping}
              />
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !currentSession || isTyping}
              size="lg"
              className="px-4"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 角色选择对话框 */}
      {showCharacterSelector && (
        <CharacterSelector
          onSelectCharacter={(character) => handleNewChat(character)}
          onClose={() => setShowCharacterSelector(false)}
          onCreateGeneralChat={() => handleNewChat()}
        />
      )}
    </div>
  );
};

interface MessageBubbleProps {
  message: ChatMessage;
  character?: Character | null;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, character }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* 头像 */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">我</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {character ? character.name.charAt(0) : 'AI'}
              </span>
            </div>
          )}
        </div>

        {/* 消息内容 */}
        <div className={`rounded-lg px-4 py-3 ${isUser ? 'bg-primary-500 text-white' : 'dark-bg-surface dark-text-primary'}`}>
          <div className="text-sm whitespace-pre-wrap">
            {message.content}
          </div>
          <div className={`text-xs mt-1 ${isUser ? 'text-primary-100' : 'dark-text-muted'}`}>
            {new Date(message.created_at).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
