import React from 'react';
import { Calendar, Ruler, Weight, Heart, Star, Mic, Gamepad2, BookOpen, Film } from 'lucide-react';
import { Button, Card } from '../common';
import { Character } from '../../types';

interface CharacterProfileProps {
  character: Character;
  onStartChat?: () => void;
  className?: string;
}

export const CharacterProfile: React.FC<CharacterProfileProps> = ({
  character,
  onStartChat,
  className = '',
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Animation':
        return <Film className="w-4 h-4" />;
      case 'Comics':
        return <BookOpen className="w-4 h-4" />;
      case 'Games':
        return <Gamepad2 className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'Animation':
        return '动画';
      case 'Comics':
        return '漫画';
      case 'Games':
        return '游戏';
      default:
        return category;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 基本信息卡片 */}
      <Card className="p-6">
        <div className="flex items-start space-x-6">
          {/* 角色头像 */}
          <div className="flex-shrink-0">
            {character.image_url ? (
              <img
                src={character.image_url}
                alt={character.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                <span className="text-gray-500 text-2xl font-bold">
                  {character.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* 基本信息 */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{character.name}</h1>
              <div className="flex items-center space-x-1 text-primary-600">
                {getCategoryIcon(character.category)}
                <span className="text-sm font-medium">
                  {getCategoryName(character.category)}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h2 className="text-xl text-gray-700">{character.series}</h2>
              
              {character.name_en && (
                <p className="text-sm text-gray-500">英文名: {character.name_en}</p>
              )}
              
              {character.name_jp && (
                <p className="text-sm text-gray-500">日文名: {character.name_jp}</p>
              )}
            </div>

            {/* 人气值 */}
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                人气值: {character.popularity_score}
              </span>
            </div>

            {/* 开始聊天按钮 */}
            {onStartChat && (
              <Button onClick={onStartChat} size="lg" className="px-6">
                开始聊天
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 详细信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 基本信息 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
          <div className="space-y-3">
            {character.age && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">年龄: {character.age}岁</span>
              </div>
            )}
            
            {character.gender && (
              <div className="flex items-center space-x-3">
                <Heart className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">性别: {character.gender}</span>
              </div>
            )}
            
            {character.birthday && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">生日: {character.birthday}</span>
              </div>
            )}
            
            {character.height && (
              <div className="flex items-center space-x-3">
                <Ruler className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">身高: {character.height}</span>
              </div>
            )}
            
            {character.weight && (
              <div className="flex items-center space-x-3">
                <Weight className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">体重: {character.weight}</span>
              </div>
            )}
            
            {character.blood_type && (
              <div className="flex items-center space-x-3">
                <Heart className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">血型: {character.blood_type}</span>
              </div>
            )}
            
            {character.voice_actor && (
              <div className="flex items-center space-x-3">
                <Mic className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">声优: {character.voice_actor}</span>
              </div>
            )}
          </div>
        </Card>

        {/* 角色描述 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">角色描述</h3>
          <div className="space-y-4">
            {character.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">简介</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {character.description}
                </p>
              </div>
            )}
            
            {character.personality && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">性格</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {character.personality}
                </p>
              </div>
            )}
            
            {character.abilities && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">能力/技能</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {character.abilities}
                </p>
              </div>
            )}
            
            {character.background && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">背景故事</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {character.background}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 标签 */}
      {character.tags && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">标签</h3>
          <div className="flex flex-wrap gap-2">
            {character.tags.split(',').map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

interface CharacterInfoProps {
  character: Character;
  className?: string;
}

export const CharacterInfo: React.FC<CharacterInfoProps> = ({
  character,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center space-x-3">
        {character.image_url ? (
          <img
            src={character.image_url}
            alt={character.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 font-medium">
              {character.name.charAt(0)}
            </span>
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{character.name}</h3>
          <p className="text-sm text-gray-500">{character.series}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
              {character.category === 'Animation' ? '动画' : 
               character.category === 'Comics' ? '漫画' : '游戏'}
            </span>
            <span className="text-xs text-gray-500">
              人气: {character.popularity_score}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
