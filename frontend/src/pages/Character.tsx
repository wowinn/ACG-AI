import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { CharacterProfile, CharacterInfo } from '../components/character';
import { Loading, ErrorMessage, Button } from '../components/common';
import { useCharacters } from '../hooks';
import { Character } from '../types';

interface CharacterPageProps {
  characterId: number;
  onBack?: () => void;
  onStartChat?: (character: Character) => void;
}

export const CharacterPage: React.FC<CharacterPageProps> = ({
  characterId,
  onBack,
  onStartChat,
}) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const { fetchCharacter } = useCharacters();

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        setLoading(true);
        setError(undefined);
        const data = await fetchCharacter(characterId);
        setCharacter(data);
      } catch (err) {
        setError('加载角色信息失败');
        console.error('加载角色失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [characterId, fetchCharacter]);

  const handleStartChat = () => {
    if (character && onStartChat) {
      onStartChat(character);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="加载角色信息..." />
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

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="角色不存在" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{character.name}</h1>
                <p className="text-sm text-gray-500">{character.series}</p>
              </div>
            </div>
            
            <Button
              onClick={handleStartChat}
              size="md"
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>开始聊天</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CharacterProfile
          character={character}
          onStartChat={handleStartChat}
        />
      </div>
    </div>
  );
};

interface CharacterDetailProps {
  character: Character;
  onBack?: () => void;
  onStartChat?: (character: Character) => void;
  className?: string;
}

export const CharacterDetail: React.FC<CharacterDetailProps> = ({
  character,
  onBack,
  onStartChat,
  className = '',
}) => {
  const handleStartChat = () => {
    if (onStartChat) {
      onStartChat(character);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between">
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
        
        <Button
          onClick={handleStartChat}
          size="md"
          className="flex items-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>开始聊天</span>
        </Button>
      </div>

      {/* 角色信息 */}
      <CharacterInfo character={character} />
    </div>
  );
};
