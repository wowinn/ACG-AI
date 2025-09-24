import React, { useState, useEffect } from 'react';
import { X, Search, Users, Sparkles } from 'lucide-react';
import { Button, ErrorMessage } from '../common';
import { useCharacters } from '../../hooks';
import { Character } from '../../types';

interface CharacterSelectorProps {
  onSelectCharacter: (character: Character) => void;
  onCreateGeneralChat: () => void;
  onClose: () => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  onSelectCharacter,
  onCreateGeneralChat,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Animation' | 'Comics' | 'Games' | ''>('');
  
  const {
    characters,
    loading,
    error,
    fetchCharacters,
    searchCharacters,
  } = useCharacters();

  // 加载角色列表
  useEffect(() => {
    fetchCharacters(0, 20);
  }, [fetchCharacters]);

  // 搜索角色
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchCharacters({
        query: searchQuery.trim(),
        category: selectedCategory === '' ? undefined : selectedCategory as 'Animation' | 'Comics' | 'Games',
        limit: 20,
      });
    } else {
      fetchCharacters(0, 20, selectedCategory === '' ? undefined : selectedCategory as 'Animation' | 'Comics' | 'Games');
    }
  };

  // 处理角色选择
  const handleCharacterSelect = (character: Character) => {
    onSelectCharacter(character);
  };

  // 处理通用聊天
  const handleGeneralChat = () => {
    onCreateGeneralChat();
  };

  const categories = [
    { value: '', label: '全部' },
    { value: 'Animation', label: '动画' },
    { value: 'Comics', label: '漫画' },
    { value: 'Games', label: '游戏' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-bold text-white">选择对话角色</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 搜索区域 */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="搜索角色..."
                  className="w-full pl-10 pr-4 py-3 dark-input rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as 'Animation' | 'Comics' | 'Games' | '')}
              className="px-4 py-3 dark-input rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            
            <Button onClick={handleSearch} loading={loading}>
              搜索
            </Button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 通用聊天选项 */}
          <div className="mb-6">
            <div
              onClick={handleGeneralChat}
              className="p-4 rounded-lg border border-white/10 hover:border-primary-500/50 cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-acg-purple to-acg-pink flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">
                    通用AI助手
                  </h3>
                  <p className="text-sm text-gray-400">
                    与AI助手进行通用对话，可以回答各种问题
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 角色列表 */}
          {error ? (
            <ErrorMessage message={error} />
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : characters.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">未找到角色</h3>
              <p className="text-gray-400">请尝试其他搜索关键词</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onClick={() => handleCharacterSelect(character)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-lg border border-white/10 hover:border-primary-500/50 cursor-pointer transition-all duration-200 group"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {character.image_url ? (
            <img
              src={character.image_url}
              alt={character.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/30 group-hover:border-primary-500 transition-colors"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center border-2 border-primary-500/30 group-hover:border-primary-500 transition-colors">
              <span className="text-white text-lg font-bold">
                {character.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-primary-300 transition-colors">
            {character.name}
          </h3>
          
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-400">{character.series}</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
              {character.category === 'Animation' ? '动画' : 
               character.category === 'Comics' ? '漫画' : '游戏'}
            </span>
          </div>
          
          {character.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {character.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
