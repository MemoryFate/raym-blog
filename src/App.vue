<template>
    <div id="app">
        <Header />
        <Content>
            <router-view></router-view>
        </Content>
        <Footer />
    </div>
</template>

<script setup>
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
import Content from "./components/Content.vue"
</script>

<style>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

}
#app {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 1rem;
}
</style>
