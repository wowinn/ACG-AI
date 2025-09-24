@echo off
echo 🚀 开始设置 ACG-AI 开发环境...

echo 📋 检查Python版本...
python --version

echo 📋 检查Node.js版本...
node --version
npm --version

echo 🐍 创建Python虚拟环境...
cd backend
python -m venv venv

echo 🔧 激活虚拟环境...
call venv\Scripts\activate.bat

echo 📦 安装Python依赖...
pip install -r requirements.txt

echo 📦 安装前端依赖...
cd ..\frontend
npm install

echo 📁 创建必要的目录...
cd ..
if not exist logs mkdir logs
if not exist data mkdir data
if not exist backend\app\static\uploads mkdir backend\app\static\uploads

echo ⚙️ 设置环境变量...
if not exist .env (
    copy .env.example .env
    echo ✅ 已创建 .env 文件，请编辑其中的配置
)

echo 🎉 开发环境设置完成！
echo.
echo 📝 下一步：
echo 1. 编辑 .env 文件，填入你的API密钥
echo 2. 启动后端: cd backend ^&^& python -m uvicorn app.main:app --reload
echo 3. 启动前端: cd frontend ^&^& npm start
echo.
echo 🌐 访问地址：
echo 前端: http://localhost:3000
echo 后端API: http://localhost:8000
echo API文档: http://localhost:8000/docs

pause


