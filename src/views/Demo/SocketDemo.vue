<template>
    <div class="lab-detail">
        <RouterLink class="back mono" to="/Lab">← 返回实验室</RouterLink>

        <header class="lab-head">
            <div>
                <p class="eyebrow">实验室 / Socket Demo</p>
                <h1>WebSocket 控制台</h1>
                <p>用于观察连接生命周期、发送消息、接收数据和错误状态的轻量 WebSocket 沙盒。</p>
            </div>
            <span class="mono status" :class="{ connected:data.status==='connected' }">● {{ statusLabel }}</span>
        </header>

        <div class="lab-layout">
            <NeonGlass class="console-surface" glow>
                <div class="surface-head">
                    <div><p class="eyebrow">连接控制台</p><h2>{{ statusLabel }}</h2></div>
                    <span class="mono">{{ data.logs.length }} 条事件</span>
                </div>

                <label class="field">
                    <span>WebSocket 地址</span>
                    <input v-model="data.url" type="text" placeholder="ws://localhost:2334/ws" :disabled="data.status==='connected'" />
                </label>

                <div class="connection-actions">
                    <button type="button" class="primary" :disabled="data.status==='connecting'||data.status==='connected'" @click="connect">连接</button>
                    <button type="button" :disabled="data.status==='disconnected'" @click="disconnect">断开</button>
                </div>

                <label class="field message-field">
                    <span>发送消息</span>
                    <textarea v-model="data.message" rows="4" placeholder='例如 {"type":"ping","value":"hello"}'></textarea>
                </label>

                <button type="button" class="primary send" :disabled="data.status!=='connected'||!data.message.trim()" @click="sendMessage">发送消息 ↗</button>

                <div class="log-section">
                    <div class="log-head">
                        <div><p class="eyebrow">事件日志</p><h3>连接过程</h3></div>
                        <div>
                            <button type="button" @click="clearLogs">清空</button>
                            <button type="button" @click="downloadLogs">下载</button>
                        </div>
                    </div>

                    <div ref="logRef" class="log-console mono">
                        <div v-if="!data.logs.length" class="log-empty">尚无事件。连接 WebSocket 后，状态和消息会显示在这里。</div>
                        <div v-for="(item,index) in data.logs" :key="index" class="log-line" :class="'log-line--'+item.type">
                            <span>{{ item.time }}</span>
                            <b>{{ item.direction }}</b>
                            <code>{{ item.message }}</code>
                        </div>
                    </div>
                </div>
            </NeonGlass>

            <aside class="side-stack">
                <NeonGlass class="side-card">
                    <p class="eyebrow">会话状态</p>
                    <div class="session-status">
                        <strong>{{ statusLabel }}</strong>
                        <span class="mono">{{ data.connectedAt ? "连接于 " + data.connectedAt : "尚未建立连接" }}</span>
                    </div>
                    <div class="stat-grid">
                        <div><small>发送</small><strong>{{ data.sentCount }}</strong></div>
                        <div><small>接收</small><strong>{{ data.receivedCount }}</strong></div>
                    </div>
                </NeonGlass>

                <NeonGlass class="side-card">
                    <p class="eyebrow">选项</p>
                    <label class="toggle">
                        <input v-model="data.prettyJson" type="checkbox" />
                        <span>格式化 JSON</span><b>{{ data.prettyJson ? "✓" : "" }}</b>
                    </label>
                    <label class="toggle">
                        <input v-model="data.autoReconnect" type="checkbox" />
                        <span>自动重连</span><b>{{ data.autoReconnect ? "✓" : "" }}</b>
                    </label>
                </NeonGlass>

                <NeonGlass class="side-card">
                    <p class="eyebrow">说明</p>
                    <h3>地址由你决定</h3>
                    <p>默认使用当前主机的 2334 端口作为演示地址。实际部署时可以直接改为自己的 ws:// 或 wss:// 服务。</p>
                </NeonGlass>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from "vue"
import { message } from "ant-design-vue"
import NeonGlass from "@/components/ui/NeonGlass.vue"

const logRef = ref(null)
let socket = null
let reconnectTimer = null
let intentionalClose = false

const defaultScheme = window.location.protocol === "https:" ? "wss" : "ws"
const defaultUrl = localStorage.getItem("raym-ws-url") || defaultScheme + "://" + window.location.hostname + ":2334/ws"

const data = reactive({
    url:defaultUrl,
    message:"",
    status:"disconnected",
    logs:[],
    sentCount:0,
    receivedCount:0,
    connectedAt:"",
    prettyJson:true,
    autoReconnect:false,
})

const statusLabel = computed(() => ({
    disconnected:"未连接",
    connecting:"连接中",
    connected:"已连接",
    error:"连接错误",
})[data.status] || "未连接")

watch(() => data.url, value => localStorage.setItem("raym-ws-url", value))

function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour12:false })
}

function formatMessage(value) {
    if (!data.prettyJson || typeof value !== "string") return String(value)
    try {
        return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
        return value
    }
}

async function addLog(type, direction, value) {
    data.logs.push({
        type,
        direction,
        time:now(),
        message:formatMessage(value),
    })
    if (data.logs.length > 300) data.logs.splice(0, data.logs.length - 300)
    await nextTick()
    if (logRef.value) logRef.value.scrollTop = logRef.value.scrollHeight
}

function connect() {
    const url = data.url.trim()
    if (!/^wss?:\/\//i.test(url)) {
        message.warning("请输入以 ws:// 或 wss:// 开头的地址")
        return
    }

    disconnect(false)
    intentionalClose = false
    data.status = "connecting"
    addLog("status", "状态", "正在连接 " + url)

    try {
        socket = new WebSocket(url)
    } catch (error) {
        data.status = "error"
        addLog("error", "错误", error.message || "无法创建 WebSocket")
        return
    }

    socket.onopen = () => {
        data.status = "connected"
        data.connectedAt = now()
        addLog("status", "状态", "连接已建立")
    }

    socket.onmessage = event => {
        data.receivedCount += 1
        addLog("receive", "← 接收", event.data)
    }

    socket.onerror = () => {
        data.status = "error"
        addLog("error", "错误", "WebSocket 发生错误")
    }

    socket.onclose = event => {
        data.status = "disconnected"
        data.connectedAt = ""
        addLog("status", "状态", "连接已关闭 · code " + event.code)

        if (!intentionalClose && data.autoReconnect) {
            clearTimeout(reconnectTimer)
            reconnectTimer = setTimeout(() => {
                addLog("status", "状态", "尝试自动重连")
                connect()
            }, 2000)
        }
    }
}

function disconnect(markIntentional = true) {
    if (markIntentional) intentionalClose = true
    clearTimeout(reconnectTimer)
    reconnectTimer = null

    if (socket) {
        socket.onclose = markIntentional ? socket.onclose : null
        try {
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) socket.close()
        } catch {}
        socket = null
    }

    if (markIntentional) {
        data.status = "disconnected"
        data.connectedAt = ""
    }
}

function sendMessage() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        message.warning("请先建立连接")
        return
    }

    const value = data.message
    socket.send(value)
    data.sentCount += 1
    addLog("send", "→ 发送", value)
}

function clearLogs() {
    data.logs = []
}

function downloadLogs() {
    const content = data.logs.map(item => "[" + item.time + "] " + item.direction + " " + item.message).join("\n")
    const blob = new Blob([content], { type:"text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "socket-demo.log"
    link.click()
    URL.revokeObjectURL(url)
}

onBeforeUnmount(() => {
    intentionalClose = true
    clearTimeout(reconnectTimer)
    if (socket) {
        socket.onopen = null
        socket.onmessage = null
        socket.onerror = null
        socket.onclose = null
        try { socket.close() } catch {}
    }
})
</script>

<style scoped lang="scss">
.lab-detail{width:min(1180px,calc(100% - 40px));margin:48px auto 0}.back{color:var(--color-text-secondary);font-size:11px;text-decoration:none}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}.lab-head{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin:34px 0 36px}.lab-head h1{margin:14px 0;font-size:clamp(42px,5vw,54px);letter-spacing:-.04em}.lab-head p:last-child{max-width:760px;margin:0;color:var(--color-text-secondary);font-size:15px;line-height:1.75}.status{color:var(--color-text-secondary);font-size:10px}.status.connected{color:var(--color-accent-primary)}.lab-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:20px}.console-surface{padding:26px}.surface-head{position:relative;z-index:1;display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.surface-head h2{margin:8px 0 0;font-size:26px}.surface-head>span{color:var(--color-text-secondary);font-size:10px}.field{position:relative;z-index:1;display:grid;gap:9px;margin-top:24px;color:var(--color-text-primary);font-size:12px}.field input,.field textarea{width:100%;padding:12px 14px;border:1px solid var(--color-border-glow);border-radius:12px;outline:none;color:var(--color-text-primary);background:var(--color-bg-panel-strong);font:12px/1.7 "IBM Plex Mono",monospace;resize:vertical}.field input:focus,.field textarea:focus{border-color:var(--color-accent-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--color-accent-primary) 22%,transparent)}.connection-actions{position:relative;z-index:1;display:flex;gap:10px;margin-top:12px}.connection-actions button,.send,.log-head button{min-height:42px;padding:0 15px;border:1px solid var(--color-border-glow);border-radius:10px;color:var(--color-text-primary);background:var(--color-chip-bg);cursor:pointer}.connection-actions .primary,.send.primary{color:var(--color-accent-contrast);border-color:var(--color-accent-primary);background:var(--color-accent-primary);font-weight:600}.connection-actions button:disabled,.send:disabled{opacity:.45;cursor:not-allowed}.send{position:relative;z-index:1;margin-top:12px}.log-section{position:relative;z-index:1;margin-top:30px;padding-top:28px;border-top:1px solid color-mix(in srgb,var(--color-border-glow) 46%,transparent)}.log-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px}.log-head h3{margin:8px 0 0;font-size:20px}.log-head>div:last-child{display:flex;gap:6px}.log-head button{min-height:34px;padding:0 10px;font-size:11px}.log-console{height:440px;margin-top:16px;padding:14px;overflow:auto;border:1px solid var(--color-border-glow);border-radius:14px;background:#040914;font-size:10px}.log-empty{display:grid;height:100%;place-items:center;color:var(--color-text-secondary);text-align:center}.log-line{display:grid;grid-template-columns:72px 58px minmax(0,1fr);gap:10px;padding:10px 8px;border-bottom:1px solid rgba(255,255,255,.04);color:var(--color-text-secondary)}.log-line b{font-weight:400}.log-line code{white-space:pre-wrap;word-break:break-word}.log-line--send b{color:var(--color-accent-primary)}.log-line--receive b{color:var(--color-accent-secondary)}.log-line--error{color:#ffc7bd}.side-stack{display:grid;align-content:start;gap:20px}.side-card{padding:22px}.side-card>*{position:relative;z-index:1}.session-status{display:grid;gap:8px;margin-top:16px}.session-status strong{font-size:22px}.session-status span{color:var(--color-text-secondary);font-size:10px}.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px}.stat-grid div{padding:12px;border:1px solid var(--color-border-glow);border-radius:11px;background:var(--color-bg-panel-strong)}.stat-grid small{display:block;color:var(--color-text-secondary);font-size:10px}.stat-grid strong{display:block;margin-top:6px;font-size:20px}.toggle{position:relative;display:grid;grid-template-columns:1fr auto;align-items:center;min-height:50px;margin-top:10px;padding:0 12px;border:1px solid var(--color-border-glow);border-radius:11px;color:var(--color-text-secondary);background:var(--color-bg-panel-strong);cursor:pointer}.toggle input{position:absolute;opacity:0}.toggle:has(input:checked){border-color:var(--color-accent-primary);color:var(--color-text-primary)}.toggle b{color:var(--color-accent-primary)}.side-card h3{margin:12px 0;font-size:20px}.side-card p:last-child{color:var(--color-text-secondary);font-size:13px;line-height:1.7}
@media(max-width:900px){.lab-layout{grid-template-columns:1fr}.side-stack{grid-template-columns:repeat(3,1fr)}}
@media(max-width:700px){.lab-detail{margin-top:38px}.lab-head{align-items:flex-start;flex-direction:column}.side-stack{grid-template-columns:1fr}.connection-actions{flex-direction:column}.connection-actions button,.send{width:100%}.log-head{align-items:flex-start;flex-direction:column}.log-console{height:360px}.log-line{grid-template-columns:1fr;gap:4px}.console-surface{padding:20px}}
</style>
