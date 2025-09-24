import React, { useState, useEffect } from 'react';
import { SearchBar, SearchResults } from '../components/search';
import { CharacterCard } from '../components/search';
import { Loading, ErrorMessage, EmptyState } from '../components/common';
import { useCharacters, useSearch } from '../hooks';
import { Character } from '../types';
import { Users, TrendingUp, Star } from 'lucide-react';

interface HomePageProps {
  onCharacterClick?: (character: Character) => void;
  onStartChat?: (character: Character) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onCharacterClick, onStartChat }) => {
  const [popularCharacters, setPopularCharacters] = useState<Character[]>([]);
  const [recentCharacters, setRecentCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const { fetchCharacters, getPopularCharacters } = useCharacters();
  const { results, loading: searchLoading, search, clearSearch } = useSearch();

  // 监听开始聊天事件
  useEffect(() => {
    const handleStartChat = (event: CustomEvent) => {
      const character = event.detail as Character;
      onStartChat?.(character);
    };

    window.addEventListener('startChat', handleStartChat as EventListener);
    
    return () => {
      window.removeEventListener('startChat', handleStartChat as EventListener);
    };
  }, [onStartChat]);

  // 加载热门角色和最近角色
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(undefined);

        // 并行加载热门角色和最近角色
        const [popular, recent] = await Promise.all([
          getPopularCharacters(6),
          fetchCharacters(0, 6),
        ]);

        setPopularCharacters(popular);
        setRecentCharacters(recent);
      } catch (err) {
        setError('加载数据失败');
        console.error('加载数据失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getPopularCharacters, fetchCharacters]);

  const handleSearch = (query: string, category?: string) => {
    if (query.trim()) {
      search(query, category);
    } else {
      clearSearch();
    }
  };

  const handleCharacterClick = (character: Character) => {
    onCharacterClick?.(character);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="加载中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* 头部区域 */}
      <div className="acg-glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4 acg-text-glow animate-fade-in">
              ACG-AI 智能问答
            </h1>
            <p className="text-xl dark-text-secondary mb-8 animate-slide-up">
              与您喜爱的ACG角色进行智能对话
            </p>
            
            {/* 搜索栏 */}
            <div className="animate-slide-up">
              <SearchBar
                onSearch={handleSearch}
                loading={searchLoading}
                placeholder="搜索您喜爱的ACG角色..."
                className="mb-8"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索结果 */}
        {results.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold dark-text-primary mb-4">搜索结果</h2>
            <SearchResults
              results={results}
              loading={searchLoading}
              onCharacterClick={handleCharacterClick}
            />
          </div>
        )}

        {/* 热门角色 */}
        {popularCharacters.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-8 h-8 text-acg-purple animate-pulse-slow" />
              <h2 className="text-3xl font-bold text-white acg-text-glow">热门角色</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCharacters.map((character, index) => (
                <div key={character.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CharacterCard
                    character={character}
                    onClick={() => handleCharacterClick(character)}
                    className="hover:animate-float"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 最近添加 */}
        {recentCharacters.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-8 h-8 text-acg-cyan animate-pulse-slow" />
              <h2 className="text-3xl font-bold text-white acg-text-glow">最近添加</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentCharacters.map((character, index) => (
                <div key={character.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CharacterCard
                    character={character}
                    onClick={() => handleCharacterClick(character)}
                    className="hover:animate-float"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!searchLoading && results.length === 0 && popularCharacters.length === 0 && (
          <EmptyState
            title="暂无角色数据"
            description="请稍后再试或联系管理员"
            icon={<Star className="w-12 h-12 text-gray-400" />}
          />
        )}
      </div>

      {/* 底部信息 */}
      <div className="acg-glass-effect border-t border-primary-500/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-xl font-medium text-white mb-2 acg-text-glow">
              开始您的ACG角色对话之旅
            </h3>
            <p className="dark-text-secondary">
              搜索您喜爱的角色，开始智能对话体验
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
