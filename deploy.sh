#!/bin/bash

# 加载环境变量
source .env

# 构建前端项目
echo "开始构建前端项目..."
npm run build

# 压缩dist和server目录
echo "压缩项目文件..."
tar -czf deploy.tar.gz dist/ server/ package.json

# 上传到服务器
echo "上传文件到服务器..."
scp deploy.tar.gz .env root@${SERVER_IP}:${DEPLOY_PATH}

# 在服务器上执行部署
echo "开始部署..."
ssh root@${SERVER_IP} << ENDSSH
cd ${DEPLOY_PATH}
# 使用 Node.js 14
source ~/.nvm/nvm.sh
nvm use 14
# 备份当前版本
mv dist dist_backup_$(date +%Y%m%d_%H%M%S)
# 解压新版本
tar -xzf deploy.tar.gz
# 安装依赖
npm install --production
# 重启后端服务
pm2 restart prompt-server || pm2 start server/index.js --name prompt-server
# 删除压缩包
rm deploy.tar.gz
# 重启 Nginx
nginx -s reload
echo "部署完成"
ENDSSH

# 清理本地文件
echo "清理本地文件..."
rm -f deploy.tar.gz

echo "全部完成"