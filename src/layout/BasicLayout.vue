<template>
    <div class="site-shell" :data-theme="theme" :style="styleVars">
        <AtmosphereBackground :theme="theme" :visual="atmosphere" />
        <div class="site-layer">
            <SiteHeader />
            <main class="site-main">
                <router-view v-slot="{ Component }">
                    <Transition name="route-fade" mode="out-in">
                        <component :is="Component" />
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
.site-shell { position:relative; min-height:100vh; color:var(--color-text-primary); background:var(--color-bg-base); }
.site-layer { position:relative; z-index:1; min-height:100vh; padding-top:18px; }
.site-main { min-height:calc(100vh - 210px); }
.route-fade-enter-active,.route-fade-leave-active { transition:opacity 180ms ease,transform 180ms ease; }
.route-fade-enter-from,.route-fade-leave-to { opacity:0; transform:translateY(5px); }
@media (max-width:760px){ .site-layer{padding-top:10px;} }
@media (prefers-reduced-motion:reduce){ .route-fade-enter-active,.route-fade-leave-active{transition:none;} }
</style>
