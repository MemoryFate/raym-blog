<template>
  <a-card>
    <button @click="newGame('easy')">简单</button>
    <button @click="newGame('medium')">中等</button>
    <button @click="newGame('hard')">困难</button>
    <button @click="newGame('expert')">专家</button>

    <SudokuBoard :puzzle="puzzle" />
  </a-card>
</template>

<script setup>
import { ref } from "vue";
import { generateSudoku } from "./js/sudokuGenerator";
import SudokuBoard from "./components/SudokuBoard.vue";

const puzzle = ref([]);

function newGame(level) {
  const { puzzle: puz } = generateSudoku(level, true);
  puzzle.value = puz;
}

newGame('medium'); // 默认初始化
</script>
