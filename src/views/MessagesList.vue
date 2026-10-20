<template>
  <div>
    <h3>💬 消息列表</h3>
    <ul>
      <li v-for="msg in messages" :key="msg.id">
        <router-link :to="`/user/${msg.fromId}`">
          [{{ msg.from }}] {{ msg.content }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const messages = ref([
  { id: 1, from: '张三', fromId: 1, content: '你好！' },
  { id: 2, from: '李四', fromId: 2, content: 'Vue3 真好用！' },
  { id: 3, from: '王五', fromId: 3, content: '期待更多更新' }
])
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
