import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"
import Maze from "@/views/Game/Maze.vue"
import text2qrcode from "@/views/Tools/text2qrcode.vue"
const routes = [
    { path: "/", component: Home },
    { path: "/Game/Maze", component: Maze },
    { path: "/Tools/text2qrcode", component: text2qrcode },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
