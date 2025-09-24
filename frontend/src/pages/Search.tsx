import React, { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Grid, List } from 'lucide-react';
import { SearchBar, CharacterCard } from '../components/search';
import { Loading, ErrorMessage, Button, EmptyState } from '../components/common';
import { useSearch } from '../hooks';
import { Character } from '../types';

interface SearchPageProps {
  initialQuery?: string;
  initialCategory?: string;
  onBack?: () => void;
  onCharacterClick?: (character: Character) => void;
  onStartChat?: (character: Character) => void;
  className?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  initialCategory = '',
  onBack,
  onCharacterClick,
  onStartChat,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    query,
    category,
    results,
    loading,
    error,
    search,
    setQuery,
    setCategory,
  } = useSearch();

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

  // 初始化搜索
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setCategory(initialCategory);
      search(initialQuery, initialCategory);
    }
  }, [initialQuery, initialCategory, search, setQuery, setCategory]);

  const handleSearch = (searchQuery: string, searchCategory?: string) => {
    search(searchQuery, searchCategory);
  };

  const handleCharacterClick = (character: Character) => {
    onCharacterClick?.(character);
  };

  const categories = [
    { value: '', label: '全部' },
    { value: 'Animation', label: '动画' },
    { value: 'Comics', label: '漫画' },
    { value: 'Games', label: '游戏' },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
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
              <h1 className="text-2xl font-bold text-gray-900">搜索角色</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>筛选</span>
              </Button>
              
              <div className="flex items-center border border-gray-300 rounded-md">
                <Button
                  onClick={() => setViewMode('grid')}
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar
            onSearch={handleSearch}
            loading={loading}
            placeholder="搜索ACG角色..."
          />
        </div>
      </div>

      {/* 筛选器 */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  作品类型
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索结果统计 */}
        {results.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              找到 {results.length} 个相关角色
              {query && ` (搜索: "${query}")`}
            </p>
          </div>
        )}

        {/* 搜索结果 */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loading size="lg" text="搜索中..." />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : results.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }>
            {results.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => handleCharacterClick(character)}
                className={viewMode === 'list' ? 'flex items-center space-x-4' : ''}
              />
            ))}
          </div>
        ) : query ? (
          <EmptyState
            title="未找到相关角色"
            description="请尝试其他关键词或调整筛选条件"
            icon={<Filter className="w-12 h-12 text-gray-400" />}
          />
        ) : (
          <EmptyState
            title="开始搜索"
            description="在上方搜索框中输入角色名称或作品名称"
            icon={<Filter className="w-12 h-12 text-gray-400" />}
          />
        )}
      </div>
    </div>
  );
};

interface SearchResultsPageProps {
  query: string;
  category?: string;
  onBack?: () => void;
  onCharacterClick?: (character: Character) => void;
  className?: string;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  query,
  category,
  onBack,
  onCharacterClick,
  className = '',
}) => {
  return (
    <SearchPage
      initialQuery={query}
      initialCategory={category}
      onBack={onBack}
      onCharacterClick={onCharacterClick}
      className={className}
    />
  );
};
