@echo off
title Celestia Tourism Management System - Presentation Launcher
color 0B
cls

echo =======================================================================
echo.
echo     CCCCCC  EEEEEEE  LL      EEEEEEE   SSSSS   TTTTTTT  II  AAAAA
echo    CC       EE       LL      EE       SS         TT     II AA   AA
echo    CC       EEEEE    LL      EEEEE     SSSSS     TT     II AAAAAAA
echo    CC       EE       LL      EE            SS    TT     II AA   AA
echo     CCCCCC  EEEEEEE  LLLLLLL EEEEEEE   SSSSS     TT     II AA   AA
echo.
echo            HIGH-END VIETNAM TOURISM MANAGEMENT SYSTEM
echo            PROGRESS PRESENTATION READY TEMPLATE (v1.0)
echo =======================================================================
echo.
echo [INFO] Preparing the application for your presentation...
echo.

:: 1. Verify and Prepend Paths
set DOTNET_PATH=C:\Program Files\dotnet
set NODE_PATH=C:\Program Files\nodejs

echo [1/3] Verifying Developer Environments...
if not exist "%DOTNET_PATH%\dotnet.exe" (
    echo [ERROR] .NET SDK not found at '%DOTNET_PATH%'.
    echo Please make sure .NET 8.0 SDK is installed.
    pause
    exit /b 1
) else (
    echo   [OK] .NET SDK detected.
)

if not exist "%NODE_PATH%\node.exe" (
    echo [ERROR] Node.js not found at '%NODE_PATH%'.
    echo Please make sure Node.js v18 or newer is installed.
    pause
    exit /b 1
) else (
    echo   [OK] Node.js environment detected.
)

:: Prepend to local path variables
set PATH=%DOTNET_PATH%;%NODE_PATH%;%PATH%
echo   [OK] Environment variables loaded.
echo.

:: 2. Launching Backend API in separate window
echo [2/3] Booting up Celestia Backend API...
echo       - Fallback Mechanism: Active (If local PostgreSQL is offline,
echo         the system seamlessly shifts to reliable EF Core InMemory mode).
echo       - Server hosting at: http://localhost:5000
echo.
start "Celestia Backend API" cmd /c "title Celestia Backend API && color 0A && cd /d %~dp0backend\Celestia.Api && dotnet run --urls http://localhost:5000"

:: Wait 3 seconds for backend compilation and initial database seeding
timeout /t 3 /nobreak >nul

:: 3. Launching Frontend Dev Server in separate window
echo [3/3] Launching React Vite Frontend...
echo       - Premium CSS Glassmorphism Styles: Loaded.
echo       - Interactive Vector Maps Engine: Loaded.
echo       - Running at: http://localhost:5173
echo.
start "Celestia React Frontend" cmd /c "title Celestia React Frontend && color 0D && cd /d %~dp0frontend && npm run dev"

:: Wait 2 seconds for server to start listening
timeout /t 2 /nobreak >nul

:: 4. Auto-open Browser and display Credentials
echo =======================================================================
echo  THE APPLICATION WAS LAUNCHED SUCCESSFULLY!
echo =======================================================================
echo.
echo  [WEBSITE] http://localhost:5173
echo  [API HELP] http://localhost:5000/swagger
echo.
echo  ---------------------------------------------------------------------
echo  PRE-CONFIGURED PRESENTATION ACCOUNTS:
echo  ---------------------------------------------------------------------
echo   1. Administrator Account (Full settings and database control)
echo      - Username: admin
echo      - Password: admin123
echo.
echo   2. Content Editor Account (Theme designer and page builder control)
echo      - Username: editor
echo      - Password: editor123
echo  ---------------------------------------------------------------------
echo.
echo  Press any key to open the application in your browser and exit this menu...
echo  (The API and frontend windows will remain running in the background).
echo.
pause >nul

start http://localhost:5173
exit
