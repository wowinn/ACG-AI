# ACG-AI Frontend

ACG角色智能问答网站的前端应用，基于React + TypeScript + Tailwind CSS构建。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置API地址：

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_API_BASE_URL=http://localhost:8000
```

### 3. 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 启动

## 📚 项目结构

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

## 🎨 主要功能

### 1. 角色搜索
- 智能搜索ACG角色
- 按作品类型筛选
- 实时搜索建议
- 搜索结果展示

### 2. 角色详情
- 完整的角色信息展示
- 基本信息、性格、能力等
- 角色图片和标签
- 一键开始聊天

### 3. 智能聊天
- 与AI角色进行对话
- 支持文字和语音输入
- 实时消息显示
- 聊天历史记录

### 4. 语音功能
- 语音转文字
- 文字转语音
- 语音消息播放
- 录音功能

## 🛠️ 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **React Router** - 路由管理
- **Zustand** - 状态管理
- **Axios** - HTTP客户端
- **Lucide React** - 图标库

## 📱 响应式设计

- 移动端优先设计
- 平板和桌面端适配
- 触摸友好的交互
- 流畅的动画效果

## 🎯 组件说明

### 通用组件 (`components/common/`)
- `Loading` - 加载状态组件
- `ErrorMessage` - 错误提示组件
- `SuccessMessage` - 成功提示组件
- `EmptyState` - 空状态组件
- `Card` - 卡片组件
- `Button` - 按钮组件（支持多种变体和状态）

### 角色相关组件
- `Character` (`components/character/`) - 角色展示组件
- `CharacterSelector` (`components/character-selector/`) - 角色选择器组件

### 搜索组件 (`components/search/`)
- `SearchBar` - 搜索输入框
- `SearchResults` - 搜索结果展示
- `CharacterCard` - 角色卡片

### 聊天组件
- `Chat` (`components/chat/`) - 聊天界面组件
- `SessionList` (`components/session-list/`) - 会话列表组件

### 页面组件 (`pages/`)
- `Home` - 首页（角色展示和搜索）
- `Character` - 角色详情页
- `Chat` - 聊天页面
- `ChatMain` - 主聊天页面（集成会话管理）
- `Search` - 搜索页面

## 🔧 开发工具

### 代码格式化
```bash
npm run format
```

### 代码检查
```bash
npm run lint
```

### 类型检查
```bash
npm run type-check
```

### 构建生产版本
```bash
npm run build
```
