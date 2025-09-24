import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Character,
  ChatSession,
  ChatMessage,
  CharacterState,
  ChatState,
  AppState,
} from '../types';

// 角色状态管理
export const useCharacterStore = create<CharacterState>()(
  devtools(
    (set, get) => ({
      characters: [],
      currentCharacter: undefined,
      searchResults: [],
      loading: false,
      error: undefined,

      // 设置加载状态
      setLoading: (loading: boolean) => set({ loading }),

      // 设置错误
      setError: (error: string | undefined) => set({ error }),

      // 设置角色列表
      setCharacters: (characters: Character[]) => set({ characters }),

      // 设置当前角色
      setCurrentCharacter: (character: Character | undefined) => set({ currentCharacter: character }),

      // 设置搜索结果
      setSearchResults: (results: Character[]) => set({ searchResults: results }),

      // 添加角色
      addCharacter: (character: Character) => {
        const { characters } = get();
        set({ characters: [...characters, character] });
      },

      // 更新角色
      updateCharacter: (id: number, updates: Partial<Character>) => {
        const { characters } = get();
        const updatedCharacters = characters.map(char =>
          char.id === id ? { ...char, ...updates } : char
        );
        set({ characters: updatedCharacters });
      },

      // 删除角色
      removeCharacter: (id: number) => {
        const { characters } = get();
        set({ characters: characters.filter(char => char.id !== id) });
      },

      // 清空搜索结果
      clearSearchResults: () => set({ searchResults: [] }),

      // 重置状态
      reset: () => set({
        characters: [],
        currentCharacter: undefined,
        searchResults: [],
        loading: false,
        error: undefined,
      }),
    }),
    {
      name: 'character-store',
    }
  )
);

// 聊天状态管理
export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      sessions: [],
      currentSession: undefined,
      messages: [],
      isTyping: false,
      loading: false,
      error: undefined,

      // 设置加载状态
      setLoading: (loading: boolean) => set({ loading }),

      // 设置错误
      setError: (error: string | undefined) => set({ error }),

      // 设置会话列表
      setSessions: (sessions: ChatSession[]) => set({ sessions }),

      // 设置当前会话
      setCurrentSession: (session: ChatSession | undefined) => set({ currentSession: session }),

      // 设置消息列表
      setMessages: (messages: ChatMessage[]) => set({ messages }),

      // 添加消息
      addMessage: (message: ChatMessage) => {
        const { messages } = get();
        set({ messages: [...messages, message] });
      },

      // 添加多条消息
      addMessages: (newMessages: ChatMessage[]) => {
        const { messages } = get();
        set({ messages: [...messages, ...newMessages] });
      },

      // 设置打字状态
      setIsTyping: (isTyping: boolean) => set({ isTyping }),

      // 添加会话
      addSession: (session: ChatSession) => {
        const { sessions } = get();
        set({ sessions: [...sessions, session] });
      },

      // 更新会话
      updateSession: (id: number, updates: Partial<ChatSession>) => {
        const { sessions } = get();
        const updatedSessions = sessions.map(session =>
          session.id === id ? { ...session, ...updates } : session
        );
        set({ sessions: updatedSessions });
      },

      // 删除会话
      removeSession: (id: number) => {
        const { sessions } = get();
        set({ sessions: sessions.filter(session => session.id !== id) });
      },

      // 清空消息
      clearMessages: () => set({ messages: [] }),

      // 重置状态
      reset: () => set({
        sessions: [],
        currentSession: undefined,
        messages: [],
        isTyping: false,
        loading: false,
        error: undefined,
      }),
    }),
    {
      name: 'chat-store',
    }
  )
);

// 应用全局状态管理
export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      characters: [],
      currentCharacter: undefined,
      chatSessions: [],
      currentSession: undefined,
      messages: [],
      loading: false,
      error: undefined,

      // 设置加载状态
      setLoading: (loading: boolean) => set({ loading }),

      // 设置错误
      setError: (error: string | undefined) => set({ error }),

      // 设置角色列表
      setCharacters: (characters: Character[]) => set({ characters }),

      // 设置当前角色
      setCurrentCharacter: (character: Character | undefined) => set({ currentCharacter: character }),

      // 设置会话列表
      setChatSessions: (sessions: ChatSession[]) => set({ chatSessions: sessions }),

      // 设置当前会话
      setCurrentSession: (session: ChatSession | undefined) => set({ currentSession: session }),

      // 设置消息列表
      setMessages: (messages: ChatMessage[]) => set({ messages }),

      // 添加消息
      addMessage: (message: ChatMessage) => {
        const { messages } = get();
        set({ messages: [...messages, message] });
      },

      // 重置状态
      reset: () => set({
        characters: [],
        currentCharacter: undefined,
        chatSessions: [],
        currentSession: undefined,
        messages: [],
        loading: false,
        error: undefined,
      }),
    }),
    {
      name: 'app-store',
    }
  )
);

// 选择器hooks
export const useCharacterSelectors = () => {
  const store = useCharacterStore();
  return {
    characters: store.characters,
    currentCharacter: store.currentCharacter,
    searchResults: store.searchResults,
    loading: store.loading,
    error: store.error,
  };
};

export const useChatSelectors = () => {
  const store = useChatStore();
  return {
    sessions: store.sessions,
    currentSession: store.currentSession,
    messages: store.messages,
    isTyping: store.isTyping,
    loading: store.loading,
    error: store.error,
  };
};

export const useAppSelectors = () => {
  const store = useAppStore();
  return {
    characters: store.characters,
    currentCharacter: store.currentCharacter,
    chatSessions: store.chatSessions,
    currentSession: store.currentSession,
    messages: store.messages,
    loading: store.loading,
    error: store.error,
  };
};
