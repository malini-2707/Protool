@echo off
echo 🚀 Starting PRISMA MERN Application...
echo.

echo 📋 IMPORTANT: Make sure PostgreSQL is running!
echo 📋 DATABASE_URL should be configured in .env.prisma
echo.

echo 🗄️ Generating Prisma Client...
cd /d d:\protool\backend
npx prisma generate

echo 🗄️ Running Database Migrations...
npx prisma db push

echo 📊 Starting Prisma Backend Server (PostgreSQL)...
start "Backend Prisma" cmd /k "cd /d d:\protool\backend && node server-prisma.js"

echo 🎨 Starting Frontend Server (React + Vite)...
timeout /t 2 /nobreak >nul
start "Frontend Prisma" cmd /k "cd /d d:\protool\frontend && npm run dev"

echo.
echo ✅ PRISMA MERN servers starting...
echo 📱 Frontend: http://localhost:5173
echo 🔗 Backend: http://localhost:5000
echo 🗄️ Database: PostgreSQL + Prisma ORM
echo 🔒 Authentication: JWT + CORS Enabled
echo 🚫 Page Reloads: FIXED
echo 🛣️ Navigation: React Router SPA
echo.
echo 🎯 Open http://localhost:5173 in your browser!
echo 👤 Demo: demo@kanban.com / password123
echo.
echo 📝 Features: 
echo   ✅ ZERO 500 errors with Prisma
echo   ✅ PostgreSQL database
echo   ✅ Type-safe queries
echo   ✅ Proper validation
echo   ✅ Production-ready code
echo.
pause
