
# 由于个人时间原因，未能按时完成开发，本仓库将于10月5日不再对外开放
<br/>


# ACG-AI 智能问答网站

一个专门面向ACG（Animation, Comics, Games）爱好者的AI智能问答网站，用户可以搜索ACG角色信息并与AI角色进行语音聊天。

## 1. 目标用户分析

### 主要用户类型
- **ACG爱好者**：喜欢动画、漫画、游戏的用户群体
- **二次元文化爱好者**：深度参与二次元文化的用户
- **游戏玩家**：各类游戏的忠实玩家
- **内容创作者**：需要ACG素材的创作者和UP主
- **学生群体**：对ACG文化感兴趣的年轻用户

### 用户痛点
- **信息分散**：ACG角色信息散布在各个平台，难以快速获取
- **语言障碍**：日文、英文资料理解困难
- **信息过时**：传统百科信息更新不及时
- **互动性差**：只能被动浏览，缺乏互动体验
- **个性化不足**：无法根据个人喜好定制内容

### 用户故事
- **小明**：一个《刀剑神域》粉丝，想了解桐谷和人的详细背景，希望与AI角色进行对话
- **小红**：游戏UP主，需要快速查找《英雄联盟》盖伦的技能和背景故事
- **小李**：二次元新手，想通过AI了解ACG文化，获得个性化推荐

## 2. 功能规划与优先级

### 核心功能（高优先级）
1. **角色搜索与信息展示**
   - 支持中英文角色名称搜索
   - 显示角色基本信息、背景故事、技能等
   - 支持图片、视频等多媒体内容

2. **AI角色对话**
   - 语音聊天功能
   - 文字对话功能
   - 角色扮演模式

3. **用户界面**
   - 响应式设计
   - 简洁直观的搜索界面
   - 聊天界面优化

### 扩展功能（中优先级）
4. **个性化推荐**
   - 基于用户喜好推荐相关角色
   - 相似角色推荐

5. **社区功能**
   - 用户评论和讨论
   - 角色评分系统

6. **多语言支持**
   - 中文、英文、日文界面
   - 多语言角色信息

### 高级功能（低优先级）
7. **AI角色定制**
   - 用户自定义AI角色
   - 角色性格设定

8. **数据分析**
   - 用户行为分析
   - 热门角色统计

## 3. AI角色技能规划

### 核心技能
1. **角色扮演能力**
   - 深度理解角色性格和背景
   - 保持角色一致性
   - 情感表达和语调模拟

2. **ACG知识库**
   - 丰富的动画、漫画、游戏知识
   - 角色关系网络理解
   - 剧情发展脉络掌握

3. **多语言交流**
   - 中文、英文、日文对话
   - 文化背景理解
   - 俚语和网络用语掌握

### 扩展技能
4. **创意互动**
   - 角色故事续写
   - 情景模拟对话
   - 角色推荐和介绍

5. **学习能力**
   - 从用户对话中学习
   - 个性化适应
   - 知识库持续更新

6. **多媒体处理**
   - 图片识别和分析
   - 音频处理
   - 视频内容理解

## 技术架构

- **前端**：React + TypeScript
- **后端**：FastAPI + Python
- **数据库**：SQLite + Redis（可选）
- **AI服务**：集成主流LLM API
- **语音服务**：TTS/STT API
- **部署**：Docker + 云服务

### 数据库选择说明

**SQLite 优势**：
- 🚀 **快速启动**：无需安装配置数据库服务器
- 📦 **轻量级**：单文件数据库，便于部署和备份
- 🔧 **开发友好**：适合原型开发和MVP阶段
- 💰 **成本低**：无需额外的数据库服务器费用
- 🔒 **数据安全**：文件级权限控制

**适用场景**：
- 项目初期和MVP阶段
- 中小规模用户量（< 10万用户）
- 单机部署或小型云服务
- 快速原型验证

**后续扩展**：
- 当用户量增长时，可平滑迁移到PostgreSQL
- FastAPI支持多种数据库，迁移成本低

## 项目文件结构

### 后端结构 (FastAPI)
```
backend/
├── app/                       # 主应用目录
│   ├── __init__.py           # 应用初始化
│   ├── main.py              # FastAPI应用入口
│   ├── database.py          # 数据库连接和配置
│   ├── api/                 # API路由层
│   │   ├── __init__.py
│   │   ├── characters.py    # 角色相关API
│   │   ├── chat.py         # 聊天API
│   │   └── users.py        # 用户API
│   ├── models/              # 数据模型层
│   │   └── __init__.py
│   ├── schemas/             # Pydantic数据模式
│   │   └── __init__.py
│   ├── services/            # 业务逻辑层
│   │   ├── __init__.py
│   │   ├── ai_service.py    # AI服务（七牛云API）
│   │   ├── character_service.py # 角色业务逻辑
│   │   ├── chat_service.py  # 聊天业务逻辑
│   │   ├── user_service.py  # 用户业务逻辑
│   │   └── voice_service.py # 语音处理服务
│   ├── utils/               # 工具函数
│   │   ├── __init__.py
│   │   ├── logging_config.py # 日志配置
│   │   └── sample_data.py   # 示例数据生成
│   └── static/              # 静态文件
│       ├── audio/           # 音频文件
│       └── images/          # 图片文件
├── migrations/              # 数据库迁移文件
├── tests/                   # 测试文件
├── venv/                    # Python虚拟环境
├── acg_ai.db               # SQLite数据库文件
├── Dockerfile              # Docker配置
├── init_data.py            # 数据初始化脚本
├── requirements.txt         # Python依赖
├── run.py                  # 应用启动脚本
└── README.md               # 项目说明文档
```

### 前端结构 (React + TypeScript)
```
frontend/
├── public/                 # 静态文件
│   ├── index.html         # HTML模板
│   ├── manifest.json      # PWA配置
│   └── robots.txt         # 搜索引擎配置
├── src/                   # 源代码目录
│   ├── components/        # React组件
│   │   ├── character/      # 角色相关组件
│   │   │   └── index.tsx  # 角色组件
│   │   ├── character-selector/ # 角色选择器
│   │   │   └── index.tsx
│   │   ├── chat/          # 聊天相关组件
│   │   │   └── index.tsx
│   │   ├── common/        # 通用组件
│   │   │   └── index.tsx  # 通用组件（Button, Loading等）
│   │   ├── search/        # 搜索相关组件
│   │   │   └── index.tsx
│   │   └── session-list/  # 会话列表组件
│   │       └── index.tsx
│   ├── hooks/             # 自定义Hooks
│   │   ├── index.ts       # 主要业务Hooks
│   │   └── useVoice.ts    # 语音功能Hook
│   ├── pages/             # 页面组件
│   │   ├── Character.tsx  # 角色详情页
│   │   ├── Chat.tsx       # 聊天页面
│   │   ├── ChatMain.tsx   # 主聊天页面
│   │   ├── Home.tsx       # 首页
│   │   └── Search.tsx     # 搜索页面
│   ├── services/          # API服务
│   │   └── api.ts         # API客户端
│   ├── store/             # 状态管理
│   │   └── index.ts       # Zustand状态管理
│   ├── styles/            # 样式文件
│   │   ├── components/    # 组件样式
│   │   ├── pages/         # 页面样式
│   │   └── globals.css    # 全局样式
│   ├── types/             # TypeScript类型定义
│   │   └── index.ts       # 类型定义
│   ├── utils/              # 工具函数
│   ├── App.tsx            # 主应用组件
│   └── index.tsx          # 应用入口
├── Dockerfile             # Docker配置
├── node_modules/          # 依赖包
├── package.json           # 项目配置
├── package-lock.json      # 依赖锁定文件
├── postcss.config.js      # PostCSS配置
├── tailwind.config.js     # Tailwind CSS配置
├── tsconfig.json          # TypeScript配置
└── README.md              # 项目说明文档
```

### 根目录结构
```
ACG-AI/
├── backend/                  # 后端代码（FastAPI + Python）
├── frontend/                 # 前端代码（React + TypeScript）
├── docs/                     # 项目文档
├── scripts/                  # 部署和工具脚本
│   ├── setup.sh             # Linux/Mac 环境设置
│   └── setup.bat             # Windows 环境设置
├── docker-compose.yml        # Docker编排配置
├── .gitignore                # Git忽略文件
└── README.md                 # 项目说明文档
```
