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
            starCount:72,
            starDrift:.42,
            twinkleAmount:.28,
            cloudOpacity:.18,
            cloudDensity:.58,
            cloudBlur:22,
            cloudTravelSeconds:190,
            cloudParallax:1,
            particleCount:42,
            particleOpacity:.20,
            particleSpeed:.55,
            meteorOpacity:.52,
            haloOpacity:.15,
            warmOpacity:0,
            speed:.7,
        }),
    },
})

const canvas=ref(null)

let ctx
let frameId
let visibilityHandler
let mediaQuery
let width=0
let height=0
let dpr=1
let lastFrame=0
let reducedMotion=false
let pointerEnabled=false
let pointerTargetX=0
let pointerTargetY=0
let pointerX=0
let pointerY=0

const fract=(value)=>value-Math.floor(value)
const seeded=(index,salt=0)=>fract(Math.sin(index*91.73+salt*17.19)*43758.5453123)

const stars=Array.from({length:96},(_,index)=>({
    x:seeded(index,1),
    y:seeded(index,2),
    size:.55+seeded(index,3)*1.55,
    depth:.35+seeded(index,4)*.65,
    phase:seeded(index,5)*Math.PI*2,
    frequency:.00034+seeded(index,6)*.00072,
    bright:index%9===0||index%17===0,
}))

const particles=Array.from({length:64},(_,index)=>({
    x:seeded(index,11),
    y:seeded(index,12),
    size:.65+seeded(index,13)*2.15,
    depth:.35+seeded(index,14)*.65,
    phase:seeded(index,15)*Math.PI*2,
    driftX:(seeded(index,16)-.5)*.18,
    driftY:.035+seeded(index,17)*.095,
    bokeh:index%8===0,
}))

const cloudSeeds=[
    {start:.04,y:.20,scale:.22,speed:.72,opacity:.56,direction:1,depth:.45},
    {start:.36,y:.43,scale:.28,speed:.92,opacity:.76,direction:-1,depth:.68},
    {start:.67,y:.68,scale:.34,speed:1.08,opacity:1,direction:1,depth:1},
    {start:.88,y:.31,scale:.19,speed:.58,opacity:.48,direction:-1,depth:.38},
]

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

    const mobile=window.innerWidth<760
    dpr=Math.min(window.devicePixelRatio||1,mobile?1.5:2)
    width=window.innerWidth
    height=window.innerHeight

    canvas.value.width=Math.round(width*dpr)
    canvas.value.height=Math.round(height*dpr)
    canvas.value.style.width=String(width)+"px"
    canvas.value.style.height=String(height)+"px"

    ctx=canvas.value.getContext("2d",{alpha:true})
    ctx.setTransform(dpr,0,0,dpr,0,0)
    drawFrame(performance.now())
}

function drawPuff(x,y,rx,ry,color,opacity){
    if(opacity<=0)return

    ctx.save()
    ctx.translate(x,y)
    ctx.scale(1,ry/rx)

    const gradient=ctx.createRadialGradient(0,0,0,0,0,rx)
    gradient.addColorStop(0,rgba(color,opacity))
    gradient.addColorStop(.42,rgba(color,opacity*.60))
    gradient.addColorStop(.72,rgba(color,opacity*.22))
    gradient.addColorStop(1,rgba(color,0))

    ctx.fillStyle=gradient
    ctx.beginPath()
    ctx.arc(0,0,rx,0,Math.PI*2)
    ctx.fill()
    ctx.restore()
}

function drawCloudCluster(x,y,scale,color,opacity,phase){
    const breathe=1+Math.sin(phase)*.035
    const puffs=[
        [-.48,.05,.42,.17],
        [-.27,-.06,.48,.22],
        [-.04,-.10,.56,.24],
        [.20,-.04,.48,.21],
        [.43,.05,.38,.16],
        [.04,.12,.70,.18],
    ]

    puffs.forEach(([dx,dy,rx,ry],index)=>{
        const pulse=1+Math.sin(phase+index*.82)*.025
        drawPuff(
            x+dx*scale,
            y+dy*scale,
            rx*scale*breathe*pulse,
            ry*scale*breathe,
            color,
            opacity*(index===5?.72:1),
        )
    })
}

function wrap(value,min,max){
    const span=max-min
    return ((value-min)%span+span)%span+min
}

function drawClouds(time,v,cloudColor){
    const density=v.cloudDensity||0
    if(density<=.08)return

    const base=Math.max(width,height)
    const travelSeconds=Math.max(90,v.cloudTravelSeconds||190)
    const overallSpeed=Math.max(.1,v.speed??.7)
    const parallaxAmount=v.cloudParallax??1
    const margin=base*.30

    ctx.save()
    ctx.globalCompositeOperation=props.theme==="dawn"||props.theme==="day"?"source-over":"screen"
    ctx.filter="blur("+Math.min(34,Math.max(0,v.cloudBlur||0))+"px)"

    const visibleClouds=Math.max(1,Math.min(cloudSeeds.length,Math.ceil(density*cloudSeeds.length)))

    for(let i=0;i<visibleClouds;i+=1){
        const cloud=cloudSeeds[i]
        const travel=(time/1000)/(travelSeconds/cloud.speed)*overallSpeed
        const phase=cloud.start+travel*cloud.direction
        const normalized=fract(phase)
        const x=wrap(
            normalized*(width+margin*2)-margin,
            -margin,
            width+margin,
        )

        const bob=Math.sin(time*.00010*cloud.speed+i*1.7)*height*.012
        const px=pointerX*18*cloud.depth*parallaxAmount
        const py=pointerY*10*cloud.depth*parallaxAmount
        const scale=base*cloud.scale
        const opacity=(v.cloudOpacity||0)*cloud.opacity

        drawCloudCluster(
            x+px,
            height*cloud.y+bob+py,
            scale,
            cloudColor,
            opacity,
            time*.00016*cloud.speed+i,
        )
    }

    ctx.restore()
}

function drawStars(time,v,starColor){
    const desktopCount=Math.round(v.starCount??72)
    const count=Math.max(
        0,
        Math.min(
            stars.length,
            width<700?Math.min(34,desktopCount):width<1100?Math.min(52,desktopCount):desktopCount,
        ),
    )

    const drift=(v.starDrift??.3)*(v.speed??.7)
    const twinkleAmount=Math.max(0,Math.min(.55,v.twinkleAmount??.22))

    ctx.save()
    ctx.globalCompositeOperation="screen"

    for(let i=0;i<count;i+=1){
        const star=stars[i]
        const xNorm=fract(star.x+time*.00000022*drift*star.depth)
        const yNorm=fract(star.y+Math.sin(time*.000035+star.phase)*.0018*star.depth)
        const x=xNorm*width+pointerX*5*star.depth
        const y=yNorm*height+pointerY*3*star.depth

        const baseOpacity=star.bright
            ? (v.starBrightOpacity??.9)
            : (v.starDimOpacity??.56)
        const wave=.5+.5*Math.sin(time*star.frequency+star.phase)
        const opacity=baseOpacity*((1-twinkleAmount)+wave*twinkleAmount)
        if(opacity<=.004)continue

        if(star.bright){
            const glowRadius=star.size*(2.6+star.depth*1.8)
            const glow=ctx.createRadialGradient(x,y,0,x,y,glowRadius)
            glow.addColorStop(0,rgba(starColor,opacity*.34))
            glow.addColorStop(1,rgba(starColor,0))
            ctx.globalAlpha=1
            ctx.fillStyle=glow
            ctx.beginPath()
            ctx.arc(x,y,glowRadius,0,Math.PI*2)
            ctx.fill()
        }

        ctx.globalAlpha=opacity
        ctx.fillStyle="rgb("+starColor.join(",")+")"
        ctx.beginPath()
        ctx.arc(x,y,star.size*(.72+star.depth*.42),0,Math.PI*2)
        ctx.fill()

        if(star.bright&&opacity>.2){
            const flare=star.size*(2.2+wave*1.2)
            ctx.globalAlpha=opacity*.22
            ctx.strokeStyle="rgb("+starColor.join(",")+")"
            ctx.lineWidth=.55
            ctx.beginPath()
            ctx.moveTo(x-flare,y)
            ctx.lineTo(x+flare,y)
            ctx.moveTo(x,y-flare)
            ctx.lineTo(x,y+flare)
            ctx.stroke()
        }
    }

    ctx.restore()
}

function drawParticles(time,v,primaryColor,secondaryColor){
    const requested=Math.round(v.particleCount??32)
    const count=Math.max(
        0,
        Math.min(
            particles.length,
            width<700?Math.min(16,requested):width<1100?Math.min(28,requested):requested,
        ),
    )
    const opacity=v.particleOpacity??.12
    const speed=(v.particleSpeed??.4)*(v.speed??.7)

    if(opacity<=.005||count===0)return

    ctx.save()
    ctx.globalCompositeOperation=props.theme==="dawn"||props.theme==="day"?"source-over":"screen"

    for(let i=0;i<count;i+=1){
        const particle=particles[i]
        const age=time*.000012*speed
        const xNorm=fract(particle.x+age*particle.driftX)
        const yNorm=fract(particle.y-age*particle.driftY)
        const sway=Math.sin(time*.00045+particle.phase)*8*particle.depth
        const x=xNorm*width+sway+pointerX*8*particle.depth
        const y=yNorm*height+pointerY*5*particle.depth

        const pulse=.58+.42*Math.sin(time*.00056+particle.phase)
        const alpha=opacity*(.48+.52*pulse)*(.55+particle.depth*.45)
        const color=i%3===0?secondaryColor:primaryColor

        if(particle.bokeh){
            const radius=particle.size*(2.2+particle.depth)
            const glow=ctx.createRadialGradient(x,y,0,x,y,radius*2.4)
            glow.addColorStop(0,rgba(color,alpha*.28))
            glow.addColorStop(1,rgba(color,0))
            ctx.globalAlpha=1
            ctx.fillStyle=glow
            ctx.beginPath()
            ctx.arc(x,y,radius*2.4,0,Math.PI*2)
            ctx.fill()
        }

        ctx.globalAlpha=alpha
        ctx.fillStyle="rgb("+color.join(",")+")"
        ctx.beginPath()
        ctx.arc(x,y,particle.size*(.45+particle.depth*.45),0,Math.PI*2)
        ctx.fill()
    }

    ctx.restore()
}

function drawMeteor(time,v,starColor){
    const opacity=v.meteorOpacity??0
    if(reducedMotion||opacity<=.01||width<700)return

    const cycle=17000
    const duration=1050
    const local=time%cycle
    if(local>duration)return

    const t=local/duration
    const ease=1-Math.pow(1-t,3)
    const fade=Math.sin(Math.PI*t)
    const startX=width*.72
    const startY=height*.14
    const distance=Math.min(width*.34,520)
    const x=startX-distance*ease
    const y=startY+distance*.34*ease
    const tail=72+70*(1-t)

    ctx.save()
    ctx.globalCompositeOperation="screen"
    ctx.globalAlpha=opacity*fade

    const gradient=ctx.createLinearGradient(x,y,x+tail,y-tail*.34)
    gradient.addColorStop(0,rgba(starColor,.92))
    gradient.addColorStop(.22,rgba(starColor,.44))
    gradient.addColorStop(1,rgba(starColor,0))

    ctx.strokeStyle=gradient
    ctx.lineWidth=1.35
    ctx.beginPath()
    ctx.moveTo(x,y)
    ctx.lineTo(x+tail,y-tail*.34)
    ctx.stroke()

    ctx.fillStyle="rgb("+starColor.join(",")+")"
    ctx.beginPath()
    ctx.arc(x,y,1.5,0,Math.PI*2)
    ctx.fill()
    ctx.restore()
}

function drawAmbient(time,v,primaryColor,secondaryColor){
    const base=Math.max(width,height)

    ctx.save()
    ctx.globalCompositeOperation=props.theme==="dawn"||props.theme==="day"?"source-over":"screen"

    drawPuff(
        width*(.72+Math.sin(time*.000018)*.018)+pointerX*9,
        height*.20+pointerY*5,
        base*.30,
        base*.18,
        primaryColor,
        Math.max(.025,v.haloOpacity||.15),
    )

    if((v.warmOpacity||0)>.01){
        drawPuff(
            width*.18+pointerX*6,
            height*.22,
            base*.34,
            base*.15,
            primaryColor,
            v.warmOpacity,
        )
        drawPuff(
            width*.10-pointerX*4,
            height*.58,
            base*.30,
            base*.14,
            secondaryColor,
            v.warmOpacity*.62,
        )
    }

    ctx.restore()
}

function drawFrame(time=0){
    if(!ctx)return

    pointerX+=((pointerTargetX||0)-pointerX)*.045
    pointerY+=((pointerTargetY||0)-pointerY)*.045

    ctx.clearRect(0,0,width,height)

    const v=props.visual||{}
    const starColor=cssColor("--color-canvas-star",[235,247,255])
    const cloudColor=cssColor("--color-canvas-cloud",[98,120,136])
    const primaryColor=cssColor("--color-ambient-primary",[31,106,152])
    const secondaryColor=cssColor("--color-ambient-secondary",[126,215,255])

    drawAmbient(time,v,primaryColor,secondaryColor)
    drawClouds(time,v,cloudColor)
    drawParticles(time,v,primaryColor,secondaryColor)
    drawStars(time,v,starColor)
    drawMeteor(time,v,starColor)
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

function handlePointerMove(event){
    if(!pointerEnabled||reducedMotion)return
    pointerTargetX=(event.clientX/Math.max(1,width)-.5)*2
    pointerTargetY=(event.clientY/Math.max(1,height)-.5)*2
}

function handlePointerLeave(){
    pointerTargetX=0
    pointerTargetY=0
}

function handleMotionPreference(event){
    reducedMotion=event.matches
    pointerTargetX=0
    pointerTargetY=0
    pointerX=0
    pointerY=0
    restart()
}

watch(()=>[props.theme,props.visual],restart,{deep:true})

onMounted(()=>{
    mediaQuery=window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotion=mediaQuery.matches
    pointerEnabled=window.matchMedia("(pointer:fine)").matches&&window.innerWidth>=760

    window.addEventListener("resize",resizeCanvas,{passive:true})
    window.addEventListener("pointermove",handlePointerMove,{passive:true})
    window.addEventListener("pointerleave",handlePointerLeave,{passive:true})

    if(mediaQuery.addEventListener){
        mediaQuery.addEventListener("change",handleMotionPreference)
    }else{
        mediaQuery.addListener(handleMotionPreference)
    }

    visibilityHandler=()=>{
        if(document.hidden)stop()
        else restart()
    }

    document.addEventListener("visibilitychange",visibilityHandler)
    resizeCanvas()
    restart()
})

onBeforeUnmount(()=>{
    window.removeEventListener("resize",resizeCanvas)
    window.removeEventListener("pointermove",handlePointerMove)
    window.removeEventListener("pointerleave",handlePointerLeave)

    if(mediaQuery?.removeEventListener){
        mediaQuery.removeEventListener("change",handleMotionPreference)
    }else if(mediaQuery?.removeListener){
        mediaQuery.removeListener(handleMotionPreference)
    }

    if(visibilityHandler){
        document.removeEventListener("visibilitychange",visibilityHandler)
    }

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
    inset:-7%;
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
    transform:scale(1.02);
    transform-origin:center;
    transition:background 900ms ease;
    animation:sky-breathe 18s ease-in-out infinite alternate;
}

.atmosphere__canvas{
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    will-change:contents;
}

.atmosphere__grain{
    position:absolute;
    inset:0;
    opacity:.025;
    mix-blend-mode:soft-light;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.24'/%3E%3C/svg%3E");
}

[data-theme="dawn"] .atmosphere__grain,
[data-theme="day"] .atmosphere__grain{
    opacity:.012;
}

@keyframes sky-breathe{
    from{transform:scale(1.02) translate3d(-.35%,0,0)}
    to{transform:scale(1.045) translate3d(.35%,-.25%,0)}
}

@media(max-width:760px){
    .atmosphere__gradient{
        animation-duration:24s;
    }

    .atmosphere__grain{
        opacity:.018;
    }
}

@media(prefers-reduced-motion:reduce){
    .atmosphere__gradient{
        transition:none;
        animation:none;
        transform:scale(1.02);
    }

    .atmosphere__grain{
        opacity:.015;
    }
}
</style>
