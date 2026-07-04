# 接口规范

## 页面路由

项目使用 Vue Router **Hash 模式**，所有路由定义在 [src/js/router.js](src/js/router.js)

### 路由表

| 路径 | 名称 | 组件 (懒加载) |
|------|------|---------------|
| `/` | home | `@/views/Home.vue` |
| `/Game` | Game | `@/views/Game/index.vue` |
| `/Game/Maze` | maze | `@/views/Game/Maze/index.vue` |
| `/Game/Sudoku` | sudoku | `@/views/Game/Sudoku/index.vue` |
| `/Tools` | Tools | `@/views/Tools/index.vue` |
| `/Tools/text2qrcode` | text2qrcode | `@/views/Tools/text2qrcode.vue` |
| `/Tools/randomstr` | randomstr | `@/views/Tools/randomstr.vue` |
| `/Tools/aes-gcm` | aes-gcm | `@/views/Tools/aes-gcm.vue` |
| `/Demo` | Demo | `@/views/Demo/index.vue` |
| `/Demo/SocketDemo` | socket-demo | `@/views/Demo/SocketDemo.vue` |
| `/Demo/SocketClientDemo` | socket-client-demo | `@/views/Demo/SocketClientDemo.vue` |

---

## WebSocket 接口

### 服务器配置

**文件**: [src/js/server.js](src/js/server.js)

```javascript
const wss = new WebSocketServer({ port: 2334 })
```

### 消息格式

服务端与客户端使用**字符串**格式通信:

```
客户端发送: 任意文本消息
服务端广播: "服务端转发的消息: {原始消息}"
           "有人离开了！ 当前服务器{n}人"
           "欢迎！ 当前服务器{m}人"
```

### 事件

| 事件 | 触发条件 | 广播内容 |
|------|----------|----------|
| `connection` | 客户端连接 | `欢迎！ 当前服务器{n}人` |
| `message` | 收到消息 | `服务端转发的消息: {消息}` |
| `close` | 客户端断开 | `有人离开了！ 当前服务器{n}人` |

### 客户端连接

```javascript
const ws = new WebSocket('ws://192.168.0.104:2334')
ws.onopen = (v) => { ... }
ws.onmessage = (msg) => { ... }
ws.onclose = (v) => { ... }
```

---

## 数独模块 API

### 生成函数

**文件**: [src/views/Game/Sudoku/js/sudokuGenerator.js](src/views/Game/Sudoku/js/sudokuGenerator.js)

```javascript
import { generateSudoku } from './js/sudokuGenerator'

// 参数: difficulty = 'easy' | 'medium' | 'hard' | 'expert'
// 参数: ensureUnique = true (确保唯一解)
// 返回: { puzzle: number[][], solution: number[][] }
const { puzzle, solution } = generateSudoku('medium', true)
```

### 难度配置

**文件**: [src/views/Game/Sudoku/js/sudokuDifficulty.js](src/views/Game/Sudoku/js/sudokuDifficulty.js)

```javascript
export const difficultyHoles = {
  easy: 32,    // 挖空数量
  medium: 40,
  hard: 48,
  expert: 56,
}
```

### 求解函数

**文件**: [src/views/Game/Sudoku/js/sudokuSolver.js](src/views/Game/Sudoku/js/sudokuSolver.js)

```javascript
import { solve } from './js/sudokuSolver'

// 参数: board (9x9 数组，0 表示空格)
// 返回: boolean (是否成功求解)
solve(board)
```

---

## 二维码模块 API

**文件**: [src/views/Tools/text2qrcode.vue](src/views/Tools/text2qrcode.vue)

```javascript
import QRCode from 'qrcode'

// 渲染到 Canvas
QRCode.toCanvas(
  canvas,           // HTMLCanvasElement
  text,             // 要编码的文本
  {
    height: 600,
    width: 600,
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  },
  (err) => { ... }
)
```

---

## AES-GCM 加密 API

**文件**: [src/views/Tools/aes-gcm.vue](src/views/Tools/aes-gcm.vue)

使用 `node-forge` 库，完整加密流程:

```javascript
import forge from 'node-forge'

// 加密
const iv = forge.random.getBytesSync(12)
const cipher = forge.cipher.createCipher('AES-GCM', key)
cipher.start({ iv })
cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(word)))
cipher.finish()
const encrypted = cipher.output
const tag = cipher.mode.tag
// 输出: Base64(iv + encrypted + tag)

// 解密
const decipher = forge.cipher.createDecipher('AES-GCM', key)
decipher.start({ iv, tag })
decipher.update(forge.util.createBuffer(ciphertext))
decipher.finish()
```

---

## 组件 Props 规范

### SudokuBoard

```javascript
// 文件: src/views/Game/Sudoku/components/SudokuBoard.vue
defineProps({
  puzzle: Array  // 9x9 二维数组，0 表示空格
})
```
