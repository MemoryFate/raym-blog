<template>
    <a-card title="字符串生成" class="content">
       
    </a-card>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue"

const { proxy, emit } = getCurrentInstance()
const data = reactive({
    input:'',
    output:''
})
</script>
<style lang="scss" scoped>
.content {
    display: flex;
    flex-direction: column;
}
</style>
