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
            title: "二维码生成",
            content: "根据文字转换为二维码",
            path: "/Tools/text2qrcode",
        },
        {
            title: "字符串生成",
            content: "随机生成指定条件的字符串",
            path: "/Tools/randomstr",
        },
        {
            title: "aes-gcm",
            content: "aes-gcm加密解密",
            path: "/Tools/aes-gcm",
        },
    ],
})
function navTo(item) {
    proxy.$router.push({ path: item.path })
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
