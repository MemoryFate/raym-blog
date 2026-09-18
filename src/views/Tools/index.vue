<template>
    <div class="page">
        <section class="intro">
            <div><p class="eyebrow">工具 / 小型系统</p><h1>小工具，<br />解决明确的问题。</h1></div>
            <div class="intro-side">
                <p>把常用任务做成清晰、快速、没有额外负担的小工具。打开页面，完成任务，然后继续做更重要的事。</p>
                <div class="filters"><span class="active">全部工具</span><span>实用工具</span><span>安全</span><span>转换</span></div>
            </div>
        </section>

        <section class="section">
            <p class="eyebrow">工具架</p><h2>选一个任务，然后完成它</h2>
            <div class="tools-grid">
                <RouterLink v-for="(item,index) in tools" :key="item.title" :to="item.path" class="card-link">
                    <NeonGlass class="tool-card" :glow="index===0" interactive>
                        <p class="eyebrow">{{ item.type }}</p><h3>{{ item.title }}</h3><p>{{ item.description }}</p><span>打开工具 ↗</span>
                    </NeonGlass>
                </RouterLink>
            </div>
        </section>

        <section class="feature-section">
            <div>
                <p class="eyebrow">精选流程</p><h2>二维码生成器</h2>
                <p>它代表这里所有工具的设计原则：一次只解决一个任务，尽量减少操作和干扰。</p>
            </div>
            <NeonGlass class="workflow" glow>
                <p>输入文本或链接，调整必要参数，然后直接生成并导出二维码。</p>
                <div class="mock"><span class="mono">https://raym.dev/tools/qr</span><RouterLink to="/Tools/text2qrcode">开始生成 ↗</RouterLink></div>
            </NeonGlass>
        </section>
    </div>
</template>

<script setup>
import NeonGlass from "@/components/ui/NeonGlass.vue"
const tools = [
    { type:"实用工具", title:"二维码", description:"将文本或链接生成二维码，用最短路径完成一个明确任务。", path:"/Tools/text2qrcode" },
    { type:"实用工具", title:"随机字符串", description:"根据长度和字符集生成测试数据、占位符和临时标识。", path:"/Tools/randomstr" },
    { type:"安全", title:"AES-GCM", description:"在本地完成 AES-GCM 加密与解密，并清晰展示关键参数和结果。", path:"/Tools/aes-gcm" },
    { type:"转换", title:"Base64", description:"处理文本、图片和常见文件的 Base64 编码与解码。", path:"/Tools/base64" },
]
</script>

<style scoped lang="scss">
.page{width:min(1180px,calc(100% - 40px));margin:56px auto 0}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}.intro{display:grid;grid-template-columns:.8fr 1.2fr;gap:70px;align-items:end;min-height:260px}.intro h1{margin:18px 0 0;font-size:clamp(42px,5vw,58px);line-height:1.12;letter-spacing:-.045em}.intro-side>p{max-width:620px;color:var(--color-text-secondary);font-size:16px;line-height:1.8}.filters{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}.filters span{padding:9px 14px;border:1px solid var(--color-border-glow);border-radius:999px;color:var(--color-text-secondary);background:var(--color-chip-bg);font-size:11px}.filters .active{color:var(--color-accent-primary);border-color:var(--color-accent-primary)}.section{margin-top:80px}.section h2,.feature-section h2{margin:10px 0 28px;font-size:34px}.tools-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}.card-link{text-decoration:none;color:inherit}.tool-card{min-height:230px;padding:24px}.tool-card>*{position:relative;z-index:1}.tool-card h3{margin:14px 0;font-size:26px}.tool-card p:not(.eyebrow){max-width:460px;color:var(--color-text-secondary);font-size:13px;line-height:1.7}.tool-card span{position:absolute;left:24px;bottom:24px;color:var(--color-text-primary);font-size:13px}.feature-section{display:grid;grid-template-columns:.72fr 1.28fr;gap:40px;align-items:center;margin-top:90px}.feature-section>div>p:last-child{color:var(--color-text-secondary);line-height:1.8}.workflow{min-height:280px;padding:28px;display:flex;flex-direction:column;justify-content:space-between}.workflow>*{position:relative;z-index:1}.workflow>p{color:var(--color-text-secondary);line-height:1.8}.mock{display:grid;grid-template-columns:1fr auto;gap:12px}.mock span,.mock a{min-height:52px;display:flex;align-items:center;padding:0 16px;border-radius:12px}.mock span{border:1px solid var(--color-border-glow);background:var(--color-bg-panel-strong);color:var(--color-text-secondary);font-size:12px}.mock a{background:var(--color-accent-primary);color:var(--color-accent-contrast);font-weight:600;text-decoration:none}
@media(max-width:800px){.intro,.feature-section{grid-template-columns:1fr;gap:24px}.tools-grid{grid-template-columns:1fr}.section,.feature-section{margin-top:68px}}
@media(max-width:520px){.mock{grid-template-columns:1fr}.filters{flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px}.filters span{white-space:nowrap}}
</style>
