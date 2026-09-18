<template>
    <div class="lab-detail">
        <RouterLink class="back mono" to="/Lab">← 返回实验室</RouterLink>

        <header class="lab-head">
            <div>
                <p class="eyebrow">实验室 / 迷宫</p>
                <h1>迷宫</h1>
                <p>生成随机迷宫，使用键盘移动起点，或点击任意格子比较 DFS 与 A* 的寻路结果。</p>
            </div>
            <span class="mono status">● {{ state.endPoint ? "路径已计算" : "等待选择终点" }}</span>
        </header>

        <div class="lab-layout">
            <NeonGlass class="game-surface" glow>
                <div class="surface-head">
                    <div><p class="eyebrow">迷宫画布</p><h2>{{ state.gridSize }} × {{ state.gridSize }}</h2></div>
                    <div class="mono metrics"><span>移动 {{ state.moves }} 步</span><span>{{ algorithmLabel }}</span></div>
                </div>

                <div ref="boardRef" class="maze-board">
                    <canvas ref="canvasRef" class="path-canvas"></canvas>

                    <div :key="state.mazeKey" class="maze-grid" :style="gridStyle">
                        <button
                            v-for="cell in cells"
                            :id="cell.id"
                            :key="cell.id"
                            type="button"
                            class="rect"
                            :aria-label="'迷宫格 ' + cell.x + ',' + cell.y"
                            @click="setTarget(cell.x, cell.y)"
                        ></button>
                    </div>

                    <div class="dot player" :style="pointStyle(state.startPoint)"><span></span></div>
                    <div v-if="state.endPoint" class="dot target" :style="pointStyle(state.endPoint)"><span></span></div>
                </div>

                <div class="board-hint mono">
                    <span>WASD / 方向键移动</span>
                    <span>点击格子设置终点</span>
                </div>
            </NeonGlass>

            <aside class="side-stack">
                <NeonGlass class="side-card">
                    <p class="eyebrow">控制</p>

                    <label>
                        <span>迷宫大小</span>
                        <select v-model.number="state.gridSize" @change="newMaze">
                            <option :value="12">12 × 12</option>
                            <option :value="14">14 × 14</option>
                            <option :value="18">18 × 18</option>
                            <option :value="24">24 × 24</option>
                        </select>
                    </label>

                    <label>
                        <span>寻路算法</span>
                        <select v-model="state.algorithm" @change="recalculatePath">
                            <option value="dfs">DFS 深度优先</option>
                            <option value="astar">A* 启发式搜索</option>
                        </select>
                    </label>

                    <button type="button" class="primary wide" @click="newMaze">生成新迷宫</button>
                    <button type="button" class="wide" @click="clearTarget">清除路径</button>
                </NeonGlass>

                <NeonGlass class="side-card">
                    <p class="eyebrow">状态</p>
                    <div class="stat-grid">
                        <div><small>起点</small><strong>{{ state.startPoint.x }}, {{ state.startPoint.y }}</strong></div>
                        <div><small>终点</small><strong>{{ state.endPoint ? state.endPoint.x + ", " + state.endPoint.y : "未选择" }}</strong></div>
                        <div><small>路径长度</small><strong>{{ state.currentPath.length ? state.currentPath.length - 1 : "—" }}</strong></div>
                    </div>
                </NeonGlass>

                <NeonGlass class="side-card">
                    <p class="eyebrow">实验说明</p>
                    <h3>同一个迷宫，两种搜索方式</h3>
                    <p>DFS 更接近“沿一个方向走到底再回退”，A* 使用曼哈顿距离作为启发函数，更偏向目标方向搜索。</p>
                </NeonGlass>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue"
import { message } from "ant-design-vue"
import NeonGlass from "@/components/ui/NeonGlass.vue"

class Point {
    constructor(x = 0, y = 0) {
        this.x = Number(x)
        this.y = Number(y)
    }
}

const boardRef = ref(null)
const canvasRef = ref(null)
let resizeObserver

const state = reactive({
    gridSize: 18,
    startPoint: new Point(),
    endPoint: null,
    algorithm: "astar",
    moves: 0,
    mazeKey: 0,
    currentPath: [],
})

const cells = computed(() => {
    const result = []
    for (let y = 0; y < state.gridSize; y += 1) {
        for (let x = 0; x < state.gridSize; x += 1) {
            result.push({ x, y, id:cellId(x, y) })
        }
    }
    return result
})

const gridStyle = computed(() => ({
    gridTemplateColumns:"repeat(" + state.gridSize + ", 1fr)",
    gridTemplateRows:"repeat(" + state.gridSize + ", 1fr)",
}))

const algorithmLabel = computed(() => state.algorithm === "astar" ? "A* 启发式搜索" : "DFS 深度优先")

function cellId(x, y) {
    return "maze_rect_" + x + "_" + y
}

function getCell(x, y) {
    return document.getElementById(cellId(x, y))
}

function pointStyle(point) {
    const cell = 100 / state.gridSize
    return {
        width:cell + "%",
        height:cell + "%",
        left:(point.x * cell) + "%",
        top:(point.y * cell) + "%",
    }
}

function findWall(point, exclude = "") {
    const walls = []
    if (point.x > 0 && exclude !== "left") walls.push(point.x + "_" + point.y + "_left")
    if (point.x < state.gridSize - 1 && exclude !== "right") walls.push(point.x + "_" + point.y + "_right")
    if (point.y > 0 && exclude !== "top") walls.push(point.x + "_" + point.y + "_top")
    if (point.y < state.gridSize - 1 && exclude !== "bottom") walls.push(point.x + "_" + point.y + "_bottom")
    return walls
}

function generateMazeWalls() {
    let walls = []
    const seed = new Point(
        Math.floor(Math.random() * state.gridSize),
        Math.floor(Math.random() * state.gridSize),
    )

    const seedCell = getCell(seed.x, seed.y)
    seedCell.dataset.visited = "1"
    walls = walls.concat(findWall(seed))

    while (walls.length) {
        const index = Math.floor(Math.random() * walls.length)
        const [xText, yText, side] = walls[index].split("_")
        const point = new Point(Number(xText), Number(yText))
        const cell = getCell(point.x, point.y)

        const delta = {
            top:[0,-1,"bottom"],
            bottom:[0,1,"top"],
            left:[-1,0,"right"],
            right:[1,0,"left"],
        }[side]

        const next = new Point(point.x + delta[0], point.y + delta[1])
        const nextCell = getCell(next.x, next.y)

        if (nextCell && !nextCell.dataset.visited) {
            nextCell.dataset.visited = "1"
            cell.style["border" + side.charAt(0).toUpperCase() + side.slice(1)] = "none"
            nextCell.style["border" + delta[2].charAt(0).toUpperCase() + delta[2].slice(1)] = "none"
            walls = walls.concat(findWall(next, delta[2]))
        }

        walls.splice(index, 1)
    }
}

async function newMaze() {
    state.mazeKey += 1
    state.moves = 0
    state.endPoint = null
    state.currentPath = []
    state.startPoint = new Point(
        Math.floor(Math.random() * state.gridSize),
        Math.floor(Math.random() * state.gridSize),
    )

    await nextTick()
    generateMazeWalls()
    resizeCanvas()
}

function getNeighbors(point) {
    const cell = getCell(point.x, point.y)
    if (!cell) return []
    const result = []
    const computedStyle = window.getComputedStyle(cell)

    if (point.y > 0 && computedStyle.borderTopStyle === "none") result.push(new Point(point.x, point.y - 1))
    if (point.y < state.gridSize - 1 && computedStyle.borderBottomStyle === "none") result.push(new Point(point.x, point.y + 1))
    if (point.x > 0 && computedStyle.borderLeftStyle === "none") result.push(new Point(point.x - 1, point.y))
    if (point.x < state.gridSize - 1 && computedStyle.borderRightStyle === "none") result.push(new Point(point.x + 1, point.y))

    return result
}

function pointKey(point) {
    return point.x + "," + point.y
}

function findPathDFS(start, end) {
    const stack = [{ point:start, path:[start] }]
    const visited = new Set([pointKey(start)])

    while (stack.length) {
        const current = stack.pop()
        if (current.point.x === end.x && current.point.y === end.y) return current.path

        const neighbors = getNeighbors(current.point)
        for (let i = neighbors.length - 1; i >= 0; i -= 1) {
            const next = neighbors[i]
            const key = pointKey(next)
            if (visited.has(key)) continue
            visited.add(key)
            stack.push({ point:next, path:[...current.path, next] })
        }
    }
    return []
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function findPathAStar(start, end) {
    const open = [{ point:start, g:0, f:heuristic(start, end), parent:null }]
    const closed = new Set()

    while (open.length) {
        open.sort((a, b) => a.f - b.f)
        const current = open.shift()
        const currentKey = pointKey(current.point)

        if (current.point.x === end.x && current.point.y === end.y) {
            const path = []
            let node = current
            while (node) {
                path.unshift(node.point)
                node = node.parent
            }
            return path
        }

        if (closed.has(currentKey)) continue
        closed.add(currentKey)

        for (const neighbor of getNeighbors(current.point)) {
            const key = pointKey(neighbor)
            if (closed.has(key)) continue

            const g = current.g + 1
            const existing = open.find(node => pointKey(node.point) === key)
            if (!existing || g < existing.g) {
                if (existing) {
                    existing.g = g
                    existing.f = g + heuristic(neighbor, end)
                    existing.parent = current
                } else {
                    open.push({
                        point:neighbor,
                        g,
                        f:g + heuristic(neighbor, end),
                        parent:current,
                    })
                }
            }
        }
    }
    return []
}

function setTarget(x, y) {
    state.endPoint = new Point(x, y)
    recalculatePath()
}

function clearTarget() {
    state.endPoint = null
    state.currentPath = []
    clearCanvas()
}

function recalculatePath() {
    if (!state.endPoint) {
        clearCanvas()
        return
    }

    const path = state.algorithm === "astar"
        ? findPathAStar(state.startPoint, state.endPoint)
        : findPathDFS(state.startPoint, state.endPoint)

    state.currentPath = path
    if (!path.length) message.warning("没有找到可达路径")
    drawPath(path)
}

function resizeCanvas() {
    if (!boardRef.value || !canvasRef.value) return
    const size = Math.floor(boardRef.value.clientWidth)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvasRef.value.width = Math.floor(size * dpr)
    canvasRef.value.height = Math.floor(size * dpr)
    canvasRef.value.style.width = size + "px"
    canvasRef.value.style.height = size + "px"
    const ctx = canvasRef.value.getContext("2d")
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    if (state.currentPath.length) drawPath(state.currentPath)
}

function clearCanvas() {
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function drawPath(path) {
    clearCanvas()
    if (!path.length || !boardRef.value) return

    const canvas = canvasRef.value
    const ctx = canvas.getContext("2d")
    const size = boardRef.value.clientWidth
    const cell = size / state.gridSize

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-accent-secondary").trim() || "#ff9b70"
    ctx.lineWidth = Math.max(2, cell * 0.1)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()

    path.forEach((point, index) => {
        const x = point.x * cell + cell / 2
        const y = point.y * cell + cell / 2
        if (index === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
    })
    ctx.stroke()
}

function canMove(from, direction) {
    const cell = getCell(from.x, from.y)
    if (!cell) return false
    const style = window.getComputedStyle(cell)
    return {
        top:style.borderTopStyle === "none",
        bottom:style.borderBottomStyle === "none",
        left:style.borderLeftStyle === "none",
        right:style.borderRightStyle === "none",
    }[direction]
}

function onKeydown(event) {
    const mapping = {
        KeyW:[0,-1,"top"],
        ArrowUp:[0,-1,"top"],
        KeyS:[0,1,"bottom"],
        ArrowDown:[0,1,"bottom"],
        KeyA:[-1,0,"left"],
        ArrowLeft:[-1,0,"left"],
        KeyD:[1,0,"right"],
        ArrowRight:[1,0,"right"],
    }
    const move = mapping[event.code]
    if (!move) return

    event.preventDefault()
    if (!canMove(state.startPoint, move[2])) return

    state.startPoint = new Point(
        Math.max(0, Math.min(state.gridSize - 1, state.startPoint.x + move[0])),
        Math.max(0, Math.min(state.gridSize - 1, state.startPoint.y + move[1])),
    )
    state.moves += 1
    if (state.endPoint) recalculatePath()
}

onMounted(async () => {
    await newMaze()
    window.addEventListener("keydown", onKeydown)
    resizeObserver = new ResizeObserver(resizeCanvas)
    if (boardRef.value) resizeObserver.observe(boardRef.value)
})

onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKeydown)
    resizeObserver?.disconnect()
})
</script>

<style scoped lang="scss">
.lab-detail{width:min(1180px,calc(100% - 40px));margin:48px auto 0}.back{color:var(--color-text-secondary);font-size:11px;text-decoration:none}.eyebrow{margin:0;color:var(--color-accent-primary);font-size:10px;letter-spacing:.14em}.lab-head{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin:34px 0 36px}.lab-head h1{margin:14px 0;font-size:clamp(42px,5vw,54px);letter-spacing:-.04em}.lab-head p:last-child{max-width:760px;margin:0;color:var(--color-text-secondary);font-size:15px;line-height:1.75}.status{color:var(--color-accent-primary);font-size:10px}.lab-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:20px}.game-surface{padding:28px;display:grid;justify-items:center}.surface-head{position:relative;z-index:1;width:100%;display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:26px}.surface-head h2{margin:8px 0 0;font-size:26px}.metrics{display:flex;gap:18px;color:var(--color-text-secondary);font-size:10px}.maze-board{position:relative;width:min(100%,700px);aspect-ratio:1;overflow:hidden;border:1px solid var(--color-accent-primary);border-radius:18px;background:var(--color-bg-panel-strong)}.maze-grid{position:absolute;inset:0;z-index:1;display:grid}.rect{min-width:0;min-height:0;padding:0;border:1px solid color-mix(in srgb,var(--color-border-glow) 62%,transparent);background:transparent;cursor:crosshair}.rect:hover{background:color-mix(in srgb,var(--color-accent-primary) 18%,transparent)}.path-canvas{position:absolute;inset:0;z-index:2;pointer-events:none}.dot{position:absolute;z-index:3;display:grid;place-items:center;padding:18%;pointer-events:none;transition:left 120ms ease,top 120ms ease}.dot span{display:block;width:100%;height:100%;border-radius:50%}.player span{background:var(--color-accent-primary);box-shadow:0 0 16px color-mix(in srgb,var(--color-accent-primary) 70%,transparent)}.target span{background:var(--color-accent-secondary);box-shadow:0 0 16px color-mix(in srgb,var(--color-accent-secondary) 70%,transparent)}.board-hint{position:relative;z-index:1;width:min(100%,700px);display:flex;justify-content:space-between;gap:20px;margin-top:14px;color:var(--color-text-secondary);font-size:10px}.side-stack{display:grid;align-content:start;gap:20px}.side-card{padding:22px}.side-card>*{position:relative;z-index:1}.side-card label{display:grid;gap:9px;margin-top:18px;color:var(--color-text-primary);font-size:12px}.side-card select{min-height:44px;padding:0 12px;border:1px solid var(--color-border-glow);border-radius:10px;color:var(--color-text-primary);background:var(--color-bg-panel-strong)}.side-card button{min-height:44px;border:1px solid var(--color-border-glow);border-radius:11px;color:var(--color-text-primary);background:var(--color-chip-bg);cursor:pointer}.side-card .primary{color:var(--color-accent-contrast);border-color:var(--color-accent-primary);background:var(--color-accent-primary);font-weight:600}.wide{width:100%;margin-top:10px}.stat-grid{display:grid;gap:14px;margin-top:18px}.stat-grid div{display:flex;align-items:center;justify-content:space-between;gap:18px}.stat-grid small{color:var(--color-text-secondary)}.stat-grid strong{font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:400}.side-card h3{margin:12px 0;font-size:20px;line-height:1.4}.side-card p:last-child{color:var(--color-text-secondary);font-size:13px;line-height:1.7}
@media(max-width:900px){.lab-layout{grid-template-columns:1fr}.side-stack{grid-template-columns:repeat(3,1fr)}}
@media(max-width:700px){.lab-detail{margin-top:38px}.lab-head{align-items:flex-start;flex-direction:column}.game-surface{padding:20px}.side-stack{grid-template-columns:1fr}.board-hint{align-items:flex-start;flex-direction:column;gap:6px}.metrics{flex-direction:column;align-items:flex-end;gap:5px}}
@media(prefers-reduced-motion:reduce){.dot{transition:none}}
</style>
