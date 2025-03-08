# Prompt实验室

一个用于展示、测试和优化AI Prompt的在线工具平台。通过该平台，用户可以实时测试提示词效果，查看优秀的Prompt示例，并获取提示词编写建议。

## 功能特点

- 🔍 **Prompt测试器**：实时测试和调整Prompt，支持参数调整
- 📚 **Prompt库**：收录优质Prompt示例，按场景分类展示
- 🛠 **提示词优化**：智能分析提示词质量，提供优化建议
- 📝 **编写指南**：提供详细的Prompt编写技巧和最佳实践

## 技术栈

- 前端：React + Vite + TailwindCSS
- 后端：Express.js
- API：Deepseek Chat API
- 其他：Marked.js (Markdown渲染)，Highlight.js (代码高亮)

## 本地开发

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装步骤

1. 克隆项目
```bash
git clone <项目地址>
cd prompt-libary
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
- 在项目根目录创建 `.env` 文件
- 添加以下配置：
```env
DEEPSEEK_API_KEY=your_api_key_here
```

4. 启动开发服务器
```bash
npm run dev:all  # 同时启动前端和后端服务
```

现在可以访问 http://localhost:5173 查看应用

## 部署指南

### 前端部署

1. 构建生产版本
```bash
npm run build
```

2. 部署 `dist` 目录到你的Web服务器

### 后端部署

1. 确保服务器已安装 Node.js 环境

2. 配置环境变量
```bash
export DEEPSEEK_API_KEY=your_api_key_here
```

3. 启动服务
```bash
node server/index.js
```

建议使用 PM2 等进程管理工具来运行后端服务：
```bash
pm2 start server/index.js --name prompt-lab-api
```

## 开发指南

### 项目结构

```
├── src/                # 前端源代码
│   ├── components/     # 公共组件
│   ├── pages/         # 页面组件
│   └── main.jsx       # 入口文件
├── server/            # 后端服务
│   └── index.js       # API服务器
└── public/            # 静态资源
```

### 添加新功能

1. 在 `src/pages` 创建新的页面组件
2. 在 `src/App.jsx` 添加路由配置
3. 如需添加API，在 `server/index.js` 添加新的路由处理

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

[MIT](LICENSE)