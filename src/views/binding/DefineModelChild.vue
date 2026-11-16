<template>
  <div class="child-box">
    <h3>👶 子组件（defineModel）</h3>

    <p class="row">
      <span>count（v-model）：</span>
      <code>{{ count }}</code>
      <button @click="count--">-1</button>
      <button @click="count++">+1</button>
    </p>

    <p class="row">
      <span>message（v-model:message）：</span>
      <input v-model="message" placeholder="子组件内编辑 message" />
    </p>

    <p class="row">
      <span>note（带 set 转换）：</span>
      <input v-model="note" placeholder="输入带空格的文本试试" />
    </p>

    <p class="hint">
      💡 defineModel 自动生成对应的 prop 和 update:xxx 事件，
      子组件内直接读写即可双向绑定，无需手写 props/emits。
    </p>
  </div>
</template>

<script setup>
// 默认 model：对应父组件的 v-model="count"
const count = defineModel({ required: true })

// 具名 model：对应父组件的 v-model:message
const message = defineModel('message', { default: '' })

// 带转换器的 model：set 会在写回父组件前处理值（去除首尾空格）
const note = defineModel('note', {
  default: '',
  get: (raw) => raw,
  set: (local) => local.trim()
})
</script>

<style scoped>
.child-box {
  padding: 15px;
  border: 1px dashed #42b983;
  border-radius: 8px;
}
.child-box h3 {
  margin-top: 0;
  font-size: 16px;
}
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin: 10px 0;
  font-size: 14px;
}
input {
  flex: 1;
  min-width: 150px;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
input:focus {
  outline: none;
  border-color: #42b983;
}
code {
  padding: 2px 6px;
  background: #e8f5e9;
  color: #42b983;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
}
button {
  padding: 6px 12px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #369e6f;
}
.hint {
  margin: 10px 0 0;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}
</style>
