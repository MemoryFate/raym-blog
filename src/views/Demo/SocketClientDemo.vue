<template>
    <div class="lab-detail">
        <RouterLink class="back mono" to="/Lab">← 返回实验室</RouterLink>

        <header class="lab-head">
            <div>
                <p class="eyebrow">实验室 / Socket Client</p>
                <h1>消息接收端</h1>
                <p>一个更简单的 WebSocket 接收客户端，用于快速查看服务端推送数据。</p>
            </div>
            <span class="mono status" :class="{ connected:data.status==='connected' }">● {{ statusLabel }}</span>
        </header>

        <NeonGlass class="receiver" glow>
            <div class="connection-row">
                <input v-model="data.url" :disabled="data.status==='connected'" />
                <button type="button" class="primary" :disabled="data.status==='connected'" @click="connect">连接</button>
                <button type="button" :disabled="data.status!=='connected'" @click="disconnect">断开</button>
            </div>

            <div class="receiver-head">
                <div><p class="eyebrow">接收日志</p><h2>{{ data.logs.length }} 条消息</h2></div>
                <button type="button" @click="data.logs=[]">清空</button>
            </div>

            <div class="messages mono">
                <div v-if="!data.logs.length" class="empty">连接后，服务端消息会显示在这里。</div>
                <div v-for="(item,index) in data.logs" :key="index" class="message-row">
                    <span>{{ item.time }}</span><code>{{ item.message }}</code>
                </div>
            </div>
        </NeonGlass>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, watch } from "vue"
import NeonGlass from "@/components/ui/NeonGlass.vue"

let ws = null
const defaultScheme = window.location.protocol === "https:" ? "wss" : "ws"

const data = reactive({
    url:localStorage.getItem("raym-ws-url") || defaultScheme + "://" + window.location.hostname + ":2334/ws",
    status:"disconnected",
    logs:[],
})

const statusLabel = computed(() => ({
    disconnected:"未连接",
    connecting:"连接中",
    connected:"已连接",
    error:"连接错误",
})[data.status] || "未连接")

watch(() => data.url, value => localStorage.setItem("raym-ws-url", value))

function stamp() {
    return new Date().toLocaleTimeString("zh-CN", { hour12:false })
}

function connect() {
    disconnect()
    data.status = "connecting"
    try {
        ws = new WebSocket(data.url)
        ws.onopen = () => { data.status = "connected" }
        ws.onmessage = event => data.logs.push({ time:stamp(), message:event.data })
        ws.onerror = () => { data.status = "error" }
        ws.onclose = () => { data.status = "disconnected" }
    } catch {
        data.status = "error"
    }
}

function disconnect() {
    if (ws) {
        ws.onopen = null
        ws.onmessage = null
        ws.onerror = null
        ws.onclose = null
        try { ws.close() } catch {}
        ws = null
    }
    data.status = "disconnected"
}

onBeforeUnmount(disconnect)
</script>

<style scoped lang="scss">
.lab-detail{width:min(980px,calc(100% - 40px));margin:48px auto 0}.back{color:var(--color-text-secondary);font-size:11px;text-decoration:none}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}.lab-head{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin:34px 0 36px}.lab-head h1{margin:14px 0;font-size:clamp(42px,5vw,54px);letter-spacing:-.04em}.lab-head p:last-child{max-width:700px;margin:0;color:var(--color-text-secondary);font-size:15px;line-height:1.75}.status{color:var(--color-text-secondary);font-size:10px}.status.connected{color:var(--color-accent-primary)}.receiver{padding:26px}.connection-row{position:relative;z-index:1;display:grid;grid-template-columns:1fr auto auto;gap:10px}.connection-row input{min-height:44px;padding:0 12px;border:1px solid var(--color-border-glow);border-radius:10px;color:var(--color-text-primary);background:var(--color-bg-panel-strong);font-family:"IBM Plex Mono",monospace}.connection-row button,.receiver-head button{min-height:44px;padding:0 14px;border:1px solid var(--color-border-glow);border-radius:10px;color:var(--color-text-primary);background:var(--color-chip-bg);cursor:pointer}.connection-row .primary{color:var(--color-accent-contrast);border-color:var(--color-accent-primary);background:var(--color-accent-primary)}.connection-row button:disabled{opacity:.45}.receiver-head{position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;margin-top:32px;padding-top:26px;border-top:1px solid color-mix(in srgb,var(--color-border-glow) 45%,transparent)}.receiver-head h2{margin:8px 0 0;font-size:24px}.receiver-head button{min-height:34px}.messages{position:relative;z-index:1;min-height:420px;max-height:620px;margin-top:16px;padding:14px;overflow:auto;border:1px solid var(--color-border-glow);border-radius:14px;background:#040914;font-size:11px}.empty{display:grid;min-height:390px;place-items:center;color:var(--color-text-secondary)}.message-row{display:grid;grid-template-columns:86px 1fr;gap:12px;padding:12px 8px;border-bottom:1px solid rgba(255,255,255,.05)}.message-row span{color:var(--color-accent-primary)}.message-row code{color:var(--color-text-secondary);white-space:pre-wrap;word-break:break-word}
@media(max-width:650px){.lab-detail{margin-top:38px}.lab-head{align-items:flex-start;flex-direction:column}.receiver{padding:20px}.connection-row{grid-template-columns:1fr}.message-row{grid-template-columns:1fr}}
</style>
