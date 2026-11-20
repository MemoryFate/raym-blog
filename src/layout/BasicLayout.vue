<template>
    <div class="site-shell" :data-theme="theme" :data-ui-theme="uiTheme" :style="styleVars">
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

const { theme, uiTheme, styleVars, atmosphere } = useTimeTheme()
</script>

<style scoped lang="scss">
.site-shell {
    position: relative;
    isolation: isolate;
    min-height: 100vh;
    color: var(--color-text-primary);
    background: var(--color-bg-base);
    /* Foreground text and card surfaces change atomically for readability. */
}
.site-layer { position: relative; z-index: 1; min-height: 100vh; padding-top: 18px; }
.site-main { position: relative; min-height: calc(100vh - 210px); }
.route-fade-enter-active,
.route-fade-leave-active { transition: opacity 230ms cubic-bezier(.22,1,.36,1), transform 230ms cubic-bezier(.22,1,.36,1); }
.route-fade-leave-active { position: absolute; inset: 0 0 auto; width: 100%; pointer-events: none; }
.route-fade-enter-from { opacity: 0; transform: translateY(7px); }
.route-fade-leave-to { opacity: 0; transform: translateY(-4px); }

@media (max-width: 760px) { .site-layer { padding-top: 10px; } }
@media (prefers-reduced-motion: reduce) {
    .site-shell,
    .route-fade-enter-active,
    .route-fade-leave-active { transition: none; }
}
</style>
