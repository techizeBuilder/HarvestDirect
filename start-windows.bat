@echo off
title Harvest Direct Development Server

echo Checking Node.js installation...
node --version
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Setting up environment...
set NODE_ENV=development

echo Starting development server...
echo.

REM Try method 1: Direct tsx execution
npx tsx server/index.ts
if %ERRORLEVEL% EQU 0 goto :success

echo.
echo Method 1 failed, trying method 2...
set NODE_OPTIONS=--import tsx/esm
node server/index.ts
if %ERRORLEVEL% EQU 0 goto :success

echo.
echo Method 2 failed, trying method 3...
node --import tsx/esm server/index.ts
if %ERRORLEVEL% EQU 0 goto :success

echo.
echo Method 3 failed, trying method 4...
node start.js
if %ERRORLEVEL% EQU 0 goto :success

echo.
echo All methods failed. Please check:
echo 1. Node.js version (should be 18+ or 20+)
echo 2. Run: npm install
echo 3. Check if tsx is installed: npx tsx --version
pause
exit /b 1

:success
echo.
echo Server started successfully!
pause