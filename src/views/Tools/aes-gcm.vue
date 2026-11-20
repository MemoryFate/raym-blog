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
                    <small>当前密钥会保存在本地；只有解密成功的密钥才会加入“已验证密钥”。</small>
                </label>

                <div v-if="data.verifiedKeys.length" class="verified-keys">
                    <div class="verified-head">
                        <div>
                            <span>已验证密钥</span>
                            <small>选择历史成功密钥后会自动填入上方输入框。</small>
                        </div>
                        <button type="button" @click="clearVerifiedKeys">清空记录</button>
                    </div>

                    <a-select
                        v-model:value="data.selectedVerifiedKey"
                        class="verified-select"
                        placeholder="选择已验证密钥"
                        @change="useVerifiedKey"
                    >
                        <a-select-option
                            v-for="item in data.verifiedKeys"
                            :key="item.key"
                            :value="item.key"
                        >
                            {{ maskedKey(item.key) }} · {{ formatVerifiedTime(item.verifiedAt) }}
                        </a-select-option>
                    </a-select>
                </div>

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

                <NeonGlass class="side-card url-quick-card">
                    <div class="url-quick-heading">
                        <div>
                            <p class="eyebrow">快捷工具 · 本地处理</p>
                            <h3>URL 预处理</h3>
                        </div>
                        <span class="mono url-quick-mark">%</span>
                    </div>
                    <p class="url-quick-tip">处理 URL 编码密文，结果一键填入 AES-GCM 解密框。</p>

                    <div class="url-quick-top">
                        <a-select
                            class="url-encoding-select"
                            :value="urlTool.encoding"
                            :options="URL_ENCODING_OPTIONS"
                            size="small"
                            aria-label="URL 字符编码"
                            @change="changeUrlEncoding"
                        />
                        <button type="button" class="url-text-action" :disabled="!data.input" @click="readCipherToUrl">读取左侧</button>
                    </div>

                    <a-textarea
                        :value="urlTool.input"
                        :rows="3"
                        class="url-quick-input"
                        placeholder="粘贴经过 URL 编码的密文…"
                        aria-label="URL 预处理输入内容"
                        spellcheck="false"
                        @update:value="updateUrlInput"
                    />

                    <div class="url-quick-actions">
                        <button type="button" @click="runUrlOperation('decode')">URL 解码</button>
                        <button type="button" @click="runUrlOperation('encode')">URL 编码</button>
                        <button type="button" @click="runUrlOperation('space-to-plus')">空格 → +</button>
                        <button type="button" @click="runUrlOperation('decode-space-to-plus')">解码 + 修复</button>
                    </div>

                    <Transition name="url-feedback">
                        <div v-if="urlTool.operation || urlTool.error" class="url-quick-result" aria-live="polite">
                            <div class="url-quick-result-head">
                                <span>{{ urlTool.error ? "处理失败" : urlOperationLabel }}</span>
                                <button v-if="urlTool.operation" type="button" @click="copyUrlResult">复制</button>
                            </div>
                            <p v-if="urlTool.error" class="url-quick-error">{{ urlTool.error }}</p>
                            <pre v-else>{{ urlTool.output || "（空结果）" }}</pre>
                        </div>
                    </Transition>

                    <div class="url-quick-footer">
                        <button type="button" class="url-text-action" @click="clearUrlTool">清空</button>
                        <a-button
                            type="primary"
                            size="small"
                            :disabled="!urlTool.output || !isDecryptReadyOperation(urlTool.operation)"
                            @click="applyUrlToDecrypt"
                        >填入并解密</a-button>
                    </div>
                    <p class="url-quick-footnote">空格修复适用于 Base64 的 + 被转换为空格的情况。</p>
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
import { URL_ENCODING_OPTIONS } from "@/utils/urlCodec.js"
import { preprocessAesUrlText, isDecryptReadyOperation } from "@/utils/aesUrlPreprocess.js"

const urlTool = reactive({
    input: "",
    output: "",
    encoding: "UTF-8",
    operation: "",
    error: "",
})

const urlOperationLabel = computed(() => ({
    encode: "URL 编码完成",
    decode: "URL 解码完成",
    "space-to-plus": "空格修复完成",
    "decode-space-to-plus": "解码和修复完成",
})[urlTool.operation] || "待处理")

function resetUrlResult() {
    urlTool.output = ""
    urlTool.operation = ""
    urlTool.error = ""
}

function updateUrlInput(value) {
    urlTool.input = value
    resetUrlResult()
}

function changeUrlEncoding(value) {
    urlTool.encoding = value
    resetUrlResult()
}

function readCipherToUrl() {
    if (!data.input) return
    urlTool.input = data.input
    resetUrlResult()
}

function clearUrlTool() {
    urlTool.input = ""
    resetUrlResult()
}

function runUrlOperation(operation) {
    if (!urlTool.input) {
        message.warning("请先输入需要处理的 URL 文本")
        return
    }
    try {
        urlTool.output = preprocessAesUrlText(urlTool.input, operation, urlTool.encoding)
        urlTool.operation = operation
        urlTool.error = ""
    } catch (error) {
        resetUrlResult()
        urlTool.error = error instanceof Error ? error.message : "URL 处理失败"
        message.error(urlTool.error)
    }
}

function applyUrlToDecrypt() {
    if (!urlTool.output || !isDecryptReadyOperation(urlTool.operation)) return
    // 保持原 AES 密钥、已验证密钥与输入监听逻辑不变。
    const unchanged = data.type === "decrypt" && data.input === urlTool.output
    data.type = "decrypt"
    data.input = urlTool.output
    if (unchanged) transformInput()
    message.success("已填入 Base64 密文，正在按原有逻辑解密")
}

function copyUrlResult() {
    if (urlTool.operation) copyToClipBoard(urlTool.output)
}

const VERIFIED_KEYS_STORAGE = "aes-gcm-verified-keys-v1"
const CURRENT_KEY_STORAGE = "aes-gcm-key"
const MAX_VERIFIED_KEYS = 8

function loadVerifiedKeys() {
    try {
        const parsed = JSON.parse(localStorage.getItem(VERIFIED_KEYS_STORAGE) || "[]")
        if (!Array.isArray(parsed)) return []
        return parsed
            .filter(item => item && typeof item.key === "string" && item.key)
            .slice(0, MAX_VERIFIED_KEYS)
    } catch {
        return []
    }
}

const data = reactive({
    key: localStorage.getItem(CURRENT_KEY_STORAGE) || "IszSeX2SAAebo2hA",
    input: "",
    output: "",
    type: "decrypt",
    verifiedKeys: loadVerifiedKeys(),
    selectedVerifiedKey: undefined,
})

const resultState = computed(() => {
    if (!data.input) return "等待输入"
    if (data.output?.startsWith("解密失败")) return "解密失败"
    return data.type === "encrypt" ? "加密完成" : "解密完成"
})

watch(() => data.key, (value) => {
    localStorage.setItem(CURRENT_KEY_STORAGE, value)
    if (data.selectedVerifiedKey !== value) data.selectedVerifiedKey = undefined
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

    if (
        data.type === "decrypt" &&
        data.key &&
        data.output &&
        !data.output.startsWith("解密失败")
    ) {
        rememberVerifiedKey(data.key)
    }
}

function rememberVerifiedKey(key) {
    const now = Date.now()
    const next = [
        { key, verifiedAt:now },
        ...data.verifiedKeys.filter(item => item.key !== key),
    ].slice(0, MAX_VERIFIED_KEYS)

    data.verifiedKeys = next
    data.selectedVerifiedKey = key
    localStorage.setItem(VERIFIED_KEYS_STORAGE, JSON.stringify(next))
}

function useVerifiedKey(key) {
    if (!key) return
    data.key = key
}

function clearVerifiedKeys() {
    data.verifiedKeys = []
    data.selectedVerifiedKey = undefined
    localStorage.removeItem(VERIFIED_KEYS_STORAGE)
    message.success("已清空已验证密钥")
}

function maskedKey(key) {
    if (!key) return ""
    if (key.length <= 6) return "••••••"
    return key.slice(0, 2) + "••••••" + key.slice(-4)
}

function formatVerifiedTime(timestamp) {
    if (!timestamp) return "已验证"
    try {
        return new Date(timestamp).toLocaleString("zh-CN", {
            month:"2-digit",
            day:"2-digit",
            hour:"2-digit",
            minute:"2-digit",
            hour12:false,
        })
    } catch {
        return "已验证"
    }
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
.tool-detail{width:min(1180px,calc(100% - 40px));margin:48px auto 0}.back{color:var(--color-text-secondary);font-size:11px;text-decoration:none}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}.tool-head{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin:34px 0 36px}.tool-head h1{margin:14px 0;font-size:clamp(42px,5vw,54px);letter-spacing:-.04em}.tool-head p:last-child{max-width:760px;margin:0;color:var(--color-text-secondary);font-size:15px;line-height:1.75}.status{color:var(--color-accent-primary);font-size:10px}.tool-layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:20px}.work-surface{padding:26px}.mode-tabs{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:28px;padding:5px;border:1px solid var(--color-border-default);border-radius:14px;background:var(--color-bg-raised)}.mode-tabs button{min-height:42px;border:0;border-radius:10px;color:var(--color-text-secondary);background:transparent;cursor:pointer}.mode-tabs button.active{color:var(--color-accent-contrast);background:var(--color-action-primary);font-weight:600}.field{position:relative;z-index:1;display:grid;gap:9px;margin-top:22px;color:var(--color-text-primary);font-size:12px}.field small{color:var(--color-text-secondary);font-size:10px;line-height:1.5}.verified-keys{position:relative;z-index:1;margin-top:14px;padding:14px;border:1px solid var(--color-border-default);border-radius:12px;background:var(--color-bg-raised)}.verified-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:10px}.verified-head>div{display:grid;gap:4px}.verified-head span{font-size:12px;color:var(--color-text-primary)}.verified-head small{font-size:10px;line-height:1.5;color:var(--color-text-secondary)}.verified-head button{padding:0;border:0;color:var(--color-text-secondary);background:transparent;cursor:pointer;font-size:10px}.verified-head button:hover{color:var(--color-accent-primary)}.verified-select{width:100%}.format-note{position:relative;z-index:1;display:grid;gap:7px;margin-top:24px;padding:14px;border:1px solid var(--color-border-default);border-radius:12px;background:var(--color-bg-raised);font-size:10px}.format-note span{color:var(--color-accent-primary)}.format-note code{color:var(--color-text-secondary);white-space:normal}.result{position:relative;z-index:1;margin-top:28px;padding-top:28px;border-top:1px solid color-mix(in srgb,var(--color-border-default) 58%,transparent)}.result-head{display:flex;justify-content:space-between;gap:20px}.result-head h3{margin:8px 0 0;font-size:20px}.result-head button{align-self:center;border:0;color:var(--color-accent-primary);background:transparent;cursor:pointer}.result pre{min-height:190px;margin:18px 0 0;padding:16px;overflow:auto;border:1px solid var(--color-border-default);border-radius:14px;color:var(--color-text-primary);background:var(--color-bg-raised);font-family:"IBM Plex Mono",monospace;font-size:11px;line-height:1.7;white-space:pre-wrap;word-break:break-word}.side-stack{display:grid;align-content:start;gap:20px}.side-card{padding:22px}.side-card>*{position:relative;z-index:1}.side-card h3{margin:12px 0;font-size:20px;line-height:1.4}.side-card ul{display:grid;gap:12px;margin:16px 0 0;padding-left:18px;color:var(--color-text-secondary);font-size:13px;line-height:1.65}.side-card p:last-child{color:var(--color-text-secondary);line-height:1.7}.side-card .accent{color:var(--color-accent-primary);font-size:11px}
:deep(.ant-input),:deep(.ant-input-affix-wrapper),:deep(.ant-input-password){color:var(--color-text-primary)!important;background:var(--color-bg-control)!important;border-color:var(--color-border-default)!important}:deep(.ant-input::placeholder){color:color-mix(in srgb,var(--color-text-secondary) 70%,transparent)}:deep(.ant-input-affix-wrapper input){color:var(--color-text-primary)!important;background:transparent!important}:deep(.verified-select .ant-select-selector){color:var(--color-text-primary)!important;background:var(--color-bg-control)!important;border-color:var(--color-border-default)!important}:deep(.verified-select .ant-select-selection-placeholder){color:color-mix(in srgb,var(--color-text-secondary) 70%,transparent)!important}:deep(.verified-select .ant-select-selection-item){color:var(--color-text-primary)!important}
@media(max-width:900px){.tool-layout{grid-template-columns:1fr}.side-stack{grid-template-columns:1fr 1fr}}
@media(max-width:650px){.tool-detail{margin-top:38px}.tool-head{align-items:flex-start;flex-direction:column}.side-stack{grid-template-columns:1fr}.work-surface{padding:20px}}

/* 紧凑的 URL 预处理面板：不会占据原有 AES 主编辑区高度 */
.url-quick-card{padding:17px 18px 15px}
.url-quick-heading{display:flex;justify-content:space-between;align-items:center;gap:8px}
.url-quick-heading h3{font-size:17px;margin:6px 0 0}
.url-quick-mark{font-size:22px;color:var(--color-accent-primary);opacity:.65}
.url-quick-tip{margin:9px 0 12px!important;color:var(--color-text-secondary);font-size:11px;line-height:1.55!important}
.url-quick-top{display:flex;align-items:center;gap:10px;margin-bottom:9px}
.url-encoding-select{flex:1;min-width:0}
.url-text-action{border:0;background:transparent;color:var(--color-accent-primary);cursor:pointer;white-space:nowrap;font-size:11px;padding:5px 0}
.url-text-action:disabled{opacity:.4;cursor:not-allowed}
.url-quick-input{resize:vertical;min-height:72px!important}
.url-quick-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px}
.url-quick-actions button{min-width:0;min-height:32px;padding:6px 5px;border-radius:9px;border:1px solid var(--color-border-default);background:var(--color-bg-control);color:var(--color-text-primary);font-size:11px;cursor:pointer;transition:transform 170ms ease,border-color 170ms ease,background 170ms ease}
.url-quick-actions button:hover{transform:translateY(-1px);border-color:var(--color-border-strong);background:var(--color-bg-selected)}
.url-quick-actions button:active{transform:translateY(0)}
.url-quick-result{margin-top:10px;padding:9px 10px;border:1px solid var(--color-border-default);border-radius:9px;background:var(--color-bg-control);overflow:hidden}
.url-quick-result-head{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:10px;color:var(--color-accent-primary)}
.url-quick-result-head button{background:transparent;color:var(--color-accent-primary);border:0;cursor:pointer;font-size:10px}
.url-quick-result pre{margin:7px 0 0;max-height:64px;overflow:auto;overflow-wrap:anywhere;white-space:pre-wrap;color:var(--color-text-primary);font:11px/1.5 "IBM Plex Mono",monospace}
.url-quick-error{margin:7px 0 0!important;font-size:11px;line-height:1.5;color:#e87878!important;overflow-wrap:anywhere}
.url-quick-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:10px}
.url-quick-footer :deep(.ant-btn-primary){color:var(--color-accent-contrast);background:var(--color-action-primary);border-color:var(--color-action-primary)}
.url-quick-footer :deep(.ant-btn-primary:disabled){opacity:.5}
.url-quick-footnote{font-size:10px;line-height:1.5!important;margin:8px 0 0!important;color:var(--color-text-secondary)}
:deep(.url-quick-input.ant-input){font-size:11px;line-height:1.5;color:var(--color-text-primary)!important;background:var(--color-bg-control)!important;border-color:var(--color-border-default)!important}
:deep(.url-encoding-select .ant-select-selector){border-color:var(--color-border-default)!important;background:var(--color-bg-control)!important}
:deep(.url-encoding-select .ant-select-selection-item){color:var(--color-text-primary)!important;font-size:11px}
.url-feedback-enter-active{transition:opacity 190ms ease,transform 190ms cubic-bezier(.2,.8,.2,1)}
.url-feedback-enter-from{opacity:0;transform:translateY(5px)}
@media(max-width:900px) and (min-width:651px){.side-stack{grid-template-columns:repeat(2,minmax(0,1fr))}.url-quick-card{grid-column:1/-1}}
@media(prefers-reduced-motion:reduce){.url-quick-actions button,.url-feedback-enter-active{transition:none!important}.url-quick-actions button:hover{transform:none}}
</style>
