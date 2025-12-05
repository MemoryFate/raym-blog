<template>
    <div>
        <a-card title="接受到的数据">
            <a-list bordered :data-source="data.logs">
                <template #renderItem="{ item }">
                    <a-list-item>{{ item }}</a-list-item>
                </template>
            </a-list>
        </a-card>
    </div>
</template>

<script setup>
import { reactive, getCurrentInstance } from "vue"

const { proxy } = getCurrentInstance()
const data = reactive({
    logs: []
})

const ws = new WebSocket('ws://192.168.0.104:2334/ws')
ws.onopen = (v) => {
    console.log('open ---->', v)
}
ws.onmessage = (msg) => {
    console.log(msg.data)
    data.logs.push(msg.data)
}
ws.onclose = (v) => {
    console.log('close ---->', v)
}
</script>

<style scoped>
section {
    margin-bottom: 2rem;
}
</style>
