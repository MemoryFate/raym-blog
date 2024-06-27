<template>
    <div class="content">
        <a-form ref="form" layout="vertical" :rules="rules" :model="data.formData">
            <a-form-item name="text" label="文本">
                <a-textarea v-model:value="data.formData.text" placeholder="请输入要转码的文本" :rows="4" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" style="float: right" @click="convertQRCode()">确定</a-button>
                <a-button type="" style="float: right; margin-right: 20px" @click="reset()">重置</a-button>
            </a-form-item>
            <a-form-item label="结果:">
                <div style="display: flex; flex-direction: column; align-items: center">
                    <canvas id="qrcode" height="600" width="600" style="background-color: white"></canvas>
                    <a v-if="data.showCopy" @click="copyToClipBoard()" style="margin: 10px">点击复制到剪贴板</a>
                </div>
            </a-form-item>
        </a-form>
    </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue"
import QRCode from "qrcode"
const { proxy, emit } = getCurrentInstance()
const data = reactive({
    formData: {},
    showCopy: false,
})
const rules = {
    text: [
        {
            required: true,
            message: "请输入内容",
            trigger: "submit",
        },
    ],
}
function reset() {
    data.showCopy = false
    data.formData = {}
}

function convertQRCode() {
    const canvas = document.getElementById("qrcode")
    proxy.$refs.form.validateFields().then(values => {
        console.log(values)
        QRCode.toCanvas(
            canvas,
            values.text,
            {
                height: 600,
                width: 600,
            },
            () => {
                data.showCopy = true
            }
        )
    })
}
function copyToClipBoard(e) {
    const canvas = document.getElementById("qrcode")
    canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]))
}
</script>
<style lang="scss" scoped>
.content {
    display: flex;
    flex-direction: column;
}
</style>
