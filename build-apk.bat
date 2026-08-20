@echo off
chcp 65001 >nul
echo ===================================================
echo     ARASKO - Automated Android APK Builder
echo ===================================================
echo.

:: Auto-detect and set Java 17/21/22 if installed
if exist "C:\Program Files\Java\jdk-17" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-17"
    set "PATH=C:\Program Files\Java\jdk-17\bin;%PATH%"
) else if exist "C:\Program Files\Java\jdk-21" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21"
    set "PATH=C:\Program Files\Java\jdk-21\bin;%PATH%"
) else if exist "C:\Program Files\Java\jdk-22" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-22"
    set "PATH=C:\Program Files\Java\jdk-22\bin;%PATH%"
) else if exist "C:\Program Files\Android\Android Studio\jbr" (
    set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
    set "PATH=C:\Program Files\Android\Android Studio\jbr\bin;%PATH%"
)

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
echo [3/4] Building Android APK via Gradle (Using Java 17+)...
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
    echo Gradle build encountered an issue.
)

cd ..
pause
