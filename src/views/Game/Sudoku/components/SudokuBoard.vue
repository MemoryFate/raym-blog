<template>
  <div class="board">
    <div v-for="(row, r) in puzzle" :key="r" class="row">
      <div
        v-for="(cell, c) in row"
        :key="c"
        class="cell"
        :class="{ 
          fixed: cell !== 0,
          'line-top': r % 3 === 0 && r !== 0,
          'line-left': c % 3 === 0 && c !== 0,
          'line-right': (c + 1) % 3 === 0 && c !== 8,
          'line-bottom': (r + 1) % 3 === 0 && r !== 8 
        }"
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
  display: flex;
  flex-direction: column;
  border: 4px solid #000;
}
.row {
  display: flex;
}
.cell {
  border: 1px solid #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  width: 40px;
  height: 40px;
}
.cell.fixed {
  font-weight: bold;
}
.cell.line-top {
  border-top: 2px solid #000;
}
.cell.line-left {
  border-left: 2px solid #000;
}
.cell.line-right {
  border-right: 2px solid #000;
}
.cell.line-bottom {
  border-bottom: 2px solid #000;
}
</style>
