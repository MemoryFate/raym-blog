<template>
    <div>
        <a-qrcode :value="data.serverInfo" />
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
    serverInfo: window.location.host + "/Demo/SocketClientDemo",
})
</script>

<style scoped>
section {
    margin-bottom: 2rem;
}
</style>
