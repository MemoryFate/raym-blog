<template>
    <div class="content" id="maze_area">
        <div style="display: flex; flex-direction: row" v-for="i in state.rows" :key="'row' + i">
            <div v-for="j in state.cols" :key="'col' + j">
                <div class="rect" :style="{ height: rectSize + 'px' }" id="`rect_${i}_${j}`"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
class RectModal {
    constructor(i, j) {
        this._i = i
        this._j = j
        this._top = true
        this._left = true
        this._right = true
        this._bottom = true
    }

    get i() {
        return this._i
    }

    set i(v) {
        this._i = v
    }

    get j() {
        return this._j
    }

    set j(v) {
        this._j = v
    }

    get top() {
        return this._top
    }

    set top(v) {
        this._top = v
    }

    get left() {
        return this._left
    }

    set left(v) {
        this._left = v
    }

    get bottom() {
        return this._bottom
    }

    set bottom(v) {
        this._bottom = v
    }

    get right() {
        return this._right
    }
    set right(v) {
        this._right = v
    }
}
import { getCurrentInstance, onMounted, reactive } from "vue"

const { proxy, emit } = getCurrentInstance()
const state = reactive({
    rectList: [],
    rows: 0,
    cols: 0,
})

const rectSize = 20

onMounted(() => {
    initRect()
})

function initRect() {
    state.rows = document.getElementById("maze_area").clientHeight / rectSize
    state.cols = document.getElementById("maze_area").clientWidth / rectSize
    for (let i = 0; i < state.rows; i++) {
        var ary = []
        for (let j = 0; j < state.cols; j++) {
            let modal = new RectModal()
            if (i == 0) {
                modal.top = false
            }
            if (j == 0) {
                modal.left = false
            }
            if (j == state.cols - 1) {
                modal.right = false
            }
            if (i == state.rows - 1) {
                modal.bottom = false
            }
            ary.push(modal)
        }
        state.rectList.push(ary)
    }
}
function initMaze() {
    var wallList = []
    
}
</script>
<style lang="scss" scoped>
.content {
    margin: auto;
    aspect-ratio: 2;
    width: 800px;
    border: 1px solid;
}

.rect {
    aspect-ratio: 1;
    box-sizing: border-box;
    border: 0.5px solid;
}
</style>
