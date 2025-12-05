<template>
  <a-card>
    <div class="container">
      <a-row>
        <a-radio-group v-model:value="data.model">
          <a-radio-button value="easy">简单</a-radio-button>
          <a-radio-button value="medium">中等</a-radio-button>
          <a-radio-button value="hard">困难</a-radio-button>
          <a-radio-button value="expert">专家</a-radio-button>
        </a-radio-group>
        <a-button type="primary" style="margin-left: 20px" @click="newGame(data.model)">新游戏</a-button>
      </a-row>

      <SudokuBoard id="board" :puzzle="puzzle" />
      <a @click="copyToClipBoard()" style="margin: 10px">点击复制二维码到剪贴板</a>
    </div>
  </a-card>
</template>

<script setup>
import html2canvas from "html2canvas";
import { reactive, ref } from "vue";
import { generateSudoku } from "./js/sudokuGenerator";
import { message } from "ant-design-vue"
import SudokuBoard from "./components/SudokuBoard.vue";

const data = reactive({
  model: 'medium'
})
const puzzle = ref([]);

function newGame(level) {
  const { puzzle: puz } = generateSudoku(level, true);
  puzzle.value = puz;
}

newGame('medium'); // 默认初始化

function copyToClipBoard() {
    const board = document.getElementById("board")
    html2canvas(board).then(canvas =>{
        canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]))
        message.info("复制成功")
    })
}
</script>
<style scoped lang="scss">
.container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
