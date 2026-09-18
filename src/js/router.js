import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    { path:"/", component:() => import("@/views/Home.vue"), name:"home" },
    { path:"/Projects", component:() => import("@/views/Projects/index.vue"), name:"Projects" },
    { path:"/Projects/raym-blog", component:() => import("@/views/Projects/RayMBlog.vue"), name:"project-raym-blog" },

    { path:"/Tools", component:() => import("@/views/Tools/index.vue"), name:"Tools" },
    { path:"/Tools/text2qrcode", component:() => import("@/views/Tools/text2qrcode.vue"), name:"text2qrcode" },
    { path:"/Tools/randomstr", component:() => import("@/views/Tools/randomstr.vue"), name:"randomstr" },
    { path:"/Tools/aes-gcm", component:() => import("@/views/Tools/aes-gcm.vue"), name:"aes-gcm" },
    { path:"/Tools/base64", component:() => import("@/views/Tools/base64.vue"), name:"base64" },

    { path:"/Lab", component:() => import("@/views/Lab/index.vue"), name:"Lab" },
    { path:"/Game", redirect:"/Lab" },
    { path:"/Game/Maze", component:() => import("@/views/Game/Maze/index.vue"), name:"maze" },
    { path:"/Game/Sudoku", component:() => import("@/views/Game/Sudoku/index.vue"), name:"sudoku" },
    { path:"/Demo", redirect:"/Lab" },
    { path:"/Demo/SocketDemo", component:() => import("@/views/Demo/SocketDemo.vue"), name:"socket-demo" },
    { path:"/Demo/SocketClientDemo", component:() => import("@/views/Demo/SocketClientDemo.vue"), name:"socket-client-demo" },

    { path:"/Notes", component:() => import("@/views/Notes/index.vue"), name:"Notes" },
    { path:"/Notes/dynamic-background", component:() => import("@/views/Notes/DynamicBackground.vue"), name:"note-dynamic-background" },
]

const router=createRouter({
    history:createWebHashHistory(), routes,
    scrollBehavior(to,from,savedPosition){
        if(savedPosition) return savedPosition
        if(to.hash) return {el:to.hash,top:112,behavior:"smooth"}
        return {top:0}
    },
})
export default router
