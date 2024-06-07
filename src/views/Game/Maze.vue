<template>
    <div class="content" id="maze_area">
        <div style="display: flex; flex-direction: row" v-for="i in state.rows" :key="'row' + i">
            <div v-for="j in state.cols" :key="'col' + j">
                <div class="rect" :style="{height: rectSize +'px'}" id="`rect_${i}_${j}`"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive } from "vue"

const { proxy, emit } = getCurrentInstance()
const state = reactive({
    rectList: [],
    rows: 0,
    cols: 0,
})

const rectSize = 20

onMounted(() => {
    calculateRect()
})

function calculateRect() {
    state.rows = document.getElementById("maze_area").clientHeight / rectSize
    state.cols = document.getElementById("maze_area").clientWidth / rectSize
    console.log(state.rows, state.cols)
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
