@echo off
set ROOT=D:\JubuddyAssetFactory\Video Demo
set HERE=%~dp0
mkdir "%ROOT%\00-masters"
mkdir "%ROOT%\01-modes"
mkdir "%ROOT%\02-hud-tools"
mkdir "%ROOT%\03-hero-pet"
mkdir "%ROOT%\04-depths-build"
mkdir "%ROOT%\05-flows"
mkdir "%ROOT%\06-highlights"
if not exist "%ROOT%\00-masters\long-take-marks.txt" copy /Y "%HERE%long-take-marks.txt" "%ROOT%\00-masters\long-take-marks.txt" >nul
if not exist "%ROOT%\00-masters\slice-ffmpeg-template.txt" copy /Y "%HERE%slice-ffmpeg-template.txt" "%ROOT%\00-masters\slice-ffmpeg-template.txt" >nul
echo Created "%ROOT%"
explorer "%ROOT%\00-masters"
notepad "%ROOT%\00-masters\long-take-marks.txt"
