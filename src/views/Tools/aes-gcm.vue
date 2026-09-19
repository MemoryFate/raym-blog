<template>
    <div class="tool-detail">
        <RouterLink class="back mono" to="/Tools">← 返回工具列表</RouterLink>

        <header class="tool-head">
            <div>
                <p class="eyebrow">工具 / AES-GCM</p>
                <h1>AES-GCM</h1>
                <p>在浏览器本地完成 AES-GCM 加密与解密。当前格式会自动生成 IV，并将 IV、密文与认证 Tag 打包为 Base64。</p>
            </div>
            <span class="mono status">● 本地处理</span>
        </header>

        <div class="tool-layout">
            <NeonGlass class="work-surface" glow>
                <div class="mode-tabs">
                    <button type="button" :class="{ active:data.type==='encrypt' }" @click="setMode('encrypt')">加密</button>
                    <button type="button" :class="{ active:data.type==='decrypt' }" @click="setMode('decrypt')">解密</button>
                </div>

                <label class="field">
                    <span>密钥</span>
                    <a-input-password v-model:value="data.key" placeholder="输入 AES 密钥" />
                    <small>密钥会保存在当前浏览器的 localStorage 中，方便重复使用。</small>
                </label>

                <label class="field">
                    <span>{{ data.type === "encrypt" ? "明文" : "Base64 密文" }}</span>
                    <a-textarea
                        v-model:value="data.input"
                        :placeholder="data.type === 'encrypt' ? '输入需要加密的文本' : '输入需要解密的 Base64 内容'"
                        :rows="8"
                    />
                </label>

                <div class="format-note mono">
                    <span>格式</span>
                    <code>12-byte IV + ciphertext + 16-byte auth tag → Base64</code>
                </div>

                <div class="result">
                    <div class="result-head">
                        <div><p class="eyebrow">结果</p><h3>{{ resultState }}</h3></div>
                        <button v-if="data.output" type="button" @click="copyToClipBoard(data.output)">复制结果</button>
                    </div>
                    <pre>{{ data.output || "结果会在输入内容变化后自动生成" }}</pre>
                </div>
            </NeonGlass>

            <aside class="side-stack">
                <NeonGlass class="side-card">
                    <p class="eyebrow">安全提示</p>
                    <h3>AES-GCM 同时提供加密与完整性校验</h3>
                    <ul>
                        <li>同一个密钥不要重复使用相同 IV。</li>
                        <li>不要在共享设备上长期保存生产环境密钥。</li>
                        <li>解密失败可能表示密钥错误、内容损坏或认证失败。</li>
                    </ul>
                </NeonGlass>

                <NeonGlass class="side-card">
                    <p class="eyebrow">当前状态</p>
                    <h3>{{ data.type === "encrypt" ? "加密模式" : "解密模式" }}</h3>
                    <p class="mono accent">{{ data.output ? "● 已生成结果" : "○ 等待输入" }}</p>
                </NeonGlass>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue"
import { message } from "ant-design-vue"
import forge from "node-forge"
import NeonGlass from "@/components/ui/NeonGlass.vue"

const data = reactive({
    key: localStorage.getItem("aes-gcm-key") || "IszSeX2SAAebo2hA",
    input: "",
    output: "",
    type: "decrypt",
})

const resultState = computed(() => {
    if (!data.input) return "等待输入"
    if (data.output?.startsWith("解密失败")) return "解密失败"
    return data.type === "encrypt" ? "加密完成" : "解密完成"
})

watch(() => data.key, (value) => {
    localStorage.setItem("aes-gcm-key", value)
    transformInput()
})

watch(() => data.input, transformInput)

function setMode(mode) {
    data.type = mode
    data.input = ""
    data.output = ""
}

function transformInput() {
    if (!data.input) {
        data.output = ""
        return
    }
    data.output = data.type === "encrypt" ? encrypt(data.input) : decrypt(data.input)
}

function encrypt(word) {
    if (!word || !data.key) return ""
    try {
        const iv = forge.random.getBytesSync(12)
        const cipher = forge.cipher.createCipher("AES-GCM", data.key)
        cipher.start({ iv })
        cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(word)))
        cipher.finish()

        const ivHex = forge.util.createBuffer(iv).toHex()
        const encryptedHex = forge.util.createBuffer(cipher.output.data).toHex()
        const tagHex = forge.util.createBuffer(cipher.mode.tag.data).toHex()
        const totalHex = ivHex + encryptedHex + tagHex
        const totalBytes = new Uint8Array(totalHex.match(/.{2}/g).map(byte => parseInt(byte, 16)))

        return btoa(String.fromCharCode.apply(null, totalBytes)).replace(/[\r\n]/g, "")
    } catch (error) {
        return "加密失败，请检查密钥与输入内容"
    }
}

function decrypt(word) {
    if (!word || !data.key) return ""
    try {
        const raw = atob(word)
        const buffer = forge.util.createBuffer(raw, "raw")
        const iv = buffer.getBytes(12)
        const ciphertextLength = buffer.length() - 16
        if (ciphertextLength < 0) return "解密失败，请检查输入内容"
        const ciphertext = buffer.getBytes(ciphertextLength)
        const tag = buffer.getBytes(16)

        const decipher = forge.cipher.createDecipher("AES-GCM", data.key)
        decipher.start({ iv, tag })
        decipher.update(forge.util.createBuffer(ciphertext))
        const pass = decipher.finish()

        return pass ? forge.util.decodeUtf8(decipher.output.getBytes()) : "解密失败，请检查密钥或输入内容"
    } catch (error) {
        return "解密失败，请检查密钥或输入内容"
    }
}

async function copyToClipBoard(value) {
    try {
        await navigator.clipboard.writeText(value)
        message.success("已复制")
    } catch {
        message.error("复制失败")
    }
}
</script>

<style scoped lang="scss">
.tool-detail{width:min(1180px,calc(100% - 40px));margin:48px auto 0}.back{color:var(--color-text-secondary);font-size:11px;text-decoration:none}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}.tool-head{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin:34px 0 36px}.tool-head h1{margin:14px 0;font-size:clamp(42px,5vw,54px);letter-spacing:-.04em}.tool-head p:last-child{max-width:760px;margin:0;color:var(--color-text-secondary);font-size:15px;line-height:1.75}.status{color:var(--color-accent-primary);font-size:10px}.tool-layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:20px}.work-surface{padding:26px}.mode-tabs{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:28px;padding:5px;border:1px solid var(--color-border-glow);border-radius:14px;background:var(--color-bg-panel-strong)}.mode-tabs button{min-height:42px;border:0;border-radius:10px;color:var(--color-text-secondary);background:transparent;cursor:pointer}.mode-tabs button.active{color:var(--color-accent-contrast);background:var(--color-action-primary);font-weight:600}.field{position:relative;z-index:1;display:grid;gap:9px;margin-top:22px;color:var(--color-text-primary);font-size:12px}.field small{color:var(--color-text-secondary);font-size:10px;line-height:1.5}.format-note{position:relative;z-index:1;display:grid;gap:7px;margin-top:24px;padding:14px;border:1px solid var(--color-border-glow);border-radius:12px;background:var(--color-bg-panel-strong);font-size:10px}.format-note span{color:var(--color-accent-primary)}.format-note code{color:var(--color-text-secondary);white-space:normal}.result{position:relative;z-index:1;margin-top:28px;padding-top:28px;border-top:1px solid color-mix(in srgb,var(--color-border-glow) 48%,transparent)}.result-head{display:flex;justify-content:space-between;gap:20px}.result-head h3{margin:8px 0 0;font-size:20px}.result-head button{align-self:center;border:0;color:var(--color-accent-primary);background:transparent;cursor:pointer}.result pre{min-height:190px;margin:18px 0 0;padding:16px;overflow:auto;border:1px solid var(--color-border-glow);border-radius:14px;color:var(--color-text-primary);background:#050914;font-family:"IBM Plex Mono",monospace;font-size:11px;line-height:1.7;white-space:pre-wrap;word-break:break-word}.side-stack{display:grid;align-content:start;gap:20px}.side-card{padding:22px}.side-card>*{position:relative;z-index:1}.side-card h3{margin:12px 0;font-size:20px;line-height:1.4}.side-card ul{display:grid;gap:12px;margin:16px 0 0;padding-left:18px;color:var(--color-text-secondary);font-size:13px;line-height:1.65}.side-card p:last-child{color:var(--color-text-secondary);line-height:1.7}.side-card .accent{color:var(--color-accent-primary);font-size:11px}
:deep(.ant-input),:deep(.ant-input-affix-wrapper),:deep(.ant-input-password){color:var(--color-text-primary)!important;background:var(--color-bg-panel-strong)!important;border-color:var(--color-border-glow)!important}:deep(.ant-input::placeholder){color:color-mix(in srgb,var(--color-text-secondary) 70%,transparent)}:deep(.ant-input-affix-wrapper input){color:var(--color-text-primary)!important;background:transparent!important}
@media(max-width:900px){.tool-layout{grid-template-columns:1fr}.side-stack{grid-template-columns:1fr 1fr}}
@media(max-width:650px){.tool-detail{margin-top:38px}.tool-head{align-items:flex-start;flex-direction:column}.side-stack{grid-template-columns:1fr}.work-surface{padding:20px}}
</style>
