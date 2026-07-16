@echo off
echo ===================================================
echo        KHOI DONG HE THONG CELESTIA (1 CLICK)
echo ===================================================

echo [1/4] Dang kiem tra va cai dat thu vien Frontend (npm install)...
cd /d %~dp0Templates
call npm install
cd /d %~dp0

echo [2/4] Dang cap nhat Database (Co the mat vai giay)...
dotnet ef database update

echo [3/4] Dang khoi dong Backend (.NET 8)...
start "Celestia Backend" cmd /k "title Celestia Backend && cd /d %~dp0 && dotnet run"

echo [4/4] Dang khoi dong Frontend (React Vite)...
start "Celestia Frontend" cmd /k "title Celestia Frontend && cd /d %~dp0Templates && npm run dev"

echo.
echo Hoan tat! Hai cua so Server da duoc mo.
echo Trang web se chay tai: http://localhost:5173
echo.
pause
