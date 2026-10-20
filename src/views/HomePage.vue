<template>
  <div>
    <h1>🏠 首页</h1>
    <p>Vue3 路由演示项目</p>
    <p>使用 Vite + Composition API</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('[HomePage] 组件已挂载')
})
</script>
