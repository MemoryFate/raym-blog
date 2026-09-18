<template>
    <div class="tool-detail">
        <RouterLink class="back mono" to="/Tools">← 返回工具列表</RouterLink>

        <header class="tool-head">
            <div>
                <p class="eyebrow">工具 / 随机字符串</p>
                <h1>随机字符串</h1>
                <p>生成测试数据、占位符、临时标识和随机 Token。所有随机值直接在浏览器中生成。</p>
            </div>
            <span class="mono status">● 使用 Web Crypto</span>
        </header>

        <div class="tool-layout">
            <NeonGlass class="work-surface" glow>
                <div class="surface-head">
                    <div><p class="eyebrow">生成设置</p><h2>定义随机规则</h2></div>
                    <span class="mono">{{ data.results.length }} 条结果</span>
                </div>

                <div class="number-grid">
                    <label>
                        <span>长度</span>
                        <a-input-number v-model:value="data.strLength" :min="1" :max="1024" />
                    </label>
                    <label>
                        <span>数量</span>
                        <a-input-number v-model:value="data.quantity" :min="1" :max="50" />
                    </label>
                </div>

                <div class="group">
                    <p class="field-label">字符集</p>
                    <div class="toggle-grid">
                        <label v-for="item in types" :key="item.value" class="toggle">
                            <input v-model="data.type" type="checkbox" :value="item.value" />
                            <span>{{ item.label }}</span>
                            <b>{{ data.type.includes(item.value) ? "✓" : "" }}</b>
                        </label>
                    </div>
                </div>

                <div class="group">
                    <p class="field-label">选项</p>
                    <div class="toggle-grid">
                        <label class="toggle">
                            <input v-model="data.avoidAmbiguous" type="checkbox" />
                            <span>排除易混淆字符</span>
                            <b>{{ data.avoidAmbiguous ? "✓" : "" }}</b>
                        </label>
                        <label class="toggle">
                            <input v-model="data.startWithLetter" type="checkbox" />
                            <span>首字符必须为字母</span>
                            <b>{{ data.startWithLetter ? "✓" : "" }}</b>
                        </label>
                    </div>
                </div>

                <label class="prefix-field">
                    <span>前缀（可选）</span>
                    <a-input v-model:value="data.prefix" placeholder="例如 raym_" />
                </label>

                <div class="actions">
                    <a-button type="primary" @click="generate">生成字符串</a-button>
                    <a-button @click="reset">重置</a-button>
                </div>
            </NeonGlass>

            <NeonGlass class="result-card">
                <div class="result-head">
                    <div><p class="eyebrow">生成结果</p><h2>{{ data.results.length ? "已生成" : "等待生成" }}</h2></div>
                    <span class="mono">{{ charsetSize }} 字符池</span>
                </div>

                <div v-if="data.results.length" class="result-list">
                    <div v-for="(value,index) in data.results" :key="index" class="result-row">
                        <code>{{ value }}</code>
                        <button type="button" @click="copyText(value)">复制</button>
                    </div>
                </div>
                <div v-else class="empty">
                    <span>Aa</span>
                    <p>设置规则后生成随机字符串</p>
                </div>

                <div v-if="data.results.length" class="result-actions">
                    <button type="button" @click="copyAll">复制全部</button>
                    <button type="button" @click="downloadResults">下载 TXT</button>
                </div>
            </NeonGlass>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive } from "vue"
import { message } from "ant-design-vue"
import NeonGlass from "@/components/ui/NeonGlass.vue"

const types = [
    { label:"数字 0–9", value:"number" },
    { label:"大写字母 A–Z", value:"uppercase" },
    { label:"小写字母 a–z", value:"lowercase" },
    { label:"特殊字符 !@#$", value:"special" },
]

const regulars = {
    number: "0123456789",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    special: "!@#$%^&*()_+-=[]{}",
}

const data = reactive({
    strLength: 24,
    quantity: 5,
    type: ["number", "uppercase", "lowercase"],
    avoidAmbiguous: true,
    startWithLetter: false,
    prefix: "",
    results: [],
})

const charset = computed(() => {
    let pool = data.type.map(type => regulars[type]).join("")
    if (data.avoidAmbiguous) pool = pool.replace(/[0O1Il|]/g, "")
    return [...new Set(pool)].join("")
})

const charsetSize = computed(() => charset.value.length)

function reset() {
    data.strLength = 24
    data.quantity = 5
    data.type = ["number", "uppercase", "lowercase"]
    data.avoidAmbiguous = true
    data.startWithLetter = false
    data.prefix = ""
    data.results = []
}

function secureIndex(max) {
    if (max <= 0) return 0
    const cryptoObj = window.crypto || window.msCrypto
    if (!cryptoObj?.getRandomValues) return Math.floor(Math.random() * max)

    const limit = Math.floor(0xffffffff / max) * max
    const buffer = new Uint32Array(1)
    do cryptoObj.getRandomValues(buffer)
    while (buffer[0] >= limit)
    return buffer[0] % max
}

function buildRandom(length, pool) {
    if (!pool.length) return ""
    let result = ""
    const letters = pool.replace(/[^A-Za-z]/g, "")

    if (data.startWithLetter && length > 0) {
        if (!letters.length) return null
        result += letters[secureIndex(letters.length)]
    }

    while (result.length < length) {
        result += pool[secureIndex(pool.length)]
    }
    return result
}

function generate() {
    if (!data.type.length || !charset.value.length) {
        message.warning("请至少选择一种字符集")
        return
    }

    if (data.startWithLetter && !/[A-Za-z]/.test(charset.value)) {
        message.warning("启用“首字符必须为字母”时，需要选择大写或小写字母")
        return
    }

    data.results = Array.from({ length: data.quantity }, () => {
        const random = buildRandom(data.strLength, charset.value)
        return data.prefix + random
    })
}

async function copyText(value) {
    try {
        await navigator.clipboard.writeText(value)
        message.success("已复制")
    } catch {
        message.error("复制失败")
    }
}

async function copyAll() {
    await copyText(data.results.join("\n"))
}

function downloadResults() {
    const blob = new Blob([data.results.join("\n")], { type:"text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "random-strings.txt"
    link.click()
    URL.revokeObjectURL(url)
}
</script>

<style scoped lang="scss">
.tool-detail{width:min(1180px,calc(100% - 40px));margin:48px auto 0}.back{color:var(--color-text-secondary);font-size:11px;text-decoration:none}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}.tool-head{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin:34px 0 36px}.tool-head h1{margin:14px 0;font-size:clamp(42px,5vw,54px);letter-spacing:-.04em}.tool-head p:last-child{max-width:720px;margin:0;color:var(--color-text-secondary);font-size:15px;line-height:1.75}.status{color:var(--color-accent-primary);font-size:10px}.tool-layout{display:grid;grid-template-columns:560px minmax(0,1fr);gap:20px}.work-surface,.result-card{padding:26px}.surface-head,.result-head{position:relative;z-index:1;display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.surface-head h2,.result-head h2{margin:8px 0 0;font-size:26px}.surface-head>span,.result-head>span{color:var(--color-text-secondary);font-size:10px}.number-grid{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:28px}.number-grid label,.prefix-field{display:grid;gap:9px;color:var(--color-text-primary);font-size:12px}.group{position:relative;z-index:1;margin-top:28px}.field-label{margin:0 0 10px;color:var(--color-text-primary);font-size:12px}.toggle-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.toggle{position:relative;display:grid;grid-template-columns:1fr auto;align-items:center;min-height:52px;padding:0 14px;border:1px solid var(--color-border-glow);border-radius:12px;color:var(--color-text-secondary);background:var(--color-bg-panel-strong);cursor:pointer}.toggle input{position:absolute;opacity:0;pointer-events:none}.toggle:has(input:checked){border-color:var(--color-accent-primary);color:var(--color-text-primary);background:color-mix(in srgb,var(--color-chip-bg) 90%,var(--color-accent-primary) 10%)}.toggle b{color:var(--color-accent-primary);font-weight:500}.prefix-field{position:relative;z-index:1;margin-top:28px}.actions{position:relative;z-index:1;display:flex;gap:12px;margin-top:28px}.result-card{min-height:680px}.result-list{position:relative;z-index:1;display:grid;gap:10px;margin-top:28px}.result-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;min-height:54px;padding:8px 12px;border:1px solid var(--color-border-glow);border-radius:12px;background:var(--color-bg-panel-strong)}.result-row code{min-width:0;overflow:hidden;color:var(--color-text-primary);font-family:"IBM Plex Mono",monospace;font-size:11px;text-overflow:ellipsis;white-space:nowrap}.result-row button,.result-actions button{border:0;color:var(--color-accent-primary);background:transparent;cursor:pointer}.result-actions{position:relative;z-index:1;display:flex;gap:10px;margin-top:18px}.result-actions button{min-height:42px;padding:0 14px;border:1px solid var(--color-border-glow);border-radius:10px;color:var(--color-text-primary);background:var(--color-chip-bg)}.empty{position:relative;z-index:1;display:grid;min-height:460px;place-items:center;align-content:center;color:var(--color-text-secondary)}.empty span{display:grid;width:64px;height:64px;place-items:center;border:1px solid var(--color-border-glow);border-radius:16px;color:var(--color-accent-primary);background:var(--color-chip-bg);font-size:20px}.empty p{font-size:12px}
:deep(.ant-input),:deep(.ant-input-number){width:100%;color:var(--color-text-primary)!important;background:var(--color-bg-panel-strong)!important;border-color:var(--color-border-glow)!important}:deep(.ant-btn-primary){color:var(--color-accent-contrast);background:var(--color-accent-primary);border-color:var(--color-accent-primary)}
@media(max-width:980px){.tool-layout{grid-template-columns:1fr}.result-card{min-height:0}.empty{min-height:260px}}
@media(max-width:650px){.tool-detail{margin-top:38px}.tool-head{align-items:flex-start;flex-direction:column}.number-grid,.toggle-grid{grid-template-columns:1fr}.actions,.result-actions{flex-direction:column}.actions :deep(.ant-btn),.result-actions button{width:100%}.work-surface,.result-card{padding:20px}}
</style>
