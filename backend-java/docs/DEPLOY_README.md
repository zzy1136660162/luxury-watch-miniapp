# Linux 服务器部署指南

## 前置准备

### 1. 服务器环境要求
- Linux 系统 (Ubuntu/CentOS/Debian)
- JDK 8 或更高版本
- Maven 3.6+
- MySQL 5.7+ (已运行)
- 建议 2GB+ 内存

### 2. 安装 Java 和 Maven

```bash
# Ubuntu/Debian
apt update
apt install openjdk-17-jdk maven -y

# CentOS
yum install java-17-openjdk maven -y
```

## 部署步骤

### 方法一：使用部署脚本（推荐）

#### 1. 上传项目到服务器
```bash
# 在本地项目根目录打包
cd c:\Users\许嘉琦\Desktop\高端名表企业小程序\luxury-watch-miniapp\backend-java

# 或在服务器上克隆
git clone <你的仓库地址>
```

#### 2. 上传部署脚本并添加执行权限
```bash
# 上传 deploy.sh 到服务器后执行
chmod +x deploy.sh
```

#### 3. 修改 application.yml 配置
在部署前，修改服务器上的配置文件：

```yaml
# application.yml 或 application-prod.yml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:mysql://101.126.90.255:63306/luxury-watch-db
    username: root
    password: Gesoft9919.
  servlet:
    multipart:
      max-file-size: 500MB
      max-request-size: 500MB

# 图片上传配置
upload:
  image-path: /data/projects/luxury-watch-miniapp
  base-url: /images

# Sa-Token 配置
sa-token:
  token-name: Authorization
  timeout: 2592000
  active-timeout: -1
  is-concurrent: true
  is-share: false
  token-style: uuid
```

#### 4. 运行部署脚本
```bash
# 完整部署（打包+启动）
sudo ./deploy.sh build

# 仅启动服务
sudo ./deploy.sh start

# 重启服务
sudo ./deploy.sh restart

# 查看状态
sudo ./deploy.sh status

# 查看日志
sudo ./deploy.sh logs
```

### 方法二：手动部署

#### 1. 打包项目
```bash
cd /root/luxury-watch-miniapp/backend-java
mvn clean package -DskipTests
```

#### 2. 创建目录
```bash
mkdir -p /opt/luxury-watch
mkdir -p /data/projects/luxury-watch-miniapp
mkdir -p /var/log/luxury-watch
```

#### 3. 复制 JAR 文件
```bash
cp target/*.jar /opt/luxury-watch/luxury-watch-backend.jar
```

#### 4. 创建 systemd 服务文件
```bash
cat > /etc/systemd/system/luxury-watch.service << EOF
[Unit]
Description=奢侈品腕表小程序后端服务
After=network.target mysql.service

[Service]
Type=simple
User=root
ExecStart=/usr/bin/java -jar /opt/luxury-watch/luxury-watch-backend.jar
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/luxury-watch/console.log
StandardError=append:/var/log/luxury-watch/error.log

[Install]
WantedBy=multi-user.target
EOF
```

#### 5. 启动服务
```bash
systemctl daemon-reload
systemctl enable luxury-watch
systemctl start luxury-watch
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `systemctl start luxury-watch` | 启动服务 |
| `systemctl stop luxury-watch` | 停止服务 |
| `systemctl restart luxury-watch` | 重启服务 |
| `systemctl status luxury-watch` | 查看状态 |
| `systemctl enable luxury-watch` | 开机自启 |
| `journalctl -u luxury-watch -f` | 实时查看日志 |

## 配置图片上传路径

服务器上需要确保目录存在并有权限：

```bash
# 创建目录
mkdir -p /data/projects/luxury-watch-miniapp

# 设置权限
chmod 755 /data/projects/luxury-watch-miniapp
chown root:root /data/projects/luxury-watch-miniapp
```

## 防火墙配置

如果服务器有防火墙，需要开放 8081 端口：

```bash
# Ubuntu/Debian (ufw)
ufw allow 8081/tcp

# CentOS (firewalld)
firewall-cmd --permanent --add-port=8081/tcp
firewall-cmd --reload
```

## 验证部署

```bash
# 检查服务状态
sudo systemctl status luxury-watch

# 测试接口
curl http://localhost:8081/api/product/brands

# 检查日志
sudo journalctl -u luxury-watch -n 50
```

## 常见问题

### 1. 服务启动失败
```bash
# 查看错误日志
cat /var/log/luxury-watch/error.log
journalctl -u luxury-watch -n 100
```

### 2. 数据库连接失败
- 检查 MySQL 是否运行
- 验证数据库账号密码
- 检查数据库是否存在

### 3. 图片上传失败
- 检查 /data/projects/luxury-watch-miniapp 目录是否存在
- 检查目录权限

### 4. 端口被占用
```bash
# 查看端口占用
netstat -tlnp | grep 8081

# 修改端口
# 在 application.yml 中修改 server.port
```
