@echo off
echo 🚀 Starting Kanban Board Servers...
echo.

echo 📊 Starting Backend Server...
start "Backend" cmd /k "cd /d d:\protool\backend && node kanban-server.js"

echo 🎨 Starting Frontend Server...
timeout /t 2 /nobreak >nul
start "Frontend" cmd /k "cd /d d:\protool\frontend && npm run dev -- --host 0.0.0.0"

echo.
echo ✅ Both servers starting...
echo 📱 Frontend: http://localhost:3000
echo 🔗 Backend API: http://localhost:5000/api
echo.
echo 🎯 Open http://localhost:3000 in your browser!
echo.
pause
