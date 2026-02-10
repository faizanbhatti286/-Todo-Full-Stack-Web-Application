@echo off
REM Restart Frontend to Pick Up Environment Variables

echo Restarting frontend...
cd /d "%~dp0"

echo Starting Next.js development server...
npm run dev
