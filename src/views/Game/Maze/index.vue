<template>
    <a-breadcrumb style="margin: 14px auto;" separator=">">
        <a-breadcrumb-item><a href="./#/">Home</a></a-breadcrumb-item>
        <a-breadcrumb-item><a href="./#/Game">游戏</a></a-breadcrumb-item>
        <a-breadcrumb-item>迷宫</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="content" id="maze_area">
        <canvas class="canvas" id="canvas" width="800" height="800"></canvas>
        <div style="z-index: 1; position: inherit">
            <div style="display: flex; flex-direction: row; z-index: 1" v-for="(rows, i) in state.rectList" :key="'row' + i">
                <div v-for="(col, j) in rows" :key="'col' + j">
                    <div class="rect" :style="{ height: rectSize + 'px' }" :id="col" @click="rectClick(j, i)"></div>
                </div>
            </div>
            <div class="dot red" :style="{ top: state.startPoint.y * rectSize + 'px', left: state.startPoint.x * rectSize + 'px', width: rectSize + 'px' }"></div>
            <div class="dot blue" v-if="state.endPoint" :style="{ top: state.endPoint.y * rectSize + 'px', left: state.endPoint.x * rectSize + 'px', width: rectSize + 'px' }"></div>
        </div>
        <div>
            <input type="radio" value="1" id="dfs" name="radio_group" checked />
            <label for="dfs">DFS算法</label>
            <input type="radio" value="2" id="astar" name="radio_group" />
            <label for="a">A*算法</label>
        </div>
    </div>
</template>
<script setup>
import { getCurrentInstance, nextTick, onMounted, reactive } from "vue"
import { message } from "ant-design-vue"
class Point {
    constructor(x = 0, y = 0) {
        this._x = x
        this._y = y
    }

    get x() {
        return parseInt(this._x)
    }
    set x(v) {
        this._x = parseInt(v)
    }
    get y() {
        return parseInt(this._y)
    }
    set y(v) {
        this._y = parseInt(v)
    }
}
const { proxy, emit } = getCurrentInstance()
const state = reactive({
    rectList: [],
    rows: 0,
    cols: 0,
    startPoint: new Point(),
    endPoint: undefined,
})

const rectSize = 20

onMounted(() => {
    initRect()
    proxy.$nextTick(() => {
        initMaze()
    })
})
document.addEventListener("keydown", e => {
    let x, y
    const rect = document.getElementById(`rect_${state.startPoint.x}_${state.startPoint.y}`)
    if (e.code == "KeyW") {
        x = state.startPoint.x
        y = state.startPoint.y - 1 > 0 ? state.startPoint.y - 1 : 0
        if (rect.style.borderTop != "none") return
    } else if (e.code == "KeyA") {
        x = state.startPoint.x - 1 > 0 ? state.startPoint.x - 1 : 0
        y = state.startPoint.y
        if (rect.style.borderLeft != "none") return
    } else if (e.code == "KeyS") {
        x = state.startPoint.x
        y = state.startPoint.y + 1 > state.rows - 1 ? state.rows - 1 : state.startPoint.y + 1
        if (rect.style.borderBottom != "none") return
    } else if (e.code == "KeyD") {
        x = state.startPoint.x + 1 > state.cols - 1 ? state.cols - 1 : state.startPoint.x + 1
        y = state.startPoint.y
        if (rect.style.borderRight != "none") return
    } else {
        return
    }
    state.startPoint = new Point(x, y)
})
function initRect() {
    state.rows = document.getElementById("canvas").clientHeight / rectSize
    state.cols = document.getElementById("canvas").clientWidth / rectSize
    for (let i = 0; i < state.rows; i++) {
        var ary = []
        for (let j = 0; j < state.cols; j++) {
            ary.push(`rect_${j}_${i}`)
        }
        state.rectList.push(ary)
    }
}
function initMaze() {
    let walls = []
    state.startPoint = new Point(Math.floor(Math.random() * state.cols), Math.floor(Math.random() * state.rows))
    document.getElementById(`rect_${state.startPoint.x}_${state.startPoint.y}`).setAttribute("hasPoint", "yes!")
    walls = walls.concat(findWall(state.startPoint))
    while (walls.length) {
        const idx = Math.floor(Math.random() * walls.length)
        const wall = walls[idx]
        const tmp = wall.split("_") // [x, y, (top|left|right|bottom)]
        const sp = new Point(parseInt(tmp[0]), parseInt(tmp[1])) // start point
        const rect = document.getElementById(`rect_${sp.x}_${sp.y}`)
        if (tmp[2] == "top") {
            let p = new Point(sp.x, sp.y - 1)
            if (p.y >= 0) {
                const nextRect = document.getElementById(`rect_${p.x}_${p.y}`)
                if (!nextRect.getAttribute("hasPoint")) {
                    nextRect.setAttribute("hasPoint", "yes!")
                    rect.style.borderTop = "none"
                    nextRect.style.borderBottom = "none"
                    walls = walls.concat(findWall(p, "bottom"))
                }
            }
        }
        if (tmp[2] == "left") {
            let p = new Point(sp.x - 1, sp.y)
            if (p.x >= 0) {
                const nextRect = document.getElementById(`rect_${p.x}_${p.y}`)
                if (!nextRect.getAttribute("hasPoint")) {
                    nextRect.setAttribute("hasPoint", "yes!")
                    rect.style.borderLeft = "none"
                    nextRect.style.borderRight = "none"
                    walls = walls.concat(findWall(p, "right"))
                }
            }
        }
        if (tmp[2] == "right") {
            let p = new Point(sp.x + 1, sp.y)
            if (p.x <= state.cols - 1) {
                const nextRect = document.getElementById(`rect_${p.x}_${p.y}`)
                if (!nextRect.getAttribute("hasPoint")) {
                    nextRect.setAttribute("hasPoint", "yes!")
                    rect.style.borderRight = "none"
                    nextRect.style.borderLeft = "none"
                    walls = walls.concat(findWall(p, "left"))
                }
            }
        }
        if (tmp[2] == "bottom") {
            let p = new Point(sp.x, sp.y + 1)
            if (p.y <= state.rows - 1) {
                const nextRect = document.getElementById(`rect_${p.x}_${p.y}`)
                if (!nextRect.getAttribute("hasPoint")) {
                    nextRect.setAttribute("hasPoint", "yes!")
                    rect.style.borderBottom = "none"
                    nextRect.style.borderTop = "none"
                    walls = walls.concat(findWall(p, "top"))
                }
            }
        }
        walls.splice(idx, 1)
    }
}
// 将该point所对应的墙找出,排除type类型
function findWall(point, type = "") {
    let ary = []
    if (point.x != 0 && type != "left") {
        ary.push(`${point.x}_${point.y}_left`)
    }
    if (point.x != state.cols - 1 && type != "right") {
        ary.push(`${point.x}_${point.y}_right`)
    }
    if (point.y != 0 && type != "top") {
        ary.push(`${point.x}_${point.y}_top`)
    }
    if (point.x != state.rows - 1 && type != "bottom") {
        ary.push(`${point.x}_${point.y}_bottom`)
    }
    return ary
}
function rectClick(x, y) {
    state.endPoint = new Point(x, y)
    clearCanvas()
    const selectedAlgo = document.querySelector('input[name="radio_group"]:checked').value
    if (selectedAlgo === '1') {
        dfsPath()
    } else {
        astarPath()
    }
}
function drawArrow(start, end) {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    const headlen = rectSize / 4 // 箭头边长

    ctx.lineWidth = 1
    ctx.strokeStyle = "#ff4444"
    ctx.fillStyle = "#ff4444"

    const fromX = start.x * rectSize + rectSize / 2
    const fromY = start.y * rectSize + rectSize / 2
    const toX = end.x * rectSize + rectSize / 2
    const toY = end.y * rectSize + rectSize / 2

    // 计算方向角度
    const angle = Math.atan2(toY - fromY, toX - fromX)
    const headAngle = Math.PI / 6 // 30度夹角

    ctx.save()
    ctx.beginPath()

    // 绘制主线
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)

    // 绘制箭头头部
    ctx.lineTo(
        toX - headlen * Math.cos(angle - headAngle),
        toY - headlen * Math.sin(angle - headAngle)
    )
    ctx.moveTo(toX, toY)
    ctx.lineTo(
        toX - headlen * Math.cos(angle + headAngle),
        toY - headlen * Math.sin(angle + headAngle)
    )

    ctx.stroke()
    ctx.restore()
}
function clearCanvas() {
    const rects = document.getElementsByClassName("rect")
    Array.prototype.forEach.call(rects, _ => {
        _.removeAttribute("hasPoint1")
    })
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}
function dfsPath() {
    let path = [state.startPoint]
    let currentP = path[0]
    document.getElementById(`rect_${currentP.x}_${currentP.y}`).setAttribute("hasPoint1", "yes!")
    dfs()
    function dfs() {
        if (!currentP) return
        if (currentP.x === state.endPoint.x && currentP.y === state.endPoint.y) {
            return
        }
        const rect = document.getElementById(`rect_${currentP.x}_${currentP.y}`)
        let nextP = undefined
        if (rect.style.borderTopStyle === "none" && !document.getElementById(`rect_${currentP.x}_${currentP.y - 1}`).getAttribute("hasPoint1")) {
            nextP = new Point(currentP.x, currentP.y - 1)
        } else if (rect.style.borderLeftStyle === "none" && !document.getElementById(`rect_${currentP.x - 1}_${currentP.y}`).getAttribute("hasPoint1")) {
            nextP = new Point(currentP.x - 1, currentP.y)
        } else if (rect.style.borderRightStyle === "none" && !document.getElementById(`rect_${currentP.x + 1}_${currentP.y}`).getAttribute("hasPoint1")) {
            nextP = new Point(currentP.x + 1, currentP.y)
        } else if (rect.style.borderBottomStyle === "none" && !document.getElementById(`rect_${currentP.x}_${currentP.y + 1}`).getAttribute("hasPoint1")) {
            nextP = new Point(currentP.x, currentP.y + 1)
        }
        if (nextP && document.getElementById(`rect_${nextP.x}_${nextP.y}`)) {
            document.getElementById(`rect_${nextP.x}_${nextP.y}`).setAttribute("hasPoint1", "yes!")
            drawArrow(currentP, nextP)
            path.push(nextP)
            currentP = nextP
        } else {
            path.pop()
            currentP = path[path.length - 1]
        }
        dfs()
    }
}
function astarPath() {
    const start = state.startPoint
    const end = state.endPoint

    // 曼哈顿距离作为启发函数
    const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

    // 获取相邻可达格子
    const getNeighbors = (point) => {
        const neighbors = []
        const rect = document.getElementById(`rect_${point.x}_${point.y}`)
        if (rect.style.borderTopStyle === "none" && point.y > 0) {
            neighbors.push({ x: point.x, y: point.y - 1 })
        }
        if (rect.style.borderBottomStyle === "none" && point.y < state.rows - 1) {
            neighbors.push({ x: point.x, y: point.y + 1 })
        }
        if (rect.style.borderLeftStyle === "none" && point.x > 0) {
            neighbors.push({ x: point.x - 1, y: point.y })
        }
        if (rect.style.borderRightStyle === "none" && point.x < state.cols - 1) {
            neighbors.push({ x: point.x + 1, y: point.y })
        }
        return neighbors
    }

    // Open 列表: { x, y, g, h, f, parent }
    const openList = []
    // Close 列表: Set 存储 "x,y" 字符串
    const closeSet = new Set()

    // 起点
    const startNode = {
        x: start.x,
        y: start.y,
        g: 0,
        h: heuristic(start, end),
        f: heuristic(start, end),
        parent: null,
    }
    openList.push(startNode)

    while (openList.length > 0) {
        // 取出 f 值最小的节点
        openList.sort((a, b) => a.f - b.f)
        const current = openList.shift()

        // 到达终点
        if (current.x === end.x && current.y === end.y) {
            // 绘制路径
            const path = []
            let node = current
            while (node) {
                path.unshift({ x: node.x, y: node.y })
                node = node.parent
            }
            // 绘制箭头
            for (let i = 0; i < path.length - 1; i++) {
                drawArrow(path[i], path[i + 1])
            }
            return
        }

        closeSet.add(`${current.x},${current.y}`)

        // 遍历邻居
        const neighbors = getNeighbors(current)
        for (const neighbor of neighbors) {
            if (closeSet.has(`${neighbor.x},${neighbor.y}`)) {
                continue
            }

            const g = current.g + 1
            const h = heuristic(neighbor, end)
            const f = g + h

            // 检查是否已在 openList 中
            const existingIndex = openList.findIndex(n => n.x === neighbor.x && n.y === neighbor.y)
            if (existingIndex !== -1) {
                if (g < openList[existingIndex].g) {
                    openList[existingIndex].g = g
                    openList[existingIndex].f = f
                    openList[existingIndex].parent = current
                }
            } else {
                openList.push({
                    x: neighbor.x,
                    y: neighbor.y,
                    g,
                    h,
                    f,
                    parent: current,
                })
            }
        }
    }

    // 未找到路径
    message.error("未找到路径")
}
</script>
<style lang="scss" scoped>
.content,
.canvas {
    position: relative;
    aspect-ratio: 1;
    width: 800px;
}

.content {
    border: 1px solid;
    margin: auto;
    box-sizing: content-box;
}

.canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
}

.rect {
    aspect-ratio: 1;
    box-sizing: border-box;
    border: 0.5px solid;
    transition: all 0.1s;
}

.rect:hover {
    box-shadow: inset 0px 0px 10px 0px gray;
}

.dot {
    transition: all 0.3s;
    position: absolute;
    aspect-ratio: 1;
    border-radius: 50%;
    transform: scale(0.8);
}

.red {
    background-color: red;
}

.blue {
    background-color: blue;
}
</style>
