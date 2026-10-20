<template>
  <div>
    <h3>📰 新闻列表</h3>
    <ul>
      <li v-for="news in newsList" :key="news.id">
        <router-link :to="`/user/${news.authorId}`">
          {{ news.title }} - 作者: {{ news.author }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const newsList = ref([
  { id: 1, title: 'Vue3.4 正式发布', author: '张三', authorId: 1 },
  { id: 2, title: 'Vite 5.0 新特性一览', author: '李四', authorId: 2 },
  { id: 3, title: ' Composition API 最佳实践', author: '王五', authorId: 3 }
])

onMounted(() => {
  console.log('[NewsList] 挂载，来源路由:', route.from?.path || '直接访问')
})
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 8px;
  border-bottom: 1px solid #eee;
}
</style>
