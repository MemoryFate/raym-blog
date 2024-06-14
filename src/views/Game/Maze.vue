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
            <div class="dot blue" :style="{ top: state.endPoint.y * rectSize + 'px', left: state.endPoint.x * rectSize + 'px', width: rectSize + 'px' }"></div>
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
        return this._x
    }
    set x(v) {
        this._x = parseInt(v)
    }
    get y() {
        return this._y
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
    endPoint: new Point(),
})

const rectSize = 20

onMounted(() => {
    initRect()
    proxy.$nextTick(() => {
        initMaze()
    })
})
document.addEventListener("keydown", e => {
    console.log(e.code)
    if (e.code == "KeyW") {
        const x = state.startPoint.x
        const y = state.startPoint.y - 1 > 0 ? state.startPoint.y - 1 : 0
        state.startPoint = new Point(x, y)
    }
    if (e.code == "KeyA") {
        const x = state.startPoint.x - 1 > 0 ? state.startPoint.x - 1 : 0
        const y = state.startPoint.y
        state.startPoint = new Point(x, y)
    }
    if (e.code == "KeyS") {
        const x = state.startPoint.x
        const y = state.startPoint.y + 1 > state.rows - 1 ? state.startPoint.y + 1 : state.rows - 1
        state.startPoint = new Point(x, y)
    }
    if (e.code == "KeyD") {
        const x = state.startPoint.x + 1 > state.cols - 1 ? state.startPoint.x + 1 : state.cols - 1
        const y = state.startPoint.y
        state.startPoint = new Point(x, y)
    }
})
function initRect() {
    state.rows = document.getElementById("maze_area").clientHeight / rectSize
    state.cols = document.getElementById("maze_area").clientWidth / rectSize
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
    walls = walls.concat(calculateWall(state.startPoint))
    while (walls.length) {
        const idx = Math.floor(Math.random() * walls.length)
        const wall = walls[idx]
        const tmp = wall.split("_") // x y [top|left|right|bottom]
        const sp = new Point(parseInt(tmp[0]), parseInt(tmp[1]))
        const rect = document.getElementById(`rect_${tmp[0]}_${tmp[1]}`)
        if (tmp[2] == "top") {
            let p = new Point(sp.x, sp.y - 1)
            if (p.y >= 0) {
                const nextRect = document.getElementById(`rect_${p.x}_${p.y}`)
                if (!nextRect.getAttribute("hasPoint")) {
                    nextRect.setAttribute("hasPoint", "yes!")
                    rect.style.borderTop = "none"
                    nextRect.style.borderBottom = "none"
                    walls = walls.concat(calculateWall(p, "bottom"))
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
                    walls = walls.concat(calculateWall(p, "right"))
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
                    walls = walls.concat(calculateWall(p, "left"))
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
                    walls = walls.concat(calculateWall(p, "top"))
                }
            }
        }
        walls.splice(idx, 1)
    }
}

function calculateWall(point, type = "") {
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
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    ctx.moveTo(state.startPoint.x * rectSize + rectSize / 2, state.startPoint.y * rectSize + rectSize / 2)
    ctx.lineTo(state.endPoint.x * rectSize + rectSize / 2, state.endPoint.y * rectSize + rectSize / 2)
    ctx.lineWidth = 5
    ctx.strokeStyle = "#32a1ff"
    ctx.stroke()
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
