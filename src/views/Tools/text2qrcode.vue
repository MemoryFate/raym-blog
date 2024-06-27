<template>
    <div class="content">
        <form>
            <label for="text">转码文字:</label><br />
            <textarea name="" id="text" placeholder="请输入要转码的内容" v-model="data.text"></textarea>
            <button type="submit">确定</button>
        </form>
        <canvas id="qrcode" height="600" width="600"></canvas>
    </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive } from "vue"
const data = reactive({
    text: "",
})
const { proxy, emit } = getCurrentInstance()
</script>
<style lang="scss" scoped>
.content {
    display: flex;
    flex-direction: column;
}
</style>
