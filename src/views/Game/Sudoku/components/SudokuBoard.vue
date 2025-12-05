<template>
  <div class="board">
    <div v-for="(row, r) in puzzle" :key="r" class="row">
      <div
        v-for="(cell, c) in row"
        :key="c"
        class="cell"
        :class="{ fixed: cell !== 0 }"
      >
        {{ cell === 0 ? '' : cell }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  puzzle: Array
});
</script>

<style scoped>
.board {
  display: grid;
  grid-template-rows: repeat(9, 40px);
  width: 360px;
  border: 2px solid #000;
}
.row {
  display: grid;
  grid-template-columns: repeat(9, 40px);
}
.cell {
  border: 1px solid #888;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.cell.fixed {
  background: #eee;
  font-weight: bold;
}
</style>
