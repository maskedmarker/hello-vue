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

    <details class="attrs-view">
      <summary>🔍 未声明的 prop 去哪了？查看 $attrs</summary>
      <pre>{{ $attrs }}</pre>
      <p class="hint">
        只有 defineProps / defineEmits 声明过的 prop 和事件会被"消费"，
        其余传入的东西（如 <code>v-model:X</code> 编译出的 <code>X</code>
        和 <code>update:X</code>）都留在 $attrs 里，
        并默认透传到根元素上（可用 inheritAttrs: false 关闭）。
      </p>
    </details>
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
.attrs-view {
  margin-top: 12px;
  font-size: 13px;
}
.attrs-view summary {
  cursor: pointer;
  color: #42b983;
  font-weight: bold;
}
.attrs-view pre {
  margin: 8px 0;
  padding: 10px;
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
