<template>
  <div class="child-box">
    <h3>👶 子组件（props + emit）</h3>
    <p class="child-value">
      子组件收到：modelValue = <code>{{ modelValue }}</code>
      ｜ title = <code>{{ title }}</code>
    </p>

    <label for="classic-name">modelValue（v-model）：</label>
    <input
      id="classic-name"
      :value="modelValue"
      placeholder="在子组件中输入…"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <label for="classic-title">title（v-model:title）：</label>
    <input
      id="classic-title"
      :value="title"
      placeholder="编辑标题…"
      @input="$emit('update:title', $event.target.value)"
    />

    <p class="hint">
      💡 v-model 的本质：父组件写
      <code>v-model="name"</code> 会被编译为
      <code>:model-value="name" @update:model-value="name = $event"</code>；
      <code>v-model:title="title"</code> 同理编译为
      <code>:title="title" @update:title="title = $event"</code>
    </p>
  </div>
</template>

<script setup>
// 子组件声明多个 prop 接收父组件数据，
// 每个 v-model:xxx 对应「一个 prop + 一个 update:xxx 事件」，
// 子组件通过事件回传修改，从而形成双向绑定（单向数据流 + 事件回调）
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})
defineEmits(['update:modelValue', 'update:title'])
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
.child-value {
  font-size: 14px;
  margin-bottom: 10px;
}
label {
  display: block;
  margin: 10px 0 4px;
  font-size: 13px;
  color: #555;
}
input {
  width: 100%;
  box-sizing: border-box;
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
.hint {
  margin: 10px 0 0;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}
</style>
