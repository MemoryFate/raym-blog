<template>
    <article class="article">
        <RouterLink class="back mono" to="/Notes">← 返回笔记列表</RouterLink>

        <header>
            <p class="eyebrow">笔记 / 设计系统</p>
            <h1>设计一个会随时间<br />变化的动态背景</h1>
            <span class="mono">2026.09 · 约 6 分钟阅读 · 设计 / 前端</span>
            <p>目标不是做一个抢眼的“动态壁纸”，而是让网站在不影响阅读的前提下，随着时间产生细微而持续的氛围变化。</p>
        </header>

        <NeonGlass class="overview" glow>
            <p class="eyebrow">系统概览</p>
            <h2>天空 → 星空 / 云层 → Token → 界面</h2>
            <p>同一个时间状态同时驱动背景氛围和界面强调色，让情绪发生变化，但页面结构保持稳定。</p>
        </NeonGlass>

        <section v-for="item in sections" :key="item.no">
            <span class="mono no">{{ item.no }}</span>
            <h2>{{ item.title }}</h2>
            <p>{{ item.body }}</p>

            <NeonGlass v-if="item.callout" class="callout">
                <p class="eyebrow">{{ item.callout.title }}</p>
                <p>{{ item.callout.body }}</p>
            </NeonGlass>
        </section>

        <NeonGlass class="takeaway">
            <p class="eyebrow">结论</p>
            <p>动态背景不是独立的视觉特效，而应该是时间主题系统的一部分；卡片、强调色、交互状态和页面氛围，都应该消费同一份状态。</p>
        </NeonGlass>
    </article>
</template>

<script setup>
import NeonGlass from "@/components/ui/NeonGlass.vue"

const sections = [
    {
        no:"01",
        title:"先设计天空，再考虑粒子。",
        body:"CSS 渐变承担大尺度的氛围变化最合适：成本低、插值平滑，也方便控制清晨蓝、白天深蓝、日落暖色和深夜蓝黑这些基础色彩。",
    },
    {
        no:"02",
        title:"Canvas 用来塑造氛围，而不是炫技。",
        body:"星点和云层需要“看得见”，但不能抢走内容注意力。核心是降低密度、放慢运动，并为不同时段设置不同的可见度。",
        callout:{
            title:"可见度规则",
            body:"如果在对应主题的页面截图里完全看不出云层或星空，那么背景氛围就太弱；反过来，如果第一眼只看到背景，它又太强。",
        },
    },
    {
        no:"03",
        title:"界面也要继承同一个时间状态。",
        body:"日落时并不是换成另一套卡片，而是让填充、边框、Glow、Accent 和辅助色继承新的 Theme Mode。这样页面身份保持一致，只是情绪发生变化。",
    },
    {
        no:"04",
        title:"不要整点切换，而要连续过渡。",
        body:"接近 macOS 的感觉来自插值。清晨和日落应该是一个时间窗口，而不是某一分钟突然切换。星星逐渐消失、云层逐渐出现，颜色在几十分钟内慢慢移动。",
    },
    {
        no:"05",
        title:"最终约束仍然是可读性。",
        body:"文章页面会主动降低 Glow、云层透明度和粒子干扰。真正稳定的设计系统，应该允许背景变安静，同时仍然让人感到它属于同一个站点。",
    },
]
</script>

<style scoped lang="scss">
.article{width:min(780px,calc(100% - 40px));margin:54px auto 0}.back{color:var(--color-text-secondary);font-size:11px;text-decoration:none}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}header{margin-top:44px}header h1{margin:18px 0;font-size:clamp(42px,6vw,56px);line-height:1.15;letter-spacing:-.045em}header span{color:var(--color-text-secondary);font-size:10px}header>p:last-child{margin-top:34px;color:var(--color-text-secondary);font-size:18px;line-height:1.85}.overview{margin-top:54px;min-height:260px;padding:28px}.overview>*{position:relative;z-index:1}.overview h2{margin:18px 0;font-size:30px}.overview p:last-child,.article section>p,.takeaway p:last-child{color:var(--color-text-secondary);line-height:1.85}.article section{margin-top:72px}.no{color:var(--color-accent-primary);font-size:11px}.article section h2{margin:18px 0;font-size:31px;line-height:1.35}.callout{margin-top:30px;padding:22px;border-left:3px solid var(--color-accent-primary)}.callout>*{position:relative;z-index:1}.callout p:last-child{margin-bottom:0;color:var(--color-text-secondary);line-height:1.75}.takeaway{margin-top:74px;padding:24px}.takeaway>*{position:relative;z-index:1}
@media(max-width:600px){.article{margin-top:40px}header>p:last-child{font-size:16px}.article section h2{font-size:26px}.article section{margin-top:60px}}
</style>
