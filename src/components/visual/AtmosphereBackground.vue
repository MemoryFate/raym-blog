<template>
    <div class="atmosphere" :data-theme="theme" aria-hidden="true">
        <div class="atmosphere__gradient"></div>
        <canvas ref="canvas" class="atmosphere__canvas"></canvas>
        <div class="atmosphere__grain"></div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue"

const props = defineProps({
    theme: { type: String, default: "night" },
})

const canvas = ref(null)
let ctx
let frameId
let width = 0
let height = 0
let dpr = 1
let reducedMotion = false

const stars = Array.from({ length: 96 }, (_, index) => {
    const seed = Math.sin(index * 917.37 + 42.71) * 43758.5453
    const seed2 = Math.sin(index * 313.11 + 9.17) * 12345.6789
    const seed3 = Math.sin(index * 127.91 + 77.3) * 9182.223
    return {
        x: Math.abs(seed % 1),
        y: Math.abs(seed2 % 1),
        size: 0.7 + Math.abs(seed3 % 1) * 1.6,
        phase: Math.abs((seed + seed2) % 1) * Math.PI * 2,
    }
})

const themeVisuals = {
    dawn: { starOpacity: 0.16, star: "rgba(226,238,255,1)", cloud: "rgba(255,195,168,.14)", halo: "rgba(126,169,255,.10)" },
    day: { starOpacity: 0.02, star: "rgba(255,255,255,1)", cloud: "rgba(255,255,255,.20)", halo: "rgba(255,183,122,.09)" },
    sunset: { starOpacity: 0.22, star: "rgba(245,232,255,1)", cloud: "rgba(255,151,121,.15)", halo: "rgba(132,102,255,.14)" },
    night: { starOpacity: 0.86, star: "rgba(222,242,255,1)", cloud: "rgba(92,129,188,.08)", halo: "rgba(86,65,177,.13)" },
}

function resizeCanvas() {
    if (!canvas.value) return
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight
    canvas.value.width = Math.round(width * dpr)
    canvas.value.height = Math.round(height * dpr)
    canvas.value.style.width = `${width}px`
    canvas.value.style.height = `${height}px`
    ctx = canvas.value.getContext("2d")
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawFrame(performance.now())
}

function drawCloud(x, y, radius, color) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.5, color.replace(/0\.\d+\)/, "0.06)"))
    gradient.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
}

function drawFrame(time = 0) {
    if (!ctx) return
    const visual = themeVisuals[props.theme] || themeVisuals.night
    ctx.clearRect(0, 0, width, height)
    const drift = reducedMotion ? 0 : time * 0.000015

    ctx.save()
    ctx.globalCompositeOperation = "screen"
    drawCloud(width * (0.72 + Math.sin(drift) * 0.03), height * 0.24, Math.max(width, height) * 0.28, visual.halo)
    drawCloud(width * (0.18 + Math.cos(drift * 0.7) * 0.03), height * 0.76, Math.max(width, height) * 0.24, visual.cloud)
    drawCloud(width * 0.52, height * (0.52 + Math.sin(drift * 0.6) * 0.02), Math.max(width, height) * 0.18, visual.cloud)
    ctx.restore()

    ctx.save()
    for (const star of stars) {
        const twinkle = reducedMotion ? 0.78 : 0.58 + Math.sin(time * 0.001 + star.phase) * 0.22
        ctx.globalAlpha = Math.max(0, visual.starOpacity * twinkle)
        ctx.fillStyle = visual.star
        ctx.beginPath()
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2)
        ctx.fill()
    }
    ctx.restore()
}

function animate(time) {
    drawFrame(time)
    frameId = window.requestAnimationFrame(animate)
}

function restart() {
    if (frameId) window.cancelAnimationFrame(frameId)
    frameId = null
    drawFrame(performance.now())
    if (!reducedMotion) frameId = window.requestAnimationFrame(animate)
}

watch(() => props.theme, restart)

onMounted(() => {
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.addEventListener("resize", resizeCanvas, { passive: true })
    resizeCanvas()
    if (!reducedMotion) frameId = window.requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeCanvas)
    if (frameId) window.cancelAnimationFrame(frameId)
})
</script>

<style scoped lang="scss">
.atmosphere { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; background: var(--color-bg-base); }
.atmosphere__gradient { position: absolute; inset: -12%; background: var(--background-gradient); transition: background 900ms ease; }
.atmosphere__canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.atmosphere__grain {
    position: absolute; inset: 0; opacity: .055; mix-blend-mode: soft-light;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
}
@media (prefers-reduced-motion: reduce) { .atmosphere__gradient { transition: none; } }
</style>
