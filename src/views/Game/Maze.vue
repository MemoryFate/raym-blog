<template>
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
    dfsPath()
}
function drawArrow(start, end) {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    const theta = 30 // 箭头夹角
    const headlen = rectSize / 4 // 箭头边长
    ctx.lineWidth = 0.5
    ctx.strokeStyle = "#ddd"
    var fromX = start.x * rectSize + rectSize / 2,
        fromY = start.y * rectSize + rectSize / 2,
        toX = end.x * rectSize + rectSize / 2,
        toY = end.y * rectSize + rectSize / 2
    var angle = (Math.atan2(fromY - toY, fromX - toX) * 180) / Math.PI,
        angle1 = ((angle + theta) * Math.PI) / 180,
        angle2 = ((angle - theta) * Math.PI) / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2)

    ctx.save()
    ctx.beginPath()

    var arrowX = fromX - topX,
        arrowY = fromY - topY

    ctx.moveTo(arrowX, arrowY)
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)
    arrowX = toX + topX
    arrowY = toY + topY
    ctx.moveTo(arrowX, arrowY)
    ctx.lineTo(toX, toY)
    arrowX = toX + botX
    arrowY = toY + botY
    ctx.lineTo(arrowX, arrowY)
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
        if (currentP.x != state.endPoint.x || currentP.y != state.endPoint.y) {
            const rect = document.getElementById(`rect_${currentP.x}_${currentP.y}`)
            let nextP = undefined
            if (rect.style.borderTop == "none" && !document.getElementById(`rect_${currentP.x}_${currentP.y - 1}`).getAttribute("hasPoint1")) {
                nextP = new Point(currentP.x, currentP.y - 1)
            } else if (rect.style.borderLeft == "none" && !document.getElementById(`rect_${currentP.x - 1}_${currentP.y}`).getAttribute("hasPoint1")) {
                nextP = new Point(currentP.x - 1, currentP.y)
            } else if (rect.style.borderRight == "none" && !document.getElementById(`rect_${currentP.x + 1}_${currentP.y}`).getAttribute("hasPoint1")) {
                nextP = new Point(currentP.x + 1, currentP.y)
            } else if (rect.style.borderBottom == "none" && !document.getElementById(`rect_${currentP.x}_${currentP.y + 1}`).getAttribute("hasPoint1")) {
                nextP = new Point(currentP.x, currentP.y + 1)
            }
            if (document.getElementById(`rect_${nextP?.x}_${nextP?.y}`)) {
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
}
function astarPath() {
    let openAry = [
        {
            x: state.startPoint.x,
            y: state.startPoint.y,
            priority: 0,
        },
    ]
    let closeAry = []
    const defaultDistance = Math.abs(state.startPoint.x - state.endPoint.x) + Math.abs(state.startPoint.y - state.endPoint.y)
    astar()
    function astar() {
        openAry.sort((a, b) => a.priority < b.priority)
        const currentO = openAry[0]
        closeAry.push(openAry.splice(0, 1))
        const rect = document.getElementById(`rect_${currentO.x}_${currentO.y}`)
    }
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
