<template>
    <header class="header-wrap">
        <NeonGlass as="div" class="site-header" raised :clip="false">
            <RouterLink class="brand" to="/" @click="closeMenu">
                <span class="brand__mark" aria-hidden="true">ϟ</span>
                <span>RayM.</span>
            </RouterLink>

            <div class="header-actions">
                <button
                    class="menu-toggle"
                    type="button"
                    :aria-expanded="navOpen"
                    aria-controls="raym-main-navigation"
                    aria-label="切换导航"
                    @click="toggleMobileNav"
                ><span></span><span></span></button>

                <nav
                    id="raym-main-navigation"
                    class="site-nav"
                    :class="{ 'site-nav--open': navOpen }"
                    aria-label="主导航"
                    @keydown.esc="closeMenu"
                >
                    <RouterLink to="/" class="nav-home" @click="closeMenu">首页</RouterLink>
                    <div
                        v-for="(group, index) in navigationGroups"
                        :key="group.label"
                        class="nav-group"
                        :class="{
                            'nav-group--expanded': expandedGroup === group.label,
                            'nav-group--right': index > 1,
                        }"
                    >
                        <div class="nav-entry">
                            <RouterLink :to="group.path" class="nav-main-link" @click="closeMenu">
                                {{ group.label }}
                            </RouterLink>
                            <button
                                type="button"
                                class="nav-expand"
                                :aria-label="'展开' + group.label + '子菜单'"
                                :aria-expanded="expandedGroup === group.label"
                                @click="toggleGroup(group.label)"
                            >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
                                    <path d="M2.5 4.25 6 7.75 9.5 4.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div class="nav-popover">
                            <div class="nav-popover-card">
                                <p class="nav-popover-title mono">{{ group.label }} / QUICK ACCESS</p>
                                <RouterLink
                                    v-for="item in group.items"
                                    :key="item.path"
                                    class="nav-sub-link"
                                    :to="item.path"
                                    @click="closeMenu"
                                >
                                    <span>{{ item.label }}</span>
                                    <small>{{ item.description }}</small>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                    <a href="https://github.com/MemoryFate/raym-blog" target="_blank" rel="noreferrer" class="nav-external" @click="closeMenu">↗ GitHub</a>
                </nav>

                <ThemeSettings />
            </div>
        </NeonGlass>
    </header>
</template>

<script setup>
import { ref } from "vue"
import NeonGlass from "@/components/ui/NeonGlass.vue"
import ThemeSettings from "@/components/layout/ThemeSettings.vue"

const navigationGroups = [
    {
        label:"项目",
        path:"/Projects",
        items:[
            { label:"项目总览", description:"全部项目与实践", path:"/Projects" },
            { label:"RayM Blog", description:"本博客的设计与实现", path:"/Projects/raym-blog" },
        ],
    },
    {
        label:"工具",
        path:"/Tools",
        items:[
            { label:"工具总览", description:"打开工具集合", path:"/Tools" },
            { label:"AES-GCM", description:"加密、解密与 URL 预处理", path:"/Tools/aes-gcm" },
            { label:"URL 编解码", description:"多字符集百分号编解码", path:"/Tools/url-encode" },
            { label:"Base64", description:"图片、视频与 Base64 转换", path:"/Tools/base64" },
            { label:"二维码", description:"文本与链接生成二维码", path:"/Tools/text2qrcode" },
            { label:"随机字符串", description:"生成测试数据与标识", path:"/Tools/randomstr" },
        ],
    },
    {
        label:"实验室",
        path:"/Lab",
        items:[
            { label:"实验室总览", description:"所有互动实验", path:"/Lab" },
            { label:"迷宫", description:"随机迷宫与路径搜索", path:"/Game/Maze" },
            { label:"数独", description:"逻辑挑战与状态校验", path:"/Game/Sudoku" },
            { label:"Socket 通信", description:"WebSocket 通信演示", path:"/Demo/SocketDemo" },
            { label:"Socket 客户端", description:"WebSocket 客户端工具", path:"/Demo/SocketClientDemo" },
        ],
    },
    {
        label:"笔记",
        path:"/Notes",
        items:[
            { label:"笔记总览", description:"记录与技术思考", path:"/Notes" },
            { label:"动态背景", description:"时间主题与 Canvas 背景", path:"/Notes/dynamic-background" },
        ],
    },
]

const navOpen = ref(false)
const expandedGroup = ref("")

function toggleMobileNav() {
    navOpen.value = !navOpen.value
    if (!navOpen.value) expandedGroup.value = ""
}

function toggleGroup(label) {
    expandedGroup.value = expandedGroup.value === label ? "" : label
}

function closeMenu() {
    navOpen.value = false
    expandedGroup.value = ""
    // 键盘导航关闭菜单后释放焦点，避免 :focus-within 残留展开状态。
    if (typeof document !== "undefined") {
        const active = document.activeElement
        if (active?.closest?.(".site-nav")) active.blur()
    }
}
</script>

<style scoped lang="scss">
.header-wrap {
    position:sticky;
    top:18px;
    z-index:30;
    width:min(1180px,calc(100% - 40px));
    margin:0 auto;
    padding-top:2px;
}
.site-header {
    min-height:72px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:14px 18px;
    border-radius:18px;
    background:var(--color-bg-raised);
    border-color:var(--color-border-default);
    box-shadow:var(--shadow-panel);
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
}
[data-theme="sunset"] .brand__mark { color:var(--color-text-primary); }
.brand {
    position:relative;
    z-index:1;
    display:inline-flex;
    align-items:center;
    gap:14px;
    color:var(--color-text-primary);
    font-weight:700;
    font-size:18px;
    text-decoration:none;
}
.brand__mark {
    display:grid;
    width:40px;
    height:40px;
    place-items:center;
    border:1px solid var(--color-border-strong);
    border-radius:12px;
    color:var(--color-accent-primary);
    background:var(--color-bg-control);
}
.header-actions {
    position:relative;
    z-index:2;
    display:flex;
    align-items:center;
    gap:16px;
}
.site-nav {
    display:flex;
    align-items:center;
    gap:20px;
}
.site-nav a {
    color:var(--color-text-secondary);
    font-size:13px;
    text-decoration:none;
    transition:color 180ms ease,text-shadow 180ms ease;
}
.site-nav a:hover,
.site-nav a.router-link-active {
    color:var(--color-text-primary);
    text-shadow:0 0 14px color-mix(in srgb,var(--color-accent-primary) 48%,transparent);
}
.nav-group { position:relative; }
.nav-entry { display:flex;align-items:center;gap:2px;white-space:nowrap; }
.nav-main-link { padding:10px 0; }
.nav-expand {
    width:18px;
    height:30px;
    display:grid;
    place-items:center;
    border:0;
    padding:0;
    color:var(--color-text-secondary);
    background:transparent;
    cursor:pointer;
}
.nav-expand svg { display:block;width:12px;height:12px;transform-origin:center;transition:transform 180ms ease; }
.nav-external { white-space:nowrap; }
.nav-popover {
    position:absolute;
    top:100%;
    left:-16px;
    width:264px;
    padding-top:13px;
    z-index:50;
    opacity:0;
    visibility:hidden;
    pointer-events:none;
    transform:translateY(-5px);
    transition:opacity 210ms ease,transform 210ms cubic-bezier(.2,.8,.2,1),visibility 210ms;
}
.nav-group--right .nav-popover { left:auto;right:-12px; }
.nav-popover-card {
    padding:11px;
    overflow:hidden;
    border:1px solid var(--color-border-strong);
    border-radius:15px;
    background:var(--color-bg-raised);
    box-shadow:var(--shadow-panel);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
}
.nav-popover-title {
    margin:4px 9px 9px;
    font-size:9px;
    letter-spacing:.1em;
    color:var(--color-accent-primary);
}
.site-nav .nav-sub-link {
    display:grid;
    gap:4px;
    margin:2px 0;
    padding:10px 11px;
    border-radius:10px;
    color:var(--color-text-primary);
    text-shadow:none;
    transition:background 160ms ease,transform 160ms ease;
}
.nav-sub-link small { font-size:10px;line-height:1.4;color:var(--color-text-secondary); }
.site-nav .nav-sub-link:hover,
.site-nav .nav-sub-link.router-link-active {
    background:var(--color-bg-selected);
    transform:translateX(2px);
    text-shadow:none;
}
.menu-toggle {
    display:none;
    width:42px;
    height:42px;
    padding:0;
    border:1px solid var(--color-border-glow);
    border-radius:12px;
    background:var(--color-chip-bg);
    cursor:pointer;
}
.menu-toggle span { display:block;width:18px;height:1px;margin:5px auto;background:var(--color-text-primary); }
@media (min-width:981px) {
    .nav-group:hover .nav-popover,
    .nav-group:focus-within .nav-popover {
        opacity:1;
        visibility:visible;
        pointer-events:auto;
        transform:translateY(0);
    }
    .nav-group:hover .nav-expand svg,
    .nav-group:focus-within .nav-expand svg { transform:rotate(180deg); }
}
@media (max-width:980px) {
    .header-wrap { top:12px;width:calc(100% - 28px); }
    .site-header { min-height:64px;padding:10px 12px; }
    .brand__mark { width:38px;height:38px; }
    .header-actions { gap:10px; }
    .menu-toggle { display:block; }
    .site-nav {
        position:absolute;
        top:calc(100% + 12px);
        right:50px;
        display:flex;
        flex-direction:column;
        align-items:stretch;
        gap:0;
        width:min(316px,calc(100vw - 28px));
        max-height:calc(100vh - 112px);
        padding:10px;
        overflow-y:auto;
        border:1px solid var(--color-border-strong);
        border-radius:16px;
        background:var(--color-bg-panel-strong);
        box-shadow:var(--shadow-panel);
        backdrop-filter:blur(18px);
        opacity:0;
        visibility:hidden;
        pointer-events:none;
        transform:translateY(-7px);
        transition:opacity 210ms ease,transform 210ms cubic-bezier(.2,.8,.2,1),visibility 210ms;
    }
    .site-nav--open {
        opacity:1;
        visibility:visible;
        pointer-events:auto;
        transform:translateY(0);
    }
    .site-nav > a,
    .nav-entry { min-height:42px; }
    .site-nav > a,
    .nav-main-link { display:flex;align-items:center;padding:11px 13px; }
    .nav-entry { justify-content:space-between; }
    .nav-expand { width:40px;height:40px; }
    .nav-group--expanded .nav-expand svg { transform:rotate(180deg); }
    .nav-popover,
    .nav-group--right .nav-popover {
        position:static;
        width:100%;
        padding:0;
        max-height:0;
        overflow:hidden;
        opacity:1;
        visibility:visible;
        pointer-events:none;
        transform:none;
        transition:max-height 240ms cubic-bezier(.2,.8,.2,1);
    }
    .nav-group--expanded .nav-popover { max-height:500px;pointer-events:auto; }
    .nav-popover-card {
        border-radius:11px;
        padding:6px;
        box-shadow:none;
        background:var(--color-bg-control);
    }
    .nav-popover-title { margin:4px 9px 5px; }
    .site-nav .nav-sub-link { padding:9px 11px; }
}
@media(max-width:440px) {
    .site-nav { right:0; }
}
@media (prefers-reduced-motion:reduce) {
    .nav-popover,
    .site-nav,
    .nav-expand svg,
    .site-nav a,
    .site-nav .nav-sub-link { transition:none!important;transform:none!important; }
}
</style>

