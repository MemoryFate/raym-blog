<template>
    <div class="home-page">
        <section class="hero">
            <div class="hero-copy">
                <p class="eyebrow">保持好奇 · 持续构建</p>
                <h1>构建。探索。<span>•</span><br />持续实验。<span>•</span></h1>
                <p class="hero-text">
                    你好，我是 RayM。一名开发者，喜欢把想法做成可用的 Web 体验、AI 工具和小型实验，
                    也在这里记录值得反复回看的技术与思考。
                </p>
                <div class="actions">
                    <RouterLink class="primary" to="/Projects">查看项目 ↗</RouterLink>
                    <RouterLink class="secondary" to="/Lab">进入实验室 ›</RouterLink>
                </div>
                <p class="mono hero-index">01 — 个人主页&nbsp;&nbsp;&nbsp;&nbsp;02 — 数字花园</p>
            </div>

            <NeonGlass class="console" raised glow>
                <div class="console-head mono"><span>● 控制台在线</span><span>RM / 001</span></div>
                <div class="identity">
                    <p class="eyebrow">当前身份</p>
                    <h2>开发者</h2>
                    <p>/ 构建者</p>
                    <b>&lt;/&gt;</b>
                </div>
                <div class="divider"></div>
                <div class="meta mono">
                    <div><small>方向</small><strong>Web · AI · Systems</strong></div>
                    <div><small>状态</small><strong class="accent">正在构建中…</strong></div>
                </div>
                <div class="chips">
                    <span class="active">Vue</span><span>JavaScript</span><span>AI</span><span>好奇心</span>
                </div>
            </NeonGlass>
        </section>

        <section class="block">
            <SectionTitle eyebrow="关于我" title="此刻关注的几件事" suffix="/ 04 个节点活跃" />
            <div class="orbit-grid">
                <NeonGlass v-for="item in orbitItems" :key="item.label" class="card orbit-card" :selected="item.selected" interactive>
                    <i>{{ item.icon }}</i>
                    <p class="eyebrow">{{ item.label }}</p>
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                </NeonGlass>
            </div>
        </section>

        <section id="projects" class="block anchor">
            <SectionTitle eyebrow="精选项目" title="正在生长的项目" suffix="持续更新 ↗" />
            <div class="project-grid">
                <RouterLink
                    v-for="(project, index) in projects"
                    :key="project.title"
                    :to="project.path"
                    class="project-link"
                >
                    <NeonGlass class="card project-card" interactive>
                        <div class="project-top"><i>{{ project.icon }}</i><span class="mono">0{{ index + 1 }} / 02</span></div>
                        <p class="eyebrow">{{ project.type }}</p>
                        <h3>{{ project.title }}</h3>
                        <p>{{ project.description }}</p>
                        <b>{{ project.action }}</b>
                    </NeonGlass>
                </RouterLink>
            </div>
        </section>

        <section class="block anchor">
            <SectionTitle eyebrow="工具 / 实验" title="把一个想法快速做出来" suffix="悬停工具即可预览" />
            <div class="lab-grid">
                <NeonGlass class="tool-panel">
                    <div class="panel-head">
                        <div><p class="eyebrow">工具架</p><h3>常用小工具</h3></div>
                        <span class="mono">›_</span>
                    </div>
                    <div class="tools">
                        <RouterLink
                            v-for="tool in tools"
                            :key="tool.name"
                            :to="tool.path"
                            :class="{ active: previewTool.name === tool.name }"
                            @mouseenter="previewTool = tool"
                            @focus="previewTool = tool"
                        >
                            <span>{{ tool.name }}</span>
                            <small>{{ tool.short }}</small>
                        </RouterLink>
                    </div>
                </NeonGlass>

                <NeonGlass class="feature" raised glow interactive>
                    <div class="panel-head">
                        <p class="eyebrow">悬停预览</p>
                        <span>{{ previewTool.icon }}</span>
                    </div>

                    <div class="preview-body">
                        <div>
                            <p class="preview-type mono">{{ previewTool.type }}</p>
                            <h3>{{ previewTool.name }}</h3>
                            <p>{{ previewTool.description }}</p>
                            <div class="preview-tags">
                                <span v-for="tag in previewTool.tags" :key="tag">{{ tag }}</span>
                            </div>
                        </div>

                        <div class="preview-visual" :key="previewTool.name">
                            <div class="preview-symbol">{{ previewTool.icon }}</div>
                            <div class="preview-lines">
                                <span></span><span></span><span></span>
                            </div>
                            <small class="mono">{{ previewTool.sample }}</small>
                        </div>
                    </div>

                    <RouterLink :to="previewTool.path">
                        <span>●&nbsp; 打开 {{ previewTool.name }}</span><b>↗</b>
                    </RouterLink>
                </NeonGlass>
            </div>
        </section>

        <section class="themes">
            <div class="theme-head">
                <div>
                    <p class="eyebrow">时间主题系统</p>
                    <h2>四时四景，同一套设计语言</h2>
                </div>
                <span class="mono">{{ mode === "auto" ? "当前：自动跟随本地时间" : "当前：已手动固定主题" }}</span>
            </div>

            <div class="theme-grid">
                <NeonGlass
                    v-for="item in themeItems"
                    :key="item.key"
                    as="button"
                    class="theme-card"
                    :class="{ active: theme === item.key }"
                    :selected="theme === item.key"
                    interactive
                    @click="setThemeMode(item.key)"
                >
                    <strong>{{ item.title }}</strong><span class="mono">{{ item.caption }}</span>
                </NeonGlass>
            </div>

            <button v-if="mode !== 'auto'" class="auto-theme" type="button" @click="setThemeMode('auto')">
                恢复自动跟随时间
            </button>
        </section>
    </div>
</template>

<script setup>
import { defineComponent, h, ref } from "vue"
import NeonGlass from "@/components/ui/NeonGlass.vue"
import { useTimeTheme } from "@/composables/useTimeTheme.js"

const { theme, mode, setThemeMode } = useTimeTheme()

const SectionTitle = defineComponent({
    props: ["eyebrow", "title", "suffix"],
    setup(props) {
        return () => h("div", { class: "section-title" }, [
            h("div", [h("p", { class: "eyebrow" }, props.eyebrow), h("h2", props.title)]),
            h("span", { class: "mono suffix" }, props.suffix),
        ])
    },
})

const orbitItems = [
    { icon: "◎", label: "关于", title: "默认保持好奇", description: "我喜欢设计、代码与一个好问题相遇的地方。" },
    { icon: "▣", label: "关注", title: "让复杂变得更清楚", description: "持续探索 AI、数据与业务流程如何组合成真正可用的产品。" },
    { icon: "≋", label: "技术栈", title: "小而锋利的工具", description: "Vue、Java、Python、PostgreSQL，以及大量持续迭代。", selected: true },
    { icon: "✣", label: "现在", title: "给想法留出空间", description: "记录原型、项目、踩坑和那些值得再次回看的思路。" },
]

const projects = [
    { icon: "↯", type: "个人 / Web", title: "RayM Blog", description: "一个会随时间变化氛围的个人主页、开发者作品集与实验空间。", action: "查看设计与实现 ↗", path: "/Projects/raym-blog" },
    { icon: "◫", type: "AI / 平台", title: "AI ActivityManager", description: "围绕领域边界、活动编排和可复用引擎构建的模块化营销平台。", action: "持续建设中 ↗", path: "/Projects" },
]

const tools = [
    { name: "二维码", short: "QR Code", type: "工具", icon: "▦", path: "/Tools/text2qrcode", description: "将文本或链接快速生成二维码，专注完成一件事，不引入额外操作。", tags: ["文本", "链接", "导出"], sample: "https://raym.dev" },
    { name: "随机字符串", short: "Random String", type: "工具", icon: "Aa", path: "/Tools/randomstr", description: "按长度和字符集快速生成随机内容，适合测试数据、占位符和临时标识。", tags: ["长度", "字符集", "批量"], sample: "raym_8K2mQ7xP" },
    { name: "AES-GCM", short: "加密 / 解密", type: "安全", icon: "⌾", path: "/Tools/aes-gcm", description: "在本地完成 AES-GCM 加密与解密，并清晰展示密钥、IV 与结果状态。", tags: ["AES", "GCM", "本地处理"], sample: "ciphertext + iv" },
    { name: "Base64", short: "编码 / 转换", type: "转换", icon: "64", path: "/Tools/base64", description: "处理文本、图片和常见文件的 Base64 编码与解码。", tags: ["文本", "文件", "预览"], sample: "SGVsbG8gUmF5TQ==" },
    { name: "迷宫", short: "Maze", type: "实验", icon: "⌗", path: "/Game/Maze", description: "随机生成迷宫并进行寻路与交互实验，保留轻量、可玩的体验。", tags: ["生成", "寻路", "游戏"], sample: "A* / DFS" },
    { name: "数独", short: "Sudoku", type: "实验", icon: "9×9", path: "/Game/Sudoku", description: "生成不同难度的数独，并围绕状态、校验和交互进行实验。", tags: ["逻辑", "状态", "游戏"], sample: "36 / 81 已填写" },
]

const previewTool = ref(tools[0])

const themeItems = [
    { key: "dawn", title: "清晨 · 春", caption: "白中透绿 · 轻、净、新鲜" },
    { key: "day", title: "白天 · 夏", caption: "绿色主体 · 混入天空蓝" },
    { key: "sunset", title: "日落 · 秋", caption: "暖金黄 · 棕褐结构 · 少量天空蓝" },
    { key: "night", title: "夜晚 · 冬", caption: "黑色夜空 · 冷冰蓝" },
]
</script>

<style scoped lang="scss">
.home-page { width: min(1180px, calc(100% - 40px)); margin: 56px auto 0; }
.eyebrow { margin: 0; color: var(--color-accent-primary); font-size: 10px; letter-spacing: .14em; }
.hero { min-height: 500px; display: grid; grid-template-columns: 1fr 550px; gap: 70px; align-items: center; }
.hero-copy h1 { margin: 24px 0 0; color: var(--color-text-primary); font-size: clamp(54px, 5vw, 68px); line-height: 1.08; letter-spacing: -.045em; }
.hero-copy h1 span { color: var(--color-accent-primary); font-size: .5em; vertical-align: top; margin-left: 12px; }
.hero-text { max-width: 540px; margin: 24px 0 0; color: var(--color-text-secondary); font-size: 17px; line-height: 1.8; }
.actions { display: flex; gap: 16px; margin-top: 28px; }
.actions a { min-height: 48px; display: inline-flex; align-items: center; padding: 0 22px; border-radius: 14px; font-size: 13px; font-weight: 600; text-decoration: none; }
.primary { color: var(--color-accent-contrast); background: var(--color-action-primary); box-shadow: 0 8px 24px rgba(26,166,255,.30); }
.secondary { color: var(--color-text-primary); border: 1px solid var(--color-border-strong); background: var(--color-bg-control); }
.hero-index { margin-top: 38px; color: var(--color-text-secondary); opacity: .65; font-size: 10px; }
.console { min-height: 420px; padding: 26px 28px; border-radius: 24px; }
.console-head,.identity,.divider,.meta,.chips { position: relative; z-index: 1; }
.console-head { display: flex; justify-content: space-between; color: var(--color-text-secondary); font-size: 10px; }
.console-head span:first-child { color: var(--color-accent-primary); }
.identity { margin-top: 50px; }
.identity h2 { margin: 14px 0 0; font-size: 34px; line-height: 1.1; }
.identity > p:last-of-type { margin: 4px 0 0; color: var(--color-text-secondary); font-size: 30px; }
.identity b { position: absolute; right: 0; top: 36px; color: var(--color-accent-primary); font-size: 24px; }
.divider { height: 1px; margin-top: 20px; background: color-mix(in srgb, var(--color-border-glow) 62%, transparent); }
.meta { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 20px; }
.meta div { display: grid; gap: 8px; }
.meta small { color: var(--color-text-secondary); }
.meta strong { font-size: 12px; font-weight: 400; }
.accent { color: var(--color-accent-primary); }
.chips { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 34px; }
.chips span { padding: 6px 12px; border: 1px solid var(--color-border-default); border-radius: 999px; color: var(--color-text-secondary); background: var(--color-bg-control); font-size: 11px; }
.chips .active { color: var(--color-accent-primary); border-color: var(--color-border-strong); background: var(--color-bg-selected); }

.block { margin-top: 100px; }
.anchor { scroll-margin-top: 120px; }
.section-title { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
.section-title h2 { margin: 10px 0 0; font-size: clamp(30px,3vw,36px); line-height: 1.15; letter-spacing: -.03em; }
.suffix { margin-bottom: 8px; color: var(--color-text-secondary); font-size: 10px; }

.orbit-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
.project-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
.project-link { color: inherit; text-decoration: none; }
.card { min-height: 210px; padding: 20px; }
.card i,.project-top i {
    display: grid; width: 40px; height: 40px; place-items: center;
    border: 1px solid var(--color-border-strong); border-radius: 12px;
    color: var(--color-accent-primary); background: var(--color-bg-control); font-style: normal; font-size: 18px;
}
.card > .eyebrow { position: relative; z-index: 1; margin-top: 18px; color: var(--color-text-secondary); }
.card h3 { position: relative; z-index: 1; margin: 9px 0 8px; font-size: 20px; }
.card > p:last-of-type { position: relative; z-index: 1; margin: 0; color: var(--color-text-secondary); font-size: 13px; line-height: 1.65; }
.project-card { min-height: 260px; padding: 20px 22px; }
.project-top { position: relative; z-index: 1; display: flex; justify-content: space-between; }
.project-top span { color: var(--color-text-secondary); font-size: 10px; }
.project-card h3 { font-size: 30px; }
.project-card > b { position: absolute; left: 22px; bottom: 24px; z-index: 1; font-size: 13px; font-weight: 500; }

.lab-grid { display: grid; grid-template-columns: .78fr 1.22fr; gap: 20px; }
.tool-panel,.feature { min-height: 370px; padding: 26px; }
.panel-head { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; }
.panel-head h3 { margin: 8px 0 0; font-size: 26px; }
.panel-head > span { color: var(--color-accent-primary); font-size: 22px; }
.tools { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; margin-top: 22px; }
.tools a {
    min-height: 58px; display: grid; align-content: center; gap: 3px; padding: 0 14px;
    border: 1px solid var(--color-border-default); border-radius: 12px;
    color: var(--color-text-primary); background: var(--color-bg-control);
    text-decoration: none; transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
}
.tools a span { font-size: 13px; }
.tools a small { color: var(--color-text-secondary); font-size: 10px; }
.tools a:hover,.tools a.active { border-color: var(--color-border-strong); background: var(--color-bg-selected); transform: translateY(-2px); }

.feature { display: flex; flex-direction: column; justify-content: space-between; }
.feature h3 { position: relative; z-index: 1; margin: 6px 0 12px; font-size: 36px; }
.feature p:not(.eyebrow):not(.preview-type) { position: relative; z-index: 1; max-width: 560px; color: var(--color-text-secondary); line-height: 1.7; }
.preview-body { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 210px; gap: 30px; align-items: center; }
.preview-type { margin: 0; color: var(--color-accent-primary); font-size: 10px; }
.preview-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.preview-tags span { padding: 5px 9px; border: 1px solid var(--color-border-glow); border-radius: 999px; color: var(--color-text-secondary); background: var(--color-chip-bg); font-size: 10px; }
.preview-visual {
    min-height: 190px; display: grid; align-content: center; gap: 16px; padding: 22px;
    border: 1px solid var(--color-border-strong); border-radius: 18px;
    background:
        radial-gradient(circle at 70% 20%, color-mix(in srgb,var(--color-accent-primary) 24%,transparent), transparent 45%),
        var(--color-bg-raised);
    animation: preview-in 180ms ease;
}
.preview-symbol { display: grid; width: 56px; height: 56px; place-items: center; border: 1px solid var(--color-accent-primary); border-radius: 15px; color: var(--color-accent-primary); background: var(--color-chip-bg); font-size: 19px; font-weight: 600; }
.preview-lines { display: grid; gap: 8px; }
.preview-lines span { height: 5px; border-radius: 99px; background: color-mix(in srgb,var(--color-text-secondary) 32%,transparent); }
.preview-lines span:nth-child(2) { width: 76%; }
.preview-lines span:nth-child(3) { width: 52%; background: color-mix(in srgb,var(--color-accent-primary) 50%,transparent); }
.preview-visual small { color: var(--color-text-secondary); font-size: 9px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.feature > a { position: relative; z-index: 1; display: flex; justify-content: space-between; color: var(--color-text-secondary); text-decoration: none; font-size: 11px; }
.feature > a b { color: var(--color-text-primary); font-size: 18px; }

.themes { margin-top: 90px; }
.theme-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 30px; margin-bottom: 18px; }
.theme-head h2 { margin: 10px 0 0; font-size: 30px; }
.theme-head > span { color: var(--color-text-secondary); font-size: 10px; }
.theme-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
.theme-card {
    width: 100%; min-height: 94px; padding: 16px 18px; text-align: left;
    color: var(--color-text-primary); cursor: pointer;
}
.theme-card strong,.theme-card span { position: relative; z-index: 1; display: block; }
.theme-card span { margin-top: 10px; color: var(--color-text-secondary); font-size: 10px; }
.theme-card.active { border-color: var(--color-border-strong); box-shadow: var(--shadow-selected); }
.auto-theme {
    margin-top: 16px; padding: 9px 13px; border: 1px solid var(--color-border-glow); border-radius: 10px;
    color: var(--color-text-secondary); background: var(--color-chip-bg); cursor: pointer;
}

@keyframes preview-in { from { opacity: .35; transform: translateY(4px); } to { opacity: 1; transform: none; } }

@media (max-width: 1050px) {
    .home-page { width: min(928px, calc(100% - 64px)); }
    .hero { grid-template-columns: 1fr 376px; gap: 52px; }
    .console { min-height: 330px; }
    .identity { margin-top: 34px; }
    .identity b,.chips { display: none; }
    .orbit-grid { grid-template-columns: repeat(2,1fr); }
    .lab-grid { grid-template-columns: 360px 1fr; }
    .preview-body { grid-template-columns: 1fr; }
    .preview-visual { display: none; }
}
@media (max-width: 760px) {
    .home-page { width: calc(100% - 40px); margin-top: 42px; }
    .hero { grid-template-columns: 1fr; min-height: 0; gap: 32px; }
    .hero-copy h1 { font-size: clamp(46px,14vw,58px); }
    .hero-index { display: none; }
    .console { min-height: 320px; }
    .meta { grid-template-columns: 1fr; }
    .block { margin-top: 76px; }
    .section-title,.theme-head { align-items: flex-start; flex-direction: column; gap: 10px; }
    .suffix { display: none; }
    .orbit-grid,.project-grid,.lab-grid { grid-template-columns: 1fr; }
    .theme-grid { grid-template-columns: repeat(2,1fr); }
    .project-card { min-height: 230px; }
    .preview-visual { display: grid; }
}
@media (max-width: 420px) {
    .actions { flex-direction: column; }
    .actions a { justify-content: center; }
    .tools,.theme-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
    .tools a { transition: none; }
    .tools a:hover,.tools a.active { transform: none; }
    .preview-visual { animation: none; }
}
</style>
