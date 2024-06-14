<template>
    <Header />
    <Content>
        <router-view></router-view>
    </Content>
    <Footer />
</template>

<script setup>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import Content from "@/components/Content.vue"
</script>