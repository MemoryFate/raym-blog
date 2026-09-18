<template>
    <div class="home-page">
        <section class="hero">
            <div class="hero-copy">
                <p class="eyebrow">AVAILABLE FOR THOUGHTFUL COLLABORATIONS</p>
                <h1>Build. Explore.<span>•</span><br />Experiment.<span>•</span></h1>
                <p class="hero-text">
                    Hi, I’m RayM. A developer building thoughtful web experiences, useful AI tools,
                    and small experiments that make the internet feel a little more human.
                </p>
                <div class="actions">
                    <RouterLink class="primary" to="/Projects">View projects ↗</RouterLink>
                    <RouterLink class="secondary" to="/Lab">Enter the lab ›</RouterLink>
                </div>
                <p class="mono hero-index">01 — PERSONAL SITE&nbsp;&nbsp;&nbsp;&nbsp;02 — DIGITAL GARDEN</p>
            </div>

            <NeonGlass class="console" glow>
                <div class="console-head mono"><span>● CONSOLE ONLINE</span><span>RM / 001</span></div>
                <div class="identity">
                    <p class="eyebrow">CURRENT IDENTITY</p>
                    <h2>Developer</h2>
                    <p>/ Builder</p>
                    <b>&lt;/&gt;</b>
                </div>
                <div class="divider"></div>
                <div class="meta mono">
                    <div><small>Focus</small><strong>Web · AI · Systems</strong></div>
                    <div><small>Status</small><strong class="accent">Building something…</strong></div>
                </div>
                <div class="chips">
                    <span class="active">Vue</span><span>JavaScript</span><span>AI</span><span>Curiosity</span>
                </div>
            </NeonGlass>
        </section>

        <section class="block">
            <SectionTitle eyebrow="A MODULAR MIND" title="A few things I’m orbiting" suffix="/ 04 NODES ACTIVE" />
            <div class="orbit-grid">
                <NeonGlass v-for="item in orbitItems" :key="item.label" class="card orbit-card" interactive>
                    <i>{{ item.icon }}</i>
                    <p class="eyebrow">{{ item.label }}</p>
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                </NeonGlass>
            </div>
        </section>

        <section id="projects" class="block anchor">
            <SectionTitle eyebrow="SELECTED WORK" title="Projects with a pulse" suffix="Growing quietly ↗" />
            <div class="project-grid">
                <NeonGlass v-for="(project, index) in projects" :key="project.title" class="card project-card" interactive>
                    <div class="project-top"><i>{{ project.icon }}</i><span class="mono">0{{ index + 1 }} / 02</span></div>
                    <p class="eyebrow">{{ project.type }}</p>
                    <h3>{{ project.title }}</h3>
                    <p>{{ project.description }}</p>
                    <b>{{ project.action }}</b>
                </NeonGlass>
            </div>
        </section>

        <section class="block anchor">
            <SectionTitle eyebrow="TOOLS / EXPERIMENTS" title="A place to play with ideas" suffix="Open the lab ↗" />
            <div class="lab-grid">
                <NeonGlass class="tool-panel">
                    <div class="panel-head"><div><p class="eyebrow">UTILITY SHELF</p><h3>Tiny tools</h3></div><span class="mono">›_</span></div>
                    <div class="tools">
                        <RouterLink v-for="tool in tools" :key="tool.name" :to="tool.path">{{ tool.name }}</RouterLink>
                    </div>
                </NeonGlass>

                <NeonGlass class="feature" glow interactive>
                    <div class="panel-head"><p class="eyebrow">SELECTED EXPERIMENT</p><span>↯</span></div>
                    <div><h3>QR Code</h3><p>A focused little interface for when you need one job done without opening another giant app.</p></div>
                    <RouterLink to="/Tools/text2qrcode"><span>●&nbsp; ready to explore</span><b>↗</b></RouterLink>
                </NeonGlass>
            </div>
        </section>

        <section class="themes">
            <p class="eyebrow">TIME-BASED BACKGROUND SYSTEM</p>
            <div class="theme-grid">
                <NeonGlass v-for="item in themeItems" :key="item.key" class="theme-card" :class="{ active: theme === item.key }">
                    <strong>{{ item.title }}</strong><span class="mono">{{ item.caption }}</span>
                </NeonGlass>
            </div>
        </section>
    </div>
</template>

<script setup>
import { defineComponent, h } from "vue"
import NeonGlass from "@/components/ui/NeonGlass.vue"
import { useTimeTheme } from "@/composables/useTimeTheme.js"

const { theme } = useTimeTheme()

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
    { icon: "◎", label: "ABOUT", title: "Curious by default", description: "I like the space where design, code, and a good question overlap." },
    { icon: "▣", label: "FOCUS", title: "Useful intelligence", description: "Exploring calm interfaces for complex AI-powered workflows." },
    { icon: "≋", label: "STACK", title: "Small, sharp tools", description: "Vue, JavaScript, edge-first thinking, and a lot of iteration." },
    { icon: "✣", label: "NOW", title: "Making room", description: "Collecting notes, prototypes, and ideas worth returning to." },
]

const projects = [
    { icon: "✣", type: "AI / INTERFACE", title: "Signal Garden", description: "A visual playground for turning noisy ideas into clear, useful systems.", action: "In progress ↗" },
    { icon: "≋", type: "TOOLS / OPEN SOURCE", title: "Tiny Systems", description: "Small, sharp utilities for the moments between bigger builds.", action: "Explore tools ↗" },
]

const tools = [
    { name: "QR Code", path: "/Tools/text2qrcode" },
    { name: "Random String", path: "/Tools/randomstr" },
    { name: "AES-GCM", path: "/Tools/aes-gcm" },
    { name: "Base64", path: "/Tools/base64" },
    { name: "Maze", path: "/Game/Maze" },
    { name: "Sudoku", path: "/Game/Sudoku" },
]

const themeItems = [
    { key: "dawn", title: "Dawn", caption: "clouds ↑ stars ↓" },
    { key: "day", title: "Day", caption: "clouds ● stars ○" },
    { key: "sunset", title: "Sunset", caption: "warm glow + violet" },
    { key: "night", title: "Night", caption: "stars ↑ clouds ↓" },
]
</script>

<style scoped lang="scss">
.home-page { width: min(1180px, calc(100% - 40px)); margin: 56px auto 0; }
.eyebrow { margin: 0; color: var(--color-accent-primary); font-size: 10px; letter-spacing: .14em; }
.hero { min-height: 500px; display: grid; grid-template-columns: 1fr 550px; gap: 70px; align-items: center; }
.hero-copy h1 { margin: 24px 0 0; color: var(--color-text-primary); font-size: clamp(54px, 5vw, 68px); line-height: 1.08; letter-spacing: -.045em; }
.hero-copy h1 span { color: var(--color-accent-primary); font-size: .5em; vertical-align: top; margin-left: 12px; }
.hero-text { max-width: 520px; margin: 24px 0 0; color: var(--color-text-secondary); font-size: 17px; line-height: 1.65; }
.actions { display: flex; gap: 16px; margin-top: 28px; }
.actions a { min-height: 48px; display: inline-flex; align-items: center; padding: 0 22px; border-radius: 14px; font-size: 13px; font-weight: 600; text-decoration: none; }
.primary { color: var(--color-accent-contrast); background: var(--color-accent-primary); box-shadow: 0 8px 24px color-mix(in srgb, var(--color-accent-primary) 30%, transparent); }
.secondary { color: var(--color-text-primary); border: 1px solid var(--color-border-glow); background: color-mix(in srgb, var(--color-bg-panel-strong) 82%, transparent); }
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
.meta div { display: grid; gap: 8px; }.meta small { color: var(--color-text-secondary); }.meta strong { font-size: 12px; font-weight: 400; }.accent { color: var(--color-accent-primary); }
.chips { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 34px; }.chips span { padding: 6px 12px; border: 1px solid var(--color-border-glow); border-radius: 999px; color: var(--color-text-secondary); background: var(--color-chip-bg); font-size: 11px; }.chips .active { color: var(--color-accent-primary); border-color: var(--color-accent-primary); }
.block { margin-top: 100px; }.anchor { scroll-margin-top: 120px; }
.section-title { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 28px; }.section-title h2 { margin: 10px 0 0; font-size: clamp(30px,3vw,36px); line-height: 1.15; letter-spacing: -.03em; }.suffix { margin-bottom: 8px; color: var(--color-text-secondary); font-size: 10px; }
.orbit-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }.project-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
.card { min-height: 210px; padding: 20px; }.card i,.project-top i { display: grid; width: 40px; height: 40px; place-items: center; border: 1px solid var(--color-border-glow); border-radius: 12px; color: var(--color-accent-primary); background: var(--color-chip-bg); font-style: normal; font-size: 18px; }.card > .eyebrow { position: relative; z-index: 1; margin-top: 18px; color: var(--color-text-secondary); }.card h3 { position: relative; z-index: 1; margin: 9px 0 8px; font-size: 20px; }.card > p:last-of-type { position: relative; z-index: 1; margin: 0; color: var(--color-text-secondary); font-size: 13px; line-height: 1.6; }
.project-card { min-height: 260px; padding: 20px 22px; }.project-top { position: relative; z-index: 1; display: flex; justify-content: space-between; }.project-top span { color: var(--color-text-secondary); font-size: 10px; }.project-card h3 { font-size: 30px; }.project-card > b { position: absolute; left: 22px; bottom: 24px; z-index: 1; font-size: 13px; font-weight: 500; }
.lab-grid { display: grid; grid-template-columns: .78fr 1.22fr; gap: 20px; }.tool-panel,.feature { min-height: 350px; padding: 26px; }.panel-head { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; }.panel-head h3 { margin: 8px 0 0; font-size: 26px; }.panel-head > span { color: var(--color-accent-primary); font-size: 22px; }
.tools { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; margin-top: 22px; }.tools a { min-height: 48px; display: flex; align-items: center; padding: 0 14px; border: 1px solid var(--color-border-glow); border-radius: 12px; color: var(--color-text-primary); background: color-mix(in srgb,var(--color-chip-bg) 76%,transparent); text-decoration: none; font-size: 13px; }.tools a:hover { border-color: var(--color-accent-primary); }
.feature { display: flex; flex-direction: column; justify-content: space-between; }.feature h3 { position: relative; z-index: 1; margin: 0 0 12px; font-size: 36px; }.feature p:not(.eyebrow) { position: relative; z-index: 1; max-width: 560px; color: var(--color-text-secondary); line-height: 1.6; }.feature > a { position: relative; z-index: 1; display: flex; justify-content: space-between; color: var(--color-text-secondary); text-decoration: none; font-size: 11px; }.feature > a b { color: var(--color-text-primary); font-size: 18px; }
.themes { margin-top: 90px; }.theme-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-top: 18px; }.theme-card { min-height: 94px; padding: 16px 18px; }.theme-card strong,.theme-card span { position: relative; z-index: 1; display: block; }.theme-card span { margin-top: 10px; color: var(--color-text-secondary); font-size: 10px; }.theme-card.active { border-color: var(--color-accent-primary); box-shadow: var(--shadow-glow); }

@media (max-width: 1050px) {
    .home-page { width: min(928px, calc(100% - 64px)); }.hero { grid-template-columns: 1fr 376px; gap: 52px; }.console { min-height: 330px; }.identity { margin-top: 34px; }.identity b,.chips { display: none; }.orbit-grid { grid-template-columns: repeat(2,1fr); }.lab-grid { grid-template-columns: 360px 1fr; }
}
@media (max-width: 760px) {
    .home-page { width: calc(100% - 40px); margin-top: 42px; }.hero { grid-template-columns: 1fr; min-height: 0; gap: 32px; }.hero-copy h1 { font-size: clamp(46px,14vw,58px); }.hero-index { display: none; }.console { min-height: 320px; }.meta { grid-template-columns: 1fr; }.block { margin-top: 76px; }.section-title { align-items: flex-start; flex-direction: column; gap: 10px; }.suffix { display: none; }.orbit-grid,.project-grid,.lab-grid { grid-template-columns: 1fr; }.theme-grid { grid-template-columns: repeat(2,1fr); }.project-card { min-height: 230px; }
}
@media (max-width: 420px) { .actions { flex-direction: column; }.actions a { justify-content: center; }.tools,.theme-grid { grid-template-columns: 1fr; } }
</style>
