@echo off
REM ============================================================================
REM  AI-Powered NIDS React Frontend - Development Server Launcher
REM ============================================================================

echo.
echo ============================================================================
echo   AI-Powered NIDS - React Frontend
echo   Development Server
echo ============================================================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [ERROR] Dependencies not installed!
    echo.
    echo Please run INSTALL.bat first or run: npm install
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting development server...
echo.
echo ============================================================================
echo   Server Starting...
echo ============================================================================
echo.
echo   Frontend URL: http://localhost:3000
echo   Backend API: http://localhost:8000 (must be running separately)
echo.
echo   Login Credentials:
echo   ------------------
echo   Username: admin
echo   Password: Admin@1234
echo.
echo   Press Ctrl+C to stop the server
echo.
echo ============================================================================
echo.

npm run dev

pause
