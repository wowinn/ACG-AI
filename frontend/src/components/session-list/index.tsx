import React from 'react';
import { MessageSquare, Trash2, Edit3 } from 'lucide-react';
import { Button } from '../common';
import { ChatSession } from '../../types';

interface SessionListProps {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  onSelectSession: (session: ChatSession) => void;
  loading?: boolean;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  currentSession,
  onSelectSession,
  loading = false,
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 24 * 60 * 60 * 1000) {
      // 今天
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      // 一周内
      return date.toLocaleDateString('zh-CN', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      // 更早
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-sm">暂无对话记录</p>
        <p className="text-gray-500 text-xs mt-1">创建新对话开始聊天</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            currentSession?.id === session.id
              ? 'bg-primary-500/20 border border-primary-500/30'
              : 'hover:bg-dark-700/50 border border-transparent'
          }`}
          onClick={() => onSelectSession(session)}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium truncate ${
                currentSession?.id === session.id ? 'text-white' : 'text-gray-300'
              }`}>
                {session.session_name || '未命名对话'}
              </h3>
              
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  {session.character_id ? '角色对话' : '通用对话'}
                </p>
                <span className="text-xs text-gray-500">
                  {formatTime(session.created_at)}
                </span>
              </div>
            </div>
          </div>
          
          {/* 悬停操作按钮 */}
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6"
                onClick={(e?: React.MouseEvent) => {
                  e?.stopPropagation();
                  // TODO: 实现编辑功能
                }}
              >
                <Edit3 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 text-red-400 hover:text-red-300"
                onClick={(e?: React.MouseEvent) => {
                  e?.stopPropagation();
                  // TODO: 实现删除功能
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
