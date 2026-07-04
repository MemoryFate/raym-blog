# 技术栈

## 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | ^3.4.21 | 渐进式 JavaScript 框架 |
| Vue Router | ^4.3.2 | 路由管理，Hash 模式 |
| Ant Design Vue | ^4.2.3 | UI 组件库 |

## 构建工具

| 技术 | 版本 | 用途 |
|------|------|------|
| Vite | ^5.2.0 | 下一代前端构建工具 |
| @vitejs/plugin-vue | ^5.0.4 | Vite Vue 插件 |
| esbuild | >=0.25.0 | JavaScript 打包/压缩 |

## 开发依赖

| 技术 | 版本 | 用途 |
|------|------|------|
| sass | ^1.77.4 | SCSS 预处理器 |

## 生产依赖

| 技术 | 版本 | 用途 |
|------|------|------|
| qrcode | ^1.5.3 | 二维码生成 (Canvas 渲染) |
| html2canvas | ^1.4.1 | DOM 转图片 (数独导出) |
| node-forge | ^1.3.1 | AES-GCM 加密解密 |
| ws | ^8.18.0 | WebSocket 服务端 (Node.js) |
| less | ^4.2.0 | Less 预处理器 |
| less-loader | ^12.2.0 | Less Webpack 加载器 |

---

## 依赖关系图

```
package.json
├── dependencies
│   ├── vue (^3.4.21)
│   ├── vue-router (^4.3.2)
│   ├── ant-design-vue (^4.2.3)
│   ├── qrcode (^1.5.3)
│   ├── html2canvas (^1.4.1)
│   ├── node-forge (^1.3.1)
│   ├── ws (^8.18.0)
│   ├── less (^4.2.0)
│   ├── less-loader (^12.2.0)
│   └── esbuild (>=0.25.0)
└── devDependencies
    ├── vite (^5.2.0)
    ├── @vitejs/plugin-vue (^5.0.4)
    ├── esbuild (>=0.25.0)
    └── sass (^1.77.4)
```

---

## Vite 配置

**文件**: [vite.config.js](vite.config.js)

```javascript
export default defineConfig({
    plugins: [vue()],
    base: '/raym-blog/',           // 部署路径
    resolve: {
        alias: {
            "@": "./src"           // 路径别名
        }
    },
    server: {
        // port: 8080             // 使用默认端口
    }
})
```

---

## 浏览器兼容性

- 使用原生 ES Module (type="module")
- 需要支持以下 API:
  - `window.crypto.getRandomValues()`
  - `Canvas 2D`
  - `WebSocket`
  - `Clipboard API`
