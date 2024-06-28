import { createRouter, createWebHistory } from "vue-router"

const routes = [
    { path: "/index", component: () => import("@/views/Home.vue"), name: "home" },
    { path: "/Game/Maze", component: () => import("@/views/Game/Maze.vue"), name: "Maze" },
    { path: "/Tools/", component: () => import("@/views/Tools/index.vue"), name: "Tools" },
    { path: "/Tools/text2qrcode", component: () => import("@/views/Tools/text2qrcode.vue"), name: "text2qrcode" },
    { path: "/Tools/randomstr", component: () => import("@/views/Tools/randomstr.vue"), name: "randomstr" },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
