from sqlalchemy.orm import Session
from typing import List, Optional
from ..models import ChatSession, ChatMessage
from ..schemas import ChatSessionCreate, ChatMessageResponse
from datetime import datetime

class ChatService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_session(self, session_data: ChatSessionCreate) -> ChatSession:
        """创建聊天会话"""
        session = ChatSession(**session_data.dict())
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session
    
    def get_session(self, session_id: int) -> Optional[ChatSession]:
        """获取聊天会话"""
        return self.db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.is_active == True
        ).first()
    
    def get_sessions(
        self, 
        user_id: Optional[int] = None, 
        character_id: Optional[int] = None
    ) -> List[ChatSession]:
        """获取聊天会话列表"""
        query = self.db.query(ChatSession).filter(ChatSession.is_active == True)
        
        if user_id:
            query = query.filter(ChatSession.user_id == user_id)
        
        if character_id:
            query = query.filter(ChatSession.character_id == character_id)
        
        return query.order_by(ChatSession.updated_at.desc()).all()
    
    def update_session(self, session_id: int, **kwargs) -> Optional[ChatSession]:
        """更新聊天会话"""
        session = self.get_session(session_id)
        if not session:
            return None
        
        for key, value in kwargs.items():
            setattr(session, key, value)
        
        session.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(session)
        return session
    
    def delete_session(self, session_id: int) -> bool:
        """删除聊天会话"""
        session = self.get_session(session_id)
        if not session:
            return False
        
        session.is_active = False
        self.db.commit()
        return True
    
    def add_message(
        self, 
        session_id: int, 
        role: str, 
        content: str, 
        message_type: str = "text",
        metadata: Optional[str] = None
    ) -> ChatMessage:
        """添加聊天消息"""
        message = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
            message_type=message_type,
            metadata=metadata
        )
        
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        
        # 更新会话时间
        self.update_session(session_id)
        
        return message
    
    def get_messages(
        self, 
        session_id: int, 
        limit: int = 50
    ) -> List[ChatMessageResponse]:
        """获取聊天消息"""
        messages = self.db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).order_by(ChatMessage.created_at.desc()).limit(limit).all()
        
        # 反转顺序，让最新的消息在最后
        messages.reverse()
        return [ChatMessageResponse.from_orm(msg) for msg in messages]
    
    def get_recent_messages(
        self, 
        session_id: int, 
        limit: int = 10
    ) -> List[ChatMessage]:
        """获取最近的聊天消息（用于AI上下文）"""
        return self.db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).order_by(ChatMessage.created_at.desc()).limit(limit).all()
    
    def clear_session_messages(self, session_id: int) -> bool:
        """清空会话消息"""
        session = self.get_session(session_id)
        if not session:
            return False
        
        self.db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).delete()
        
        self.db.commit()
        return True
    
    def get_session_statistics(self, session_id: int) -> dict:
        """获取会话统计信息"""
        session = self.get_session(session_id)
        if not session:
            return {}
        
        total_messages = self.db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).count()
        
        user_messages = self.db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id,
            ChatMessage.role == "user"
        ).count()
        
        assistant_messages = self.db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id,
            ChatMessage.role == "assistant"
        ).count()
        
        return {
            "session_id": session_id,
            "total_messages": total_messages,
            "user_messages": user_messages,
            "assistant_messages": assistant_messages,
            "created_at": session.created_at,
            "updated_at": session.updated_at
        }

