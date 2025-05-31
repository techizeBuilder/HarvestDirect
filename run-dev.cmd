@echo off
echo Starting Harvest Direct development server...

:: Set environment variables
set NODE_ENV=development
set NODE_OPTIONS=--experimental-loader tsx/esm

:: Check Node.js version
node --version
echo.

:: Try running with tsx first
echo Attempting to start with tsx...
npx tsx server/index.ts

:: If that fails, try with node directly
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo tsx failed, trying with node --loader...
    set NODE_OPTIONS=--loader tsx/esm
    node --loader tsx/esm server/index.ts
)

:: If that also fails, try alternative approach
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Standard approaches failed, trying alternative...
    node --import tsx/esm server/index.ts
)

pause