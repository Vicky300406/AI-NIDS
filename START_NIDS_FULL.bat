@echo off
REM ============================================================================
REM  AI-Powered NIDS - Full Stack Launcher
REM  Starts both Frontend (React) and Backend (FastAPI)
REM ============================================================================

echo.
echo ============================================================================
echo   AI-Powered Network Intrusion Detection System
echo   Full Stack Launcher
echo ============================================================================
echo.

REM Check Node.js
echo [1/4] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found! Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found
echo.

REM Check Python
echo [2/4] Checking Python...
where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found! Please install Python 3.10+
    pause
    exit /b 1
)
echo [OK] Python found
echo.

REM Check Frontend Dependencies
echo [3/4] Checking frontend dependencies...
if not exist "nids-react\node_modules" (
    echo [INFO] Frontend dependencies not installed.
    echo [INFO] Running: npm install
    cd nids-react
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies!
        pause
        exit /b 1
    )
    cd ..
)
echo [OK] Frontend dependencies ready
echo.

REM Check Backend Dependencies
echo [4/4] Checking backend dependencies...
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo [INFO] Backend dependencies not fully installed.
    echo [INFO] Installing backend requirements...
    cd sentinelx\backend
    python -m pip install -r requirements.txt
    cd ..\..
)
echo [OK] Backend dependencies ready
echo.

echo ============================================================================
echo   Starting Services...
echo ============================================================================
echo.
echo [INFO] Starting Backend API on port 8001...
echo [INFO] Starting Frontend Dev Server on port 3000...
echo.
echo ============================================================================
echo   Access Information
echo ============================================================================
echo.
echo   Frontend URL: http://localhost:3000
echo   Backend API:  http://localhost:8001
echo   API Docs:     http://localhost:8001/docs
echo.
echo   Login Credentials:
echo   ------------------
echo   Username: admin
echo   Password: Admin@1234
echo.
echo   Press Ctrl+C in any window to stop
echo.
echo ============================================================================
echo.

REM Start Backend in new window
start "NIDS Backend API" cmd /k "cd sentinelx\backend && python -m uvicorn app.main:app --reload --port 8001"

REM Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

REM Start Frontend in new window
start "NIDS Frontend" cmd /k "cd nids-react && npm run dev"

echo.
echo [SUCCESS] Both services started!
echo.
echo Check the new windows for logs.
echo Close those windows to stop the services.
echo.

pause
