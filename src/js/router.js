import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"
import Maze from "@/views/Game/Maze.vue"
import Tools from "@/views/Tools/index.vue"
import text2qrcode from "@/views/Tools/text2qrcode.vue"
import randomstr from "@/views/Tools/randomstr.vue"
const routes = [
    { path: "/index", component: Home, name: "home" },
    { path: "/Game/Maze", component: Maze, name: "Maze" },
    { path: "/Tools/", component: Tools, name: "Tools" },
    { path: "/Tools/text2qrcode", component: text2qrcode, name: "text2qrcode" },
    { path: "/Tools/randomstr", component: randomstr, name: "randomstr" },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
