import axios, { AxiosResponse } from 'axios';
import {
  Character,
  CharacterCreate,
  CharacterUpdate,
  User,
  UserCreate,
  ChatSession,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  SearchRequest,
  SearchResponse,
  VoiceRequest,
  VoiceResponse,
  ApiResponse,
  ApiError,
} from '../types';

// API基础配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API请求: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API响应: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API响应错误:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 角色相关API
export const characterApi = {
  // 获取角色列表
  getCharacters: async (
    skip: number = 0,
    limit: number = 10,
    category?: string
  ): Promise<Character[]> => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });
    
    if (category) {
      params.append('category', category);
    }
    
    const response: AxiosResponse<Character[]> = await api.get(
      `/characters/?${params.toString()}`
    );
    return response.data;
  },

  // 获取单个角色
  getCharacter: async (id: number): Promise<Character> => {
    const response: AxiosResponse<Character> = await api.get(`/characters/${id}`);
    return response.data;
  },

  // 创建角色
  createCharacter: async (character: CharacterCreate): Promise<Character> => {
    const response: AxiosResponse<Character> = await api.post('/characters/', character);
    return response.data;
  },

  // 更新角色
  updateCharacter: async (id: number, character: CharacterUpdate): Promise<Character> => {
    const response: AxiosResponse<Character> = await api.put(`/characters/${id}`, character);
    return response.data;
  },

  // 删除角色
  deleteCharacter: async (id: number): Promise<void> => {
    await api.delete(`/characters/${id}`);
  },

  // 搜索角色
  searchCharacters: async (request: SearchRequest): Promise<SearchResponse> => {
    const params = new URLSearchParams({
      query: request.query,
      limit: (request.limit || 10).toString(),
    });
    
    if (request.category) {
      params.append('category', request.category);
    }
    
    const response: AxiosResponse<SearchResponse> = await api.get(
      `/characters/search/?${params.toString()}`
    );
    return response.data;
  },

  // 获取热门角色
  getPopularCharacters: async (limit: number = 10, category?: string): Promise<Character[]> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    
    if (category) {
      params.append('category', category);
    }
    
    const response: AxiosResponse<Character[]> = await api.get(
      `/characters/popular/?${params.toString()}`
    );
    return response.data;
  },

  // 增加角色人气值
  incrementPopularity: async (id: number): Promise<void> => {
    await api.post(`/characters/${id}/increment-popularity`);
  },
};

// 用户相关API
export const userApi = {
  // 获取用户列表
  getUsers: async (skip: number = 0, limit: number = 10): Promise<User[]> => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });
    
    const response: AxiosResponse<User[]> = await api.get(`/users/?${params.toString()}`);
    return response.data;
  },

  // 获取单个用户
  getUser: async (id: number): Promise<User> => {
    const response: AxiosResponse<User> = await api.get(`/users/${id}`);
    return response.data;
  },

  // 创建用户
  createUser: async (user: UserCreate): Promise<User> => {
    const response: AxiosResponse<User> = await api.post('/users/', user);
    return response.data;
  },
};

// 聊天相关API
export const chatApi = {
  // 创建聊天会话
  createSession: async (sessionData: { character_id?: number | null; session_name?: string }): Promise<ChatSession> => {
    const response: AxiosResponse<ChatSession> = await api.post('/chat/sessions', sessionData);
    return response.data;
  },

  // 创建通用聊天会话
  createGeneralSession: async (sessionName: string = '新对话'): Promise<ChatSession> => {
    const response: AxiosResponse<ChatSession> = await api.post('/chat/sessions/general', null, {
      params: { session_name: sessionName }
    });
    return response.data;
  },

  // 获取聊天会话列表
  getSessions: async (userId?: number, characterId?: number): Promise<ChatSession[]> => {
    const params = new URLSearchParams();
    
    if (userId) {
      params.append('user_id', userId.toString());
    }
    
    if (characterId) {
      params.append('character_id', characterId.toString());
    }
    
    const response: AxiosResponse<ChatSession[]> = await api.get(
      `/chat/sessions?${params.toString()}`
    );
    return response.data;
  },

  // 获取单个聊天会话
  getSession: async (id: number): Promise<ChatSession> => {
    const response: AxiosResponse<ChatSession> = await api.get(`/chat/sessions/${id}`);
    return response.data;
  },

  // 获取聊天消息
  getMessages: async (sessionId: number, limit: number = 50): Promise<ChatMessage[]> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    
    const response: AxiosResponse<ChatMessage[]> = await api.get(
      `/chat/sessions/${sessionId}/messages?${params.toString()}`
    );
    return response.data;
  },

  // 发送聊天消息
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response: AxiosResponse<ChatResponse> = await api.post('/chat/send', request);
    return response.data;
  },

  // 发送通用聊天消息
  sendGeneralMessage: async (message: string, sessionId?: number): Promise<ChatResponse> => {
    const params = sessionId ? { session_id: sessionId } : {};
    const response: AxiosResponse<ChatResponse> = await api.post('/chat/send/general', null, {
      params: { message, ...params }
    });
    return response.data;
  },

  // 处理语音消息
  processVoiceMessage: async (request: VoiceRequest): Promise<VoiceResponse> => {
    const response: AxiosResponse<VoiceResponse> = await api.post('/chat/voice', request);
    return response.data;
  },
};

// 通用API工具
export const apiUtils = {
  // 处理API错误
  handleError: (error: any): ApiError => {
    if (error.response) {
      return {
        detail: error.response.data.detail || '服务器错误',
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        detail: '网络连接失败',
        status: 0,
      };
    } else {
      return {
        detail: error.message || '未知错误',
        status: -1,
      };
    }
  },

  // 检查API健康状态
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/health`);
      return response.status === 200;
    } catch {
      return false;
    }
  },
};

export default api;
