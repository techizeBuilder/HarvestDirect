@echo off
set NODE_ENV=development
set NODE_OPTIONS=--import tsx/esm
npx tsx server/index.ts