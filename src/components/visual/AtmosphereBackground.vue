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
    theme:{type:String,default:"night"},
    visual:{
        type:Object,
        default:()=>({
            starDimOpacity:.56,
            starBrightOpacity:.90,
            starCount:64,
            cloudOpacity:.18,
            cloudDensity:.52,
            cloudBlur:22,
            haloOpacity:.15,
            warmOpacity:0,
            speed:.7,
        }),
    },
})

const canvas=ref(null)
let ctx,frameId,visibilityHandler
let width=0,height=0,dpr=1,lastFrame=0,reducedMotion=false

const stars=Array.from({length:80},(_,index)=>{
    const a=Math.sin(index*917.37+42.71)*43758.5453
    const b=Math.sin(index*313.11+9.17)*12345.6789
    const c=Math.sin(index*127.91+77.3)*9182.223
    return {
        x:Math.abs(a%1),
        y:Math.abs(b%1),
        size:.65+Math.abs(c%1)*1.5,
        phase:Math.abs((a+b)%1)*Math.PI*2,
        bright:index%9===0,
    }
})

const rgba=(rgb,alpha)=>"rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+","+alpha+")"

function cssColor(name,fallback){
    if(!canvas.value)return fallback
    const root=canvas.value.closest(".site-shell")||document.documentElement
    const value=getComputedStyle(root).getPropertyValue(name).trim()
    const match=value.match(/rgba?\(([^)]+)\)/)
    if(!match)return fallback
    const values=match[1].split(",").slice(0,3).map(v=>Number.parseFloat(v.trim()))
    return values.every(Number.isFinite)?values:fallback
}

function resizeCanvas(){
    if(!canvas.value)return
    dpr=Math.min(window.devicePixelRatio||1,2)
    width=window.innerWidth
    height=window.innerHeight
    canvas.value.width=Math.round(width*dpr)
    canvas.value.height=Math.round(height*dpr)
    canvas.value.style.width=String(width)+"px"
    canvas.value.style.height=String(height)+"px"
    ctx=canvas.value.getContext("2d")
    ctx.setTransform(dpr,0,0,dpr,0,0)
    drawFrame(performance.now())
}

function drawPuff(x,y,rx,ry,color,opacity){
    ctx.save()
    ctx.translate(x,y)
    ctx.scale(1,ry/rx)
    const g=ctx.createRadialGradient(0,0,0,0,0,rx)
    g.addColorStop(0,rgba(color,opacity))
    g.addColorStop(.46,rgba(color,opacity*.52))
    g.addColorStop(1,rgba(color,0))
    ctx.fillStyle=g
    ctx.beginPath()
    ctx.arc(0,0,rx,0,Math.PI*2)
    ctx.fill()
    ctx.restore()
}

function drawCloudCluster(x,y,scale,color,opacity){
    const puffs=[
        [-.42,.04,.42,.18],
        [-.18,-.07,.50,.22],
        [.10,-.02,.48,.22],
        [.36,.05,.42,.17],
        [.03,.14,.66,.19],
    ]
    puffs.forEach(([dx,dy,rx,ry])=>{
        drawPuff(x+dx*scale,y+dy*scale,rx*scale,ry*scale,color,opacity)
    })
}

function drawFrame(time=0){
    if(!ctx)return
    ctx.clearRect(0,0,width,height)

    const v=props.visual||{}
    const speed=reducedMotion?0:(v.speed??.7)
    const drift=time*.000012*speed
    const base=Math.max(width,height)

    const starColor=cssColor("--color-canvas-star",[235,247,255])
    const cloudColor=cssColor("--color-canvas-cloud",[98,120,136])
    const ambientPrimary=cssColor("--color-ambient-primary",[31,106,152])
    const ambientSecondary=cssColor("--color-ambient-secondary",[126,215,255])

    ctx.save()
    ctx.globalCompositeOperation=props.theme==="dawn"||props.theme==="day"?"source-over":"screen"

    drawPuff(
        width*(.72+Math.sin(drift)*.018),
        height*.20,
        base*.30,
        base*.18,
        ambientPrimary,
        Math.max(.025,v.haloOpacity||.15),
    )

    if((v.cloudDensity||0)>.2){
        ctx.save()
        ctx.filter="blur("+Math.min(28,Math.max(0,v.cloudBlur||0))+"px)"

        drawCloudCluster(
            width*(.18+Math.cos(drift*.7)*.025),
            height*.68,
            base*.30,
            cloudColor,
            Math.max(.018,v.cloudOpacity||.18),
        )

        if((v.cloudDensity||0)>.55){
            drawCloudCluster(
                width*(.72+Math.sin(drift*.56)*.02),
                height*.43,
                base*.23,
                cloudColor,
                Math.max(.015,(v.cloudOpacity||.18)*.70),
            )
        }

        if((v.cloudDensity||0)>.84){
            drawCloudCluster(
                width*(.46+Math.sin(drift*.34)*.015),
                height*.20,
                base*.18,
                cloudColor,
                Math.max(.012,(v.cloudOpacity||.18)*.46),
            )
        }

        ctx.restore()
    }

    if((v.warmOpacity||0)>.01){
        drawPuff(
            width*.18,
            height*.22,
            base*.34,
            base*.15,
            ambientPrimary,
            v.warmOpacity,
        )
        drawPuff(
            width*.10,
            height*.58,
            base*.30,
            base*.14,
            ambientSecondary,
            v.warmOpacity*.62,
        )
    }

    ctx.restore()

    const desktopCount=Math.round(v.starCount??64)
    const starLimit=Math.max(
        0,
        Math.min(
            stars.length,
            width<700?Math.min(34,desktopCount):width<1100?Math.min(48,desktopCount):desktopCount,
        ),
    )

    ctx.save()
    for(let i=0;i<starLimit;i+=1){
        const star=stars[i]
        const targetOpacity=star.bright
            ? (v.starBrightOpacity??.90)
            : (v.starDimOpacity??.56)
        const twinkle=reducedMotion?1:.90+Math.sin(time*.00072+star.phase)*.10

        ctx.globalAlpha=Math.max(0,targetOpacity*twinkle)
        ctx.fillStyle="rgb("+starColor.join(",")+")"
        ctx.beginPath()
        ctx.arc(star.x*width,star.y*height,star.size,0,Math.PI*2)
        ctx.fill()
    }
    ctx.restore()
}

function animate(time){
    if(time-lastFrame>=33){
        drawFrame(time)
        lastFrame=time
    }
    frameId=window.requestAnimationFrame(animate)
}

function stop(){
    if(frameId)window.cancelAnimationFrame(frameId)
    frameId=null
}

function restart(){
    stop()
    drawFrame(performance.now())
    if(!reducedMotion&&!document.hidden){
        frameId=window.requestAnimationFrame(animate)
    }
}

watch(()=>[props.theme,props.visual],restart,{deep:true})

onMounted(()=>{
    reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.addEventListener("resize",resizeCanvas,{passive:true})
    visibilityHandler=()=>{if(document.hidden)stop();else restart()}
    document.addEventListener("visibilitychange",visibilityHandler)
    resizeCanvas()
    restart()
})

onBeforeUnmount(()=>{
    window.removeEventListener("resize",resizeCanvas)
    if(visibilityHandler)document.removeEventListener("visibilitychange",visibilityHandler)
    stop()
})
</script>

<style scoped lang="scss">
.atmosphere{
    position:fixed;
    inset:0;
    z-index:0;
    overflow:hidden;
    pointer-events:none;
    background:var(--color-bg-base);
}

.atmosphere__gradient{
    position:absolute;
    inset:-6%;
    background:
        radial-gradient(
            ellipse var(--sky-glow-primary-size) at var(--sky-glow-primary-position),
            var(--sky-glow-primary),
            transparent 100%
        ),
        radial-gradient(
            ellipse var(--sky-glow-secondary-size) at var(--sky-glow-secondary-position),
            var(--sky-glow-secondary),
            transparent 100%
        ),
        linear-gradient(
            180deg,
            var(--sky-start) 0%,
            var(--sky-mid) var(--sky-mid-stop),
            var(--sky-end) 100%
        );
    transition:background 900ms ease;
}

.atmosphere__canvas{
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
}

.atmosphere__grain{
    position:absolute;
    inset:0;
    opacity:.025;
    mix-blend-mode:soft-light;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter id='n'%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.24'/%3E%3C/svg%3E");
}

[data-theme="dawn"] .atmosphere__grain,
[data-theme="day"] .atmosphere__grain{opacity:.012}

@media(prefers-reduced-motion:reduce){
    .atmosphere__gradient{transition:none}
    .atmosphere__grain{opacity:.015}
}
</style>
