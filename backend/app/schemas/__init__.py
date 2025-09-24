from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# 基础模式
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

# 角色相关模式
class CharacterBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=100)
    name_en: Optional[str] = Field(None, max_length=100)
    name_jp: Optional[str] = Field(None, max_length=100)
    series: str = Field(..., min_length=1, max_length=100)
    series_en: Optional[str] = Field(None, max_length=100)
    series_jp: Optional[str] = Field(None, max_length=100)
    category: str = Field(..., pattern="^(Animation|Comics|Games)$")
    description: Optional[str] = None
    personality: Optional[str] = None
    abilities: Optional[str] = None
    background: Optional[str] = None
    relationships: Optional[str] = None
    image_url: Optional[str] = Field(None, max_length=500)
    voice_actor: Optional[str] = Field(None, max_length=100)
    age: Optional[int] = Field(None, ge=0, le=1000)
    gender: Optional[str] = Field(None, max_length=20)
    birthday: Optional[str] = Field(None, max_length=20)
    height: Optional[str] = Field(None, max_length=20)
    weight: Optional[str] = Field(None, max_length=20)
    blood_type: Optional[str] = Field(None, max_length=10)
    tags: Optional[str] = None

class CharacterCreate(CharacterBase):
    pass

class CharacterUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    name_en: Optional[str] = Field(None, max_length=100)
    name_jp: Optional[str] = Field(None, max_length=100)
    series: Optional[str] = Field(None, min_length=1, max_length=100)
    series_en: Optional[str] = Field(None, max_length=100)
    series_jp: Optional[str] = Field(None, max_length=100)
    category: Optional[str] = Field(None, pattern="^(Animation|Comics|Games)$")
    description: Optional[str] = None
    personality: Optional[str] = None
    abilities: Optional[str] = None
    background: Optional[str] = None
    relationships: Optional[str] = None
    image_url: Optional[str] = Field(None, max_length=500)
    voice_actor: Optional[str] = Field(None, max_length=100)
    age: Optional[int] = Field(None, ge=0, le=1000)
    gender: Optional[str] = Field(None, max_length=20)
    birthday: Optional[str] = Field(None, max_length=20)
    height: Optional[str] = Field(None, max_length=20)
    weight: Optional[str] = Field(None, max_length=20)
    blood_type: Optional[str] = Field(None, max_length=10)
    tags: Optional[str] = None

class Character(CharacterBase):
    id: int
    popularity_score: int = 0
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

class CharacterResponse(BaseSchema):
    id: int
    name: str
    name_en: Optional[str]
    name_jp: Optional[str]
    series: str
    series_en: Optional[str]
    series_jp: Optional[str]
    category: str
    description: Optional[str]
    personality: Optional[str]
    abilities: Optional[str]
    background: Optional[str]
    image_url: Optional[str]
    voice_actor: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    birthday: Optional[str]
    height: Optional[str]
    weight: Optional[str]
    blood_type: Optional[str]
    tags: Optional[str]
    popularity_score: int
    created_at: datetime

# 用户相关模式
class UserBase(BaseSchema):
    username: str = Field(..., min_length=3, max_length=50)
    email: Optional[str] = Field(None, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseSchema):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[str] = Field(None, max_length=100)
    preferences: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool = True
    is_premium: bool = False
    preferences: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

class UserResponse(BaseSchema):
    id: int
    username: str
    email: Optional[str]
    is_active: bool
    is_premium: bool
    created_at: datetime

# 聊天相关模式
class ChatSessionBase(BaseSchema):
    character_id: Optional[int] = None
    session_name: Optional[str] = Field(None, max_length=100)

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSession(ChatSessionBase):
    id: int
    user_id: Optional[int]
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

class ChatMessageBase(BaseSchema):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str = Field(..., min_length=1)
    message_type: str = Field(default="text", pattern="^(text|voice|image)$")
    message_metadata: Optional[str] = None

class ChatMessageCreate(ChatMessageBase):
    session_id: int

class ChatMessage(ChatMessageBase):
    id: int
    session_id: int
    created_at: datetime

class ChatMessageResponse(BaseSchema):
    id: int
    role: str
    content: str
    message_type: str
    created_at: datetime

# 搜索相关模式
class SearchRequest(BaseSchema):
    query: str = Field(..., min_length=1, max_length=200)
    category: Optional[str] = Field(None, pattern="^(Animation|Comics|Games)$")
    limit: int = Field(default=10, ge=1, le=50)

class SearchResponse(BaseSchema):
    characters: List[CharacterResponse]
    total: int
    query: str

# AI聊天相关模式
class ChatRequest(BaseSchema):
    message: str = Field(..., min_length=1, max_length=2000)
    character_id: Optional[int] = None
    session_id: Optional[int] = None
    message_type: str = Field(default="text", pattern="^(text|voice)$")

class ChatResponse(BaseSchema):
    message: str
    character_id: Optional[int] = None
    session_id: int
    message_type: str = "text"
    created_at: datetime

# 语音相关模式
class VoiceRequest(BaseSchema):
    audio_data: str  # Base64编码的音频数据
    character_id: Optional[int] = None
    session_id: Optional[int] = None

class VoiceResponse(BaseSchema):
    text: str
    audio_response: Optional[str] = None  # Base64编码的音频响应
    character_id: Optional[int] = None
    session_id: int

