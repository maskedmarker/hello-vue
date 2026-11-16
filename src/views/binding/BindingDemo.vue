<template>
  <div>
    <h1>🔄 父子双向绑定（v-model）</h1>
    <p>父组件状态与子组件实时同步：修改任意一侧，另一侧立即更新</p>

    <!-- 方式一：经典 props + emit -->
    <section class="demo-section">
      <h2>方式一：props + emit（v-model 的本质）</h2>
      <p class="parent-value">
        父组件中的值：name = <code>{{ name }}</code>
        ｜ title = <code>{{ title }}</code>
      </p>
      <ClassicChild v-model="name" v-model:title="title" />
    </section>

    <!-- 方式二：defineModel -->
    <section class="demo-section">
      <h2>方式二：defineModel（Vue 3.4+ 推荐）</h2>
      <p class="parent-value">
        父组件：count = <code>{{ count }}</code>
        ｜ message = <code>{{ message }}</code>
        ｜ note = <code>{{ note }}</code>
      </p>
      <DefineModelChild
        v-model="count"
        v-model:message="message"
        v-model:note="note"
      />
      <div class="parent-actions">
        <button @click="count += 10">父组件内 count +10</button>
        <button @click="message = '来自父组件的问候 👋'">父组件修改 message</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ClassicChild from './ClassicChild.vue'
import DefineModelChild from './DefineModelChild.vue'

const name = ref('小明')
const title = ref('默认标题')
const count = ref(0)
const message = ref('你好，Vue！')
const note = ref('')
</script>

<style scoped>
.demo-section {
  margin: 20px auto;
  padding: 20px;
  max-width: 600px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: left;
}
.demo-section h2 {
  margin-top: 0;
  font-size: 18px;
}
.parent-value {
  font-size: 14px;
  margin-bottom: 12px;
}
code {
  padding: 2px 6px;
  background: #e8f5e9;
  color: #42b983;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
}
.parent-actions {
  margin-top: 12px;
}
button {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 4px 8px 0 0;
}
button:hover {
  background: #369e6f;
}
</style>
