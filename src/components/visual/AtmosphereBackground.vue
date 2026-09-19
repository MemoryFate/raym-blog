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
    theme: { type:String, default:"night" },
    visual: {
        type:Object,
        default:() => ({
            starOpacity:.9,
            starDensity:.9,
            cloudOpacity:.2,
            cloudDensity:.6,
            cloudBlur:24,
            haloOpacity:.18,
            warmOpacity:0,
            speed:.7,
        }),
    },
})

const canvas = ref(null)
let ctx
let frameId
let visibilityHandler
let width = 0
let height = 0
let dpr = 1
let lastFrame = 0
let reducedMotion = false

const stars = Array.from({ length:160 }, (_, index) => {
    const a = Math.sin(index * 917.37 + 42.71) * 43758.5453
    const b = Math.sin(index * 313.11 + 9.17) * 12345.6789
    const c = Math.sin(index * 127.91 + 77.3) * 9182.223
    return {
        x:Math.abs(a % 1),
        y:Math.abs(b % 1),
        size:.6 + Math.abs(c % 1) * 1.8,
        phase:Math.abs((a+b)%1) * Math.PI * 2,
    }
})

const rgba = (rgb, alpha) => "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + alpha + ")"

function cssColor(name, fallback) {
    if (!canvas.value) return fallback
    const root = canvas.value.closest(".site-shell") || document.documentElement
    const value = getComputedStyle(root).getPropertyValue(name).trim()
    const match = value.match(/rgba?\(([^)]+)\)/)
    if (!match) return fallback
    const values = match[1].split(",").slice(0,3).map(v => Number.parseFloat(v.trim()))
    return values.every(Number.isFinite) ? values : fallback
}

function resizeCanvas() {
    if (!canvas.value) return
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight
    canvas.value.width = Math.round(width * dpr)
    canvas.value.height = Math.round(height * dpr)
    canvas.value.style.width = String(width) + "px"
    canvas.value.style.height = String(height) + "px"
    ctx = canvas.value.getContext("2d")
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawFrame(performance.now())
}

function drawPuff(x, y, rx, ry, color, opacity) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(1, ry / rx)
    const g = ctx.createRadialGradient(0,0,0,0,0,rx)
    g.addColorStop(0, rgba(color, opacity))
    g.addColorStop(.46, rgba(color, opacity * .55))
    g.addColorStop(1, rgba(color, 0))
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(0,0,rx,0,Math.PI*2)
    ctx.fill()
    ctx.restore()
}

function drawCloudCluster(x, y, scale, color, opacity) {
    const puffs = [
        [-.42,.04,.42,.18],
        [-.18,-.07,.50,.22],
        [.10,-.02,.48,.22],
        [.36,.05,.42,.17],
        [.03,.14,.66,.19],
    ]
    puffs.forEach(([dx,dy,rx,ry]) => {
        drawPuff(x+dx*scale,y+dy*scale,rx*scale,ry*scale,color,opacity)
    })
}

function drawFrame(time = 0) {
    if (!ctx) return
    ctx.clearRect(0,0,width,height)

    const v = props.visual || {}
    const speed = reducedMotion ? 0 : (v.speed ?? .7)
    const drift = time * .000012 * speed
    const base = Math.max(width,height)

    const starColor = cssColor("--color-canvas-star", [221,246,255])
    const cloudColor = cssColor("--color-canvas-cloud", [98,120,136])
    const ambientPrimary = cssColor("--color-ambient-primary", [21,58,82])
    const ambientSecondary = cssColor("--color-ambient-secondary", [12,33,48])

    ctx.save()
    ctx.globalCompositeOperation = props.theme === "dawn" || props.theme === "day" ? "source-over" : "screen"

    drawPuff(
        width*(.73+Math.sin(drift)*.025),
        height*.18,
        base*.34,
        base*.20,
        ambientPrimary,
        Math.max(.04,v.haloOpacity||.18),
    )

    if ((v.cloudDensity || 0) > .15) {
        ctx.save()
        ctx.filter = "blur(" + Math.min(26, Math.max(0, v.cloudBlur || 0)) + "px)"

        drawCloudCluster(
            width*(.20+Math.cos(drift*.7)*.035),
            height*.68,
            base*.35,
            cloudColor,
            Math.max(.035,v.cloudOpacity||.2),
        )

        if ((v.cloudDensity || 0) > .42) {
            drawCloudCluster(
                width*(.72+Math.sin(drift*.56)*.025),
                height*.43,
                base*.27,
                cloudColor,
                Math.max(.025,(v.cloudOpacity||.2)*.78),
            )
        }

        if ((v.cloudDensity || 0) > .78) {
            drawCloudCluster(
                width*(.45+Math.sin(drift*.34)*.018),
                height*.20,
                base*.22,
                cloudColor,
                Math.max(.02,(v.cloudOpacity||.2)*.52),
            )
        }

        ctx.restore()
    }

    if ((v.warmOpacity||0) > .01) {
        drawPuff(
            width*.72,
            height*.78,
            base*.42,
            base*.17,
            ambientSecondary,
            v.warmOpacity,
        )
    }

    ctx.restore()

    const baseLimit = width < 700 ? 62 : width < 1100 ? 104 : 150
    const starLimit = Math.max(0, Math.min(stars.length, Math.round(baseLimit * (v.starDensity ?? 1))))

    ctx.save()
    for (let i=0; i<starLimit; i+=1) {
        const star = stars[i]
        const twinkle = reducedMotion
            ? .82
            : .68 + Math.sin(time*.00072 + star.phase) * .18

        ctx.globalAlpha = Math.max(0,(v.starOpacity||0)*twinkle)
        ctx.fillStyle = "rgb(" + starColor.join(",") + ")"
        ctx.beginPath()
        ctx.arc(star.x*width,star.y*height,star.size,0,Math.PI*2)
        ctx.fill()
    }
    ctx.restore()
}

function animate(time) {
    if (time-lastFrame >= 33) {
        drawFrame(time)
        lastFrame = time
    }
    frameId = window.requestAnimationFrame(animate)
}

function stop() {
    if (frameId) window.cancelAnimationFrame(frameId)
    frameId = null
}

function restart() {
    stop()
    drawFrame(performance.now())
    if (!reducedMotion && !document.hidden) {
        frameId = window.requestAnimationFrame(animate)
    }
}

watch(() => [props.theme, props.visual], restart, { deep:true })

onMounted(() => {
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.addEventListener("resize",resizeCanvas,{ passive:true })

    visibilityHandler = () => {
        if (document.hidden) stop()
        else restart()
    }

    document.addEventListener("visibilitychange",visibilityHandler)
    resizeCanvas()
    restart()
})

onBeforeUnmount(() => {
    window.removeEventListener("resize",resizeCanvas)
    if (visibilityHandler) document.removeEventListener("visibilitychange",visibilityHandler)
    stop()
})
</script>

<style scoped lang="scss">
.atmosphere {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    background: var(--color-bg-base);
}

.atmosphere__gradient {
    position: absolute;
    inset: -12%;
    background: var(--background-gradient);
    transition: background 900ms ease;
}

.atmosphere__canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}

.atmosphere__grain {
    position: absolute;
    inset: 0;
    opacity: .035;
    mix-blend-mode: soft-light;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.30'/%3E%3C/svg%3E");
}

[data-theme="dawn"] .atmosphere__grain,
[data-theme="day"] .atmosphere__grain { opacity: .018; }

@media (prefers-reduced-motion:reduce) {
    .atmosphere__gradient { transition: none; }
    .atmosphere__grain { opacity: .02; }
}
</style>
