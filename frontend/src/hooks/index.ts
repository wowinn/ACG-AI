import { useState, useEffect, useCallback } from 'react';
import { characterApi, chatApi, apiUtils } from '../services/api';
import { useCharacterStore, useChatStore } from '../store';
import {
  Character,
  ChatSession,
  ChatMessage,
  ChatRequest,
  SearchRequest,
  VoiceRequest,
  ApiError,
} from '../types';

// 角色相关hooks
export const useCharacters = () => {
  const {
    characters,
    loading,
    error,
    setCharacters,
    setLoading,
    setError,
  } = useCharacterStore();

  const fetchCharacters = useCallback(async (
    skip: number = 0,
    limit: number = 10,
    category?: string
  ): Promise<Character[]> => {
    try {
      setLoading(true);
      setError(undefined);
      const data = await characterApi.getCharacters(skip, limit, category);
      setCharacters(data);
      return data;
    } catch (err) {
      const error = apiUtils.handleError(err);
      setError(error.detail);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setCharacters, setLoading, setError]);

  const fetchCharacter = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(undefined);
      const character = await characterApi.getCharacter(id);
      return character;
    } catch (err) {
      const error = apiUtils.handleError(err);
      setError(error.detail);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const searchCharacters = useCallback(async (request: SearchRequest) => {
    try {
      setLoading(true);
      setError(undefined);
      const response = await characterApi.searchCharacters(request);
      return response;
    } catch (err) {
      const error = apiUtils.handleError(err);
      setError(error.detail);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getPopularCharacters = useCallback(async (limit: number = 10, category?: string): Promise<Character[]> => {
    try {
      setLoading(true);
      setError(undefined);
      const data = await characterApi.getPopularCharacters(limit, category);
      return data;
    } catch (err) {
      const error = apiUtils.handleError(err);
      setError(error.detail);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    characters,
    loading,
    error,
    fetchCharacters,
    fetchCharacter,
    searchCharacters,
    getPopularCharacters,
  };
};

// 聊天相关hooks
export const useChat = () => {
  const {
    sessions,
    currentSession,
    messages,
    isTyping,
    loading,
    error,
    setSessions,
    setCurrentSession,
    setMessages,
    addMessage,
    setIsTyping,
    setLoading,
    setError,
  } = useChatStore();

  const fetchSessions = useCallback(async (userId?: number, characterId?: number) => {
    try {
      setLoading(true);
      setError(undefined);
      const data = await chatApi.getSessions(userId, characterId);
      setSessions(data);
    } catch (err) {
      const error = apiUtils.handleError(err);
      setError(error.detail);
    } finally {
      setLoading(false);
    }
  }, [setSessions, setLoading, setError]);

  const createSession = useCallback(async (characterId: number | null, sessionName?: string) => {
    try {
      setLoading(true);
      setError(undefined);
      const session = await chatApi.createSession({
        character_id: characterId,
        session_name: sessionName,
      });
      return session;
    } catch (err) {
      const error = apiUtils.handleError(err);
      setError(error.detail);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const fetchMessages = useCallback(async (sessionId: number, limit: number = 50): Promise<ChatMessage[]> => {
    try {
      setLoading(true);
      setError(undefined);
      const data = await chatApi.getMessages(sessionId, limit);
      setMessages(data);
      return data;
    } catch (err) {
      const error = apiUtils.handleError(err);
      setError(error.detail);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setMessages, setLoading, setError]);

  const sendMessage = useCallback(async (request: ChatRequest) => {
    try {
      setIsTyping(true);
      setError(undefined);
      
      const response = await chatApi.sendMessage(request);
      
      // 添加用户消息
      const userMessage: ChatMessage = {
        id: Date.now(), // 临时ID
        session_id: response.session_id,
        role: 'user',
        content: request.message,
        message_type: request.message_type || 'text',
        created_at: new Date().toISOString(),
      };
      addMessage(userMessage);
      
      // 添加AI回复
      const aiMessage: ChatMessage = {
        id: Date.now() + 1, // 临时ID
        session_id: response.session_id,
        role: 'assistant',
        content: response.message,
        message_type: response.message_type,
        created_at: response.created_at,
      };
      addMessage(aiMessage);
      
      return response;
    } catch (err) {
      const error = apiUtils.handleError(err);
      setError(error.detail);
      throw error;
    } finally {
      setIsTyping(false);
    }
  }, [addMessage, setIsTyping, setError]);

  const processVoiceMessage = useCallback(async (request: VoiceRequest) => {
    try {
      setIsTyping(true);
      setError(undefined);
      
      const response = await chatApi.processVoiceMessage(request);
      
      // 添加用户语音消息
      const userMessage: ChatMessage = {
        id: Date.now(),
        session_id: response.session_id,
        role: 'user',
        content: response.text,
        message_type: 'voice',
        created_at: new Date().toISOString(),
      };
      addMessage(userMessage);
      
      // 添加AI回复
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        session_id: response.session_id,
        role: 'assistant',
        content: response.text,
        message_type: 'voice',
        created_at: new Date().toISOString(),
      };
      addMessage(aiMessage);
      
      return response;
    } catch (err) {
      const error = apiUtils.handleError(err);
      setError(error.detail);
      throw error;
    } finally {
      setIsTyping(false);
    }
  }, [addMessage, setIsTyping, setError]);

  const getSession = useCallback(async (sessionId: number): Promise<ChatSession | null> => {
    try {
      setLoading(true);
      setError(undefined);
      const session = await chatApi.getSession(sessionId);
      return session;
    } catch (err) {
      const error = apiUtils.handleError(err);
      setError(error.detail);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    sessions,
    currentSession,
    messages,
    isTyping,
    loading,
    error,
    setCurrentSession,
    fetchSessions,
    createSession,
    fetchMessages,
    sendMessage,
    processVoiceMessage,
    getSession,
  };
};

// 搜索hook
export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('');
  const [results, setResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const search = useCallback(async (searchQuery: string, searchCategory?: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(undefined);
      
      const response = await characterApi.searchCharacters({
        query: searchQuery,
        category: searchCategory as any,
        limit: 20,
      });
      
      setResults(response.characters);
      setQuery(searchQuery);
      setCategory(searchCategory || '');
    } catch (err) {
      const apiError = apiUtils.handleError(err);
      setError(apiError.detail);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setCategory('');
    setResults([]);
    setError(undefined);
  }, []);

  return {
    query,
    category,
    results,
    loading,
    error,
    search,
    clearSearch,
    setQuery,
    setCategory,
  };
};

// API健康检查hook
export const useApiHealth = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = useCallback(async () => {
    try {
      setLoading(true);
      const healthy = await apiUtils.checkHealth();
      setIsHealthy(healthy);
    } catch {
      setIsHealthy(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // 每30秒检查一次健康状态
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    isHealthy,
    loading,
    checkHealth,
  };
};

// 导出语音相关hooks
export {
  useVoiceRecorder,
  useVoicePlayer,
  useSpeechToText,
  useTextToSpeech,
} from './useVoice';
