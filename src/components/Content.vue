<template>
    <article>
        <slot />
    </article>
</template>

<script setup>
</script>

<style scoped>
article {
    height: calc(100vh - 120px);
    overflow: scroll;
    background-color: #fff;
    padding: 1rem;
    border-radius: 5px;
    box-sizing: border-box;
}
article::-webkit-scrollbar {
    display: none;
}
</style>
