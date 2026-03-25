@echo off
echo 🚀 Starting SPA-FIXED MERN Application (No Page Reloads)...
echo.

echo 📊 Starting Backend Server (MongoDB + Express)...
start "Backend SPA" cmd /k "cd /d d:\protool\backend && node server-mern.js"

echo 🎨 Starting Frontend Server (React Router + Vite - No Reloads)...
timeout /t 2 /nobreak >nul
start "Frontend SPA" cmd /k "cd /d d:\protool\frontend && npm run dev"

echo.
echo ✅ SPA-FIXED MERN servers starting...
echo 📱 Frontend: http://localhost:5173
echo 🔗 Backend: http://localhost:5000
echo 🗄️ Database: MongoDB
echo 🔒 Authentication: JWT + CORS Enabled
echo 🚫 Page Reloads: COMPLETELY FIXED
echo 🛣️ Navigation: React Router SPA
echo.
echo 🎯 Open http://localhost:5173 in your browser!
echo 👤 Demo: demo@kanban.com / password123
echo.
echo 📝 Features: 
echo   ✅ ZERO page reloads
echo   ✅ React Router navigation
echo   ✅ Centralized AuthContext
echo   ✅ Protected routes
echo   ✅ Smooth SPA transitions
echo   ✅ State preserved across routes
echo.
pause
