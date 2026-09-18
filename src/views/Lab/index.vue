<template>
    <div class="page">
        <section class="intro">
            <div><p class="eyebrow">实验室 / 实验空间</p><h1>允许失败，<br />然后再试一次。</h1></div>
            <div>
                <p>游戏、原型、交互测试和技术 Demo 都先放在这里。它们不需要完整，只需要足够回答一个问题。</p>
                <div class="status mono"><span>● 3 个实验</span><span>○ 永远不会真正完成</span></div>
            </div>
        </section>

        <section class="section">
            <p class="eyebrow">精选实验</p><h2>先动手，再解释</h2>
            <div class="grid">
                <RouterLink v-for="(item,index) in experiments" :key="item.title" :to="item.path" class="card-link">
                    <NeonGlass class="lab-card" :glow="index===0" interactive>
                        <p class="eyebrow">{{ item.type }}</p><h3>{{ item.title }}</h3><p>{{ item.description }}</p><span>开始实验 ↗</span>
                    </NeonGlass>
                </RouterLink>
            </div>

            <NeonGlass class="note">
                <p class="eyebrow">实验室备注</p>
                <h3>这里刻意保持轻量和不完整。</h3>
                <p>原型不需要一开始就成为产品。只要它能验证一个想法、回答一个问题，就值得继续下一次迭代。</p>
            </NeonGlass>
        </section>

        <section class="section">
            <p class="eyebrow">Demo 控制台</p><h2>观察信号如何在连接中流动</h2>
            <NeonGlass class="console" glow>
                <div class="mono">
                    <span>● socket://已连接</span>
                    <span>[18:10:08] 客户端 → hello RayM Lab</span>
                    <span>[18:10:09] 服务端 → 已收到消息</span>
                    <span>[18:10:12] 客户端 → ping</span>
                    <strong>[18:10:12] 服务端 → pong</strong>
                </div>
                <RouterLink to="/Demo/SocketDemo">打开 Socket Demo ↗</RouterLink>
            </NeonGlass>
        </section>
    </div>
</template>

<script setup>
import NeonGlass from "@/components/ui/NeonGlass.vue"
const experiments = [
    { type:"游戏 / 生成", title:"迷宫", description:"用于实验网格生成、寻路逻辑和轻量交互的迷宫小游戏。", path:"/Game/Maze" },
    { type:"游戏 / 逻辑", title:"数独", description:"围绕状态、约束、校验和交互设计的经典逻辑实验。", path:"/Game/Sudoku" },
    { type:"Demo / 网络", title:"Socket Demo", description:"用于观察 WebSocket 连接、消息与状态变化的简单沙盒。", path:"/Demo/SocketDemo" },
]
</script>

<style scoped lang="scss">
.page{width:min(1180px,calc(100% - 40px));margin:56px auto 0}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}.intro{display:grid;grid-template-columns:1.1fr .9fr;gap:64px;align-items:end;min-height:260px}.intro h1{margin:18px 0 0;font-size:clamp(42px,5vw,58px);line-height:1.12;letter-spacing:-.045em}.intro>div:last-child>p{color:var(--color-text-secondary);font-size:16px;line-height:1.8}.status{display:flex;gap:12px;margin-top:28px;color:var(--color-text-secondary);font-size:10px}.status span:first-child{color:var(--color-accent-primary)}.section{margin-top:84px}.section h2{margin:10px 0 28px;font-size:34px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.card-link{text-decoration:none;color:inherit}.lab-card{min-height:250px;padding:24px}.lab-card>*{position:relative;z-index:1}.lab-card h3{margin:14px 0;font-size:26px}.lab-card p:not(.eyebrow){color:var(--color-text-secondary);font-size:13px;line-height:1.7}.lab-card span{position:absolute;left:24px;bottom:24px;color:var(--color-text-primary);font-size:13px}.note{margin-top:22px;padding:24px}.note>*{position:relative;z-index:1}.note h3{margin:12px 0;font-size:24px}.note p:last-child{max-width:880px;color:var(--color-text-secondary);line-height:1.75}.console{min-height:300px;padding:26px;display:flex;justify-content:space-between;gap:30px}.console>*{position:relative;z-index:1}.console>div{display:grid;gap:24px;color:var(--color-text-secondary);font-size:12px}.console>div span:first-child,.console strong{color:var(--color-accent-primary);font-weight:400}.console a{align-self:flex-end;color:var(--color-text-primary);text-decoration:none}
@media(max-width:850px){.intro{grid-template-columns:1fr}.grid{grid-template-columns:1fr}.console{flex-direction:column}.section{margin-top:68px}}
</style>
