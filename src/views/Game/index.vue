<template>
    <div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 20px">
        <a @click="navTo(item)" v-for="(item, index) in data.menus" :key="index" style="width: 200px">
            <a-card :title="item.title" :body-style="{height: '100px', overflow: 'hidden', whiteSpace: 'wrap', textOverflow: 'ellipsis'}">
                {{ item.content }}
            </a-card>
        </a>
    </div>
</template>
<script setup>
import { reactive, getCurrentInstance } from "vue"
const { proxy } = getCurrentInstance()
const data = reactive({
    menus: [
        {
            title: "迷宫",
            content: "随机迷宫生成及寻路逻辑",
            path: "/Game/Maze",
        },
        {
            title: "数独",
            content: "随机数独生成及解题逻辑",
            path: "/Game/Sudoku",
        },
    ],
})
function navTo(item) {
    console.log(proxy.$router)
    proxy.$router.push({ path: item.path, component: item.component })
}
</script>
<style lang="scss" scoped>
a {
    transition: all 0.1s ease-in-out;
}

a:hover {
    transform: scale(1.05);
    box-shadow: #32a1ff5c 0 0 20px 2px;
    display: block;
    border-radius: 10px;
}
</style>
