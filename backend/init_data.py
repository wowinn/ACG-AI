#!/usr/bin/env python3
"""
ACG-AI 示例数据初始化脚本
"""

import os
import sys
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.utils.sample_data import create_sample_data

def main():
    """初始化示例数据"""
    print("🚀 正在初始化ACG-AI示例数据...")
    
    try:
        # 创建数据库表
        print("📋 创建数据库表...")
        Base.metadata.create_all(bind=engine)
        print("✅ 数据库表创建成功")
        
        # 创建示例数据
        print("📝 创建示例数据...")
        db = SessionLocal()
        try:
            create_sample_data(db)
            print("✅ 示例数据创建成功")
        finally:
            db.close()
        
        print("🎉 ACG-AI示例数据初始化完成！")
        print("📊 已创建以下角色:")
        print("   - 桐谷和人 (刀剑神域)")
        print("   - 蕾姆 (Re:从零开始的异世界生活)")
        print("   - 亚丝娜 (刀剑神域)")
        print("   - 盖伦 (英雄联盟)")
        print("   - 蒙奇·D·路飞 (海贼王)")
        print("👤 已创建测试用户: testuser")
        
    except Exception as e:
        print(f"❌ 初始化失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
