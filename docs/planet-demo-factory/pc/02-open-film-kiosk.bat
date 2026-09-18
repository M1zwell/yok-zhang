@echo off
REM Needs: bun run dev  (or npm run dev) in this repo first.
REM 先在仓库里 bun run dev，再双击。
start chrome --kiosk --autoplay-policy=no-user-gesture-required "http://localhost:3100/film"
if errorlevel 1 start msedge --kiosk "http://localhost:3100/film"
