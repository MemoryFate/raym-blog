<template>
    <div ref="root" class="theme-settings">
        <button
            class="theme-trigger"
            type="button"
            :aria-expanded="open"
            aria-label="主题设置"
            title="主题设置"
            @click="open = !open"
        >
            <span>◐</span>
        </button>

        <div v-if="open" class="theme-panel">
            <div class="panel-head">
                <div>
                    <p class="eyebrow">主题设置</p>
                    <strong>切换页面氛围</strong>
                </div>
                <button type="button" class="close" aria-label="关闭主题设置" @click="open = false">×</button>
            </div>

            <p class="hint">默认跟随本地时间；也可以固定主题，或拖动时间 Slider 手动预览一天中的连续变化。</p>

            <section class="time-preview" :class="{ active: mode === 'manual' }">
                <div class="time-preview__head">
                    <div>
                        <span>手动时间预览</span>
                        <small>{{ mode === "manual" ? "已暂停自动跟随时间" : "拖动后进入手动预览" }}</small>
                    </div>
                    <strong class="mono">{{ manualTimeLabel }}</strong>
                </div>

                <input
                    class="time-slider"
                    type="range"
                    min="0"
                    max="1439"
                    step="1"
                    :value="sliderMinute"
                    aria-label="手动预览时间"
                    @input="onSliderInput"
                />

                <div class="time-scale mono">
                    <span>00:00</span>
                    <span>06:30</span>
                    <span>13:00</span>
                    <span>18:10</span>
                    <span>23:30</span>
                </div>

                <div class="time-preview__actions">
                    <span class="theme-chip">{{ currentThemeLabel }}</span>
                    <button v-if="mode === 'manual'" type="button" @click="restoreAuto">恢复自动</button>
                </div>
            </section>

            <div class="theme-options">
                <button
                    v-for="item in options"
                    :key="item.key"
                    type="button"
                    :class="{ active: mode === item.key }"
                    @click="selectTheme(item.key)"
                >
                    <span class="swatch" :class="'swatch--' + item.key"></span>
                    <span class="option-copy">
                        <strong>{{ item.label }}</strong>
                        <small>{{ item.description }}</small>
                    </span>
                    <span class="check">{{ mode === item.key ? "✓" : "" }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { useTimeTheme } from "@/composables/useTimeTheme.js"

const root = ref(null)
const open = ref(false)

const {
    theme,
    mode,
    manualMinute,
    setThemeMode,
    setManualThemeMinute,
} = useTimeTheme()

const localMinute = () => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
}

const sliderMinute = computed(() => (
    mode.value === "manual" ? manualMinute.value : localMinute()
))

const manualTimeLabel = computed(() => {
    const minute = Number(sliderMinute.value || 0)
    const hour = Math.floor(minute / 60).toString().padStart(2, "0")
    const min = (minute % 60).toString().padStart(2, "0")
    return hour + ":" + min
})

const currentThemeLabel = computed(() => ({
    dawn:"青岚 · 春",
    day:"碧霄 · 夏",
    sunset:"暮光 · 秋",
    night:"星夜 · 冬",
})[theme.value] || "自动")

const options = [
    { key:"auto", label:"自动", description:"跟随本地时间连续变化" },
    { key:"dawn", label:"青岚", description:"青绿云岚 · 渐染天蓝" },
    { key:"day", label:"碧霄", description:"盛夏绿意 · 清透天空蓝" },
    { key:"sunset", label:"暮光", description:"天际蓝渐变麦穗金" },
    { key:"night", label:"星夜", description:"黑色夜空 · 冷冰蓝" },
]

function selectTheme(nextMode) {
    setThemeMode(nextMode)
    open.value = false
}

function onSliderInput(event) {
    setManualThemeMinute(Number(event.target.value))
}

function restoreAuto() {
    setThemeMode("auto")
}

function onPointerDown(event) {
    if (open.value && root.value && !root.value.contains(event.target)) open.value = false
}

function onKeyDown(event) {
    if (event.key === "Escape") open.value = false
}

onMounted(() => {
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
})

onBeforeUnmount(() => {
    document.removeEventListener("pointerdown", onPointerDown)
    document.removeEventListener("keydown", onKeyDown)
})
</script>

<style scoped lang="scss">
.theme-settings { position:relative; z-index:120; }

.theme-trigger {
    display:grid; width:42px; height:42px; place-items:center; padding:0;
    border:1px solid var(--color-border-default); border-radius:12px;
    color:var(--color-text-primary); background:var(--color-bg-control);
    cursor:pointer; transition:border-color 180ms ease,box-shadow 180ms ease,transform 180ms ease;
}

.theme-trigger:hover {
    border-color:var(--color-border-strong);
    box-shadow:var(--shadow-selected);
    transform:translateY(-1px);
}

.theme-trigger span { font-size:18px; line-height:1; }

.theme-panel {
    position:absolute;
    top:calc(100% + 12px);
    right:0;
    width:min(370px,calc(100vw - 28px));
    padding:18px;
    border:1px solid var(--color-border-strong);
    border-radius:18px;
    background:var(--color-bg-raised);
    box-shadow:var(--shadow-glow);
    z-index:120;
    backdrop-filter:blur(24px) saturate(135%);
    -webkit-backdrop-filter:blur(24px) saturate(135%);
}

.panel-head {
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:18px;
}

.panel-head strong {
    display:block;
    margin-top:6px;
    font-size:17px;
}

.eyebrow {
    margin:0;
    color:var(--color-accent-primary);
    font-size:10px;
    letter-spacing:.12em;
}

.close {
    width:32px;
    height:32px;
    border:1px solid var(--color-border-default);
    border-radius:9px;
    color:var(--color-text-secondary);
    background:var(--color-bg-control);
    cursor:pointer;
}

.hint {
    margin:16px 0;
    color:var(--color-text-secondary);
    font-size:12px;
    line-height:1.6;
}

.time-preview {
    margin:0 0 14px;
    padding:14px;
    border:1px solid var(--color-border-default);
    border-radius:14px;
    background:var(--color-bg-panel);
    transition:border-color 180ms ease,box-shadow 180ms ease,background 180ms ease;
}

.time-preview.active {
    border-color:var(--color-border-strong);
    background:var(--color-bg-selected);
    box-shadow:var(--shadow-selected);
}

.time-preview__head {
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:18px;
}

.time-preview__head > div {
    display:grid;
    gap:4px;
}

.time-preview__head span {
    color:var(--color-text-primary);
    font-size:12px;
    font-weight:600;
}

.time-preview__head small {
    color:var(--color-text-secondary);
    font-size:10px;
    line-height:1.4;
}

.time-preview__head strong {
    color:var(--color-accent-primary);
    font-size:12px;
    font-weight:500;
}

.time-slider {
    --slider-progress:50%;
    width:100%;
    height:24px;
    margin:12px 0 2px;
    appearance:none;
    -webkit-appearance:none;
    background:transparent;
    cursor:pointer;
}

.time-slider::-webkit-slider-runnable-track {
    height:5px;
    border-radius:999px;
    background:linear-gradient(
        90deg,
        #07131d 0%,
        #acdcc4 27%,
        #c9e9dd 52%,
        #77aece 68%,
        #edc777 76%,
        #07131d 100%
    );
    box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--color-border-default) 72%,transparent);
}

.time-slider::-webkit-slider-thumb {
    width:18px;
    height:18px;
    margin-top:-6.5px;
    appearance:none;
    -webkit-appearance:none;
    border:2px solid var(--color-border-strong);
    border-radius:50%;
    background:var(--color-bg-raised);
    box-shadow:var(--shadow-selected);
}

.time-slider::-moz-range-track {
    height:5px;
    border-radius:999px;
    background:linear-gradient(
        90deg,
        #07131d 0%,
        #acdcc4 27%,
        #c9e9dd 52%,
        #77aece 68%,
        #edc777 76%,
        #07131d 100%
    );
}

.time-slider::-moz-range-thumb {
    width:18px;
    height:18px;
    border:2px solid var(--color-border-strong);
    border-radius:50%;
    background:var(--color-bg-raised);
    box-shadow:var(--shadow-selected);
}

.time-scale {
    display:flex;
    justify-content:space-between;
    gap:6px;
    color:var(--color-text-secondary);
    font-size:8px;
}

.time-preview__actions {
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    margin-top:12px;
}

.theme-chip {
    padding:5px 8px;
    border:1px solid var(--color-border-default);
    border-radius:999px;
    color:var(--color-text-secondary);
    background:var(--color-bg-control);
    font-size:9px;
}

.time-preview__actions button {
    padding:0;
    border:0;
    color:var(--color-accent-primary);
    background:transparent;
    font-size:10px;
    cursor:pointer;
}

.theme-options {
    display:grid;
    gap:8px;
}

.theme-options button {
    display:grid;
    grid-template-columns:38px 1fr 20px;
    gap:10px;
    align-items:center;
    width:100%;
    padding:10px;
    border:1px solid transparent;
    border-radius:12px;
    color:var(--color-text-primary);
    text-align:left;
    background:transparent;
    cursor:pointer;
}

.theme-options button:hover { background:var(--color-bg-control); }

.theme-options button.active {
    border-color:var(--color-border-strong);
    background:var(--color-bg-selected);
}

.swatch {
    width:32px;
    height:32px;
    border-radius:10px;
    border:1px solid rgba(255,255,255,.14);
}

.swatch--auto {
    background:linear-gradient(135deg,#07131d,#acdcc4 28%,#9bcee2 47%,#edc777 76%,#07131d);
}

.swatch--dawn {
    background:linear-gradient(135deg,#dbf3e1,#acdcc4 52%,#9bcee2);
}

.swatch--day {
    background:linear-gradient(135deg,#ddefe5,#c9e9dd 55%,#b9ddf2);
}

.swatch--sunset {
    background:linear-gradient(135deg,#77aece,#aec6c8 52%,#edc777);
}

.swatch--night {
    background:linear-gradient(135deg,#05090e,#07131d 58%,#0a1c29);
}

.option-copy {
    display:grid;
    gap:3px;
}

.option-copy strong { font-size:13px; }

.option-copy small {
    color:var(--color-text-secondary);
    font-size:10px;
    line-height:1.45;
}

.check {
    color:var(--color-accent-primary);
    font-size:13px;
    text-align:center;
}

@media (max-width:760px) {
    .theme-trigger { width:40px; height:40px; }

    .theme-panel {
        position:fixed;
        top:88px;
        right:14px;
    }

    .time-scale span:nth-child(2),
    .time-scale span:nth-child(4) {
        display:none;
    }
}

@media (prefers-reduced-motion:reduce) {
    .theme-trigger,
    .time-preview { transition:none; }
}
</style>
