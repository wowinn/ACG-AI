# ACG-AI Backend API

ACG角色智能问答系统的后端API服务。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并填入你的配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的API密钥：

```env
QINIU_BASE_URL=https://openai.qiniu.com/v1
QINIU_API_KEY=your_qiniu_ai_api_key_here
SECRET_KEY=your_secret_key_here
```

### 3. 启动服务

```bash
python run.py
```

或者使用uvicorn：

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. 访问API文档

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- 健康检查: http://localhost:8000/health

## 📚 API端点

### 角色管理
- `GET /api/v1/characters/` - 获取角色列表
- `GET /api/v1/characters/{id}` - 获取角色详情
- `POST /api/v1/characters/` - 创建新角色
- `PUT /api/v1/characters/{id}` - 更新角色信息
- `DELETE /api/v1/characters/{id}` - 删除角色
- `GET /api/v1/characters/search/` - 搜索角色
- `GET /api/v1/characters/popular/` - 获取热门角色

### 用户管理
- `GET /api/v1/users/` - 获取用户列表
- `GET /api/v1/users/{id}` - 获取用户信息
- `POST /api/v1/users/` - 创建新用户
- `PUT /api/v1/users/{id}` - 更新用户信息
- `DELETE /api/v1/users/{id}` - 删除用户

### 聊天功能
- `POST /api/v1/chat/sessions` - 创建聊天会话
- `GET /api/v1/chat/sessions` - 获取聊天会话列表
- `GET /api/v1/chat/sessions/{id}` - 获取聊天会话详情
- `GET /api/v1/chat/sessions/{id}/messages` - 获取聊天消息
- `POST /api/v1/chat/send` - 发送聊天消息
- `POST /api/v1/chat/voice` - 处理语音消息
- `WS /api/v1/chat/ws/{session_id}` - WebSocket实时聊天

## 🗄️ 数据库

项目使用SQLite数据库，数据库文件位于 `acg_ai.db`。

### 数据模型

- **Character**: ACG角色信息
- **User**: 用户信息
- **ChatSession**: 聊天会话
- **ChatMessage**: 聊天消息

### 创建示例数据

```bash
python -c "from app.utils.sample_data import create_sample_data; from app.database import SessionLocal; create_sample_data(SessionLocal())"
```

## 🔧 开发

### 项目结构

```
backend/
├── app/                    # 主应用目录
│   ├── __init__.py        # 应用初始化
│   ├── main.py            # FastAPI应用入口
│   ├── database.py        # 数据库配置和连接
│   ├── api/               # API路由层
│   │   ├── __init__.py
│   │   ├── characters.py  # 角色相关API
│   │   ├── chat.py       # 聊天相关API
│   │   └── users.py      # 用户相关API
│   ├── models/            # 数据模型层
│   │   └── __init__.py
│   ├── schemas/           # Pydantic数据模式
│   │   └── __init__.py
│   ├── services/          # 业务逻辑层
│   │   ├── __init__.py
│   │   ├── ai_service.py      # AI服务（七牛云API）
│   │   ├── character_service.py # 角色业务逻辑
│   │   ├── chat_service.py    # 聊天业务逻辑
│   │   ├── user_service.py    # 用户业务逻辑
│   │   └── voice_service.py   # 语音处理服务
│   ├── utils/             # 工具函数
│   │   ├── __init__.py
│   │   ├── logging_config.py  # 日志配置
│   │   └── sample_data.py     # 示例数据生成
│   └── static/            # 静态文件
│       ├── audio/         # 音频文件
│       └── images/        # 图片文件
├── migrations/            # 数据库迁移文件
├── tests/                # 测试文件
├── venv/                 # Python虚拟环境
├── acg_ai.db            # SQLite数据库文件
├── Dockerfile           # Docker配置
├── init_data.py         # 数据初始化脚本
├── requirements.txt     # Python依赖
├── run.py              # 应用启动脚本
└── README.md           # 项目说明文档
```

### 添加新功能

1. 在 `models/` 中定义数据模型
2. 在 `schemas/` 中创建Pydantic模式
3. 在 `services/` 中实现业务逻辑
4. 在 `api/` 中创建API路由
5. 在 `main.py` 中注册路由

## 🧪 测试

```bash
# 运行测试
pytest

# 运行特定测试
pytest tests/test_characters.py
```

## 🐳 Docker部署

```bash
# 构建镜像
docker build -t acg-ai-backend .

# 运行容器
docker run -p 8000:8000 acg-ai-backend
```

## 📝 注意事项

1. 确保设置了正确的七牛云AI API密钥
2. 生产环境请修改SECRET_KEY
3. 语音功能需要安装额外的系统依赖
4. 建议使用PostgreSQL作为生产数据库

