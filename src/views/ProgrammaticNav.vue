<template>
  <div>
    <h1>🧭 编程式导航</h1>
    <p>不通过 <code>&lt;router-link&gt;</code> 手动控制路由跳转</p>
    
    <div class="demo-section">
      <h3>push / replace</h3>
      <button @click="pushHome">push('/')</button>
      <button @click="pushUser1">push('/user/1')</button>
      <button @click="pushWithQuery">push('/user/2?tab=profile')</button>
      <button @click="replaceNamed">replace by name('home')</button>
    </div>

    <div class="demo-section">
      <h3>go / back</h3>
      <button @click="goBack">go(-1) 后退</button>
      <button @click="goForward">go(1) 前进</button>
      <button @click="goRoot">go(-99) 回首页</button>
    </div>

    <div class="demo-section">
      <h3>导航历史</h3>
      <p>history.length: {{ historyLength }}</p>
      <p>当前索引: {{ currentIndex }}</p>
      <ul>
        <li v-for="(h, i) in history" :key="i" :class="{ current: i === currentIndex }">
          {{ i + 1 }}. {{ h }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const router = useRouter()
const historyLength = ref(0)
const currentIndex = ref(0)
const history = ref([])

const pushHome = () => router.push('/')
const pushUser1 = () => router.push('/user/1')
const pushWithQuery = () => router.push('/user/2?tab=profile')
const replaceNamed = () => router.replace({ name: 'home' })
const goBack = () => router.go(-1)
const goForward = () => router.go(1)
const goRoot = () => router.go(-99)

onMounted(() => {
  historyLength.value = window.history.length
  // 监听 popstate 手动追踪索引（简化演示）
  window.addEventListener('popstate', updateHistory)
  updateHistory()
})

const updateHistory = () => {
  currentIndex.value = window.history.state?.index ?? 0
  history.value = []
  for (let i = 0; i < window.history.length; i++) {
    history.value.push(`session entry ${i + 1}`)
  }
}

onBeforeRouteLeave(() => {
  window.removeEventListener('popstate', updateHistory)
})
</script>

<style scoped>
.demo-section {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}
button {
  margin: 5px;
  padding: 8px 12px;
  cursor: pointer;
  border: 1px solid #42b983;
  background: white;
  border-radius: 4px;
  transition: background 0.2s;
}
button:hover {
  background: #e8f5e9;
}
ul {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}
li {
  padding: 4px 0;
}
li.current {
  font-weight: bold;
  color: #42b983;
}
code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
