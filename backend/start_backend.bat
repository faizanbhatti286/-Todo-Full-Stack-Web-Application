@echo off
REM Start Todo Backend on Port 8080

cd /d "%~dp0"

echo Starting Todo Backend on port 8080...
echo Press Ctrl+C to stop
echo.

python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8080
