<template>
    <div class="content">
        <a-form ref="form" layout="vertical">
            <a-form-item label="文本">
                <a-textarea v-model="data.text" placeholder="请输入要转码的文本" :rows="4" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" style="float: right" @click="convertQRCode()">确定</a-button>
            </a-form-item>
            <a-form-item label="结果">
                <canvas id="qrcode" height="600" width="600" style="margin: 0 auto; display: block; background-color: white" @click="copyToClipBoard()"></canvas>
            </a-form-item>
        </a-form>
        <canvas id="qrcode" height="600" width="600"></canvas>
    </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive } from "vue"
import QRCode from "qrcode";
const data = reactive({
    text: "",
})
const { proxy, emit } = getCurrentInstance()

function convertQRCode() {
    const canvas = document.getElementById('qrcode')
    QRCode.toCanvas(canvas, data.text, err => {
        console.log(err)
    })
}
function copyToClipBoard(e) {
    console.log(e)
}
</script>
<style lang="scss" scoped>
.content {
    display: flex;
    flex-direction: column;
}
</style>
