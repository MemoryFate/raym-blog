<template>
    <div class="page">
        <section class="intro">
            <div><p class="eyebrow">TOOLS / SMALL SYSTEMS</p><h1>Small tools.<br />Sharp edges.</h1></div>
            <div class="intro-side">
                <p>Focused utilities for common tasks — fast to open, clear to use, and deliberately free of extra ceremony.</p>
                <div class="filters"><span class="active">All tools</span><span>Utility</span><span>Security</span><span>Conversion</span></div>
            </div>
        </section>

        <section class="section">
            <p class="eyebrow">UTILITY SHELF</p><h2>Pick one job and get it done</h2>
            <div class="tools-grid">
                <RouterLink v-for="(item,index) in tools" :key="item.title" :to="item.path" class="card-link">
                    <NeonGlass class="tool-card" :glow="index===0" interactive>
                        <p class="eyebrow">{{ item.type }}</p><h3>{{ item.title }}</h3><p>{{ item.description }}</p><span>Open tool ↗</span>
                    </NeonGlass>
                </RouterLink>
            </div>
        </section>

        <section class="feature-section">
            <div><p class="eyebrow">FEATURED WORKFLOW</p><h2>QR Code Generator</h2><p>Selected because it represents the design principle for every tool here: one task, minimal friction.</p></div>
            <NeonGlass class="workflow" glow>
                <p>Paste text or a URL, tune the output, and export a clean QR code without leaving the page.</p>
                <div class="mock"><span class="mono">https://raym.dev/tools/qr</span><RouterLink to="/Tools/text2qrcode">Generate ↗</RouterLink></div>
            </NeonGlass>
        </section>
    </div>
</template>

<script setup>
import NeonGlass from "@/components/ui/NeonGlass.vue"
const tools=[
 {type:"UTILITY",title:"QR Code",description:"Generate a QR code from text or links with a focused one-job interface.",path:"/Tools/text2qrcode"},
 {type:"UTILITY",title:"Random String",description:"Create random strings for test data, placeholders, and temporary values.",path:"/Tools/randomstr"},
 {type:"SECURITY",title:"AES-GCM",description:"Encrypt or decrypt text with AES-GCM in a compact local workflow.",path:"/Tools/aes-gcm"},
 {type:"CONVERSION",title:"Base64",description:"Convert text, images, and binary snippets to and from Base64.",path:"/Tools/base64"},
]
</script>

<style scoped lang="scss">
.page{width:min(1180px,calc(100% - 40px));margin:56px auto 0}
.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}
.intro{display:grid;grid-template-columns:.8fr 1.2fr;gap:70px;align-items:end;min-height:260px}
.intro h1{margin:18px 0 0;font-size:clamp(42px,5vw,58px);line-height:1.05;letter-spacing:-.045em}
.intro-side>p{max-width:620px;color:var(--color-text-secondary);font-size:16px;line-height:1.7}
.filters{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}
.filters span{padding:9px 14px;border:1px solid var(--color-border-glow);border-radius:999px;color:var(--color-text-secondary);background:var(--color-chip-bg);font-size:11px}
.filters .active{color:var(--color-accent-primary);border-color:var(--color-accent-primary)}
.section{margin-top:80px}.section h2,.feature-section h2{margin:10px 0 28px;font-size:34px}
.tools-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}.card-link{text-decoration:none;color:inherit}
.tool-card{min-height:230px;padding:24px}.tool-card>*{position:relative;z-index:1}.tool-card h3{margin:14px 0;font-size:26px}
.tool-card p:not(.eyebrow){max-width:460px;color:var(--color-text-secondary);font-size:13px;line-height:1.65}
.tool-card span{position:absolute;left:24px;bottom:24px;color:var(--color-text-primary);font-size:13px}
.feature-section{display:grid;grid-template-columns:.72fr 1.28fr;gap:40px;align-items:center;margin-top:90px}
.feature-section>div>p:last-child{color:var(--color-text-secondary);line-height:1.7}
.workflow{min-height:280px;padding:28px;display:flex;flex-direction:column;justify-content:space-between}.workflow>*{position:relative;z-index:1}.workflow>p{color:var(--color-text-secondary);line-height:1.7}
.mock{display:grid;grid-template-columns:1fr auto;gap:12px}.mock span,.mock a{min-height:52px;display:flex;align-items:center;padding:0 16px;border-radius:12px}
.mock span{border:1px solid var(--color-border-glow);background:var(--color-bg-panel-strong);color:var(--color-text-secondary);font-size:12px}
.mock a{background:var(--color-accent-primary);color:var(--color-accent-contrast);font-weight:600;text-decoration:none}
@media(max-width:800px){.intro,.feature-section{grid-template-columns:1fr;gap:24px}.tools-grid{grid-template-columns:1fr}.section,.feature-section{margin-top:68px}}
@media(max-width:520px){.mock{grid-template-columns:1fr}.filters{flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px}.filters span{white-space:nowrap}}
</style>
