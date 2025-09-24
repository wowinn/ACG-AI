import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings
from .utils.logging_config import get_logger

logger = get_logger(__name__)

class Settings(BaseSettings):
    database_url: str = "sqlite:///./acg_ai.db"
    secret_key: str = "acg-ai"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    qiniu_base_url: str = "https://openai.qiniu.com/v1"
    qiniu_api_key: str = "sk-567f92eb9586456bc69d154a601deb4001b667dc92e1696fcc29fd66a2b7dc6c"
    debug: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()

# 创建数据库引擎
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {},
    echo=settings.debug  # 在调试模式下显示SQL语句
)

logger.info(f"数据库引擎已创建: {settings.database_url}")

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基础模型类
Base = declarative_base()

# 依赖注入：获取数据库会话
def get_db():
    """获取数据库会话"""
    db = SessionLocal()
    try:
        logger.debug("创建数据库会话")
        yield db
    except Exception as e:
        logger.error(f"数据库会话错误: {e}")
        db.rollback()
        raise
    finally:
        logger.debug("关闭数据库会话")
        db.close()

