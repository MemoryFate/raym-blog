# RayM Blog

个人博客与工具集，基于 Vue 3 + Vite + Ant Design Vue 构建。

## 在线访问

部署于 GitHub Pages: `https://用户名.github.io/raym-blog/`

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Vue 3.4 + Composition API |
| 路由 | Vue Router 4 (Hash 模式) |
| UI | Ant Design Vue 4 |
| 构建 | Vite 5 |
| 加密 | node-forge (AES-GCM) |
| 二维码 | qrcode |
| WebSocket | ws |

## 功能模块

### 游戏 (Game)

| 游戏 | 说明 | 路径 |
|------|------|------|
| 迷宫 | 随机迷宫生成 + DFS 寻路 | `/Game/Maze` |
| 数独 | 随机数独生成，支持 4 种难度 | `/Game/Sudoku` |

### 工具 (Tools)

| 工具 | 说明 | 路径 |
|------|------|------|
| 二维码生成 | 文本转二维码，支持自定义分辨率和图标 | `/Tools/text2qrcode` |
| 字符串生成 | 随机字符串，支持多种字符类型 | `/Tools/randomstr` |
| AES-GCM | 加密解密，密钥本地缓存 | `/Tools/aes-gcm` |
| Base64 | Base64 与图片/视频互转，支持导入导出 | `/Tools/base64` |

### 示例 (Demo)

| 示例 | 说明 | 路径 |
|------|------|------|
| WebSocket 通信 | 扫码连接后传输数据 | `/Demo/SocketDemo` |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
raym-blog/
├── src/
│   ├── App.vue              # 根组件
│   ├── main.js              # 入口文件
│   ├── js/
│   │   ├── router.js        # 路由配置
│   │   └── server.js        # WebSocket 服务端
│   ├── layout/
│   │   └── BasicLayout.vue  # 基础布局
│   └── views/
│       ├── Home.vue         # 首页
│       ├── Game/            # 游戏模块
│       ├── Tools/           # 工具模块
│       └── Demo/            # 示例模块
├── index.html
├── package.json
└── vite.config.js
```

## WebSocket 服务

WebSocket 服务独立运行，不通过 Vite 开发服务器：

```bash
# 启动服务端 (端口 2334)
node src/js/server.js
```

## 部署

项目配置了 GitHub Actions 自动部署，推送到 master 分支后自动构建发布。

构建产物部署在 `/raym-blog/` 路径下。
