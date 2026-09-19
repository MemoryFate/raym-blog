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
    overflow:hidden;border:2px solid var(--color-border-strong);border-radius:18px;
    background:var(--color-bg-raised);box-shadow:inset 0 0 36px color-mix(in srgb,var(--color-accent-primary) 7%,transparent);
}
.cell{
    display:grid;place-items:center;min-width:0;padding:0;border:0;border-right:1px solid color-mix(in srgb,var(--color-border-default) 58%,transparent);
    border-bottom:1px solid color-mix(in srgb,var(--color-border-default) 58%,transparent);
    color:var(--color-text-primary);background:color-mix(in srgb,var(--color-bg-panel) 82%,transparent);
    font:600 clamp(14px,3vw,22px)/1 "DM Sans",sans-serif;cursor:pointer;transition:background 120ms ease,color 120ms ease,box-shadow 120ms ease;
}
.cell:not(.fixed):hover{background:var(--color-bg-selected)}
.cell.fixed{color:var(--color-text-primary);background:color-mix(in srgb,var(--color-bg-raised) 92%,var(--color-text-primary) 8%);cursor:default}
.cell.related{background:var(--color-bg-control)}
.cell.same-value{color:var(--color-accent-primary);background:var(--color-bg-selected)}
.cell.selected{color:var(--color-text-primary);background:var(--color-bg-selected);box-shadow:inset 0 0 0 2px var(--color-border-strong),var(--shadow-selected)}
.cell.conflict{color:#ffd4ca;background:color-mix(in srgb,#a83c4b 45%,var(--color-bg-raised))}
.cell.box-right{border-right:2px solid color-mix(in srgb,var(--color-border-strong) 72%,transparent)}
.cell.box-bottom{border-bottom:2px solid color-mix(in srgb,var(--color-border-strong) 72%,transparent)}
.cell:disabled{opacity:1}
@media(prefers-reduced-motion:reduce){.cell{transition:none}}
</style>
