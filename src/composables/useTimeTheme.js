import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { semanticThemeForMinute, themeStates, timeThemeKeyframes } from "@/config/timeThemes.js"

const clamp = (v) => Math.max(0, Math.min(1, v))
const smoothstep = (v) => { const t = clamp(v); return t * t * (3 - 2 * t) }
const mix = (a, b, t) => a + (b - a) * t
const mixArray = (a, b, t) => a.map((v, i) => mix(v, b[i], t))
const cssRgba = ([r,g,b,a=1]) => "rgba(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + "," + a.toFixed(3) + ")"

function pairForMinute(minute) {
    for (let i = 0; i < timeThemeKeyframes.length - 1; i += 1) {
        const from = timeThemeKeyframes[i]
        const to = timeThemeKeyframes[i + 1]
        if (minute >= from.minute && minute <= to.minute) return { from, to }
    }
    return { from:timeThemeKeyframes[0], to:timeThemeKeyframes[1] }
}

export function resolveTimeTheme(date = new Date()) {
    return semanticThemeForMinute(date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60)
}

export function resolveTimeState(date = new Date()) {
    const minute = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60
    const pair = pairForMinute(minute)
    const fromState = themeStates[pair.from.state]
    const toState = themeStates[pair.to.state]
    const raw = (minute - pair.from.minute) / Math.max(1, pair.to.minute - pair.from.minute)
    const progress = smoothstep(raw)

    const tokens = {}
    Object.keys(fromState.tokens).forEach((key) => { tokens[key] = mixArray(fromState.tokens[key], toState.tokens[key], progress) })
    const atmosphere = {}
    Object.keys(fromState.atmosphere).forEach((key) => { atmosphere[key] = mix(fromState.atmosphere[key], toState.atmosphere[key], progress) })

    return {
        theme: semanticThemeForMinute(minute),
        progress: raw,
        atmosphere,
        styleVars: {
            "--color-bg-base":cssRgba(tokens.bgBase), "--color-bg-panel":cssRgba(tokens.bgPanel),
            "--color-bg-panel-strong":cssRgba(tokens.bgPanelStrong), "--color-panel-highlight":cssRgba(tokens.panelHighlight),
            "--color-chip-bg":cssRgba(tokens.chipBg), "--color-border-glow":cssRgba(tokens.borderGlow),
            "--color-accent-primary":cssRgba(tokens.accentPrimary), "--color-accent-secondary":cssRgba(tokens.accentSecondary),
            "--color-accent-contrast":cssRgba(tokens.accentContrast), "--color-text-primary":cssRgba(tokens.textPrimary),
            "--color-text-secondary":cssRgba(tokens.textSecondary), "--sky-start":cssRgba(tokens.skyStart),
            "--sky-mid":cssRgba(tokens.skyMid), "--sky-end":cssRgba(tokens.skyEnd),
            "--sky-glow-primary":cssRgba(tokens.glowPrimary), "--sky-glow-secondary":cssRgba(tokens.glowSecondary),
        },
    }
}

export function useTimeTheme() {
    const state = ref(resolveTimeState())
    let timerId
    const update = () => { state.value = resolveTimeState() }

    onMounted(() => {
        update()
        timerId = window.setInterval(update, 30_000)
    })
    onBeforeUnmount(() => { if (timerId) window.clearInterval(timerId) })

    return {
        theme: computed(() => state.value.theme),
        phaseProgress: computed(() => state.value.progress),
        styleVars: computed(() => state.value.styleVars),
        atmosphere: computed(() => state.value.atmosphere),
    }
}
