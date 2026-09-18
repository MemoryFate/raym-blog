<template>
    <article class="article">
        <RouterLink class="back mono" to="/Projects">← 返回项目列表</RouterLink>

        <header>
            <p class="eyebrow">项目 / 个人站点</p>
            <h1>RayM Blog</h1>
            <p>一个正在演变为“个人主页 + 开发者作品集 + 实验空间”的站点，并通过时间主题系统保持持续变化的氛围。</p>
            <div class="chips"><span>Vue 3</span><span>Vite</span><span>Canvas</span><span>Design Tokens</span></div>
        </header>

        <NeonGlass class="hero" glow>
            <p class="eyebrow">项目案例</p>
            <h2>从一个工具集合，重新整理成一套个人实验空间。</h2>
            <p>这次重构不只是换颜色和卡片，而是建立统一的时间氛围、NeonGlass 表面、信息架构和响应式页面体系。</p>
        </NeonGlass>

        <section>
            <p class="eyebrow">01 / 问题</p>
            <h2>原来的功能可以使用，但缺少统一身份。</h2>
            <p>工具、游戏和 Demo 是逐步累积出来的，它们各自能用，却像几个互不相关的页面。新的设计把这些内容重新组织成同一个个人系统。</p>
        </section>

        <div class="compare">
            <NeonGlass>
                <p class="eyebrow">改造前</p>
                <h3>以功能入口为主</h3>
                <p>基础页面框架 · 功能分散 · 固定蓝色样式 · 层级和个人表达较弱。</p>
            </NeonGlass>
            <NeonGlass glow>
                <p class="eyebrow">改造后</p>
                <h3>统一的 Personal Lab</h3>
                <p>时间主题 · NeonGlass 卡片 · 响应式布局 · 列表与详情一致的视觉规则。</p>
            </NeonGlass>
        </div>

        <section>
            <p class="eyebrow">02 / 系统</p>
            <h2>时间改变氛围，但不改变设计语言。</h2>
            <p>主题引擎 → 动态背景 → 表面 Token → 交互状态 → 响应式布局。每天不同时段的情绪可以变化，但组件结构、可读性和操作方式保持稳定。</p>
        </section>

        <section>
            <p class="eyebrow">03 / 结果</p>
            <h2>设计系统已经可以直接映射到 Vue 实现。</h2>
            <p>目前代码侧已经有共享时间引擎、动态星空与云层、NeonGlass 交互状态、正式导航与响应式页面骨架，后续可以继续把工具和实验详情页逐个迁移进来。</p>
        </section>
    </article>
</template>

<script setup>
import NeonGlass from "@/components/ui/NeonGlass.vue"
</script>

<style scoped lang="scss">
.article{width:min(980px,calc(100% - 40px));margin:54px auto 0}.back{color:var(--color-text-secondary);font-size:11px;text-decoration:none}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}header{margin-top:44px}header h1{margin:16px 0;font-size:clamp(48px,7vw,72px);letter-spacing:-.05em}header>p:last-of-type{max-width:800px;color:var(--color-text-secondary);font-size:17px;line-height:1.8}.chips{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.chips span{padding:7px 12px;border:1px solid var(--color-border-glow);border-radius:999px;color:var(--color-text-secondary);background:var(--color-chip-bg);font-size:11px}.hero{margin-top:54px;padding:28px;min-height:270px}.hero>*{position:relative;z-index:1}.hero h2,section h2{margin:18px 0;font-size:clamp(28px,4vw,38px);line-height:1.3}.hero p:last-child,section>p:last-child,.compare p:last-child{color:var(--color-text-secondary);line-height:1.8}.article section{margin-top:82px}.compare{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:30px}.compare>div{padding:24px}.compare h3{margin:14px 0;font-size:23px}
@media(max-width:700px){.article{margin-top:40px}.compare{grid-template-columns:1fr}.article section{margin-top:64px}}
</style>
