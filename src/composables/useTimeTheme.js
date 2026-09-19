import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { semanticThemeForMinute, themeStates, timeThemeKeyframes } from "@/config/timeThemes.js"

const THEME_MODE_KEY = "raym-theme-mode"
const validModes = ["auto", "dawn", "day", "sunset", "night"]

const clamp = (v) => Math.max(0, Math.min(1, v))
const smoothstep = (v) => { const t = clamp(v); return t * t * (3 - 2 * t) }
const mix = (a, b, t) => a + (b - a) * t
const mixArray = (a, b, t) => a.map((v, i) => mix(v, b[i], t))
const cssRgba = ([r, g, b, a = 1]) => "rgba(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + "," + a.toFixed(3) + ")"

function pairForMinute(minute) {
    for (let i = 0; i < timeThemeKeyframes.length - 1; i += 1) {
        const from = timeThemeKeyframes[i]
        const to = timeThemeKeyframes[i + 1]
        if (minute >= from.minute && minute <= to.minute) return { from, to }
    }
    return { from: timeThemeKeyframes[0], to: timeThemeKeyframes[1] }
}

function toStyleVars(tokens) {
    return {
        "--color-bg-base": cssRgba(tokens.bgBase),
        "--color-bg-panel": cssRgba(tokens.bgPanel),
        "--color-bg-panel-strong": cssRgba(tokens.bgPanelStrong),
        "--color-bg-raised": cssRgba(tokens.bgRaised),
        "--color-bg-control": cssRgba(tokens.bgControl),
        "--color-bg-selected": cssRgba(tokens.bgSelected),
        "--color-panel-highlight": cssRgba(tokens.panelHighlight),
        "--color-chip-bg": cssRgba(tokens.chipBg),

        "--color-heading-primary": cssRgba(tokens.headingPrimary),
        "--color-text-primary": cssRgba(tokens.textPrimary),
        "--color-text-secondary": cssRgba(tokens.textSecondary),
        "--color-text-on-accent": cssRgba(tokens.textOnAccent),

        "--color-accent-primary": cssRgba(tokens.accentPrimary),
        "--color-accent-secondary": cssRgba(tokens.accentSecondary),
        "--color-action-primary": cssRgba(tokens.actionPrimary),
        "--color-accent-contrast": cssRgba(tokens.accentContrast),

        "--color-border-default": cssRgba(tokens.borderDefault),
        "--color-border-strong": cssRgba(tokens.borderStrong),
        "--color-border-glow": cssRgba(tokens.borderGlow),

        "--color-ambient-primary": cssRgba(tokens.ambientPrimary),
        "--color-ambient-secondary": cssRgba(tokens.ambientSecondary),
        "--color-canvas-star": cssRgba(tokens.canvasStar),
        "--color-canvas-cloud": cssRgba(tokens.canvasCloud),

        "--sky-start": cssRgba(tokens.skyStart),
        "--sky-mid": cssRgba(tokens.skyMid),
        "--sky-end": cssRgba(tokens.skyEnd),
        "--sky-glow-primary": cssRgba(tokens.glowPrimary),
        "--sky-glow-secondary": cssRgba(tokens.glowSecondary),
    }
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
    Object.keys(fromState.tokens).forEach((key) => {
        tokens[key] = mixArray(fromState.tokens[key], toState.tokens[key], progress)
    })

    const atmosphere = {}
    Object.keys(fromState.atmosphere).forEach((key) => {
        atmosphere[key] = mix(fromState.atmosphere[key], toState.atmosphere[key], progress)
    })

    return {
        theme: semanticThemeForMinute(minute),
        progress: raw,
        atmosphere,
        styleVars: toStyleVars(tokens),
    }
}

function resolveStaticState(theme) {
    const state = themeStates[theme] || themeStates.night
    return {
        theme,
        progress: 1,
        atmosphere: { ...state.atmosphere },
        styleVars: toStyleVars(state.tokens),
    }
}

function loadSavedMode() {
    if (typeof window === "undefined") return "auto"
    const saved = window.localStorage.getItem(THEME_MODE_KEY)
    return validModes.includes(saved) ? saved : "auto"
}

const themeMode = ref(loadSavedMode())
const automaticState = ref(resolveTimeState())
let timerId = null
let consumers = 0

function updateAutomaticState() {
    automaticState.value = resolveTimeState()
}

function startClock() {
    if (timerId || typeof window === "undefined") return
    updateAutomaticState()
    timerId = window.setInterval(updateAutomaticState, 30_000)
}

function stopClock() {
    if (!timerId || consumers > 0) return
    window.clearInterval(timerId)
    timerId = null
}

export function setThemeMode(mode) {
    const nextMode = validModes.includes(mode) ? mode : "auto"
    themeMode.value = nextMode
    if (typeof window !== "undefined") {
        window.localStorage.setItem(THEME_MODE_KEY, nextMode)
    }
    if (nextMode === "auto") updateAutomaticState()
}

export function useTimeTheme() {
    const activeState = computed(() => {
        if (themeMode.value === "auto") return automaticState.value
        return resolveStaticState(themeMode.value)
    })

    onMounted(() => {
        consumers += 1
        startClock()
    })

    onBeforeUnmount(() => {
        consumers = Math.max(0, consumers - 1)
        stopClock()
    })

    return {
        theme: computed(() => activeState.value.theme),
        mode: computed(() => themeMode.value),
        isAuto: computed(() => themeMode.value === "auto"),
        phaseProgress: computed(() => activeState.value.progress),
        styleVars: computed(() => activeState.value.styleVars),
        atmosphere: computed(() => activeState.value.atmosphere),
        setThemeMode,
    }
}
