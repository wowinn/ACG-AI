import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '../common';

interface SearchBarProps {
  onSearch: (query: string, category?: string) => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  loading = false,
  placeholder = '搜索ACG角色...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim(), category || undefined);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setCategory('');
    onSearch('', undefined);
  };

  const categories = [
    { value: '', label: '全部' },
    { value: 'Animation', label: '动画' },
    { value: 'Comics', label: '漫画' },
    { value: 'Games', label: '游戏' },
  ];

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 dark-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-4 dark-input rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
              disabled={loading}
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 dark-text-muted hover:dark-text-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="md"
            className="px-3"
          >
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </Button>
          
          <Button
            onClick={handleSearch}
            loading={loading}
            disabled={!query.trim()}
            size="md"
            className="px-6"
          >
            搜索
          </Button>
        </div>

        {showFilters && (
          <div className="mt-3 p-4 dark-card rounded-lg dark-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium dark-text-secondary mb-2">
                  作品类型
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 dark-input rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
        )}
      </div>
    </div>
  );
};

interface SearchResultsProps {
  results: any[];
  loading?: boolean;
  error?: string;
  onCharacterClick?: (character: any) => void;
  className?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading = false,
  error,
  onCharacterClick,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`flex justify-center py-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="dark-text-secondary">搜索中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-400 mb-2">搜索出错</div>
        <p className="dark-text-secondary">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="dark-text-muted mb-2">未找到相关角色</div>
        <p className="dark-text-muted">请尝试其他关键词</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {results.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          onClick={() => onCharacterClick?.(character)}
        />
      ))}
    </div>
  );
};

interface CharacterCardProps {
  character: any;
  onClick?: () => void;
  className?: string;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onClick,
  className = '',
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // 如果点击的是按钮，不触发卡片点击
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  };

  const handleStartChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 触发开始聊天事件
    const event = new CustomEvent('startChat', { detail: character });
    window.dispatchEvent(event);
  };

  return (
    <div
      className={`acg-card-bg rounded-lg shadow-acg hover:shadow-acg-lg hover:scale-105 transition-all duration-300 cursor-pointer group ${className}`}
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {character.image_url ? (
              <img
                src={character.image_url}
                alt={character.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-500/30 group-hover:border-primary-500 transition-colors duration-300"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center border-2 border-primary-500/30 group-hover:border-primary-500 transition-colors duration-300">
                <span className="text-white text-lg font-bold">
                  {character.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white truncate group-hover:text-primary-300 transition-colors duration-300">
              {character.name}
            </h3>
            
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-sm dark-text-secondary">{character.series}</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                {character.category === 'Animation' ? '动画' : 
                 character.category === 'Comics' ? '漫画' : '游戏'}
              </span>
            </div>
            
            {character.description && (
              <p className="text-sm dark-text-muted mt-3 line-clamp-2">
                {character.description}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2 text-xs text-primary-300">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-acg-neon rounded-full animate-pulse"></span>
                  <span>人气: {character.popularity_score}</span>
                </span>
              </div>
              
              {character.voice_actor && (
                <span className="text-xs dark-text-muted">
                  声优: {character.voice_actor}
                </span>
              )}
            </div>
            
            {/* 开始聊天按钮 */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={handleStartChat}
                className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800"
              >
                开始聊天
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
