// 角色相关类型
export interface Character {
  id: number;
  name: string;
  name_en?: string;
  name_jp?: string;
  series: string;
  series_en?: string;
  series_jp?: string;
  category: 'Animation' | 'Comics' | 'Games';
  description?: string;
  personality?: string;
  abilities?: string;
  background?: string;
  image_url?: string;
  voice_actor?: string;
  age?: number;
  gender?: string;
  birthday?: string;
  height?: string;
  weight?: string;
  blood_type?: string;
  tags?: string;
  popularity_score: number;
  created_at: string;
}

export interface CharacterCreate {
  name: string;
  name_en?: string;
  name_jp?: string;
  series: string;
  series_en?: string;
  series_jp?: string;
  category: 'Animation' | 'Comics' | 'Games';
  description?: string;
  personality?: string;
  abilities?: string;
  background?: string;
  image_url?: string;
  voice_actor?: string;
  age?: number;
  gender?: string;
  birthday?: string;
  height?: string;
  weight?: string;
  blood_type?: string;
  tags?: string;
}

export interface CharacterUpdate {
  name?: string;
  name_en?: string;
  name_jp?: string;
  series?: string;
  series_en?: string;
  series_jp?: string;
  category?: 'Animation' | 'Comics' | 'Games';
  description?: string;
  personality?: string;
  abilities?: string;
  background?: string;
  image_url?: string;
  voice_actor?: string;
  age?: number;
  gender?: string;
  birthday?: string;
  height?: string;
  weight?: string;
  blood_type?: string;
  tags?: string;
}

// 用户相关类型
export interface User {
  id: number;
  username: string;
  email?: string;
  is_active: boolean;
  is_premium: boolean;
  created_at: string;
}

export interface UserCreate {
  username: string;
  email?: string;
  password: string;
}

// 聊天相关类型
export interface ChatSession {
  id: number;
  user_id?: number;
  character_id: number | null;
  session_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: number;
  session_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  message_type: 'text' | 'voice' | 'image';
  message_metadata?: string;
  created_at: string;
}

export interface ChatRequest {
  message: string;
  character_id: number | null;
  session_id?: number;
  message_type?: 'text' | 'voice';
}

export interface ChatResponse {
  message: string;
  character_id: number | null;
  session_id: number;
  message_type: 'text' | 'voice' | 'image';
  created_at: string;
}

// 搜索相关类型
export interface SearchRequest {
  query: string;
  category?: 'Animation' | 'Comics' | 'Games';
  limit?: number;
}

export interface SearchResponse {
  characters: Character[];
  total: number;
  query: string;
}

// API响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  detail: string;
  status: number;
}

// 语音识别相关类型
export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

// 语音相关类型
export interface VoiceRequest {
  audio_data: string; // Base64编码的音频数据
  character_id: number;
  session_id?: number;
}

export interface VoiceResponse {
  text: string;
  audio_response?: string; // Base64编码的音频响应
  character_id: number;
  session_id: number;
}

// 组件Props类型
export interface CharacterCardProps {
  character: Character;
  onClick?: (character: Character) => void;
}

export interface SearchBarProps {
  onSearch: (query: string, category?: string) => void;
  loading?: boolean;
}

export interface ChatInterfaceProps {
  character: Character;
  sessionId?: number;
}

export interface MessageBubbleProps {
  message: ChatMessage;
  isUser: boolean;
}

// 状态管理类型
export interface AppState {
  characters: Character[];
  currentCharacter?: Character;
  chatSessions: ChatSession[];
  currentSession?: ChatSession;
  messages: ChatMessage[];
  loading: boolean;
  error?: string;
}

export interface CharacterState {
  characters: Character[];
  currentCharacter?: Character;
  searchResults: Character[];
  loading: boolean;
  error?: string;
  // Actions
  setCharacters: (characters: Character[]) => void;
  setCurrentCharacter: (character: Character | undefined) => void;
  setSearchResults: (results: Character[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: number, updates: Partial<Character>) => void;
  removeCharacter: (id: number) => void;
  clearSearchResults: () => void;
  reset: () => void;
}

export interface ChatState {
  sessions: ChatSession[];
  currentSession?: ChatSession;
  messages: ChatMessage[];
  isTyping: boolean;
  loading: boolean;
  error?: string;
  // Actions
  setSessions: (sessions: ChatSession[]) => void;
  setCurrentSession: (session: ChatSession | undefined) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  addMessages: (messages: ChatMessage[]) => void;
  setIsTyping: (isTyping: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;
  addSession: (session: ChatSession) => void;
  updateSession: (id: number, updates: Partial<ChatSession>) => void;
  removeSession: (id: number) => void;
  clearMessages: () => void;
  reset: () => void;
}
