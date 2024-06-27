<template>
    <a-layout class="layout">
        <a-layout-header>
            <div class="logo">RayM Blog</div>
        </a-layout-header>
        <a-layout-content class="layout-content">
            <router-view></router-view>
        </a-layout-content>
        <a-layout-footer> 2024 RayM Blog </a-layout-footer>
    </a-layout>
</template>

<script setup></script>
<style lang="scss" scoped>
.logo {
    float: left;
    width: 120px;
    color: white;
    text-align: center;
    background: rgba(255, 255, 255, 0.3);
}

.layout {
    width: 1000px;
    margin: 0 auto;

    .layout-content {
        padding: 20px;
        min-height: 80vh;
    }
}
</style>
