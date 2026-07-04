# 目录说明

## 根目录文件

| 文件/目录 | 说明 |
|-----------|------|
| `index.html` | HTML 入口文件，id="app" 挂载点 |
| `package.json` | 项目依赖配置，ES Module 模式 |
| `vite.config.js` | Vite 构建配置，路径别名 `@` 指向 `src/` |
| `README.md` | 项目简短说明 |
| `.gitignore` | Git 忽略配置 |
| `.github/workflows/deploy.yml` | GitHub Actions 部署流程 |

## src/ 目录结构

### 核心文件

| 文件 | 说明 |
|------|------|
| `main.js` | 应用入口，创建 Vue 实例，注册路由和 Ant Design |
| `App.vue` | 根组件，仅包含 BasicLayout 和 router-view |

### js/ 目录

| 文件 | 说明 |
|------|------|
| `router.js` | Vue Router 配置，Hash 模式，所有路由定义 |
| `server.js` | WebSocket 服务器 (Node.js ws 库)，监听端口 2334 |

### layout/ 目录

| 文件 | 说明 |
|------|------|
| `BasicLayout.vue` | 基础布局组件，包含 Header (Logo)、Content (路由内容)、Footer |

### views/ 目录 - 首页

| 文件 | 说明 |
|------|------|
| `Home.vue` | 首页，展示 Game/Tools/Demo 三个入口卡片 |

### views/Game/ 目录 (游戏模块)

| 文件/目录 | 说明 |
|-----------|------|
| `index.vue` | 游戏列表页，展示迷宫和数独入口 |
| `Maze/index.vue` | 迷宫游戏页面，Canvas 绘制 + DFS/A* 寻路 |
| `Sudoku/index.vue` | 数独游戏页面 |
| `Sudoku/components/SudokuBoard.vue` | 数独棋盘组件，9x9 格子渲染 |
| `Sudoku/js/sudokuGenerator.js` | 数独生成器，回溯算法生成完整盘+挖空 |
| `Sudoku/js/sudokuSolver.js` | 数独求解器，DFS 回溯求解 |
| `Sudoku/js/sudokuDifficulty.js` | 难度配置，easy/medium/hard/expert 对应挖空数量 |

### views/Tools/ 目录 (工具模块)

| 文件 | 说明 |
|------|------|
| `index.vue` | 工具列表页 |
| `text2qrcode.vue` | 二维码生成工具，基于 qrcode 库 |
| `randomstr.vue` | 随机字符串生成工具，支持长度和字符类型选择 |
| `aes-gcm.vue` | AES-GCM 加密解密工具，基于 node-forge |

### views/Demo/ 目录 (示例模块)

| 文件 | 说明 |
|------|------|
| `index.vue` | Demo 列表页 |
| `SocketDemo.vue` | WebSocket 服务端 Demo，显示连接二维码 |
| `SocketClientDemo.vue` | WebSocket 客户端 Demo，连接指定服务器 |

### assets/ 目录

| 文件 | 说明 |
|------|------|
| `background.jpg` | 项目背景图片 |

## 公共资源

当前无 `public/` 目录，图标使用 Ant Design Icons Vue 组件。
