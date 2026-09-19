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

            <p class="hint">默认跟随本地时间，也可以手动固定主题。选择会保存在当前浏览器中。</p>

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
import { onBeforeUnmount, onMounted, ref } from "vue"
import { useTimeTheme } from "@/composables/useTimeTheme.js"

const root = ref(null)
const open = ref(false)
const { mode, setThemeMode } = useTimeTheme()

const options = [
    { key: "auto", label: "自动", description: "跟随本地时间连续变化" },
    { key: "dawn", label: "清晨", description: "白中透绿 · 春日清晨" },
    { key: "day", label: "白天", description: "绿色为主 · 混入天空蓝" },
    { key: "sunset", label: "日落", description: "金黄为主 · 暖棕承接" },
    { key: "night", label: "夜晚", description: "黑色夜空 · 冷冰蓝" },
]

function selectTheme(nextMode) {
    setThemeMode(nextMode)
    open.value = false
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
.theme-settings { position: relative; z-index: 120; }
.theme-trigger {
    display: grid; width: 42px; height: 42px; place-items: center; padding: 0;
    border: 1px solid var(--color-border-default); border-radius: 12px;
    color: var(--color-text-primary); background: var(--color-bg-control);
    cursor: pointer; transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}
.theme-trigger:hover { border-color: var(--color-border-strong); box-shadow: var(--shadow-selected); transform: translateY(-1px); }
.theme-trigger span { font-size: 18px; line-height: 1; }

.theme-panel {
    position: absolute; top: calc(100% + 12px); right: 0; width: min(340px, calc(100vw - 28px));
    padding: 18px; border: 1px solid var(--color-border-strong); border-radius: 18px;
    background: var(--color-bg-raised); box-shadow: var(--shadow-glow);
    z-index: 120; backdrop-filter: blur(24px) saturate(135%); -webkit-backdrop-filter: blur(24px) saturate(135%);
}
.panel-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; }
.panel-head strong { display: block; margin-top: 6px; font-size: 17px; }
.eyebrow { margin: 0; color: var(--color-accent-primary); font-size: 10px; letter-spacing: .12em; }
.close {
    width: 32px; height: 32px; border: 0; border-radius: 9px; color: var(--color-text-secondary);
    background: var(--color-chip-bg); cursor: pointer;
}
.hint { margin: 16px 0; color: var(--color-text-secondary); font-size: 12px; line-height: 1.6; }
.theme-options { display: grid; gap: 8px; }
.theme-options button {
    display: grid; grid-template-columns: 38px 1fr 20px; gap: 10px; align-items: center;
    width: 100%; padding: 10px; border: 1px solid transparent; border-radius: 12px;
    color: var(--color-text-primary); text-align: left; background: transparent; cursor: pointer;
}
.theme-options button:hover { background: var(--color-bg-control); }
.theme-options button.active { border-color: var(--color-border-strong); background: var(--color-bg-selected); }
.swatch { width: 32px; height: 32px; border-radius: 10px; border: 1px solid rgba(255,255,255,.14); }
.swatch--auto { background: linear-gradient(135deg, #f2f6f1, #258f69 36%, #d9a24a 68%, #05090e); }
.swatch--dawn { background: linear-gradient(135deg, #f3f7f2, #e7f1ea 55%, #ddeae4); }
.swatch--day { background: linear-gradient(135deg, #ddefe5, #c9e9dd 55%, #b9ddf2); }
.swatch--sunset { background: linear-gradient(135deg, #4f3927, #8c6436 52%, #a9793e); }
.swatch--night { background: linear-gradient(135deg, #05090e, #07131d 58%, #0a1c29); }
.option-copy { display: grid; gap: 3px; }
.option-copy strong { font-size: 13px; }
.option-copy small { color: var(--color-text-secondary); font-size: 10px; line-height: 1.45; }
.check { color: var(--color-accent-primary); font-size: 13px; text-align: center; }

@media (max-width: 760px) {
    .theme-trigger { width: 40px; height: 40px; }
    .theme-panel { position: fixed; top: 88px; right: 14px; }
}
@media (prefers-reduced-motion: reduce) { .theme-trigger { transition: none; } }
</style>
