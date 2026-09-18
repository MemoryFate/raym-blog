<template>
    <article class="article">
        <RouterLink class="back mono" to="/Notes">← Back to Notes</RouterLink>
        <header><p class="eyebrow">NOTES / DESIGN SYSTEM</p><h1>Designing a background<br />that changes with time</h1><span class="mono">Sep 2026 · 6 min read · Design / Frontend</span><p>The goal was not to build a dramatic animated wallpaper. The goal was to make the site feel subtly alive while keeping content readable and the RayM visual identity stable.</p></header>
        <NeonGlass class="overview" glow><p class="eyebrow">SYSTEM OVERVIEW</p><h2>Sky → Stars / Clouds → Tokens → UI</h2><p>One time phase drives the background atmosphere and interface accents. Mood changes without changing structure.</p></NeonGlass>
        <section v-for="item in sections" :key="item.no"><span class="mono no">{{ item.no }}</span><h2>{{ item.title }}</h2><p>{{ item.body }}</p><NeonGlass v-if="item.callout" class="callout"><p class="eyebrow">{{ item.callout.title }}</p><p>{{ item.callout.body }}</p></NeonGlass></section>
        <NeonGlass class="takeaway"><p class="eyebrow">TAKEAWAY</p><p>The background is not a separate visual effect. It is one layer of the same time-aware system that also controls cards, accents, interaction states, and page mood.</p></NeonGlass>
    </article>
</template>
<script setup>
import NeonGlass from "@/components/ui/NeonGlass.vue"
const sections=[
 {no:"01",title:"Start with the sky, not the particles.",body:"CSS gradients are the base layer because they are cheap, smooth, and easy to interpolate. Large-scale atmosphere belongs there: sky color, dawn glow, sunset warmth, and deep-night blue."},
 {no:"02",title:"Use Canvas for atmosphere, not spectacle.",body:"Stars and clouds should be visible enough to establish mood, but quiet enough to disappear from attention while reading. That means low density, slow movement, and different visibility targets for each phase.",callout:{title:"VISIBILITY RULE",body:"If a review screenshot cannot show a recognizable cloud layer or star field at the intended time state, the atmosphere is too weak."}},
 {no:"03",title:"Let the UI inherit the same time state.",body:"The card system does not become a different design at sunset. Fill, border, glow, accent, and supporting colors simply inherit a different theme mode."},
 {no:"04",title:"Transition continuously, not on the hour.",body:"A macOS-like feel comes from interpolation. Dawn and sunset are windows, not switches. Stars fade while clouds rise and colors move over tens of minutes."},
 {no:"05",title:"Readability is the final constraint.",body:"Article pages intentionally reduce glow, cloud opacity, and visual noise. The atmosphere should become quieter without making the site feel like a different product."},
]
</script>
<style scoped lang="scss">
.article{width:min(780px,calc(100% - 40px));margin:54px auto 0}.back{color:var(--color-text-secondary);font-size:11px;text-decoration:none}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}header{margin-top:44px}header h1{margin:18px 0;font-size:clamp(42px,6vw,56px);line-height:1.08;letter-spacing:-.045em}header span{color:var(--color-text-secondary);font-size:10px}header>p:last-child{margin-top:34px;color:var(--color-text-secondary);font-size:18px;line-height:1.75}.overview{margin-top:54px;min-height:260px;padding:28px}.overview>*{position:relative;z-index:1}.overview h2{margin:18px 0;font-size:30px}.overview p:last-child,.article section>p,.takeaway p:last-child{color:var(--color-text-secondary);line-height:1.8}.article section{margin-top:72px}.no{color:var(--color-accent-primary);font-size:11px}.article section h2{margin:18px 0;font-size:31px;line-height:1.25}.callout{margin-top:30px;padding:22px;border-left:3px solid var(--color-accent-primary)}.callout>*{position:relative;z-index:1}.callout p:last-child{margin-bottom:0;color:var(--color-text-secondary);line-height:1.7}.takeaway{margin-top:74px;padding:24px}.takeaway>*{position:relative;z-index:1}
@media(max-width:600px){.article{margin-top:40px}header>p:last-child{font-size:16px}.article section h2{font-size:26px}.article section{margin-top:60px}}
</style>
