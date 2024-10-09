<template>
    <div>
        <a-qrcode :value="JSON.stringify(data.serverInfo)" />
        <a-card title="log">
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
    serverInfo: {
        ip: "192.168.0.104",
        port: "2334",
    },
    logs: [],
})


</script>

<style scoped>
section {
    margin-bottom: 2rem;
}
</style>
