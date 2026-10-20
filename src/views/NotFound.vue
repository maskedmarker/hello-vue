<template>
  <div>
    <h2>😕 404 - 页面未找到</h2>
    <p>当前路径: <code>{{ route.path }}</code></p>
    <p>抱歉，您访问的页面不存在。</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>
div {
  text-align: center;
  padding: 40px;
}
a {
  color: #42b983;
}
code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
