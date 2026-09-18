<template>
    <div class="page">
        <section class="intro">
            <div>
                <p class="eyebrow">项目 / 精选系统</p>
                <h1>做过的项目、<br />探索过的问题与持续迭代的系统。</h1>
                <p>这里收录正在建设和已经沉淀下来的项目：从 AI 工作流、数据平台，到解决单一问题的小型工具。</p>
            </div>
            <div class="stats mono"><span>06 个项目</span><strong>03 个持续迭代</strong></div>
        </section>

        <section class="section">
            <p class="eyebrow">精选项目</p><h2>正在生长的项目</h2>
            <div class="featured-grid">
                <RouterLink v-for="(item,index) in featured" :key="item.title" :to="item.path" class="card-link">
                    <NeonGlass class="project-card" :glow="index===0" interactive>
                        <div class="icon">{{ item.icon }}</div>
                        <p class="eyebrow">{{ item.type }}</p>
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.description }}</p>
                        <span>{{ item.action }}</span>
                    </NeonGlass>
                </RouterLink>
            </div>
        </section>

        <section class="section">
            <p class="eyebrow">项目归档</p><h2>更多仍在轨道上的系统</h2>
            <div class="archive">
                <NeonGlass v-for="item in archive" :key="item.title" class="archive-row" interactive>
                    <span class="mono year">{{ item.year }}</span>
                    <div><h3>{{ item.title }}</h3><p>{{ item.description }}</p></div>
                    <span class="mono tags">{{ item.tags }}</span><b>↗</b>
                </NeonGlass>
            </div>
        </section>
    </div>
</template>

<script setup>
import NeonGlass from "@/components/ui/NeonGlass.vue"

const featured = [
    { icon:"↯", type:"个人 / Web", title:"RayM Blog", description:"一个会随时间改变氛围的个人主页、开发者作品集与实验空间。", action:"查看项目 ↗", path:"/Projects/raym-blog" },
    { icon:"◫", type:"AI / 平台", title:"AI ActivityManager", description:"围绕领域边界、活动编排、规则与策略引擎构建的模块化营销平台。", action:"查看项目概览 ↗", path:"/Projects" },
    { icon:"⌁", type:"数据 / Agent", title:"数据 Agent 实验室", description:"面向业务数据库、SQL 取数和自动化流程构建的 Agent 化数据工作台。", action:"持续建设中 ↗", path:"/Projects" },
]

const archive = [
    { year:"2026", title:"抖音采集系统", description:"面向多账号历史作品的数据采集、调度与归档流程。", tags:"PYTHON · POSTGRESQL" },
    { year:"2026", title:"微信视频号采集", description:"围绕 Finder 主页历史作品抓取与结构化存储的自动化方案。", tags:"PROXY · AUTOMATION" },
    { year:"2026", title:"小型工具集", description:"二维码、AES-GCM、Base64、随机字符串等专注单一任务的小工具。", tags:"VUE · TOOLS" },
]
</script>

<style scoped lang="scss">
.page{width:min(1180px,calc(100% - 40px));margin:56px auto 0}.intro{display:grid;grid-template-columns:1fr auto;gap:40px;align-items:end;min-height:260px}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}.intro h1{margin:18px 0 20px;font-size:clamp(42px,5vw,58px);line-height:1.12;letter-spacing:-.045em}.intro>div>p:last-child{max-width:760px;color:var(--color-text-secondary);font-size:16px;line-height:1.8}.stats{display:grid;gap:12px;padding-bottom:34px;color:var(--color-text-secondary);font-size:12px}.stats strong{color:var(--color-accent-primary);font-weight:400}.section{margin-top:88px}.section h2{margin:10px 0 28px;font-size:34px}.featured-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.card-link{text-decoration:none;color:inherit}.project-card{min-height:300px;padding:24px}.project-card>*{position:relative;z-index:1}.icon{display:grid;width:42px;height:42px;place-items:center;border:1px solid var(--color-border-glow);border-radius:12px;color:var(--color-accent-primary);background:var(--color-chip-bg);font-size:18px}.project-card .eyebrow{margin-top:28px}.project-card h3{margin:12px 0;font-size:28px}.project-card p:not(.eyebrow){color:var(--color-text-secondary);line-height:1.7;font-size:13px}.project-card span{position:absolute;left:24px;bottom:24px;color:var(--color-text-primary);font-size:13px}.archive{display:grid;gap:16px}.archive-row{min-height:130px;display:grid;grid-template-columns:72px 1fr auto 28px;gap:24px;align-items:center;padding:22px 24px}.archive-row>*{position:relative;z-index:1}.year,.tags{color:var(--color-text-secondary);font-size:10px}.archive-row h3{margin:0 0 8px;font-size:21px}.archive-row p{margin:0;color:var(--color-text-secondary);font-size:13px;line-height:1.6}.archive-row b{color:var(--color-accent-primary)}
@media(max-width:950px){.featured-grid{grid-template-columns:repeat(2,1fr)}.featured-grid .card-link:last-child{grid-column:1/-1}.archive-row{grid-template-columns:64px 1fr 24px}.tags{display:none}}
@media(max-width:700px){.page{margin-top:42px}.intro{grid-template-columns:1fr;min-height:0}.stats{display:flex;padding:0}.featured-grid{grid-template-columns:1fr}.featured-grid .card-link:last-child{grid-column:auto}.archive-row{grid-template-columns:1fr 24px;gap:10px}.year{grid-column:1/-1}.section{margin-top:68px}}
</style>
