<template>
    <div class="tool-detail">
        <RouterLink class="back mono" to="/Tools">← 返回工具列表</RouterLink>

        <header class="tool-head">
            <div>
                <p class="eyebrow">工具 / 二维码</p>
                <h1>二维码生成器</h1>
                <p>输入文本或链接，设置容错级别与尺寸，在浏览器中直接生成二维码。</p>
            </div>
            <span class="mono status">● 本地生成</span>
        </header>

        <div class="tool-layout">
            <NeonGlass class="work-surface" glow>
                <div class="surface-head">
                    <div><p class="eyebrow">生成参数</p><h2>创建二维码</h2></div>
                    <span class="mono">QR / 001</span>
                </div>

                <a-form ref="formRef" layout="vertical" :rules="rules" :model="data.formData">
                    <a-form-item name="text" label="内容">
                        <a-textarea
                            v-model:value="data.formData.text"
                            placeholder="输入文本、网址或其他内容"
                            :rows="5"
                        />
                    </a-form-item>

                    <div class="form-grid">
                        <a-form-item name="level" label="容错级别">
                            <a-radio-group v-model:value="data.formData.level">
                                <a-radio-button value="L">低</a-radio-button>
                                <a-radio-button value="M">中</a-radio-button>
                                <a-radio-button value="Q">高</a-radio-button>
                                <a-radio-button value="H">极高</a-radio-button>
                            </a-radio-group>
                        </a-form-item>

                        <a-form-item name="pixel" label="尺寸">
                            <div class="size-row">
                                <a-input-number v-model:value="data.formData.pixel" :min="120" :max="900" :step="20" />
                                <span class="mono">px</span>
                            </div>
                        </a-form-item>
                    </div>

                    <a-form-item label="中心图标（可选）">
                        <a-upload
                            v-model:file-list="data.fileList"
                            list-type="picture-card"
                            :before-upload="beforeUpload"
                            :max-count="1"
                            accept="image/*"
                        >
                            <plus-outlined />
                            <div class="upload-copy">选择图片</div>
                        </a-upload>
                    </a-form-item>

                    <div class="actions">
                        <a-button type="primary" @click="convertQRCode">生成二维码</a-button>
                        <a-button @click="reset">重置</a-button>
                    </div>
                </a-form>

                <div class="result-block">
                    <div class="result-head">
                        <div><p class="eyebrow">生成结果</p><h3>{{ data.showCopy ? "二维码已生成" : "等待生成" }}</h3></div>
                        <span class="mono">{{ data.formData.pixel }} × {{ data.formData.pixel }}</span>
                    </div>

                    <div class="qr-stage" :class="{ ready: data.showCopy }">
                        <canvas
                            id="qrcode"
                            :height="data.formData.pixel"
                            :width="data.formData.pixel"
                        ></canvas>
                        <div v-if="!data.showCopy" class="placeholder">
                            <span>▦</span>
                            <p>生成后将在这里预览</p>
                        </div>
                    </div>

                    <div v-if="data.showCopy" class="result-actions">
                        <button type="button" @click="copyToClipBoard">复制图片</button>
                        <button type="button" @click="downloadQrCode">下载 PNG</button>
                    </div>
                </div>
            </NeonGlass>

            <aside class="side-stack">
                <NeonGlass class="side-card">
                    <p class="eyebrow">使用说明</p>
                    <h3>容错越高，二维码越容易被识别</h3>
                    <p>如果需要在二维码中心放 Logo，建议选择“高”或“极高”容错，并避免让图标覆盖过大的有效区域。</p>
                </NeonGlass>

                <NeonGlass class="side-card">
                    <p class="eyebrow">隐私</p>
                    <h3>内容不会上传到服务器</h3>
                    <p>二维码生成过程直接在当前浏览器执行。你输入的文本与图片只参与本地绘制。</p>
                </NeonGlass>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import QRCode from "qrcode"
import { message } from "ant-design-vue"
import { PlusOutlined } from "@ant-design/icons-vue"
import NeonGlass from "@/components/ui/NeonGlass.vue"

const formRef = ref()
const data = reactive({
    formData: { text: "", level: "M", pixel: 400 },
    showCopy: false,
    fileList: [],
})

const rules = {
    text: [{ required: true, message: "请输入需要生成二维码的内容", trigger: "change" }],
    level: [{ required: true, message: "请选择容错级别", trigger: "change" }],
    pixel: [{ required: true, message: "请输入二维码尺寸", trigger: "change" }],
}

function reset() {
    data.formData = { text: "", level: "M", pixel: 400 }
    data.fileList = []
    data.showCopy = false
    const canvas = document.getElementById("qrcode")
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function beforeUpload(file) {
    data.fileList = [file]
    return false
}

async function drawCenterIcon(canvas, pixel) {
    const uploadFile = data.fileList[0]
    const file = uploadFile?.originFileObj || uploadFile
    if (!file) return

    const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })

    const img = await new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = reject
        image.src = dataUrl
    })

    const ctx = canvas.getContext("2d")
    const iconSize = pixel / 5
    const iconX = (canvas.width - iconSize) / 2
    const iconY = (canvas.height - iconSize) / 2
    ctx.fillStyle = "#fff"
    ctx.fillRect(iconX - 6, iconY - 6, iconSize + 12, iconSize + 12)
    ctx.drawImage(img, iconX, iconY, iconSize, iconSize)
}

async function convertQRCode() {
    try {
        await formRef.value.validate()
        const canvas = document.getElementById("qrcode")
        const pixel = Number(data.formData.pixel)
        canvas.width = pixel
        canvas.height = pixel

        await QRCode.toCanvas(canvas, data.formData.text, {
            width: pixel,
            errorCorrectionLevel: data.formData.level,
            margin: 2,
        })

        await drawCenterIcon(canvas, pixel)
        data.showCopy = true
        message.success("二维码已生成")
    } catch (error) {
        if (error?.errorFields) {
            message.warning("请先完成必要输入")
        } else {
            message.error(error?.message || "生成失败")
        }
    }
}

function canvasBlob() {
    const canvas = document.getElementById("qrcode")
    return new Promise((resolve, reject) => {
        if (!canvas) {
            reject(new Error("二维码画布不存在"))
            return
        }
        canvas.toBlob(blob => {
            if (blob) resolve(blob)
            else reject(new Error("PNG 生成失败"))
        }, "image/png")
    })
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 500)
}

async function copyToClipBoard() {
    try {
        const blob = await canvasBlob()

        if (window.isSecureContext && navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
            try {
                await navigator.clipboard.write([new ClipboardItem({ "image/png":blob })])
                message.success("二维码已复制")
                return
            } catch (error) {
                console.warn("Clipboard image write failed, falling back to download.", error)
            }
        }

        downloadBlob(blob, "raym-qrcode.png")
        message.warning("浏览器限制了图片剪贴板，已改为下载 PNG")
    } catch (error) {
        console.error(error)
        message.error("二维码图片生成失败")
    }
}

async function downloadQrCode() {
    try {
        const blob = await canvasBlob()
        downloadBlob(blob, "raym-qrcode.png")
        message.success("二维码已下载")
    } catch (error) {
        console.error(error)
        message.error("二维码图片生成失败")
    }
}
</script>

<style scoped lang="scss">
.tool-detail{width:min(1180px,calc(100% - 40px));margin:48px auto 0}.back{color:var(--color-text-secondary);font-size:11px;text-decoration:none}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}.tool-head{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin:34px 0 36px}.tool-head h1{margin:14px 0;font-size:clamp(42px,5vw,54px);letter-spacing:-.04em}.tool-head p:last-child{max-width:700px;margin:0;color:var(--color-text-secondary);font-size:15px;line-height:1.75}.status{color:var(--color-accent-primary);font-size:10px}.tool-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:20px}.work-surface{padding:26px}.surface-head{position:relative;z-index:1;display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px}.surface-head h2{margin:8px 0 0;font-size:26px}.surface-head>span{color:var(--color-text-secondary);font-size:10px}.form-grid{display:grid;grid-template-columns:1fr 220px;gap:18px}.size-row{display:flex;align-items:center;gap:10px}.size-row span{color:var(--color-text-secondary);font-size:10px}.upload-copy{margin-top:6px;font-size:11px}.actions{display:flex;gap:12px;justify-content:flex-end;margin-top:8px}.result-block{position:relative;z-index:1;margin-top:32px;padding-top:28px;border-top:1px solid color-mix(in srgb,var(--color-border-default) 58%,transparent)}.result-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px}.result-head h3{margin:8px 0 0;font-size:20px}.result-head>span{color:var(--color-text-secondary);font-size:10px}.qr-stage{position:relative;display:grid;min-height:360px;margin-top:18px;place-items:center;border:1px dashed var(--color-border-default);border-radius:18px;background:var(--color-bg-raised);overflow:hidden}.qr-stage canvas{display:none;width:min(100%,420px);max-width:420px;height:auto!important;max-height:420px;aspect-ratio:1/1;object-fit:contain;background:#fff}.qr-stage.ready canvas{display:block}.placeholder{display:grid;place-items:center;color:var(--color-text-secondary)}.placeholder span{color:var(--color-accent-primary);font-size:38px}.placeholder p{margin:12px 0 0;font-size:12px}.result-actions{display:flex;gap:10px;margin-top:14px}.result-actions button{min-height:42px;padding:0 16px;border:1px solid var(--color-border-default);border-radius:11px;color:var(--color-text-primary);background:var(--color-bg-control);cursor:pointer}.side-stack{display:grid;align-content:start;gap:20px}.side-card{padding:22px}.side-card>*{position:relative;z-index:1}.side-card h3{margin:12px 0;font-size:20px;line-height:1.35}.side-card p:last-child{margin:0;color:var(--color-text-secondary);font-size:13px;line-height:1.75}
:deep(.ant-form-item-label>label){color:var(--color-text-primary)!important}:deep(.ant-input),:deep(.ant-input-number),:deep(.ant-radio-button-wrapper){color:var(--color-text-primary)!important;background:var(--color-bg-control)!important;border-color:var(--color-border-default)!important}:deep(.ant-input::placeholder){color:color-mix(in srgb,var(--color-text-secondary) 70%,transparent)}:deep(.ant-radio-button-wrapper-checked){color:var(--color-accent-contrast)!important;background:var(--color-action-primary)!important}:deep(.ant-btn-primary){color:var(--color-accent-contrast);background:var(--color-action-primary);border-color:var(--color-action-primary)}
@media(max-width:900px){.tool-layout{grid-template-columns:1fr}.side-stack{grid-template-columns:1fr 1fr}}
@media(max-width:650px){.tool-detail{margin-top:38px}.tool-head{align-items:flex-start;flex-direction:column}.form-grid,.side-stack{grid-template-columns:1fr}.actions,.result-actions{flex-direction:column}.actions :deep(.ant-btn),.result-actions button{width:100%}.qr-stage{min-height:300px}.work-surface{padding:20px}}
</style>
