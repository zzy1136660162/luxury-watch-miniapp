#!/bin/bash

# ============================================
# 奢侈品腕表小程序后端服务管理脚本
# ============================================

# 配置参数
APP_NAME="luxury-watch-backend"
APP_PORT=8081
APP_USER="root"
JAR_DIR="/data/luxury-watch-miniapp/jar"
IMAGE_DIR="/data/luxury-watch-miniapp/image"
LOG_DIR="${JAR_DIR}/logs"
JAR_FILE=""
BACKUP_DIR="${JAR_DIR}/backup"
PID_FILE="${JAR_DIR}/app.pid"
PROFILE="prod"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Java环境
check_java() {
    if ! command -v java &> /dev/null; then
        log_error "未检测到 Java 环境，请先安装 JDK 8 或更高版本"
        log_info "安装命令: apt update && apt install openjdk-17-jdk -y"
        exit 1
    fi
    java -version
}

# 创建目录
create_dirs() {
    log_info "创建目录..."
    mkdir -p ${JAR_DIR}
    mkdir -p ${IMAGE_DIR}
    mkdir -p ${LOG_DIR}
    mkdir -p ${BACKUP_DIR}
    log_info "目录创建完成"
}

# 查找JAR文件
find_jar() {
    if [ -f "${JAR_DIR}/${APP_NAME}.jar" ]; then
        JAR_FILE="${JAR_DIR}/${APP_NAME}.jar"
    else
        JAR_FILE=$(find ${JAR_DIR} -name "*.jar" -not -name "*-sources.jar" 2>/dev/null | head -1)
    fi
    
    if [ -z "$JAR_FILE" ] || [ ! -f "$JAR_FILE" ]; then
        log_error "未找到 JAR 文件，请将 JAR 包放入 ${JAR_DIR} 目录"
        log_info "然后运行: ./deploy.sh start"
        exit 1
    fi
    log_info "找到 JAR 文件: $JAR_FILE"
}

# 获取进程ID
get_pid() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo $PID
            return 0
        fi
    fi
    # 备用方案：通过端口查找
    PID=$(lsof -ti:${APP_PORT} 2>/dev/null)
    if [ -n "$PID" ]; then
        echo $PID
        return 0
    fi
    return 1
}

# 检查服务是否运行
is_running() {
    if get_pid > /dev/null 2>&1; then
        return 0
    fi
    return 1
}

# 启动服务
start_service() {
    if is_running; then
        PID=$(get_pid)
        log_warn "服务已在运行，PID: $PID"
        return
    fi
    
    find_jar
    
    log_info "启动服务..."
    
    cd ${JAR_DIR}
    
    # 使用 nohup 后台运行
    nohup java -jar ${JAR_FILE} \
        --spring.profiles.active=${PROFILE} \
        > ${LOG_DIR}/console.log 2>&1 &
    
    APP_PID=$!
    echo $APP_PID > ${PID_FILE}
    
    sleep 3
    
    if is_running; then
        PID=$(get_pid)
        log_info "服务启动成功！"
        log_info "服务地址: http://localhost:${APP_PORT}"
        log_info "PID: $PID"
        log_info "日志文件: ${LOG_DIR}/console.log"
    else
        log_error "服务启动失败，请检查日志: ${LOG_DIR}/console.log"
        exit 1
    fi
}

# 停止服务
stop_service() {
    if ! is_running; then
        log_warn "服务未运行"
        rm -f ${PID_FILE}
        return
    fi
    
    PID=$(get_pid)
    log_info "停止服务，PID: $PID..."
    
    kill $PID
    
    # 等待进程结束
    for i in {1..10}; do
        if ! is_running; then
            log_info "服务已停止"
            rm -f ${PID_FILE}
            return
        fi
        sleep 1
    done
    
    # 强制终止
    log_warn "服务未响应，强制终止..."
    kill -9 $PID 2>/dev/null
    rm -f ${PID_FILE}
    log_info "服务已强制停止"
}

# 重启服务（不更新JAR）
restart_service() {
    log_info "重启服务..."
    stop_service
    sleep 2
    start_service
}

# 重新部署（JAR包已手动上传）
redeploy_service() {
    if is_running; then
        log_info "停止旧服务..."
        stop_service
        sleep 2
    fi
    
    # 备份旧版本
    if [ -f "${JAR_DIR}/${APP_NAME}.jar" ]; then
        BACKUP_FILE="${BACKUP_DIR}/${APP_NAME}_$(date +%Y%m%d_%H%M%S).jar"
        log_info "备份旧版本: $BACKUP_FILE"
        cp "${JAR_DIR}/${APP_NAME}.jar" "$BACKUP_FILE"
    fi
    
    # 查找新JAR
    find_jar
    
    # 复制到标准名称
    log_info "部署新版本: $JAR_FILE"
    if [ "$JAR_FILE" != "${JAR_DIR}/${APP_NAME}.jar" ]; then
        cp "$JAR_FILE" "${JAR_DIR}/${APP_NAME}.jar"
        JAR_FILE="${JAR_DIR}/${APP_NAME}.jar"
    fi
    
    sleep 2
    
    log_info "启动新服务..."
    start_service
}

# 查看状态
status_service() {
    if is_running; then
        PID=$(get_pid)
        log_info "服务运行中"
        log_info "PID: $PID"
        log_info "端口: ${APP_PORT}"
        log_info "JAR: $(readlink -f ${JAR_FILE} 2>/dev/null || echo '未找到')"
        log_info "配置文件: ${PROFILE}"
    else
        log_warn "服务未运行"
        log_info "提示: ./deploy.sh start"
    fi
}

# 查看日志
logs_service() {
    if [ -f "${LOG_DIR}/console.log" ]; then
        tail -n 100 ${LOG_DIR}/console.log
    else
        log_warn "日志文件不存在: ${LOG_DIR}/console.log"
    fi
}

# 实时查看日志
logs_follow() {
    if [ -f "${LOG_DIR}/console.log" ]; then
        tail -f ${LOG_DIR}/console.log
    else
        log_error "日志文件不存在: ${LOG_DIR}/console.log"
    fi
}

# 查看备份
list_backup() {
    if [ -d "${BACKUP_DIR}" ]; then
        log_info "备份文件列表:"
        ls -lh ${BACKUP_DIR}/
    else
        log_warn "暂无备份文件"
    fi
}

# 初始化目录
init() {
    log_info "初始化部署环境..."
    check_java
    create_dirs
    log_info "初始化完成！"
    log_info ""
    log_info "请将 JAR 文件放入: ${JAR_DIR}"
    log_info "图片存储目录: ${IMAGE_DIR}"
    log_info "日志目录: ${LOG_DIR}"
    log_info "备份目录: ${BACKUP_DIR}"
    log_info ""
    log_info "部署 JAR 后运行: ./deploy.sh start"
}

# 帮助信息
show_help() {
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${CYAN}  奢侈品腕表小程序后端服务管理脚本${NC}"
    echo -e "${CYAN}==========================================${NC}"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo -e "${GREEN}命令:${NC}"
    echo "  init      - 初始化部署环境（首次使用）"
    echo "  start     - 启动服务"
    echo "  stop      - 停止服务"
    echo "  restart   - 重启服务（不更新JAR）"
    echo "  redeploy  - 重新部署（上传新JAR后使用）"
    echo "  status    - 查看服务状态"
    echo "  logs      - 查看日志（最近100行）"
    echo "  tail      - 实时查看日志"
    echo "  backup    - 查看备份列表"
    echo "  help      - 显示帮助信息"
    echo ""
    echo -e "${YELLOW}部署步骤:${NC}"
    echo "  1. 将 JAR 文件放入: ${JAR_DIR}"
    echo "  2. 运行: ./deploy.sh redeploy"
    echo ""
    echo -e "${YELLOW}常用命令:${NC}"
    echo "  ./deploy.sh start     - 启动服务"
    echo "  ./deploy.sh stop      - 停止服务"
    echo "  ./deploy.sh restart   - 重启服务"
    echo "  ./deploy.sh redeploy  - 重新部署"
    echo "  ./deploy.sh status    - 查看状态"
    echo "  ./deploy.sh logs      - 查看日志"
    echo ""
}

# 主菜单
case "$1" in
    init)
        init
        ;;
    start)
        start_service
        ;;
    stop)
        stop_service
        ;;
    restart)
        restart_service
        ;;
    redeploy)
        redeploy_service
        ;;
    status)
        status_service
        ;;
    logs)
        logs_service
        ;;
    tail)
        logs_follow
        ;;
    backup)
        list_backup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        if [ -z "$1" ]; then
            show_help
        else
            log_error "未知命令: $1"
        fi
        show_help
        exit 1
        ;;
esac
