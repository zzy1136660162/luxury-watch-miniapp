#!/bin/bash
# ========================================
#   奢侈品腕表小程序后端服务启动脚本
# ========================================

# 切换到脚本所在目录
cd "$(dirname "$0")"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   奢侈品腕表小程序后端服务启动脚本${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# [1/3] 检查 Java 环境
echo -e "[1/3] 检查 Java 环境..."
if ! command -v java &> /dev/null; then
    echo -e "${RED}[错误] 未检测到 Java 环境，请先安装 JDK 8 或更高版本${NC}"
    exit 1
fi
JAVA_VERSION=$(java -version 2>&1 | head -n 1)
echo -e "${GREEN}[OK]${NC} Java 环境检查通过 - $JAVA_VERSION"

# [2/3] 检查图片存储目录
echo ""
echo -e "[2/3] 检查图片存储目录..."
IMAGE_DIR="/data/projects/luxury-watch-miniapp/image"
if [ ! -d "$IMAGE_DIR" ]; then
    echo -e "${YELLOW}[警告] 目录 $IMAGE_DIR 不存在，正在创建...${NC}"
    sudo mkdir -p "$IMAGE_DIR"
    sudo chmod 777 "$IMAGE_DIR"
fi
echo -e "${GREEN}[OK]${NC} 图片存储目录检查通过 - $IMAGE_DIR"

# [3/3] 查找并启动 jar 文件
echo ""
echo -e "[3/3] 启动后端服务..."

# 查找 jar 文件
JAR_FILE=$(ls *.jar 2>/dev/null | head -n 1)

if [ -z "$JAR_FILE" ]; then
    echo -e "${RED}[错误] 未找到 jar 文件${NC}"
    exit 1
fi

echo ""
echo -e "启动参数："
echo -e "  ${GREEN}-${NC} 服务端口: ${YELLOW}8081${NC}"
echo -e "  ${GREEN}-${NC} 数据库: ${YELLOW}luxury-watch-db@167.88.180.246:63306${NC}"
echo -e "  ${GREEN}-${NC} 图片上传目录: ${YELLOW}$IMAGE_DIR${NC}"
echo -e "  ${GREEN}-${NC} 运行环境: ${YELLOW}生产环境 (application-prod.yml)${NC}"
echo -e "  ${GREEN}-${NC} JAR文件: ${YELLOW}$JAR_FILE${NC}"
echo ""

echo -e "${YELLOW}按 Ctrl+C 可以停止服务${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# 使用生产环境配置启动 jar 文件
java -jar "$JAR_FILE" --spring.profiles.active=prod
