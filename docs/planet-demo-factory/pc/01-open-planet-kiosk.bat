@echo off
REM Fullscreen planet. Alt+F4 to quit.
REM 全屏 planet。Alt+F4 退出。
start chrome --kiosk --autoplay-policy=no-user-gesture-required "https://jubuddy.com/planet"
if errorlevel 1 start msedge --kiosk "https://jubuddy.com/planet"
