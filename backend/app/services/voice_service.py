import base64
import io
import speech_recognition as sr
from gtts import gTTS
import tempfile
import os
from typing import Optional

class VoiceService:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.language = "zh-cn"  # 默认中文
    
    async def speech_to_text(self, audio_data: str) -> str:
        """语音转文字"""
        try:
            # 解码Base64音频数据
            audio_bytes = base64.b64decode(audio_data)
            
            # 创建临时文件
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_bytes)
                temp_file_path = temp_file.name
            
            try:
                # 使用语音识别
                with sr.AudioFile(temp_file_path) as source:
                    audio = self.recognizer.record(source)
                
                # 识别语音
                text = self.recognizer.recognize_google(audio, language=self.language)
                return text
                
            finally:
                # 清理临时文件
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
                    
        except sr.UnknownValueError:
            return "抱歉，我听不清楚您说的话。"
        except sr.RequestError as e:
            return f"语音识别服务出错: {str(e)}"
        except Exception as e:
            return f"语音转文字失败: {str(e)}"
    
    async def text_to_speech(self, text: str, language: str = "zh-cn") -> str:
        """文字转语音"""
        try:
            # 使用gTTS生成语音
            tts = gTTS(text=text, lang=language, slow=False)
            
            # 创建临时文件
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_file:
                temp_file_path = temp_file.name
            
            try:
                # 保存音频文件
                tts.save(temp_file_path)
                
                # 读取音频文件并转换为Base64
                with open(temp_file_path, "rb") as audio_file:
                    audio_bytes = audio_file.read()
                    audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
                
                return audio_base64
                
            finally:
                # 清理临时文件
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
                    
        except Exception as e:
            raise Exception(f"文字转语音失败: {str(e)}")
    
    async def process_voice_message(
        self, 
        audio_data: str, 
        character_id: int,
        session_id: Optional[int] = None
    ) -> dict:
        """处理语音消息（语音转文字 + 文字转语音）"""
        try:
            # 语音转文字
            text = await self.speech_to_text(audio_data)
            
            # 这里可以调用AI服务生成回复
            # ai_response = await ai_service.generate_response(text, character_id, session_id)
            
            # 文字转语音
            # audio_response = await self.text_to_speech(ai_response)
            
            return {
                "text": text,
                "audio_response": None,  # 暂时返回None，实际使用时需要AI回复
                "success": True
            }
            
        except Exception as e:
            return {
                "text": "",
                "audio_response": None,
                "success": False,
                "error": str(e)
            }
    
    def set_language(self, language: str):
        """设置语音识别和合成的语言"""
        self.language = language
    
    def get_supported_languages(self) -> dict:
        """获取支持的语言列表"""
        return {
            "zh-cn": "中文（简体）",
            "zh-tw": "中文（繁体）",
            "en": "英语",
            "ja": "日语",
            "ko": "韩语"
        }
    
    async def validate_audio_format(self, audio_data: str) -> bool:
        """验证音频格式"""
        try:
            # 尝试解码Base64
            audio_bytes = base64.b64decode(audio_data)
            
            # 检查文件大小（限制为10MB）
            if len(audio_bytes) > 10 * 1024 * 1024:
                return False
            
            # 检查是否为有效的音频文件
            # 这里可以添加更详细的音频格式检查
            return len(audio_bytes) > 0
            
        except Exception:
            return False

