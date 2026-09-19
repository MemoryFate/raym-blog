<template>
    <div class="tool-detail">
        <RouterLink class="back mono" to="/Tools">← 返回工具列表</RouterLink>

        <header class="tool-head">
            <div>
                <p class="eyebrow">工具 / Base64</p>
                <h1>Base64 转换</h1>
                <p>在图片 / 视频与 Base64 之间互相转换。Base64 是编码格式，不是加密方式。</p>
            </div>
            <span class="mono status">● 浏览器本地处理</span>
        </header>

        <div class="mode-tabs">
            <button type="button" :class="{ active:data.activeTab==='decode' }" @click="data.activeTab='decode'">Base64 → 文件</button>
            <button type="button" :class="{ active:data.activeTab==='encode' }" @click="data.activeTab='encode'">文件 → Base64</button>
        </div>

        <div class="tool-layout">
            <NeonGlass class="work-surface" glow>
                <template v-if="data.activeTab === 'decode'">
                    <div class="surface-head">
                        <div><p class="eyebrow">解码</p><h2>Base64 转图片 / 视频</h2></div>
                    </div>

                    <div class="type-switch">
                        <button type="button" :class="{active:data.decodeType==='image'}" @click="data.decodeType='image'">图片</button>
                        <button type="button" :class="{active:data.decodeType==='video'}" @click="data.decodeType='video'">视频</button>
                    </div>

                    <label class="field">
                        <span>Base64 内容</span>
                        <a-textarea v-model:value="data.base64Input" placeholder="粘贴 Base64 文本或 Data URL" :rows="10" />
                    </label>

                    <div class="actions">
                        <a-button type="primary" @click="decodeBase64">转换并预览</a-button>
                        <a-button @click="clearDecode">清空</a-button>
                    </div>
                </template>

                <template v-else>
                    <div class="surface-head">
                        <div><p class="eyebrow">编码</p><h2>图片 / 视频转 Base64</h2></div>
                    </div>

                    <div class="type-switch">
                        <button type="button" :class="{active:data.encodeType==='image'}" @click="data.encodeType='image'">图片</button>
                        <button type="button" :class="{active:data.encodeType==='video'}" @click="data.encodeType='video'">视频</button>
                    </div>

                    <div class="drop-zone">
                        <a-upload
                            :before-upload="handleFileUpload"
                            :show-upload-list="false"
                            accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.ogg"
                        >
                            <a-button>选择{{ data.encodeType === "image" ? "图片" : "视频" }}</a-button>
                        </a-upload>
                        <div>
                            <strong>{{ data.fileName || "尚未选择文件" }}</strong>
                            <span>{{ data.fileName ? formatFileSize(data.fileSize) : "支持常见图片和视频格式" }}</span>
                        </div>
                    </div>

                    <div class="actions">
                        <a-button type="primary" :loading="data.encoding" @click="encodeFile">转换为 Base64</a-button>
                        <a-button @click="clearEncode">清空</a-button>
                    </div>

                    <label class="field">
                        <span>Base64 结果</span>
                        <a-textarea v-model:value="data.base64Output" placeholder="转换结果将显示在这里" :rows="10" readonly />
                    </label>

                    <div v-if="data.base64Output" class="plain-actions">
                        <button type="button" @click="copyBase64">复制 Base64</button>
                        <button type="button" @click="downloadBase64Txt">下载 TXT</button>
                    </div>
                </template>
            </NeonGlass>

            <aside class="side-stack">
                <NeonGlass class="preview-card">
                    <p class="eyebrow">预览</p>
                    <div class="preview-box">
                        <img v-if="data.decodeType === 'image' && data.previewUrl" :src="data.previewUrl" alt="转换预览" />
                        <video v-if="data.decodeType === 'video' && data.previewUrl" :src="data.previewUrl" controls></video>
                        <div v-if="!data.previewUrl" class="placeholder"><span>64</span><p>解码后可在这里预览文件</p></div>
                    </div>
                    <button v-if="data.previewUrl" type="button" class="download" @click="downloadFile">下载转换文件</button>
                </NeonGlass>

                <NeonGlass class="note-card">
                    <p class="eyebrow">说明</p>
                    <h3>Base64 ≠ 加密</h3>
                    <p>它只是把二进制数据编码成文本形式，不能用于保护密码、密钥或其他敏感信息。</p>
                </NeonGlass>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, reactive } from "vue"
import { message } from "ant-design-vue"
import NeonGlass from "@/components/ui/NeonGlass.vue"

const data = reactive({
    activeTab:"decode",
    decodeType:"image",
    encodeType:"image",
    base64Input:"",
    previewUrl:"",
    fileName:"",
    fileSize:0,
    fileData:null,
    base64Output:"",
    encoding:false,
})

function revokePreview() {
    if (data.previewUrl) URL.revokeObjectURL(data.previewUrl)
    data.previewUrl = ""
}

function formatFileSize(bytes) {
    if (!bytes) return "0 B"
    const k = 1024
    const sizes = ["B","KB","MB","GB"]
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function decodeBase64() {
    if (!data.base64Input.trim()) {
        message.warning("请输入 Base64 内容")
        return
    }

    try {
        revokePreview()
        let base64 = data.base64Input.trim()
        const mimeMatch = base64.match(/^data:([^;]+);base64,/)
        if (mimeMatch) base64 = base64.replace(/^data:([^;]+);base64,/, "")

        const binaryString = atob(base64)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i += 1) bytes[i] = binaryString.charCodeAt(i)

        const mimeType = mimeMatch
            ? mimeMatch[1]
            : data.decodeType === "image" ? "image/png" : "video/mp4"

        data.previewUrl = URL.createObjectURL(new Blob([bytes], { type:mimeType }))
        message.success("转换成功")
    } catch (error) {
        message.error("Base64 解析失败，请检查输入内容")
    }
}

function clearDecode() {
    data.base64Input = ""
    revokePreview()
}

function downloadFile() {
    if (!data.previewUrl) return
    const link = document.createElement("a")
    link.href = data.previewUrl
    link.download = data.decodeType === "image" ? "converted.png" : "converted.mp4"
    link.click()
}

function handleFileUpload(file) {
    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")

    if (!isImage && !isVideo) {
        message.error("只能选择图片或视频文件")
        return false
    }
    if (data.encodeType === "image" && !isImage) {
        message.error("当前模式请选择图片文件")
        return false
    }
    if (data.encodeType === "video" && !isVideo) {
        message.error("当前模式请选择视频文件")
        return false
    }

    data.fileName = file.name
    data.fileSize = file.size
    data.fileData = file
    data.base64Output = ""
    return false
}

function encodeFile() {
    if (!data.fileData) {
        message.warning("请先选择文件")
        return
    }

    data.encoding = true
    const reader = new FileReader()
    reader.onload = event => {
        data.base64Output = event.target.result
        data.encoding = false
        message.success("转换成功")
    }
    reader.onerror = () => {
        data.encoding = false
        message.error("文件读取失败")
    }
    reader.readAsDataURL(data.fileData)
}

function clearEncode() {
    data.fileName = ""
    data.fileSize = 0
    data.fileData = null
    data.base64Output = ""
}

async function copyBase64() {
    try {
        await navigator.clipboard.writeText(data.base64Output)
        message.success("已复制")
    } catch {
        message.error("复制失败")
    }
}

function downloadBase64Txt() {
    if (!data.base64Output) return
    const blob = new Blob([data.base64Output], { type:"text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = (data.fileName || "base64") + ".txt"
    link.click()
    URL.revokeObjectURL(url)
}

onBeforeUnmount(revokePreview)
</script>

<style scoped lang="scss">
.tool-detail{width:min(1180px,calc(100% - 40px));margin:48px auto 0}.back{color:var(--color-text-secondary);font-size:11px;text-decoration:none}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}.tool-head{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin:34px 0 28px}.tool-head h1{margin:14px 0;font-size:clamp(42px,5vw,54px);letter-spacing:-.04em}.tool-head p:last-child{max-width:760px;margin:0;color:var(--color-text-secondary);font-size:15px;line-height:1.75}.status{color:var(--color-accent-primary);font-size:10px}.mode-tabs{display:grid;grid-template-columns:1fr 1fr;width:min(520px,100%);gap:6px;margin-bottom:20px;padding:5px;border:1px solid var(--color-border-glow);border-radius:14px;background:var(--color-bg-panel-strong)}.mode-tabs button,.type-switch button{min-height:42px;border:0;border-radius:10px;color:var(--color-text-secondary);background:transparent;cursor:pointer}.mode-tabs button.active,.type-switch button.active{color:var(--color-accent-contrast);background:var(--color-action-primary);font-weight:600}.tool-layout{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:20px}.work-surface{padding:26px}.surface-head{position:relative;z-index:1}.surface-head h2{margin:8px 0 0;font-size:26px}.type-switch{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:24px}.type-switch button{border:1px solid var(--color-border-glow);background:var(--color-bg-panel-strong)}.field{position:relative;z-index:1;display:grid;gap:9px;margin-top:24px;color:var(--color-text-primary);font-size:12px}.actions{position:relative;z-index:1;display:flex;gap:12px;margin-top:22px}.drop-zone{position:relative;z-index:1;display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center;min-height:130px;margin-top:24px;padding:20px;border:1px dashed var(--color-border-glow);border-radius:16px;background:var(--color-bg-panel-strong)}.drop-zone>div{display:grid;gap:5px}.drop-zone strong{font-size:13px}.drop-zone span{color:var(--color-text-secondary);font-size:11px}.plain-actions{position:relative;z-index:1;display:flex;gap:10px;margin-top:14px}.plain-actions button,.download{min-height:42px;padding:0 14px;border:1px solid var(--color-border-glow);border-radius:10px;color:var(--color-text-primary);background:var(--color-chip-bg);cursor:pointer}.side-stack{display:grid;align-content:start;gap:20px}.preview-card,.note-card{padding:22px}.preview-card>*,.note-card>*{position:relative;z-index:1}.preview-box{display:grid;min-height:280px;margin-top:16px;place-items:center;overflow:hidden;border:1px dashed var(--color-border-glow);border-radius:15px;background:var(--color-bg-panel-strong)}.preview-box img,.preview-box video{max-width:100%;max-height:360px}.placeholder{display:grid;place-items:center;color:var(--color-text-secondary);text-align:center}.placeholder span{display:grid;width:58px;height:58px;place-items:center;border:1px solid var(--color-border-glow);border-radius:15px;color:var(--color-accent-primary);background:var(--color-chip-bg);font-size:18px}.placeholder p{font-size:11px}.download{width:100%;margin-top:12px}.note-card h3{margin:12px 0;font-size:22px}.note-card p:last-child{margin:0;color:var(--color-text-secondary);font-size:13px;line-height:1.75}
:deep(.ant-input){color:var(--color-text-primary)!important;background:var(--color-bg-panel-strong)!important;border-color:var(--color-border-glow)!important}:deep(.ant-input::placeholder){color:color-mix(in srgb,var(--color-text-secondary) 70%,transparent)}:deep(.ant-btn){border-color:var(--color-border-glow);color:var(--color-text-primary);background:var(--color-chip-bg)}:deep(.ant-btn-primary){color:var(--color-accent-contrast);background:var(--color-action-primary);border-color:var(--color-action-primary)}
@media(max-width:950px){.tool-layout{grid-template-columns:1fr}.side-stack{grid-template-columns:1.2fr .8fr}.preview-box{min-height:220px}}
@media(max-width:650px){.tool-detail{margin-top:38px}.tool-head{align-items:flex-start;flex-direction:column}.side-stack{grid-template-columns:1fr}.actions,.plain-actions{flex-direction:column}.actions :deep(.ant-btn),.plain-actions button{width:100%}.drop-zone{grid-template-columns:1fr}.work-surface{padding:20px}}
</style>
