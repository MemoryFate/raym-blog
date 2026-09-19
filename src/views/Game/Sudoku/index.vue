<template>
    <div class="lab-detail">
        <RouterLink class="back mono" to="/Lab">← 返回实验室</RouterLink>

        <header class="lab-head">
            <div>
                <p class="eyebrow">实验室 / 数独</p>
                <h1>数独</h1>
                <p>一个用于练习状态管理、约束校验和轻量交互的经典逻辑实验。</p>
            </div>
            <span class="mono status">● {{ statusText }}</span>
        </header>

        <div class="lab-layout">
            <NeonGlass class="game-surface" glow>
                <div class="surface-head">
                    <div><p class="eyebrow">棋盘</p><h2>{{ difficultyLabel }}难度</h2></div>
                    <div class="mono metrics"><span>{{ filledCount }} / 81</span><span>{{ elapsedText }}</span></div>
                </div>

                <SudokuBoard
                    :puzzle="puzzle"
                    :original="original"
                    :selected="selected"
                    :conflicts="conflicts"
                    @select="selected = $event"
                />

                <div class="number-pad">
                    <button v-for="n in 9" :key="n" type="button" @click="setNumber(n)">{{ n }}</button>
                </div>

                <div class="game-actions">
                    <button type="button" class="primary" @click="checkPuzzle">检查答案</button>
                    <button type="button" @click="hint">提示</button>
                    <button type="button" @click="clearCell">清空当前格</button>
                </div>
            </NeonGlass>

            <aside class="side-stack">
                <NeonGlass class="side-card">
                    <p class="eyebrow">游戏设置</p>
                    <label>
                        <span>难度</span>
                        <select v-model="data.model">
                            <option value="easy">简单</option>
                            <option value="medium">中等</option>
                            <option value="hard">困难</option>
                            <option value="expert">专家</option>
                        </select>
                    </label>
                    <button type="button" class="primary wide" @click="newGame(data.model)">新游戏</button>
                    <button type="button" class="wide" @click="restartGame">重新开始</button>
                </NeonGlass>

                <NeonGlass class="side-card">
                    <p class="eyebrow">操作说明</p>
                    <h3>先选中空格，再输入数字</h3>
                    <p>相同行、相同列与相同数字会通过填充和边框辅助定位。检查时，错误格子会明确标记。</p>
                </NeonGlass>

                <NeonGlass class="side-card">
                    <p class="eyebrow">导出</p>
                    <h3>把当前棋盘复制成图片</h3>
                    <p>适合保存题目或分享当前进度。</p>
                    <button type="button" class="wide" @click="copyToClipBoard">复制棋盘图片</button>
                    <button type="button" class="wide" @click="downloadBoardImage">下载棋盘 PNG</button>
                </NeonGlass>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue"
import { message } from "ant-design-vue"
import { generateSudoku } from "./js/sudokuGenerator"
import SudokuBoard from "./components/SudokuBoard.vue"
import NeonGlass from "@/components/ui/NeonGlass.vue"

const data = reactive({ model:"medium" })
const puzzle = ref([])
const original = ref([])
const solution = ref([])
const selected = ref(null)
const conflicts = ref([])
const elapsed = ref(0)
const finished = ref(false)
let timerId = null

const difficultyLabel = computed(() => ({
    easy:"简单",
    medium:"中等",
    hard:"困难",
    expert:"专家",
})[data.model] || "中等")

const filledCount = computed(() => puzzle.value.flat().filter(Boolean).length)
const elapsedText = computed(() => {
    const minutes = Math.floor(elapsed.value / 60).toString().padStart(2,"0")
    const seconds = (elapsed.value % 60).toString().padStart(2,"0")
    return minutes + ":" + seconds
})
const statusText = computed(() => finished.value ? "已完成" : conflicts.value.length ? "存在错误" : "解题中")

function clone(board) {
    return board.map(row => [...row])
}

function startTimer() {
    if (timerId) clearInterval(timerId)
    timerId = setInterval(() => {
        if (!finished.value) elapsed.value += 1
    }, 1000)
}

function newGame(level) {
    const generated = generateSudoku(level, true)
    puzzle.value = clone(generated.puzzle)
    original.value = clone(generated.puzzle)
    solution.value = clone(generated.solution)
    selected.value = null
    conflicts.value = []
    elapsed.value = 0
    finished.value = false
    startTimer()
}

function restartGame() {
    puzzle.value = clone(original.value)
    selected.value = null
    conflicts.value = []
    elapsed.value = 0
    finished.value = false
}

function canEditSelected() {
    if (!selected.value) {
        message.info("请先选择一个空格")
        return false
    }
    const { row, col } = selected.value
    return original.value[row][col] === 0
}

function setNumber(value) {
    if (!canEditSelected()) return
    const { row, col } = selected.value
    puzzle.value[row][col] = value
    conflicts.value = conflicts.value.filter(item => item.row !== row || item.col !== col)
}

function clearCell() {
    if (!canEditSelected()) return
    const { row, col } = selected.value
    puzzle.value[row][col] = 0
    conflicts.value = conflicts.value.filter(item => item.row !== row || item.col !== col)
}

function hint() {
    if (!canEditSelected()) return
    const { row, col } = selected.value
    puzzle.value[row][col] = solution.value[row][col]
    conflicts.value = conflicts.value.filter(item => item.row !== row || item.col !== col)
}

function checkPuzzle() {
    const errors = []
    for (let row = 0; row < 9; row += 1) {
        for (let col = 0; col < 9; col += 1) {
            const value = puzzle.value[row][col]
            if (value && value !== solution.value[row][col]) errors.push({ row, col })
        }
    }
    conflicts.value = errors

    if (errors.length) {
        message.warning("还有 " + errors.length + " 个格子需要检查")
        return
    }
    if (filledCount.value < 81) {
        message.info("目前没有发现错误，继续完成剩余空格")
        return
    }

    finished.value = true
    message.success("完成！")
}

function themeColor(name, fallback) {
    const root = document.querySelector(".site-shell") || document.documentElement
    const value = getComputedStyle(root).getPropertyValue(name).trim()
    return value || fallback
}

function renderBoardCanvas() {
    const size = 1080
    const padding = 54
    const boardSize = size - padding * 2
    const cellSize = boardSize / 9
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext("2d")
    const bg = themeColor("--color-bg-raised", "#0f1c26")
    const panel = themeColor("--color-bg-panel", "#0b151d")
    const fixedBg = themeColor("--color-bg-control", "#112633")
    const selectedBg = themeColor("--color-bg-selected", "#143546")
    const border = themeColor("--color-border-default", "#23485f")
    const borderStrong = themeColor("--color-border-strong", "#58bceb")
    const text = themeColor("--color-text-primary", "#eaf6ff")
    const accent = themeColor("--color-accent-primary", "#78cff6")

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, size, size)

    for (let row = 0; row < 9; row += 1) {
        for (let col = 0; col < 9; col += 1) {
            const x = padding + col * cellSize
            const y = padding + row * cellSize
            const value = puzzle.value[row]?.[col] || 0
            const fixed = original.value[row]?.[col] !== 0
            const isSelected = selected.value?.row === row && selected.value?.col === col
            const isConflict = conflicts.value.some(item => item.row === row && item.col === col)

            ctx.fillStyle = isConflict
                ? "rgba(168,60,75,.42)"
                : isSelected
                    ? selectedBg
                    : fixed
                        ? fixedBg
                        : panel
            ctx.fillRect(x, y, cellSize, cellSize)

            if (value) {
                ctx.fillStyle = fixed ? text : accent
                ctx.font = "600 42px DM Sans, sans-serif"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillText(String(value), x + cellSize / 2, y + cellSize / 2 + 1)
            }
        }
    }

    ctx.lineCap = "square"
    for (let i = 0; i <= 9; i += 1) {
        const pos = padding + i * cellSize
        const strong = i % 3 === 0
        ctx.strokeStyle = strong ? borderStrong : border
        ctx.lineWidth = strong ? 4 : 1.5

        ctx.beginPath()
        ctx.moveTo(padding, pos)
        ctx.lineTo(padding + boardSize, pos)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(pos, padding)
        ctx.lineTo(pos, padding + boardSize)
        ctx.stroke()
    }

    return canvas
}

function canvasToPngBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) resolve(blob)
            else reject(new Error("PNG 生成失败"))
        }, "image/png")
    })
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 500)
}

async function copyToClipBoard() {
    try {
        const blob = await canvasToPngBlob(renderBoardCanvas())

        if (window.isSecureContext && navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
            try {
                await navigator.clipboard.write([new ClipboardItem({ "image/png":blob })])
                message.success("棋盘图片已复制")
                return
            } catch (error) {
                console.warn("Clipboard image write failed, falling back to download.", error)
            }
        }

        downloadBlob(blob, "raym-sudoku.png")
        message.warning("浏览器限制了图片剪贴板，已改为下载 PNG")
    } catch (error) {
        console.error(error)
        message.error("棋盘图片生成失败")
    }
}

async function downloadBoardImage() {
    try {
        const blob = await canvasToPngBlob(renderBoardCanvas())
        downloadBlob(blob, "raym-sudoku.png")
        message.success("棋盘图片已下载")
    } catch (error) {
        console.error(error)
        message.error("棋盘图片生成失败")
    }
}

function onKeydown(event) {
    if (/^[1-9]$/.test(event.key)) setNumber(Number(event.key))
    if (event.key === "Backspace" || event.key === "Delete") clearCell()
}

onMounted(() => {
    newGame("medium")
    window.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
    if (timerId) clearInterval(timerId)
    window.removeEventListener("keydown", onKeydown)
})
</script>

<style scoped lang="scss">
.lab-detail{width:min(1180px,calc(100% - 40px));margin:48px auto 0}.back{color:var(--color-text-secondary);font-size:11px;text-decoration:none}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}.lab-head{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin:34px 0 36px}.lab-head h1{margin:14px 0;font-size:clamp(42px,5vw,54px);letter-spacing:-.04em}.lab-head p:last-child{max-width:720px;margin:0;color:var(--color-text-secondary);font-size:15px;line-height:1.75}.status{color:var(--color-accent-primary);font-size:10px}.lab-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:20px}.game-surface{padding:28px;display:grid;justify-items:center}.surface-head{position:relative;z-index:1;width:100%;display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:26px}.surface-head h2{margin:8px 0 0;font-size:26px}.metrics{display:flex;gap:18px;color:var(--color-text-secondary);font-size:10px}.number-pad{position:relative;z-index:1;width:min(100%,560px);display:grid;grid-template-columns:repeat(9,1fr);gap:7px;margin-top:18px}.number-pad button{aspect-ratio:1;border:1px solid var(--color-border-default);border-radius:10px;color:var(--color-text-primary);background:var(--color-bg-control);cursor:pointer}.number-pad button:hover{border-color:var(--color-border-strong);color:var(--color-accent-primary);background:var(--color-bg-selected)}.game-actions{position:relative;z-index:1;width:min(100%,560px);display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:9px;margin-top:18px}.game-actions button,.side-card button{min-height:44px;border:1px solid var(--color-border-default);border-radius:11px;color:var(--color-text-primary);background:var(--color-bg-control);cursor:pointer}.game-actions .primary,.side-card .primary{color:var(--color-accent-contrast);border-color:var(--color-action-primary);background:var(--color-action-primary);font-weight:600}.side-stack{display:grid;align-content:start;gap:20px}.side-card{padding:22px}.side-card>*{position:relative;z-index:1}.side-card h3{margin:12px 0;font-size:20px;line-height:1.4}.side-card p:last-of-type{color:var(--color-text-secondary);font-size:13px;line-height:1.7}.side-card label{display:grid;gap:9px;margin:18px 0;color:var(--color-text-primary);font-size:12px}.side-card select{min-height:44px;padding:0 12px;border:1px solid var(--color-border-default);border-radius:10px;color:var(--color-text-primary);background:var(--color-bg-control)}.wide{width:100%;margin-top:9px}
@media(max-width:900px){.lab-layout{grid-template-columns:1fr}.side-stack{grid-template-columns:repeat(3,1fr)}}
@media(max-width:700px){.lab-detail{margin-top:38px}.lab-head{align-items:flex-start;flex-direction:column}.game-surface{padding:20px}.side-stack{grid-template-columns:1fr}.game-actions{grid-template-columns:1fr}.number-pad{gap:4px}.number-pad button{min-height:38px}.metrics{flex-direction:column;gap:5px;align-items:flex-end}}
</style>
