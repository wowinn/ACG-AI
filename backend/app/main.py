from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from .database import engine, Base, settings
from .utils.logging_config import setup_logging, get_logger
from .api import characters, users, chat

# 设置日志
logger = setup_logging(
    level="INFO",
    log_file="logs/acg_ai.log" if not settings.debug else None
)

# 创建数据库表
@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时创建数据库表
    logger.info("正在创建数据库表...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("数据库表创建成功")
    except Exception as e:
        logger.error(f"数据库表创建失败: {e}")
        raise
    
    logger.info("ACG-AI Backend 启动完成")
    yield
    
    # 关闭时清理资源
    logger.info("ACG-AI Backend 正在关闭...")

# 创建FastAPI应用
app = FastAPI(
    title="ACG-AI 智能问答API",
    description="一个专门面向ACG（Animation, Comics, Games）爱好者的AI智能问答网站API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS中间件配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静态文件服务
static_dir = "app/static"
if not os.path.exists(static_dir):
    os.makedirs(static_dir)
    logger.info(f"创建静态文件目录: {static_dir}")

app.mount("/static", StaticFiles(directory=static_dir), name="static")

# 注册API路由
app.include_router(characters.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")

# 根路径
@app.get("/")
async def root():
    return {
        "message": "欢迎使用ACG-AI智能问答API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# 健康检查
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API服务正常运行"}

# 获取API信息
@app.get("/api/info")
async def api_info():
    return {
        "name": "ACG-AI API",
        "description": "ACG角色智能问答API",
        "version": "1.0.0",
        "features": [
            "角色搜索和管理",
            "AI角色对话",
            "语音聊天",
            "用户管理",
            "聊天会话管理"
        ],
        "endpoints": {
            "characters": "/api/v1/characters",
            "users": "/api/v1/users", 
            "chat": "/api/v1/chat"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

