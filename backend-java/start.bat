@echo off
chcp 65001 >nul
echo ========================================
echo   奢侈品腕表小程序后端服务启动脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] 检查 Java 环境...
java -version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Java 环境，请先安装 JDK 8 或更高版本
    pause
    exit /b 1
)
echo [OK] Java 环境检查通过

echo.
echo [2/4] 检查 Maven 环境...
mvn -version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Maven 环境，请先安装 Maven
    pause
    exit /b 1
)
echo [OK] Maven 环境检查通过

echo.
echo [3/4] 检查图片存储目录...
if not exist "/data/projects/luxury-watch-miniapp/image" (
    echo [警告] 目录 /data/projects/luxury-watch-miniapp/image 不存在，正在创建...
    mkdir "/data/projects/luxury-watch-miniapp/image" 2>nul
)
echo [OK] 图片存储目录检查通过

echo.
echo [4/4] 编译并启动后端服务...
echo.
echo 启动参数：
echo   - 服务端口: 8081
echo   - 数据库: luxury-watch-db@167.88.180.246:63306
echo   - 图片上传目录: /data/projects/luxury-watch-miniapp
echo   - 运行环境: 生产环境 (application-prod.yml)
echo.

echo 按 Ctrl+C 可以停止服务
echo ========================================
echo.

mvn spring-boot:run -Dspring-boot.run.profiles=prod
