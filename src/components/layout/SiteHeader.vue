<template>
    <header class="header-wrap">
        <NeonGlass as="div" class="site-header">
            <RouterLink class="brand" to="/" @click="closeMenu"><span class="brand__mark">↯</span><span>RayM.</span></RouterLink>
            <button class="menu-toggle" type="button" :aria-expanded="navOpen" aria-label="Toggle navigation" @click="navOpen=!navOpen"><span></span><span></span></button>
            <nav class="site-nav" :class="{ 'site-nav--open':navOpen }">
                <RouterLink to="/" @click="closeMenu">Home</RouterLink>
                <RouterLink to="/Projects" @click="closeMenu">Projects</RouterLink>
                <RouterLink to="/Tools" @click="closeMenu">Tools</RouterLink>
                <RouterLink to="/Lab" @click="closeMenu">Lab</RouterLink>
                <RouterLink to="/Notes" @click="closeMenu">Notes</RouterLink>
                <a href="https://github.com/MemoryFate/raym-blog" target="_blank" rel="noreferrer" @click="closeMenu">↗ GitHub</a>
            </nav>
        </NeonGlass>
    </header>
</template>

<script setup>
import { ref } from "vue"
import NeonGlass from "@/components/ui/NeonGlass.vue"

const navOpen=ref(false)
const closeMenu=()=>{ navOpen.value=false }
</script>

<style scoped lang="scss">
.header-wrap{position:sticky;top:18px;z-index:30;width:min(1180px,calc(100% - 40px));margin:0 auto;padding-top:2px}
.site-header{min-height:72px;display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-radius:18px}
.brand{position:relative;z-index:1;display:inline-flex;align-items:center;gap:14px;color:var(--color-text-primary);font-weight:700;font-size:18px;text-decoration:none}
.brand__mark{display:grid;width:40px;height:40px;place-items:center;border:1px solid var(--color-accent-primary);border-radius:12px;color:var(--color-accent-primary);background:var(--color-chip-bg)}
.site-nav{position:relative;z-index:1;display:flex;align-items:center;gap:30px}
.site-nav a{color:var(--color-text-secondary);font-size:13px;text-decoration:none;transition:color 160ms ease,text-shadow 160ms ease}
.site-nav a:hover,.site-nav a.router-link-active{color:var(--color-text-primary);text-shadow:0 0 16px color-mix(in srgb,var(--color-accent-primary) 56%,transparent)}
.menu-toggle{display:none;position:relative;z-index:2;width:42px;height:42px;padding:0;border:1px solid var(--color-border-glow);border-radius:12px;background:var(--color-chip-bg)}
.menu-toggle span{display:block;width:18px;height:1px;margin:5px auto;background:var(--color-text-primary)}
@media(max-width:760px){
 .header-wrap{top:12px;width:calc(100% - 28px)}.site-header{min-height:64px;padding:10px 12px}.brand__mark{width:38px;height:38px}.menu-toggle{display:block}
 .site-nav{position:absolute;top:calc(100% + 10px);right:0;width:min(250px,calc(100vw - 28px));flex-direction:column;align-items:stretch;gap:0;padding:10px;border:1px solid var(--color-border-glow);border-radius:16px;background:var(--color-bg-panel-strong);box-shadow:var(--shadow-panel);backdrop-filter:blur(18px);opacity:0;visibility:hidden;transform:translateY(-8px);transition:opacity 160ms ease,transform 160ms ease,visibility 160ms ease}
 .site-nav--open{opacity:1;visibility:visible;transform:translateY(0)}.site-nav a{padding:12px 14px;border-radius:10px}.site-nav a:hover{background:var(--color-chip-bg)}
}
</style>
