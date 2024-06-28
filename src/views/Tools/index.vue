<template>
    <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data.menus">
        <template #renderItem="{ item }">
            <a-list-item>
                <a @click="navTo(item)">
                    <a-card :title="item.title">
                        {{ item.content }}
                    </a-card>
                </a>
            </a-list-item>
        </template>
    </a-list>
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
    ],
})
function navTo(item) {
    console.log(proxy.$router)
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
