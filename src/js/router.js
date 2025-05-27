import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    { path: "/index", component: () => import("@/views/Home.vue"), name: "home" },

    { path: "/Game/", component: () => import("@/views/Game/index.vue"), name: "Game" },
    { path: "/Game/Maze", component: () => import("@/views/Game/Maze.vue"), name: "maze" },

    { path: "/Tools/", component: () => import("@/views/Tools/index.vue"), name: "Tools" },
    { path: "/Tools/text2qrcode", component: () => import("@/views/Tools/text2qrcode.vue"), name: "text2qrcode" },
    { path: "/Tools/randomstr", component: () => import("@/views/Tools/randomstr.vue"), name: "randomstr" },

    { path: "/Demo/", component: () => import("@/views/Demo/index.vue"), name: "Demo" },
    { path: "/Demo/SocketDemo", component: () => import("@/views/Demo/SocketDemo.vue"), name: "socket-demo" },
    { path: "/Demo/SocketClientDemo", component: () => import("@/views/Demo/SocketClientDemo.vue"), name: "socket-client-demo" },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
