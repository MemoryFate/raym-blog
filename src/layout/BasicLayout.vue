<template>
    <a-layout class="layout">
        <a-layout-header class="layout-header">
            <div class="logo">RayM</div>
        </a-layout-header>
        <a-layout-content class="layout-content">
            <div class="layout-content-div">
                <router-view></router-view>
            </div>
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
    min-width: 1400px;
    width: 100vw;

    .layout-header {
        height: 44px;
    }
    .layout-content {
        margin: 0 auto;
        padding: 20px;
        min-height: calc(100vh - 88px);
        width: 100%;
        background-image: url("@/assets/background.jpg");
        background-position: 0 0;
        background-repeat: repeat-x;
        background-size: cover;
        display: flex;
        flex-direction: column;
        align-items: center;

        .layout-content-div {
            width: 80vw;
            min-width: 800px;
        }
    }
    .layout-footer {
        padding: 0 20px;
        height: 44px;
        display: flex;
        align-items: center;
    }
}
</style>
