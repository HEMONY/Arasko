@echo off
chcp 65001 >nul
echo ===================================================
echo     ARASKO - Automated Android APK Builder
echo ===================================================
echo.

echo [1/4] Building web application assets...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error during build! Exiting...
    pause
    exit /b 1
)

echo.
echo [2/4] Syncing Capacitor Android project...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo Installing Capacitor Android...
    call npm install @capacitor/core @capacitor/cli @capacitor/android
    call npx cap add android
    call npx cap sync android
)

echo.
echo [3/4] Building Android APK via Gradle...
cd android
set GRADLE_OPTS=-Dhttp.socketTimeout=120000 -Dhttp.connectionTimeout=120000
call gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo  SUCCESS! APK generated successfully!
    echo ===================================================
    echo.
    echo APK Location:
    echo %CD%\app\build\outputs\apk\debug\app-debug.apk
    echo.
    copy app\build\outputs\apk\debug\app-debug.apk ..\Arasko.apk >nul
    echo A copy was placed in the root folder as: Arasko.apk
    echo.
    explorer.exe /select,..\Arasko.apk
) else (
    echo.
    echo Gradle build encountered an issue. Please make sure Java (JDK 17 or higher) is installed.
)

cd ..
pause
