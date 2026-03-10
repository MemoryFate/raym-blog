<template>
    <a-breadcrumb style="margin: 14px auto;" separator=">">
        <a-breadcrumb-item>Tools</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="content">
        <a @click="navTo(item)" v-for="(item, index) in data.menus" :key="index" style="width: 200px">
            <a-card :title="item.title"
                :body-style="{ height: '100px', overflow: 'hidden', whiteSpace: 'wrap', textOverflow: 'ellipsis' }">
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

<style scoped lang="scss">
section {
    margin-bottom: 2rem;
}

.content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;

    a {
        transition: all 0.1s ease-in-out;
    }

    a:hover {
        transform: scale(1.05);
        box-shadow: #32a1ff5c 0 0 20px 2px;
        display: block;
        border-radius: 10px;
    }
}
</style>
