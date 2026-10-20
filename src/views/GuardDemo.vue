<template>
  <div>
    <h1>🛡️ 路由守卫演示</h1>
    <p>本页面受路由守卫保护，尝试直接访问会被拦截并重定向</p>

    <div v-if="loggedIn">
      <p>✅ 您已登录</p>
      <button @click="logout">退出登录</button>
    </div>
    <div v-else>
      <p>❌ 未登录状态</p>
      <button @click="login">模拟登录</button>
    </div>

    <div class="guard-log">
      <h4>📋 路由守卫日志（控制台）</h4>
      <ul>
        <li v-for="(log, i) in logs" :key="i" :class="log.type">
          [{{ log.type }}] {{ log.msg }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, onBeforeRouteEnter, onBeforeRouteLeave } from 'vue-router'

const router = useRouter()
const loggedIn = ref(localStorage.getItem('vue3-demo-logged-in') === 'true')
const logs = ref([])

const log = (type, msg) => logs.value.unshift({ type, msg })

const login = () => {
  localStorage.setItem('vue3-demo-logged-in', 'true')
  loggedIn.value = true
  log('info', '用户点击登录')
  router.push('/guard-demo')
}

const logout = () => {
  localStorage.removeItem('vue3-demo-logged-in')
  loggedIn.value = false
  log('info', '用户退出登录')
  router.push('/')
}

onBeforeRouteEnter((to, from) => {
  log('enter', `进入 ${to.path}，来自 ${from.path}`)
})

onBeforeRouteLeave((to, from) => {
  log('leave', `离开 ${from.path}，前往 ${to.path}`)
})

onMounted(() => {
  log('mount', 'GuardDemo 组件挂载')
})
</script>

<style scoped>
.guard-log {
  margin-top: 20px;
  padding: 15px;
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 8px;
  font-family: monospace;
  text-align: left;
}
.guard-log ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.guard-log li {
  padding: 4px 0;
  font-size: 13px;
}
.guard-log li.info { color: #4fc3f7; }
.guard-log li.enter { color: #81c784; }
.guard-log li.leave { color: #ffb74d; }
button {
  padding: 8px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
