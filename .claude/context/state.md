# 状态管理

## 概述

项目**未使用** Pinia 或 Vuex 等状态管理库，采用 **组件内状态管理** 模式。

---

## 状态管理方式

### 1. reactive() - 响应式对象

适用于对象类型状态:

```javascript
const data = reactive({
  menus: [...],
  formData: {...},
  result: ''
})
```

### 2. ref() - 响应式引用

适用于原始类型和数组:

```javascript
const puzzle = ref([])
const fileList = ref([])
const types = ref([...])
```

### 3. 组件实例获取

```javascript
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

// 访问路由
proxy.$router.push({ path: '/' })

// 访问 ref
console.log(proxy.$refs.form)
```

---

## 各模块状态

### 首页 (Home.vue)

```javascript
data = {
  menus: [
    { title, content, path },
    ...
  ]
}
```

### 迷宫 (Game/Maze/index.vue)

```javascript
state = {
  rectList: [],        // 格子 ID 矩阵
  rows: 40,            // 迷宫行数
  cols: 40,            // 迷宫列数
  startPoint: Point,   // 起点 {x, y}
  endPoint: Point      // 终点 {x, y}
}
```

### 数独 (Game/Sudoku/index.vue)

```javascript
data = {
  model: 'medium'      // 难度等级
}
puzzle = ref([])       // 当前谜题 9x9 数组
```

### 二维码 (Tools/text2qrcode.vue)

```javascript
data = {
  formData: {
    level: 'L',        // 识别级别
    pixel: '600'       // 分辨率
  },
  showCopy: false,
  fileList: []         // 上传的图标文件
}
```

### 随机字符串 (Tools/randomstr.vue)

```javascript
data = {
  formData: {
    strLength: 16,
    type: ['number']
  },
  result: ''
}
types = ref([...])     // 可选类型配置
```

### AES-GCM (Tools/aes-gcm.vue)

```javascript
data = {
  key: string,         // 密钥 (localStorage 缓存)
  input: string,       // 输入文本
  output: string,      // 输出结果
  type: 'encrypt' | 'decrypt'
}
```

### WebSocket 服务端 (Demo/SocketDemo.vue)

```javascript
data = {
  serverInfo: window.location.host + "/Demo/SocketClientDemo"
}
```

### WebSocket 客户端 (Demo/SocketClientDemo.vue)

```javascript
data = {
  logs: []             // 接收的消息列表
}
```

---

## 状态持久化

仅 AES-GCM 模块使用了 localStorage:

```javascript
// 文件: src/views/Tools/aes-gcm.vue
watch(() => data.key, (val) => {
  localStorage.setItem('aes-gcm-key', val)
})
```

---

## 响应式数据流

```
用户操作 → 事件处理函数 → 修改 reactive/ref → Vue 自动更新 DOM
```

无跨组件状态共享需求，所有状态均为组件私有。
