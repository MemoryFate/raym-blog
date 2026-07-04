# 项目结构分析

## 项目概述

- **项目名称**: raym-blog
- **项目类型**: Vue 3 个人博客/工具集 Web 应用
- **技术栈**: Vue 3 + Vite + Ant Design Vue 4 + Vue Router 4
- **构建工具**: Vite 5
- **Node 版本**: ES Module 模式

## 目录结构

```
raym-blog/
├── .claude/                    # Claude Code 配置目录
│   └── context/                # 项目文档目录
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── .vscode/
│   └── extensions.json         # VSCode 扩展推荐
├── public/                     # 公共静态资源 (当前为空)
├── src/
│   ├── App.vue                 # 根组件
│   ├── main.js                 # 应用入口
│   ├── assets/                 # 静态资源
│   │   └── background.jpg      # 背景图
│   ├── js/                     # JavaScript 核心模块
│   │   ├── router.js           # 路由配置
│   │   └── server.js           # WebSocket 服务器
│   ├── layout/                 # 布局组件
│   │   └── BasicLayout.vue     # 基础布局 (Header/Content/Footer)
│   └── views/                  # 页面视图
│       ├── Home.vue            # 首页
│       ├── Game/               # 游戏模块
│       │   ├── index.vue       # 游戏列表页
│       │   ├── Maze/           # 迷宫游戏
│       │   │   └── index.vue
│       │   └── Sudoku/         # 数独游戏
│       │       ├── index.vue
│       │       ├── components/
│       │       │   └── SudokuBoard.vue
│       │       └── js/
│       │           ├── sudokuGenerator.js
│       │           ├── sudokuSolver.js
│       │           └── sudokuDifficulty.js
│       ├── Tools/              # 工具模块
│       │   ├── index.vue       # 工具列表页
│       │   ├── text2qrcode.vue # 二维码生成
│       │   ├── randomstr.vue   # 随机字符串生成
│       │   └── aes-gcm.vue     # AES-GCM 加密解密
│       └── Demo/               # 示例模块
│           ├── index.vue       # Demo 列表页
│           ├── SocketDemo.vue  # WebSocket 服务端
│           └── SocketClientDemo.vue # WebSocket 客户端
├── index.html                  # HTML 入口
├── package.json                # 依赖配置
├── vite.config.js              # Vite 配置
└── README.md                   # 项目说明
```

## 路由结构

| 路径 | 组件 | 功能 |
|------|------|------|
| `/` | Home.vue | 首页 |
| `/Game` | Game/index.vue | 游戏列表 |
| `/Game/Maze` | Game/Maze/index.vue | 迷宫游戏 |
| `/Game/Sudoku` | Game/Sudoku/index.vue | 数独游戏 |
| `/Tools` | Tools/index.vue | 工具列表 |
| `/Tools/text2qrcode` | Tools/text2qrcode.vue | 二维码生成 |
| `/Tools/randomstr` | Tools/randomstr.vue | 随机字符串 |
| `/Tools/aes-gcm` | Tools/aes-gcm.vue | AES-GCM加密 |
| `/Demo` | Demo/index.vue | Demo列表 |
| `/Demo/SocketDemo` | Demo/SocketDemo.vue | WebSocket服务端 |
| `/Demo/SocketClientDemo` | Demo/SocketClientDemo.vue | WebSocket客户端 |

## 构建命令

```bash
npm run dev      # 开发服务器 (--host 允许外部访问)
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

## 部署信息

- 部署路径: `/raym-blog/`
- GitHub Actions 自动部署配置已启用
