<template>
    <a-layout class="layout">
        <a-layout-header class="layout-header">
            <div class="logo">RayM</div>
        </a-layout-header>
        <a-layout-content class="layout-content">
            <router-view></router-view>
        </a-layout-content>
        <a-layout-footer class="layout-footer">
            <div>RayM®</div>
        </a-layout-footer>
    </a-layout>
</template>

<script setup></script>
<style lang="scss" scoped>
.logo {
    float: left;
    width: 80px;
    color: white;
    text-align: center;
    background: rgba(255, 255, 255, 0.3);
    line-height: 44px;
}

.layout {
    margin: 0 auto;
    background-image: url("@/assets/background.jpg");
    background-position: 0 0;
    background-repeat: repeat-x;
    background-size: cover;

    .layout-header {
        height: 44px;
    }
    .layout-content {
        margin: 0 auto;
        min-width: 900px;
        width: 80vw;
        padding: 20px;
        min-height: calc(100vh - 88px);
    }
    .layout-footer {
        padding: 0 20px;
        height: 44px;
        display: flex;
        align-items: center;
    }
}
</style>
