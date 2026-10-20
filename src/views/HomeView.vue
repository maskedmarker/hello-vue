<template>
  <div>
    <h1>📁 主页（嵌套路由父级）</h1>
    <nav>
      <router-link :to="{ name: 'news' }">📰 新闻列表</router-link> |
      <router-link :to="{ name: 'messages' }">💬 消息列表</router-link>
    </nav>
    <hr />
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { onBeforeRouteEnter, onBeforeRouteUpdate } from 'vue-router'

onMounted(() => {
  console.log('[HomeView] 父级组件已挂载')
})

// 组件内守卫：路由进入前
onBeforeRouteEnter((to, from) => {
  console.log('[HomeView onBeforeRouteEnter] 即将进入:', to.path)
})

// 组件内守卫：路由参数更新时（如同路由的子路由切换）
onBeforeRouteUpdate((to, from) => {
  console.log('[HomeView onBeforeRouteUpdate] 路由参数变化:', from.path, '->', to.path)
})
</script>

<style scoped>
nav {
  margin: 15px 0;
}
nav a {
  margin: 0 10px;
  color: #42b983;
}
</style>
