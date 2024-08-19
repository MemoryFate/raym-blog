<template>
    <a-card title="二维码生成" class="content">
        <a-form ref="form" layout="vertical" :rules="rules" :model="data.formData">
            <a-form-item name="text" label="文本">
                <a-textarea v-model:value="data.formData.text" placeholder="请输入要转码的文本" :rows="4" />
            </a-form-item>
            <a-form-item name="level" label="识别度">
                <a-radio-group v-model:value="data.formData.level">
                    <a-radio-button value="L">低</a-radio-button>
                    <a-radio-button value="M">中</a-radio-button>
                    <a-radio-button value="Q">高</a-radio-button>
                    <a-radio-button value="H">极高</a-radio-button>
                </a-radio-group>
            </a-form-item>
            <a-form-item name="pixel" label="分辨率">
                <a-row>
                    <a-col :span="8">
                        <a-radio-group v-model:value="data.formData.pixel">
                            <a-radio-button value="60">60</a-radio-button>
                            <a-radio-button value="200">200</a-radio-button>
                            <a-radio-button value="400">400</a-radio-button>
                            <a-radio-button value="600">600</a-radio-button>
                        </a-radio-group>
                    </a-col>
                    <a-col :offset="1">
                        <a-form-item-rest><a-input-number v-model:value="data.formData.pixel" min="60" max="900"></a-input-number></a-form-item-rest>
                    </a-col>
                </a-row>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" style="float: right" @click="convertQRCode()">确定</a-button>
                <a-button type="primary" ghost style="float: right; margin-right: 20px" @click="reset()">重置</a-button>
            </a-form-item>
            <a-form-item label="结果:">
                <div style="display: flex; flex-direction: column; align-items: center; background-color: white; padding: 10px">
                    <canvas id="qrcode" :height="data.formData.pixel" :width="data.formData.pixel" style="box-shadow: #32a1ff5c 0 0 4px 1px"></canvas>
                    <a v-if="data.showCopy" @click="copyToClipBoard()" style="margin: 10px">点击复制二维码到剪贴板</a>
                </div>
            </a-form-item>
        </a-form>
    </a-card>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue"
import QRCode from "qrcode"
import { message } from "ant-design-vue"
const { proxy, emit } = getCurrentInstance()
const data = reactive({
    formData: { level: "L", pixel: "600" },
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
    level: [
        {
            required: true,
            trigger: "submit",
        },
    ],
    pixel: [
        {
            required: true,
            message: "请输入分辨率",
            trigger: "submit",
        },
    ],
}
function reset() {
    data.showCopy = false
    data.formData = { level: "L", pixel: "600" }
}

function convertQRCode() {
    const canvas = document.getElementById("qrcode")
    proxy.$refs.form.validateFields().then(values => {
        QRCode.toCanvas(
            canvas,
            values.text,
            {
                height: values.pixel,
                width: values.pixel,
                errorCorrectionLevel: values.level,
            },
            err => {
                if (!err) {
                    data.showCopy = true
                } else {
                    message.error(err.message)
                }
            }
        )
    })
}
function copyToClipBoard(e) {
    const canvas = document.getElementById("qrcode")
    canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]))
    message.info("复制成功")
}
</script>
<style lang="scss" scoped>
.content {
    display: flex;
    flex-direction: column;
}
</style>
