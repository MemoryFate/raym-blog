<template>
    <div class="tool-detail">
        <RouterLink class="back mono" to="/Tools">← 返回工具列表</RouterLink>

        <header class="tool-head">
            <div>
                <p class="eyebrow">工具 / 文本转换</p>
                <h1>URL 编码/解码</h1>
                <p>对 URL 字符串进行百分号编码与解码，支持 UTF-8 中文和特殊字符。</p>
            </div>
            <span class="mono local-status">● 浏览器本地处理</span>
        </header>

        <NeonGlass class="input-card" glow>
            <div class="card-heading">
                <div>
                    <p class="eyebrow">输入</p>
                    <h2>待处理文本</h2>
                </div>
                <span class="mono word-count">{{ characterCount }} 字</span>
            </div>
            <a-textarea
                :value="inputText"
                @update:value="updateInput"
                :rows="10"
                placeholder="请输入需要 URL 编码/解码的文本"
                aria-label="需要 URL 编码或解码的文本"
                spellcheck="false"
            />
        </NeonGlass>

        <div class="toolbar">
            <div class="toolbar-main">
                <label class="encoding-setting">
                    <span>字符编码：</span>
                    <a-select :value="'UTF-8'" :options="encodingOptions" disabled aria-label="字符编码 UTF-8" />
                </label>
                <a-button type="primary" @click="run('encode')">URL 编码</a-button>
                <a-button @click="run('decode')">URL 解码</a-button>
                <a-button @click="run('spaceToPlus')" title="先 URL 解码，再将普通空格替换为 +">
                    URL 解码（空格 → +）
                </a-button>
            </div>
            <div class="toolbar-secondary">
                <a-button :disabled="!outputText" @click="swapTexts">⇅ 交换</a-button>
                <a-button danger @click="clearAll">清空</a-button>
            </div>
        </div>

        <NeonGlass class="result-card">
            <div class="result-heading">
                <div class="result-labels">
                    <h2>处理结果</h2>
                    <span class="state-tag" :class="status" role="status">
                        {{ status === "success" ? "已完成" : status === "error" ? "处理失败" : "待处理" }}
                    </span>
                    <span v-if="lastAction" class="mono operation-label">{{ lastAction }}</span>
                </div>
                <a-button type="primary" size="small" :disabled="!outputText" @click="copyResult">复制</a-button>
            </div>
            <div class="result-content" aria-live="polite">
                <pre v-if="outputText">{{ outputText }}</pre>
                <p v-else-if="status === 'error'" class="error-hint">
                    编解码失败，请检查文本中的百分号编码或 UTF-8 字符是否完整。
                </p>
                <p v-else class="placeholder">结果将显示在这里…</p>
            </div>
        </NeonGlass>

        <p class="helper-note">
            使用 UTF-8 的 encodeURIComponent / decodeURIComponent 规则。普通解码保留原文中的 +；
            “空格 → +”模式会将解码结果中的普通空格转换为 +。编码整条 URL 时请注意，斜杠和问号也会被转义。
        </p>
    </div>
</template>

<script setup>
import { computed, ref } from "vue"
import { message } from "ant-design-vue"
import NeonGlass from "@/components/ui/NeonGlass.vue"
import { encodeUrlText, decodeUrlText } from "@/utils/urlCodec.js"

const encodingOptions = [{ label:"UTF-8", value:"UTF-8" }]
const inputText = ref("")
const outputText = ref("")
const status = ref("idle")
const lastAction = ref("")
const characterCount = computed(() => Array.from(inputText.value).length)

function updateInput(value) {
    inputText.value = value
    outputText.value = ""
    status.value = "idle"
    lastAction.value = ""
}

function run(action) {
    if (!inputText.value) {
        message.warning("请输入需要处理的文本")
        return
    }

    try {
        if (action === "encode") {
            outputText.value = encodeUrlText(inputText.value)
            lastAction.value = "URL 编码"
        } else {
            outputText.value = decodeUrlText(inputText.value, { spaceToPlus:action === "spaceToPlus" })
            lastAction.value = action === "spaceToPlus" ? "URL 解码 · 空格 → +" : "URL 解码"
        }
        status.value = "success"
    } catch {
        outputText.value = ""
        status.value = "error"
        lastAction.value = ""
        message.error("处理失败：请检查 URL 百分号编码或字符格式")
    }
}

function swapTexts() {
    if (!outputText.value) {
        message.warning("暂无可交换的处理结果")
        return
    }
    const original = inputText.value
    inputText.value = outputText.value
    outputText.value = original
    status.value = "success"
    lastAction.value = "已交换"
}

function clearAll() {
    inputText.value = ""
    outputText.value = ""
    status.value = "idle"
    lastAction.value = ""
}

async function copyResult() {
    if (!outputText.value) return
    try {
        await navigator.clipboard.writeText(outputText.value)
        message.success("处理结果已复制")
    } catch {
        message.error("复制失败，请检查浏览器剪贴板权限")
    }
}
</script>

<style scoped lang="scss">
.tool-detail {
    width: min(1180px, calc(100% - 40px));
    margin: 48px auto 0;
}

.back {
    color: var(--color-text-secondary);
    font-size: 11px;
    text-decoration: none;
}

.eyebrow {
    margin: 0;
    color: var(--color-accent-primary);
    font-size: 10px;
    letter-spacing: .14em;
}

.tool-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 30px;
    margin: 34px 0 28px;
}

.tool-head h1 {
    margin: 14px 0;
    font-size: clamp(38px, 5vw, 54px);
    letter-spacing: -.04em;
}

.tool-head p:last-child {
    max-width: 720px;
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 15px;
    line-height: 1.75;
}

.local-status {
    color: var(--color-accent-primary);
    font-size: 10px;
    white-space: nowrap;
}

.input-card,
.result-card {
    padding: 24px;
}

.input-card > *,
.result-card > * {
    position: relative;
    z-index: 1;
}

.card-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
}

.card-heading h2 {
    margin: 9px 0 0;
    font-size: 24px;
}

.word-count {
    color: var(--color-text-secondary);
    font-size: 11px;
}

.toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 14px 20px;
    margin: 20px 0;
}

.toolbar-main,
.toolbar-secondary {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.encoding-setting {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: 4px;
    color: var(--color-text-secondary);
    font-size: 12px;
    white-space: nowrap;
}

.encoding-setting :deep(.ant-select) {
    width: 116px;
}

.result-heading,
.result-labels {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.result-heading {
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--color-border-default);
}

.result-heading h2 {
    margin: 0;
    font-size: 17px;
}

.state-tag {
    padding: 4px 10px;
    border: 1px solid var(--color-border-default);
    border-radius: 999px;
    color: var(--color-text-secondary);
    background: var(--color-bg-control);
    font-size: 11px;
}

.state-tag.success {
    color: var(--color-accent-primary);
    border-color: var(--color-border-strong);
    background: var(--color-bg-selected);
}

.state-tag.error,
.error-hint {
    color: #dc5d5d;
}

.operation-label {
    color: var(--color-text-secondary);
    font-size: 10px;
}

.result-content {
    min-height: 230px;
    padding: 22px 0 2px;
}

.result-content pre {
    margin: 0;
    color: var(--color-text-primary);
    font: inherit;
    font-size: 14px;
    line-height: 1.8;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    user-select: text;
}

.placeholder {
    margin: 0;
    color: var(--color-text-secondary);
    opacity: .8;
}

.helper-note {
    margin: 18px 2px 0;
    color: var(--color-text-secondary);
    font-size: 12px;
    line-height: 1.8;
}

:deep(.ant-input) {
    color: var(--color-text-primary) !important;
    background: var(--color-bg-control) !important;
    border-color: var(--color-border-default) !important;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.75;
    resize: vertical;
}

:deep(.ant-input::placeholder) {
    color: var(--color-text-secondary);
    opacity: .72;
}

:deep(.ant-input:focus) {
    border-color: var(--color-border-strong) !important;
    box-shadow: var(--shadow-selected) !important;
}

:deep(.ant-btn) {
    min-height: 38px;
    border-color: var(--color-border-default);
    color: var(--color-text-primary);
    background: var(--color-bg-control);
}

:deep(.ant-btn-primary) {
    border-color: var(--color-action-primary);
    color: var(--color-accent-contrast);
    background: var(--color-action-primary);
}

:deep(.ant-btn[disabled]) {
    opacity: .55;
}

:deep(.ant-select-disabled .ant-select-selector) {
    border-color: var(--color-border-default) !important;
    background: var(--color-bg-control) !important;
}

:deep(.ant-select-disabled .ant-select-selection-item) {
    color: var(--color-text-primary) !important;
}

@media (max-width: 700px) {
    .tool-detail { margin-top: 34px; }
    .tool-head { align-items: flex-start; flex-direction: column; gap: 10px; }
    .input-card, .result-card { padding: 18px; }
    .toolbar-main, .toolbar-secondary { width: 100%; }
    .toolbar-main :deep(.ant-btn) { flex: 1 1 auto; }
    .toolbar-secondary :deep(.ant-btn) { flex: 1; }
    .result-content { min-height: 180px; }
}
</style>
