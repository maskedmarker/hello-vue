<template>
  <div>
    <h1>📁 主页（嵌套路由父级）</h1>
    <nav>
      <router-link :to="{ name: 'news' }" custom v-slot="{ navigate, isActive }">
        <button :class="{ active: isActive }" @click="navigate">📰 新闻列表</button>
      </router-link> |
      <router-link :to="{ name: 'messages' }" custom v-slot="{ navigate, isActive }">
        <button :class="{ active: isActive }" @click="navigate">💬 消息列表</button>
      </router-link>
    </nav>
    <hr />
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

onMounted(() => {
  console.log('[HomeView] 父级组件已挂载')
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
nav button {
  margin: 0 10px;
  color: #42b983;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
}
nav button.active {
  color: #2c3e50;
}
</style>
