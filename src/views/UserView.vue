<template>
  <div>
    <h1>👤 用户详情</h1>
    <p>当前用户 ID: <strong>{{ route.params.id }}</strong></p>
    <p>完整路由信息: <code>{{ JSON.stringify(route.params) }}</code></p>
    <p>当前路径: <code>{{ route.path }}</code></p>
    <p>全路径（含查询）: <code>{{ route.fullPath }}</code></p>
    <button @click="goToUser(parseInt(route.params.id) + 1)">下一个用户</button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onBeforeRouteUpdate } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 动态路由参数变化时触发
onBeforeRouteUpdate(async (to, from) => {
  console.log(`[UserView] 用户 ID 变化: ${from.params.id} -> ${to.params.id}`)
})

const goToUser = (id) => {
  router.push(`/user/${id}`)
}
</script>

<style scoped>
button {
  margin-top: 15px;
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
