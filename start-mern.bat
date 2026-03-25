@echo off
echo 🚀 Starting MERN ProTool Application...
echo.

echo 📊 Starting Backend Server (MongoDB + Express)...
start "Backend MERN" cmd /k "cd /d d:\protool\backend && node server-mern.js"

echo 🎨 Starting Frontend Server (React + Vite)...
timeout /t 2 /nobreak >nul
start "Frontend MERN" cmd /k "cd /d d:\protool\frontend && npm run dev"

echo.
echo ✅ MERN servers starting...
echo 📱 Frontend: http://localhost:5173
echo 🔗 Backend: http://localhost:5000
echo 🗄️ Database: MongoDB
echo 🔒 Authentication: JWT + CORS Enabled
echo.
echo 🎯 Open http://localhost:5173 in your browser!
echo 👤 Demo: demo@kanban.com / password123
echo.
echo 📝 Features: Create Projects, Jira-style Features, Form Validation
echo.
pause
