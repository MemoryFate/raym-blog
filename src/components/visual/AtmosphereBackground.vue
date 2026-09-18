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
    visual: { type:Object, default:() => ({ starOpacity:.9, cloudOpacity:.1, haloOpacity:.12, warmOpacity:.02 }) },
})

const canvas = ref(null)
let ctx, frameId, visibilityHandler
let width = 0, height = 0, dpr = 1, lastFrame = 0, reducedMotion = false

const stars = Array.from({ length:140 }, (_, index) => {
    const a = Math.sin(index * 917.37 + 42.71) * 43758.5453
    const b = Math.sin(index * 313.11 + 9.17) * 12345.6789
    const c = Math.sin(index * 127.91 + 77.3) * 9182.223
    return { x:Math.abs(a % 1), y:Math.abs(b % 1), size:.65 + Math.abs(c % 1) * 1.7, phase:Math.abs((a+b)%1) * Math.PI * 2 }
})

const rgba = (rgb, alpha) => "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + alpha + ")"

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
    g.addColorStop(.48, rgba(color, opacity * .5))
    g.addColorStop(1, rgba(color, 0))
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(0,0,rx,0,Math.PI*2)
    ctx.fill()
    ctx.restore()
}

function drawCloudCluster(x, y, scale, color, opacity) {
    const puffs=[[-.36,.04,.42,.18],[-.12,-.06,.48,.22],[.15,.02,.5,.2],[.38,.06,.4,.16],[.02,.12,.62,.18]]
    puffs.forEach(([dx,dy,rx,ry]) => drawPuff(x+dx*scale,y+dy*scale,rx*scale,ry*scale,color,opacity))
}

function drawFrame(time = 0) {
    if (!ctx) return
    ctx.clearRect(0,0,width,height)
    const v = props.visual || {}
    const drift = reducedMotion ? 0 : time * .000012
    const base = Math.max(width,height)

    ctx.save()
    ctx.globalCompositeOperation = "screen"
    drawPuff(width*(.73+Math.sin(drift)*.025),height*.2,base*.34,base*.2,props.theme==="sunset"?[132,102,255]:[72,164,235],Math.max(.035,v.haloOpacity||.12))
    const cloudColor = props.theme==="sunset"?[190,166,255]:props.theme==="day"?[190,228,255]:[118,163,220]
    drawCloudCluster(width*(.22+Math.cos(drift*.7)*.035),height*.72,base*.34,cloudColor,Math.max(.04,v.cloudOpacity||.1))
    drawCloudCluster(width*(.72+Math.sin(drift*.56)*.025),height*.48,base*.26,cloudColor,Math.max(.03,(v.cloudOpacity||.1)*.72))
    if ((v.warmOpacity||0)>.02) drawPuff(width*.72,height*.78,base*.4,base*.16,[255,137,96],v.warmOpacity)
    ctx.restore()

    const limit = width<700?52:width<1100?88:128
    ctx.save()
    for (let i=0;i<limit;i+=1) {
        const star=stars[i]
        const twinkle=reducedMotion?.82:.68+Math.sin(time*.00072+star.phase)*.18
        ctx.globalAlpha=Math.max(0,(v.starOpacity||0)*twinkle)
        ctx.fillStyle=props.theme==="sunset"?"rgb(247,238,255)":"rgb(226,244,255)"
        ctx.beginPath(); ctx.arc(star.x*width,star.y*height,star.size,0,Math.PI*2); ctx.fill()
    }
    ctx.restore()
}

function animate(time) {
    if (time-lastFrame>=33) { drawFrame(time); lastFrame=time }
    frameId=window.requestAnimationFrame(animate)
}
function stop(){ if(frameId) window.cancelAnimationFrame(frameId); frameId=null }
function restart(){ stop(); drawFrame(performance.now()); if(!reducedMotion&&!document.hidden) frameId=window.requestAnimationFrame(animate) }

watch(() => [props.theme, props.visual], restart, { deep:true })

onMounted(() => {
    reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.addEventListener("resize",resizeCanvas,{passive:true})
    visibilityHandler=()=>{ if(document.hidden) stop(); else restart() }
    document.addEventListener("visibilitychange",visibilityHandler)
    resizeCanvas(); restart()
})
onBeforeUnmount(() => {
    window.removeEventListener("resize",resizeCanvas)
    if(visibilityHandler) document.removeEventListener("visibilitychange",visibilityHandler)
    stop()
})
</script>

<style scoped lang="scss">
.atmosphere { position:fixed; inset:0; z-index:0; overflow:hidden; pointer-events:none; background:var(--color-bg-base); }
.atmosphere__gradient { position:absolute; inset:-12%; background:var(--background-gradient); }
.atmosphere__canvas { position:absolute; inset:0; width:100%; height:100%; }
.atmosphere__grain {
    position:absolute; inset:0; opacity:.045; mix-blend-mode:soft-light;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
}
@media (prefers-reduced-motion:reduce){ .atmosphere__grain{opacity:.03;} }
</style>
