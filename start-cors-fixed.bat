@echo off
echo 🔧 Starting CORS-Fixed ProTool Servers...
echo.

echo 📊 Starting Backend Server (Fixed CORS)...
start "Backend Fixed" cmd /k "cd /d d:\protool\backend && node server-fixed.js"

echo 🎨 Starting Frontend Server (Fixed)...
timeout /t 2 /nobreak >nul
start "Frontend Fixed" cmd /k "cd /d d:\protool\frontend && npm run dev"

echo.
echo ✅ CORS-Fixed servers starting...
echo 📱 Frontend: http://localhost:5173
echo 🔗 Backend: http://localhost:5000
echo 🔒 CORS: Configured for Vite (localhost:5173)
echo.
echo 🎯 Open http://localhost:5173 in your browser!
echo 👤 Demo: demo@kanban.com / password123
echo.
pause
