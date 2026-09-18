<template>
    <div class="site-shell" :data-theme="theme" :style="styleVars">
        <AtmosphereBackground :theme="theme" :visual="atmosphere" />
        <div class="site-layer">
            <SiteHeader />
            <main class="site-main">
                <router-view v-slot="{ Component, route }">
                    <Transition name="route-fade">
                        <component :is="Component" :key="route.fullPath" />
                    </Transition>
                </router-view>
            </main>
            <SiteFooter />
        </div>
    </div>
</template>

<script setup>
import AtmosphereBackground from "@/components/visual/AtmosphereBackground.vue"
import SiteFooter from "@/components/layout/SiteFooter.vue"
import SiteHeader from "@/components/layout/SiteHeader.vue"
import { useTimeTheme } from "@/composables/useTimeTheme.js"

const { theme, styleVars, atmosphere } = useTimeTheme()
</script>

<style scoped lang="scss">
.site-shell {
    position: relative;
    min-height: 100vh;
    color: var(--color-text-primary);
    background: var(--color-bg-base);
    transition: color 240ms ease, background 600ms ease;
}
.site-layer { position: relative; z-index: 1; min-height: 100vh; padding-top: 18px; }
.site-main { position: relative; min-height: calc(100vh - 210px); }
.route-fade-enter-active,
.route-fade-leave-active { transition: opacity 140ms ease, transform 140ms ease; }
.route-fade-leave-active { position: absolute; inset: 0 0 auto; width: 100%; pointer-events: none; }
.route-fade-enter-from { opacity: 0; transform: translateY(4px); }
.route-fade-leave-to { opacity: 0; transform: translateY(-3px); }

@media (max-width: 760px) { .site-layer { padding-top: 10px; } }
@media (prefers-reduced-motion: reduce) {
    .site-shell,
    .route-fade-enter-active,
    .route-fade-leave-active { transition: none; }
}
</style>
