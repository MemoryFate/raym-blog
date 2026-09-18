<template>
    <div class="board" role="grid" aria-label="数独棋盘">
        <button
            v-for="(cell,index) in flatPuzzle"
            :key="index"
            type="button"
            class="cell"
            :class="cellClass(index, cell)"
            :disabled="isFixed(index)"
            @click="select(index)"
        >
            {{ cell || "" }}
        </button>
    </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    puzzle: { type:Array, required:true },
    original: { type:Array, required:true },
    selected: { type:Object, default:null },
    conflicts: { type:Array, default:() => [] },
})

const emit = defineEmits(["select"])

const flatPuzzle = computed(() => props.puzzle.flat())

function rowCol(index) {
    return { row:Math.floor(index / 9), col:index % 9 }
}

function isFixed(index) {
    const { row, col } = rowCol(index)
    return props.original[row]?.[col] !== 0
}

function select(index) {
    if (isFixed(index)) return
    emit("select", rowCol(index))
}

function cellClass(index, value) {
    const { row, col } = rowCol(index)
    const selected = props.selected?.row === row && props.selected?.col === col
    const sameRow = props.selected?.row === row
    const sameCol = props.selected?.col === col
    const selectedValue = props.selected ? props.puzzle[props.selected.row]?.[props.selected.col] : 0
    const sameValue = value && selectedValue && value === selectedValue
    const conflict = props.conflicts.some(item => item.row === row && item.col === col)

    return {
        fixed:isFixed(index),
        selected,
        related:!selected && (sameRow || sameCol),
        "same-value":!selected && sameValue,
        conflict,
        "box-right":col === 2 || col === 5,
        "box-bottom":row === 2 || row === 5,
    }
}
</script>

<style scoped lang="scss">
.board{
    width:min(100%,560px);aspect-ratio:1;display:grid;grid-template-columns:repeat(9,1fr);
    overflow:hidden;border:2px solid var(--color-accent-primary);border-radius:18px;
    background:var(--color-bg-panel-strong);box-shadow:inset 0 0 36px color-mix(in srgb,var(--color-accent-primary) 7%,transparent);
}
.cell{
    display:grid;place-items:center;min-width:0;padding:0;border:0;border-right:1px solid color-mix(in srgb,var(--color-border-glow) 45%,transparent);
    border-bottom:1px solid color-mix(in srgb,var(--color-border-glow) 45%,transparent);
    color:var(--color-text-primary);background:color-mix(in srgb,var(--color-bg-panel) 82%,transparent);
    font:600 clamp(14px,3vw,22px)/1 "DM Sans",sans-serif;cursor:pointer;transition:background 120ms ease,color 120ms ease,box-shadow 120ms ease;
}
.cell:not(.fixed):hover{background:color-mix(in srgb,var(--color-chip-bg) 86%,var(--color-accent-primary) 14%)}
.cell.fixed{color:var(--color-text-primary);background:color-mix(in srgb,var(--color-bg-panel-strong) 92%,var(--color-text-primary) 8%);cursor:default}
.cell.related{background:color-mix(in srgb,var(--color-chip-bg) 72%,transparent)}
.cell.same-value{color:var(--color-accent-primary);background:color-mix(in srgb,var(--color-chip-bg) 82%,var(--color-accent-primary) 18%)}
.cell.selected{color:var(--color-accent-contrast);background:var(--color-accent-primary);box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--color-text-primary) 46%,transparent)}
.cell.conflict{color:#ffd4ca;background:color-mix(in srgb,#a83c4b 45%,var(--color-bg-panel-strong))}
.cell.box-right{border-right:2px solid color-mix(in srgb,var(--color-accent-primary) 68%,transparent)}
.cell.box-bottom{border-bottom:2px solid color-mix(in srgb,var(--color-accent-primary) 68%,transparent)}
.cell:disabled{opacity:1}
@media(prefers-reduced-motion:reduce){.cell{transition:none}}
</style>
