@echo off
REM ============================================================================
REM  AI-Powered NIDS React Frontend - Installation Script
REM ============================================================================

echo.
echo ============================================================================
echo   AI-Powered NIDS - React/TypeScript Frontend
echo   Installation Script
echo ============================================================================
echo.

REM Check Node.js
echo [1/4] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% found
echo.

REM Check npm
echo [2/4] Checking npm...
where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm not found!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% found
echo.

REM Install dependencies
echo [3/4] Installing dependencies...
echo This may take a few minutes...
echo.

call npm install

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to install dependencies!
    echo.
    echo Please check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo [OK] Dependencies installed successfully
echo.

REM Create .env file if it doesn't exist
echo [4/4] Setting up environment...
if not exist ".env" (
    echo VITE_API_URL=http://localhost:8000 > .env
    echo [OK] Created .env file
) else (
    echo [OK] .env file already exists
)
echo.

REM Installation complete
echo ============================================================================
echo   Installation Complete!
echo ============================================================================
echo.
echo [SUCCESS] React frontend is ready to use!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo Or double-click: START_DEV.bat
echo.
echo Access URL: http://localhost:3000
echo Backend API: http://localhost:8000 (must be running)
echo.
echo Default Login:
echo   Username: admin
echo   Password: Admin@1234
echo.
echo ============================================================================
echo.

pause
