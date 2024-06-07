<template>
    <article>
        <h3>{{ title }}</h3>
        <p>{{ summary }}</p>
        <router-link :to="`/post/${id}`">Read more</router-link>
    </article>
</template>

<script setup>
import { ref } from "vue"
defineProps({
    title: {
        type: String,
        defaultValue: "标题",
    },
    summary: {
        type: String,
        defaultValue: "内容",
    },
    id: {
        type: String,
    },
})
</script>

<style scoped>
article {
    background-color: #fff;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
