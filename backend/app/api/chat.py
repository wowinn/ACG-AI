from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from ..database import get_db
from ..schemas import (
    ChatRequest, ChatResponse, ChatSessionCreate, ChatSession, 
    ChatMessageResponse, VoiceRequest, VoiceResponse
)
from ..services.chat_service import ChatService
from ..services.ai_service import AIService
from ..services.voice_service import VoiceService

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/sessions", response_model=ChatSession)
async def create_chat_session(
    session_data: ChatSessionCreate,
    db: Session = Depends(get_db)
):
    """创建聊天会话"""
    service = ChatService(db)
    return service.create_session(session_data)

@router.post("/sessions/general", response_model=ChatSession)
async def create_general_chat_session(
    session_name: str = "新对话",
    db: Session = Depends(get_db)
):
    """创建通用聊天会话（不绑定特定角色）"""
    service = ChatService(db)
    session_data = ChatSessionCreate(
        character_id=None,  # 通用聊天，不绑定角色
        session_name=session_name
    )
    return service.create_session(session_data)

@router.get("/sessions", response_model=List[ChatSession])
async def get_chat_sessions(
    user_id: Optional[int] = None,
    character_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """获取聊天会话列表"""
    service = ChatService(db)
    return service.get_sessions(user_id, character_id)

@router.get("/sessions/{session_id}", response_model=ChatSession)
async def get_chat_session(session_id: int, db: Session = Depends(get_db)):
    """获取单个聊天会话"""
    service = ChatService(db)
    session = service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return session

@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageResponse])
async def get_chat_messages(
    session_id: int,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """获取聊天消息历史"""
    service = ChatService(db)
    messages = service.get_messages(session_id, limit)
    return messages

@router.post("/send", response_model=ChatResponse)
async def send_message(
    chat_request: ChatRequest,
    db: Session = Depends(get_db)
):
    """发送聊天消息"""
    chat_service = ChatService(db)
    ai_service = AIService()
    
    # 创建或获取会话
    if chat_request.session_id:
        session = chat_service.get_session(chat_request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
    else:
        session_data = ChatSessionCreate(
            character_id=chat_request.character_id,
            session_name=f"Chat with Character {chat_request.character_id}" if chat_request.character_id else "新对话"
        )
        session = chat_service.create_session(session_data)
    
    # 保存用户消息
    user_message = chat_service.add_message(
        session_id=session.id,
        role="user",
        content=chat_request.message,
        message_type=chat_request.message_type
    )
    
    # 获取AI回复
    ai_response = await ai_service.generate_response(
        message=chat_request.message,
        character_id=chat_request.character_id,
        session_id=session.id
    )
    
    # 保存AI回复
    assistant_message = chat_service.add_message(
        session_id=session.id,
        role="assistant",
        content=ai_response,
        message_type="text"
    )
    
    return ChatResponse(
        message=ai_response,
        character_id=chat_request.character_id,
        session_id=session.id,
        message_type="text",
        created_at=assistant_message.created_at
    )

@router.post("/send/general", response_model=ChatResponse)
async def send_general_message(
    message: str,
    session_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """发送通用聊天消息（不绑定角色）"""
    chat_service = ChatService(db)
    ai_service = AIService()
    
    # 创建或获取会话
    if session_id:
        session = chat_service.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
    else:
        session_data = ChatSessionCreate(
            character_id=None,  # 通用聊天
            session_name="新对话"
        )
        session = chat_service.create_session(session_data)
    
    # 保存用户消息
    user_message = chat_service.add_message(
        session_id=session.id,
        role="user",
        content=message,
        message_type="text"
    )
    
    # 获取AI回复（通用模式）
    ai_response = await ai_service.generate_general_response(
        message=message,
        session_id=session.id
    )
    
    # 保存AI回复
    assistant_message = chat_service.add_message(
        session_id=session.id,
        role="assistant",
        content=ai_response,
        message_type="text"
    )
    
    return ChatResponse(
        message=ai_response,
        character_id=None,
        session_id=session.id,
        message_type="text",
        created_at=assistant_message.created_at
    )

@router.post("/voice", response_model=VoiceResponse)
async def process_voice_message(
    voice_request: VoiceRequest,
    db: Session = Depends(get_db)
):
    """处理语音消息"""
    chat_service = ChatService(db)
    voice_service = VoiceService()
    ai_service = AIService()
    
    # 语音转文字
    text = await voice_service.speech_to_text(voice_request.audio_data)
    
    # 创建或获取会话
    if voice_request.session_id:
        session = chat_service.get_session(voice_request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
    else:
        session_data = ChatSessionCreate(
            character_id=voice_request.character_id,
            session_name=f"Voice Chat with Character {voice_request.character_id}"
        )
        session = chat_service.create_session(session_data)
    
    # 保存用户语音消息
    user_message = chat_service.add_message(
        session_id=session.id,
        role="user",
        content=text,
        message_type="voice"
    )
    
    # 获取AI回复
    ai_response = await ai_service.generate_response(
        message=text,
        character_id=voice_request.character_id,
        session_id=session.id
    )
    
    # 文字转语音
    audio_response = await voice_service.text_to_speech(ai_response)
    
    # 保存AI回复
    assistant_message = chat_service.add_message(
        session_id=session.id,
        role="assistant",
        content=ai_response,
        message_type="voice"
    )
    
    return VoiceResponse(
        text=ai_response,
        audio_response=audio_response,
        character_id=voice_request.character_id,
        session_id=session.id
    )

@router.websocket("/ws/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: int, db: Session = Depends(get_db)):
    """WebSocket实时聊天"""
    await websocket.accept()
    chat_service = ChatService(db)
    ai_service = AIService()
    
    try:
        while True:
            # 接收消息
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # 验证会话
            session = chat_service.get_session(session_id)
            if not session:
                await websocket.send_text(json.dumps({"error": "Session not found"}))
                continue
            
            # 保存用户消息
            user_message = chat_service.add_message(
                session_id=session_id,
                role="user",
                content=message_data["message"],
                message_type=message_data.get("type", "text")
            )
            
            # 获取AI回复
            ai_response = await ai_service.generate_response(
                message=message_data["message"],
                character_id=session.character_id,
                session_id=session_id
            )
            
            # 保存AI回复
            assistant_message = chat_service.add_message(
                session_id=session_id,
                role="assistant",
                content=ai_response,
                message_type="text"
            )
            
            # 发送回复
            response_data = {
                "message": ai_response,
                "character_id": session.character_id,
                "session_id": session_id,
                "timestamp": assistant_message.created_at.isoformat()
            }
            await websocket.send_text(json.dumps(response_data))
            
    except WebSocketDisconnect:
        pass

