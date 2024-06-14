<template>
    <header>
        <h1>{{ props.title }}</h1>
    </header>
</template>
<script setup>
import { defineProps } from "vue"
const props = defineProps({
    title: {
        type: String,
        default: "Blog",
    },
})
</script>
<style scoped>
header {
    background-color: #333;
    color: #fff;
    text-align: center;
    line-height: 60px;
}
</style>
