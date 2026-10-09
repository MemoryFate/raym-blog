import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { semanticThemeForMinute, themeStates, timeThemeKeyframes } from "@/config/timeThemes.js"

const THEME_MODE_KEY = "raym-theme-mode"
const MANUAL_MINUTE_KEY = "raym-theme-manual-minute"
const validModes = ["auto", "manual", "dawn", "day", "sunset", "night"]

const clamp = (v) => Math.max(0, Math.min(1, v))
const smoothstep = (v) => { const t = clamp(v); return t * t * (3 - 2 * t) }
const mix = (a, b, t) => a + (b - a) * t
const mixArray = (a, b, t) => a.map((v, i) => mix(v, b[i], t))
const cssRgba = ([r, g, b, a = 1]) => "rgba(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + "," + a.toFixed(3) + ")"

// Only sky, light and canvas effects interpolate across opposite light/dark palettes.
// Card surfaces and semantic foreground colors must stay paired to avoid gray-on-gray.
const skyTokenNames = new Set([
    "skyStart", "skyMid", "skyEnd", "glowPrimary", "glowSecondary",
    "ambientPrimary", "ambientSecondary", "canvasStar", "canvasCloud",
])
const isLightTheme = (theme) => theme === "dawn" || theme === "day"

function luminance(color) {
    const channels = color.slice(0, 3).map((channel) => {
        const v = channel / 255
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(a, b) {
    const x = luminance(a)
    const y = luminance(b)
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

function readableColor(color, backgrounds, minimum, lighter) {
    if (backgrounds.every((bg) => contrastRatio(color, bg) >= minimum)) return color
    const limit = lighter ? [255, 255, 255, 1] : [0, 8, 9, 1]
    let low = 0
    let high = 1
    for (let i = 0; i < 16; i += 1) {
        const t = (low + high) / 2
        const result = mixArray(color, limit, t)
        if (backgrounds.every((bg) => contrastRatio(result, bg) >= minimum)) high = t
        else low = t
    }
    return mixArray(color, limit, high)
}

function maintainUiContrast(tokens, uiTheme) {
    const light = isLightTheme(uiTheme)
    const backgrounds = [
        tokens.bgPanel,
        tokens.bgRaised,
        tokens.bgControl,
        tokens.bgSelected,
    ]
    tokens.textPrimary = readableColor(tokens.textPrimary, backgrounds, 4.7, !light)
    tokens.headingPrimary = readableColor(tokens.headingPrimary, backgrounds, 4.7, !light)
    tokens.textSecondary = readableColor(tokens.textSecondary, backgrounds, 4.7, !light)
    tokens.accentPrimary = readableColor(tokens.accentPrimary, backgrounds, 4.7, !light)
    tokens.actionPrimary = readableColor(tokens.actionPrimary, [tokens.accentContrast], 4.7, !light)
    return tokens
}

function skyReadableVars(tokens) {
    const stops = [tokens.skyStart, tokens.skyMid, tokens.skyEnd]
    const darkInk = [0, 9, 8]
    const lightInk = [255, 255, 255]
    const worstContrast = (color) => Math.min(...stops.map((bg) => contrastRatio(color, bg)))
    const primary = worstContrast(lightInk) >= worstContrast(darkInk) ? lightInk : darkInk
    // Sky-facing copy deliberately uses a high contrast neutral through twilight.
    // Accent hues on cards remain controlled by the independent UI palette.
    return {
        "--color-on-sky-primary": cssRgba(primary),
        "--color-on-sky-secondary": cssRgba(primary),
        "--color-on-sky-accent": cssRgba(primary),
    }
}

function normalizeMinute(value) {
    const minute = Number(value)
    if (!Number.isFinite(minute)) return 0
    return Math.max(0, Math.min(1439, Math.round(minute)))
}

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
        ...skyReadableVars(tokens),
    }
}

export function resolveTimeTheme(date = new Date()) {
    return semanticThemeForMinute(date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60)
}

export function resolveTimeStateByMinute(value) {
    const minute = normalizeMinute(value)
    const pair = pairForMinute(minute)
    const fromState = themeStates[pair.from.state]
    const toState = themeStates[pair.to.state]
    const raw = (minute - pair.from.minute) / Math.max(1, pair.to.minute - pair.from.minute)
    const progress = smoothstep(raw)

    const changesContrastMode = isLightTheme(pair.from.state) !== isLightTheme(pair.to.state)
    const uiTheme = changesContrastMode
        ? (progress < 0.5 ? pair.from.state : pair.to.state)
        : semanticThemeForMinute(minute)

    const tokens = {}
    Object.keys(fromState.tokens).forEach((key) => {
        if (changesContrastMode && !skyTokenNames.has(key)) {
            // Snap the entire semantic UI palette as one coherent unit.
            // Text and surfaces must never fade independently through mid-gray.
            tokens[key] = [...themeStates[uiTheme].tokens[key]]
        } else {
            tokens[key] = mixArray(fromState.tokens[key], toState.tokens[key], progress)
        }
    })
    maintainUiContrast(tokens, uiTheme)

    const atmosphere = {}
    Object.keys(fromState.atmosphere).forEach((key) => {
        atmosphere[key] = mix(fromState.atmosphere[key], toState.atmosphere[key], progress)
    })

    return {
        theme: semanticThemeForMinute(minute),
        uiTheme,
        minute,
        progress: raw,
        atmosphere,
        styleVars: toStyleVars(tokens),
    }
}

export function resolveTimeState(date = new Date()) {
    const minute = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60
    return resolveTimeStateByMinute(minute)
}

function resolveStaticState(theme) {
    const state = themeStates[theme] || themeStates.night
    const tokens = Object.fromEntries(
        Object.entries(state.tokens).map(([key, value]) => [key, [...value]])
    )
    maintainUiContrast(tokens, theme)
    return {
        theme,
        uiTheme: theme,
        minute: null,
        progress: 1,
        atmosphere: { ...state.atmosphere },
        styleVars: toStyleVars(tokens),
    }
}

function localMinuteNow() {
    const date = new Date()
    return date.getHours() * 60 + date.getMinutes()
}

function loadSavedMode() {
    if (typeof window === "undefined") return "auto"
    const saved = window.localStorage.getItem(THEME_MODE_KEY)
    return validModes.includes(saved) ? saved : "auto"
}

function loadSavedManualMinute() {
    if (typeof window === "undefined") return localMinuteNow()
    const saved = window.localStorage.getItem(MANUAL_MINUTE_KEY)
    return saved === null ? localMinuteNow() : normalizeMinute(saved)
}

const themeMode = ref(loadSavedMode())
const manualMinute = ref(loadSavedManualMinute())
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

export function setManualThemeMinute(value) {
    const nextMinute = normalizeMinute(value)
    manualMinute.value = nextMinute
    themeMode.value = "manual"

    if (typeof window !== "undefined") {
        window.localStorage.setItem(MANUAL_MINUTE_KEY, String(nextMinute))
        window.localStorage.setItem(THEME_MODE_KEY, "manual")
    }
}

export function useTimeTheme() {
    const activeState = computed(() => {
        if (themeMode.value === "auto") return automaticState.value
        if (themeMode.value === "manual") return resolveTimeStateByMinute(manualMinute.value)
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
        uiTheme: computed(() => activeState.value.uiTheme),
        mode: computed(() => themeMode.value),
        isAuto: computed(() => themeMode.value === "auto"),
        isManual: computed(() => themeMode.value === "manual"),
        manualMinute: computed(() => manualMinute.value),
        phaseProgress: computed(() => activeState.value.progress),
        styleVars: computed(() => activeState.value.styleVars),
        atmosphere: computed(() => activeState.value.atmosphere),
        setThemeMode,
        setManualThemeMinute,
    }
}
