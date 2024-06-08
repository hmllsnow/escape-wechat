@echo off
:START_LOOP
node demo.js
timeout /t 20
goto START_LOOP