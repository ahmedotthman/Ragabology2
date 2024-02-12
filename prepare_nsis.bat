@echo off
setlocal

rem Define the actual paths relative to this script location
set BUILD_DIR=%~dp0dist
set RESOURCES_DIR=%~dp0build

rem Replace placeholders in the NSIS script
powershell -Command "(Get-Content installer.nsi) -replace '!define BUILD_DIR .*', '!define BUILD_DIR \"%BUILD_DIR%\"' -replace '!define RESOURCES_DIR .*', '!define RESOURCES_DIR \"%RESOURCES_DIR%\"' | Set-Content installer_prepared.nsi"

endlocal
