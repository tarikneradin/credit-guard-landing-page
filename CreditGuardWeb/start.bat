@echo off
REM CreditGuard Landing Page - Start Script for Windows
REM This script starts a local web server to view the landing page

echo.
echo 🚀 Starting CreditGuard Landing Page...
echo.

REM Change to script directory
cd /d %~dp0

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python detected - Starting server on port 8000...
    echo.
    echo 📱 Open your browser and visit:
    echo    http://localhost:8000/creditguard_landing_page.html
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
    goto :end
)

REM Check if PHP is available
php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PHP detected - Starting server on port 8000...
    echo.
    echo 📱 Open your browser and visit:
    echo    http://localhost:8000/creditguard_landing_page.html
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    php -S localhost:8000
    goto :end
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js detected - Starting server on port 8000...
    echo.
    npx http-server -p 8000 -o creditguard_landing_page.html
    goto :end
)

REM No suitable server found
echo ❌ Error: No suitable web server found!
echo.
echo Please install one of the following:
echo   - Python: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo   - PHP: https://www.php.net/downloads
echo.
echo Or manually open 'creditguard_landing_page.html' in your browser.
pause

:end
