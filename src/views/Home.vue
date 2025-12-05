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
            title: "Tools",
            content: "工具类",
            path: "/Tools",
        },
        {
            title: "Game",
            content: "游戏",
            path: "/Game",
        },
        {
            title: "Demo",
            content: "Demo",
            path: "/Demo",
        },
    ],
})
function navTo(item) {
    console.log(proxy.$router)
    proxy.$router.push({ path: item.path })
}
</script>

<style scoped>
section {
  margin-bottom: 2rem;
}
</style>
