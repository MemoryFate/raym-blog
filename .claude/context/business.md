# 业务模块

## 概述

项目包含 3 大业务模块：游戏 (Game)、工具 (Tools)、示例 (Demo)，共 8 个子页面。

---

## 游戏模块 (Game)

### 1. 迷宫 (Maze)

**功能**: 随机迷宫生成 + 寻路算法

**页面**: [src/views/Game/Maze/index.vue](src/views/Game/Maze/index.vue)

**核心逻辑**:
- **迷宫生成**: 使用随机 Prim 算法，从起点开始不断扩展
- **寻路算法**: 
  - DFS (深度优先) - 完整实现
  - A* - 代码框架未完成
- **交互**: 
  - 点击格子设置终点
  - WASD/方向键控制起点移动
  - Canvas 绘制箭头路径

**状态**:
```javascript
state = {
  rectList: [],      // 格子 ID 列表
  rows: 40,          // 行数 (800/20)
  cols: 40,          // 列数
  startPoint: Point, // 起点坐标
  endPoint: Point    // 终点坐标
}
```

---

### 2. 数独 (Sudoku)

**功能**: 随机数独生成 + 难度选择 + 截图复制

**页面**: [src/views/Game/Sudoku/index.vue](src/views/Game/Sudoku/index.vue)

**组件**: [SudokuBoard.vue](src/views/Game/Sudoku/components/SudokuBoard.vue)

**核心逻辑**:
- **生成算法** (sudokuGenerator.js):
  1. 回溯法填充完整 9x9 盘
  2. 根据难度挖空 (easy: 32, medium: 40, hard: 48, expert: 56)
  3. 验证唯一解
- **难度等级**: easy / medium / hard / expert

**状态**:
```javascript
data.model = 'medium'  // 难度
puzzle = ref([])       // 9x9 数组，0 表示空格
```

---

## 工具模块 (Tools)

### 1. 二维码生成 (text2qrcode)

**功能**: 文本转二维码，支持自定义识别级别和分辨率

**页面**: [src/views/Tools/text2qrcode.vue](src/views/Tools/text2qrcode.vue)

**功能点**:
- 输入文本内容
- 选择识别级别 (L/M/Q/H)
- 选择分辨率 (60/200/400/600 或自定义)
- 上传中心图标 (可选)
- 复制二维码到剪贴板

**依赖**: `qrcode` 库，渲染到 Canvas

---

### 2. 随机字符串生成 (randomstr)

**功能**: 生成指定长度和字符类型的随机字符串

**页面**: [src/views/Tools/randomstr.vue](src/views/Tools/randomstr.vue)

**字符类型**:
| 类型 | 字符集 |
|------|--------|
| 数字 | 0123456789 |
| 大写字母 | ABCDEFGHIJKLMNOPQRSTUVWXYZ |
| 小写字母 | abcdefghijklmnopqrstuvwxyz |
| 特殊字符 | !@#$%^&*() |

**长度**: 16/32/64/128 或自定义 (1-1024)

**随机源**: 优先使用 `window.crypto.getRandomValues()`，降级使用 `Math.random()`

---

### 3. AES-GCM 加密解密 (aes-gcm)

**功能**: AES-GCM 模式加密解密

**页面**: [src/views/Tools/aes-gcm.vue](src/views/Tools/aes-gcm.vue)

**依赖**: `node-forge`

**特性**:
- Key 缓存到 localStorage
- 12 字节随机 IV
- 16 字节 Auth Tag
- 输出格式: Base64 (IV + Ciphertext + Tag 拼接)

**数据格式**:
```
┌──────┬──────────────┬──────┐
│ IV   │  Ciphertext  │ Tag  │
│ 12B  │    可变      │ 16B  │
└──────┴──────────────┴──────┘
```

---

## 示例模块 (Demo)

### WebSocket 通信

**服务端**: [SocketDemo.vue](src/views/Demo/SocketDemo.vue)
- 显示连接二维码 (URL: `host/Demo/SocketClientDemo`)
- 接收/广播消息

**客户端**: [SocketClientDemo.vue](src/views/Demo/SocketClientDemo.vue)
- 连接到 `ws://192.168.0.104:2334`
- 接收并显示消息

**服务端进程**: [src/js/server.js](src/js/server.js)
- 独立 Node.js 进程
- 端口: 2334
- 广播消息给所有连接客户端
- 维护连接计数

---

## 页面导航结构

```
Home (/)
├── Game (/Game)
│   ├── Maze (/Game/Maze)
│   └── Sudoku (/Game/Sudoku)
├── Tools (/Tools)
│   ├── text2qrcode (/Tools/text2qrcode)
│   ├── randomstr (/Tools/randomstr)
│   └── aes-gcm (/Tools/aes-gcm)
└── Demo (/Demo)
    ├── SocketDemo (/Demo/SocketDemo) - 服务端
    └── SocketClientDemo (/Demo/SocketClientDemo) - 客户端
```
