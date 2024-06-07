import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"
import Maze from "@/views/Game/Maze.vue"
const routes = [
    { path: "/", component: Home },
    { path: "/Maze", component: Maze },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
