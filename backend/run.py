#!/usr/bin/env python3
"""
ACG-AI Backend 启动脚本
"""

import os
import sys
import uvicorn
from pathlib import Path
import logging

# 添加项目根目录到Python路径
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

logger = logging.getLogger(__name__)

def main():
    """启动FastAPI应用"""
    logger.info("🚀 启动 ACG-AI Backend API...")
    logger.info("📋 API文档地址: http://localhost:8000/docs")
    logger.info("🔧 ReDoc文档地址: http://localhost:8000/redoc")
    logger.info("💡 健康检查: http://localhost:8000/health")
    logger.info("-" * 50)
    
    # 检查环境变量
    if not os.getenv("OPENAI_API_KEY") and not os.getenv("ANTHROPIC_API_KEY"):
        logger.warning("⚠️  警告: 未设置AI API密钥，AI功能可能无法使用")
        logger.warning("   请在.env文件中设置OPENAI_API_KEY或ANTHROPIC_API_KEY")
        logger.warning("-" * 50)
    
    # 启动服务器
    logger.info("正在启动Uvicorn服务器...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()

