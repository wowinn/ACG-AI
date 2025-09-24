from openai import OpenAI
from typing import Optional
from ..database import settings
from ..models import Character, ChatMessage
from sqlalchemy.orm import Session

class AIService:
    def __init__(self):
        self.client = None
        
        if settings.qiniu_api_key:
            self.client = OpenAI(
                base_url=settings.qiniu_base_url,
                api_key=settings.qiniu_api_key
            )
    
    async def generate_response(
        self, 
        message: str, 
        character_id: int, 
        session_id: int,
        db: Session = None
    ) -> str:
        """生成AI回复"""
        # 获取角色信息
        character = db.query(Character).filter(Character.id == character_id).first()
        if not character:
            return "抱歉，我找不到这个角色信息。"
        
        # 构建角色提示词
        character_prompt = self._build_character_prompt(character)
        
        # 获取聊天历史（最近5条消息）
        if db:
            recent_messages = db.query(ChatMessage).filter(
                ChatMessage.session_id == session_id
            ).order_by(ChatMessage.created_at.desc()).limit(5).all()
            
            # 反转顺序，让最早的在前
            recent_messages.reverse()
            
            # 构建对话历史
            conversation_history = []
            for msg in recent_messages:
                if msg.role == "user":
                    conversation_history.append(f"用户: {msg.content}")
                elif msg.role == "assistant":
                    conversation_history.append(f"{character.name}: {msg.content}")
        
        # 构建完整的提示词
        full_prompt = f"""
            {character_prompt}

            对话历史:
            {chr(10).join(conversation_history) if 'conversation_history' in locals() else '无'}

            用户: {message}

            {character.name}:"""
        
        # 调用AI服务
        try:
            if self.client:
                response = await self._call_qiniu_api(full_prompt)
            else:
                response = "抱歉，AI服务暂时不可用。"
            
            return response.strip()
            
        except Exception as e:
            return f"抱歉，生成回复时出现错误: {str(e)}"
    
    async def generate_general_response(
        self, 
        message: str, 
        session_id: int,
        db: Session = None
    ) -> str:
        """生成通用AI回复（不绑定角色）"""
        # 获取聊天历史（最近5条消息）
        conversation_history = []
        if db:
            recent_messages = db.query(ChatMessage).filter(
                ChatMessage.session_id == session_id
            ).order_by(ChatMessage.created_at.desc()).limit(5).all()
            
            # 反转顺序，让最早的在前
            recent_messages.reverse()
            
            # 构建对话历史
            for msg in recent_messages:
                if msg.role == "user":
                    conversation_history.append(f"用户: {msg.content}")
                elif msg.role == "assistant":
                    conversation_history.append(f"AI助手: {msg.content}")
        
        # 构建通用提示词
        general_prompt = f"""
            你是一个专业的AI助手，擅长回答各种问题，包括ACG相关内容、技术问题、生活建议等。
            请用友好、专业的语气回复用户的问题。
            
            对话历史:
            {chr(10).join(conversation_history) if conversation_history else '无'}

            用户: {message}

            AI助手:"""
        
        # 调用AI服务
        try:
            if self.client:
                response = await self._call_qiniu_api(general_prompt)
            else:
                response = "抱歉，AI服务暂时不可用。"
            
            return response.strip()
            
        except Exception as e:
            return f"抱歉，生成回复时出现错误: {str(e)}"
    
    def _build_character_prompt(self, character: Character) -> str:
        """构建角色提示词"""
        prompt = f"""
            你正在扮演{character.name}这个角色。

            基本信息:
            - 姓名: {character.name}
            - 作品: {character.series}
            - 类型: {character.category}
            """
        
        if character.name_en:
            prompt += f"- 英文名: {character.name_en}\n"
        
        if character.name_jp:
            prompt += f"- 日文名: {character.name_jp}\n"
        
        if character.description:
            prompt += f"\n角色描述: {character.description}\n"
        
        if character.personality:
            prompt += f"\n性格特点: {character.personality}\n"
        
        if character.abilities:
            prompt += f"\n能力/技能: {character.abilities}\n"
        
        if character.background:
            prompt += f"\n背景故事: {character.background}\n"
        
        if character.voice_actor:
            prompt += f"\n声优: {character.voice_actor}\n"
        
        prompt += f"""
            请以{character.name}的身份和语气回复用户的问题。保持角色的性格特点，使用符合角色设定的语言风格。
            如果用户询问的内容超出了你的知识范围，请以角色的身份礼貌地表示不知道。
            """
        
        return prompt
    
    async def _call_qiniu_api(self, prompt: str) -> str:
        """调用七牛云 OpenAI 兼容 API"""
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "你是一个专业的角色扮演AI助手。"},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"七牛云 API调用失败: {str(e)}")
    
    async def generate_character_summary(self, character: Character) -> str:
        """生成角色摘要"""
        summary_prompt = f"""
请为以下ACG角色生成一个简洁的摘要介绍：

角色信息:
- 姓名: {character.name}
- 作品: {character.series}
- 类型: {character.category}
- 描述: {character.description or '暂无'}
- 性格: {character.personality or '暂无'}
- 能力: {character.abilities or '暂无'}

请生成一个100字以内的角色介绍，突出角色的特点和魅力。
"""
        
        try:
            if self.client:
                response = await self._call_qiniu_api(summary_prompt)
            else:
                response = f"{character.name}是来自{character.series}的角色。"
            
            return response.strip()
            
        except Exception as e:
            return f"{character.name}是来自{character.series}的角色。"
