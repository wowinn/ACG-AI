import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ChatMainPage } from './pages/ChatMain';
import { HomePage } from './pages/Home';
import { CharacterPage } from './pages/Character';
import { ChatPage } from './pages/Chat';
import { SearchPage } from './pages/Search';
import { Character } from './types';

// 路由组件
const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [currentCharacter, setCurrentCharacter] = React.useState<Character | null>(null);
  const [currentSessionId, setCurrentSessionId] = React.useState<number | null>(null);

  const handleCharacterClick = (character: Character) => {
    setCurrentCharacter(character);
    navigate(`/character/${character.id}`);
  };

  const handleStartChat = (character: Character) => {
    setCurrentCharacter(character);
    setCurrentSessionId(null); // 创建新会话
    navigate('/chat');
  };

  const handleStartChatFromHome = (character: Character) => {
    setCurrentCharacter(character);
    setCurrentSessionId(null); // 创建新会话
    navigate('/chat');
  };

  const handleBack = () => {
    setCurrentCharacter(null);
    setCurrentSessionId(null);
    navigate('/');
  };

  return (
    <Routes>
      {/* 主聊天页面 */}
      <Route 
        path="/" 
        element={<ChatMainPage />} 
      />
      
      {/* 传统首页（保留作为备用） */}
      <Route 
        path="/home" 
        element={
          <HomePage 
            onCharacterClick={handleCharacterClick}
            onStartChat={handleStartChatFromHome}
          />
        } 
      />
      
      {/* 搜索页面 */}
      <Route 
        path="/search" 
        element={
          <SearchPage 
            onCharacterClick={handleCharacterClick}
            onStartChat={handleStartChatFromHome}
            onBack={handleBack}
          />
        } 
      />
      
      {/* 角色详情页面 */}
      <Route 
        path="/character/:id" 
        element={
          currentCharacter ? (
            <CharacterPage
              characterId={currentCharacter.id}
              onBack={handleBack}
              onStartChat={handleStartChat}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      {/* 聊天页面（保留作为备用） */}
      <Route 
        path="/chat" 
        element={
          currentCharacter ? (
            <ChatPage
              character={currentCharacter}
              sessionId={currentSessionId || undefined}
              onBack={handleBack}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      {/* 会话页面 */}
      <Route 
        path="/session/:sessionId" 
        element={
          <ChatPage
            character={currentCharacter!}
            sessionId={parseInt(window.location.pathname.split('/')[2])}
            onBack={handleBack}
          />
        } 
      />
      
      {/* 404页面 */}
      <Route 
        path="*" 
        element={<Navigate to="/" replace />} 
      />
    </Routes>
  );
};

// 主应用组件
const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;