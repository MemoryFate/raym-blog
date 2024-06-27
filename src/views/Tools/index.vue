<template>
    <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data.menus">
        <template #renderItem="{ item }">
            <a-list-item>
                <a :href="item.path">
                    <a-card :title="item.title">
                        {{ item.content }}
                    </a-card>
                </a>
            </a-list-item>
        </template>
    </a-list>
</template>
<script setup>
import { reactive } from "vue"

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
</script>
