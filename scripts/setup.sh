# ACG-AI 开发环境设置脚本

echo "🚀 开始设置 ACG-AI 开发环境..."

# 检查Python版本
echo "📋 检查Python版本..."
python --version

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node --version
npm --version

# 创建虚拟环境
echo "🐍 创建Python虚拟环境..."
cd backend
python -m venv venv

# 激活虚拟环境 (Windows)
echo "🔧 激活虚拟环境..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# 安装Python依赖
echo "📦 安装Python依赖..."
pip install -r requirements.txt

# 返回根目录
cd ..

# 安装前端依赖
echo "📦 安装前端依赖..."
cd frontend
npm install

# 返回根目录
cd ..

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p logs
mkdir -p data
mkdir -p backend/app/static/uploads

# 复制环境变量文件
echo "⚙️ 设置环境变量..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请编辑其中的配置"
fi

echo "🎉 开发环境设置完成！"
echo ""
echo "📝 下一步："
echo "1. 编辑 .env 文件，填入你的API密钥"
echo "2. 启动后端: cd backend && python -m uvicorn app.main:app --reload"
echo "3. 启动前端: cd frontend && npm start"
echo ""
echo "🌐 访问地址："
echo "前端: http://localhost:3000"
echo "后端API: http://localhost:8000"
echo "API文档: http://localhost:8000/docs"




