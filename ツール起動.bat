@echo off
cd /d "%~dp0"
title Lotto-Numbers Visualization Tool

echo ======================================================
echo  Lotto-Numbers Visualization Tool
echo ======================================================
echo.

if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo Starting dev server...
call npm run dev

pause
