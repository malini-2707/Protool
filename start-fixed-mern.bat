@echo off
echo 🚀 Starting FIXED MERN Application (No Page Reloads)...
echo.

echo 📊 Starting Backend Server (MongoDB + Express)...
start "Backend Fixed" cmd /k "cd /d d:\protool\backend && node server-mern.js"

echo 🎨 Starting Frontend Server (React + Vite - No Reloads)...
timeout /t 2 /nobreak >nul
start "Frontend Fixed" cmd /k "cd /d d:\protool\frontend && npm run dev"

echo.
echo ✅ FIXED MERN servers starting...
echo 📱 Frontend: http://localhost:5173
echo 🔗 Backend: http://localhost:5000
echo 🗄️ Database: MongoDB
echo 🔒 Authentication: JWT + CORS Enabled
echo 🚫 Page Reloads: FIXED
echo.
echo 🎯 Open http://localhost:5173 in your browser!
echo 👤 Demo: demo@kanban.com / password123
echo.
echo 📝 Features: 
echo   ✅ No automatic page reloads
echo   ✅ Profile dashboard after login
echo   ✅ Jira-style project creation
echo   ✅ Smooth SPA navigation
echo.
pause
