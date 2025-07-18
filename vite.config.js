import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "node:url"
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: '/raym-blog/',
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        // port: 8080,
    },
})
