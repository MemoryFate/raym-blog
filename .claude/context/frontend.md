# 开发规范

## 项目规范

### 目录结构

```
src/
├── js/                    # JavaScript 工具模块
│   ├── router.js          # 路由配置
│   └── server.js          # WebSocket 服务器
├── layout/                # 布局组件
│   └── BasicLayout.vue
├── views/                 # 页面组件
│   ├── Home.vue
│   ├── Game/
│   │   ├── index.vue      # 模块列表页
│   │   ├── Maze/
│   │   └── Sudoku/
│   ├── Tools/
│   │   ├── index.vue
│   │   └── *.vue
│   └── Demo/
│       ├── index.vue
│       └── *.vue
└── assets/                # 静态资源
```

### 文件命名

- Vue 组件: **PascalCase** (如 `SudokuBoard.vue`)
- JS 模块: **camelCase** (如 `sudokuGenerator.js`)
- 目录: **camelCase** (如 `Sudoku/`)

---

## Vue 3 规范

### 组件模板

```vue
<template>
    <a-breadcrumb style="margin: 14px auto;" separator=">">
        <a-breadcrumb-item><a href="./#/">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>当前页面</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="content">
        <!-- 页面内容 -->
    </div>
</template>
```

### 组件脚本

```vue
<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from "vue"

// 获取组件实例
const { proxy } = getCurrentInstance()

// 响应式状态
const data = reactive({
    menus: [],
    formData: {}
})

// 路由导航
function navTo(item) {
    proxy.$router.push({ path: item.path })
}
</script>

<style lang="scss" scoped>
.content {
    /* 样式 */
}
</style>
```

### 路由定义

```javascript
// src/js/router.js
const routes = [
    { path: "/", component: () => import("@/views/Home.vue"), name: "home" },
    { path: "/Game", component: () => import("@/views/Game/index.vue"), name: "Game" },
    // ...
]
```

---

## 样式规范

### 命名规范

- 使用 **SCSS** 预处理器
- 组件样式添加 `scoped` 防止污染
- BEM 命名: `.layout-content-div`

```scss
.layout {
    .layout-header { }
    .layout-content {
        .layout-content-div { }
    }
}
```

### 通用样式

```scss
.content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;

    a {
        transition: all 0.1s ease-in-out;
    }

    a:hover {
        transform: scale(1.05);
        box-shadow: #32a1ff5c 0 0 20px 2px;
    }
}
```

---

## 业务规范

### 页面结构

每个页面包含:
1. **面包屑导航** - 使用 Ant Design Breadcrumb
2. **内容区域** - 卡片或容器
3. **样式** - SCSS scoped

### 列表页模板

```vue
<template>
    <a-breadcrumb ...>
        <a-breadcrumb-item><a href="./#/">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>模块名</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="content">
        <a @click="navTo(item)" v-for="(item, index) in data.menus" :key="index">
            <a-card :title="item.title">
                {{ item.content }}
            </a-card>
        </a>
    </div>
</template>
```

### 表单处理

```javascript
proxy.$refs.form.validateFields().then(values => {
    // 处理表单数据
}).catch(err => {
    message.error("请检查输入内容是否正确")
})
```

---

## Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
chore: 构建/工具变更
```

---

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

---

## WebSocket 开发

服务端独立运行，不通过 Vite:

```bash
node src/js/server.js
```

客户端连接地址 (需根据实际 IP 修改):
```javascript
const ws = new WebSocket('ws://192.168.0.104:2334')
```
