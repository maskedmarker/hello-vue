# `defineProps` / `defineEmits` — 组件对外声明的两个接口

## 一、核心结论

**组件是孤立的。** Vue 组件的模板和逻辑运行在自己的作用域里，父组件的数据不会自动"流入"，子组件的修改也不会自动"流出"。`defineProps` / `defineEmits` 就是子组件对外声明的两个接口，分别定义数据怎么进来、修改请求怎么出去：

```
父组件 ── props（数据下行）──────────→ 子组件
父组件 ←── emit 事件（修改请求上行）── 子组件
```

这就是 Vue 的**单向数据流**设计：数据通过 props 向下传，修改通过事件向上请求。两个通道都必须是显式声明的，否则数据流就不可预测。

---

## 二、defineProps：声明"我能接收什么"

没有它，父组件传下来的数据子组件拿不到——模板里的 `{{ modelValue }}` 只是未定义变量，传入的值会全部堆进 `$attrs`。

声明后，Vue 把父组件传下来的值变成子组件里可直接使用的变量，并且支持类型校验、默认值、required 等约束。

`src/views/binding/ClassicChild.vue`：

```js
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
```

模板中直接以 prop 名使用：`{{ modelValue }}`、`{{ title }}`。

---

## 三、defineEmits：声明"我会触发什么事件"

### 为什么子组件不能直接改 prop？

这是**单向数据流**原则：props 是父组件"借"给子组件的数据，子组件只读。要修改，必须发事件让父组件自己改。好处：

- 数据流可预测：改一个数据只会走"子组件发事件 → 父组件改状态 → 新状态沿 props 流回"这一条路；
- 父子解耦：父组件想监听就监听，不想监听也不受影响。

### 声明事件的三个作用

1. **让父组件能监听。** `v-model` 编译后正是"prop 下行 + 事件上行"，父组件写 `v-model="name"` 等价于 `:model-value="name" @update:model-value="name = $event"`——这个 `@update:model-value` 能生效，前提就是子组件声明了这个事件；
2. **区分自定义事件与原生事件。** Vue 3 里未声明的事件会被透传到根元素当成原生 DOM 事件处理，声明后 Vue 才知道这是组件自己的事件；
3. **获得 IDE 补全和类型提示。** `<script setup>` 里 `$emit` 也基于它工作。

```js
defineEmits(['update:modelValue', 'update:title'])
```

模板中触发：`$emit('update:modelValue', $event.target.value)`。

---

## 四、与 v-model / defineModel 的关系

### v-model 的编译本质

| 父组件写法 | 编译结果 |
|---|---|
| `v-model="name"` | `:model-value="name"` + `@update:model-value="name = $event"` |
| `v-model:title="title"` | `:title="title"` + `@update:title="title = $event"` |

所以一个 `v-model:xxx` 在子组件里恰好对应「一个 prop `xxx` + 一个事件 `update:xxx`」，必须成对声明，缺一个双向绑定就断了。

### defineModel 就是自动打包这两件事

`src/views/binding/DefineModelChild.vue`：

```js
const message = defineModel('message', { default: '' })
```

`defineModel('message')` 自动生成 prop `message` + 事件 `update:message`，再封装成一个可读写的 ref。因此 `defineModel` 与手写 defineProps + defineEmits 完全等价，只是省掉样板代码：

- 无参 `defineModel()` 等价于 `defineModel('modelValue')`，对应 `v-model`；
- 入参是 model 的名字（`v-model:` 冒号后的部分），与任何一方的变量名无关。

---

## 五、常见疑问

**Q：defineProps / defineEmits 为什么不需要 import？**
它们是**编译宏**，由编译器在 `<script setup>` 里直接处理，不是运行时 API。同理还有 `defineModel`、`defineExpose`、`defineOptions` 等。

**Q：事件必须事先声明才能用吗？**
`$emit` 未声明的事件在 Vue 3 中也能触发，但会被当成原生事件透传到根元素上，容易出问题，所以一律先声明。

**Q：为什么不用 props 传函数回调来代替事件？**
技术上可行，但事件是官方约定的上行通道：`v-model`、`@xxx` 模板语法、devtools 事件面板等都基于它，统一走事件更规范、可维护。

---

## 六、小结

- 组件是孤立的，数据不自动流入/流出；defineProps / defineEmits 是子组件对外的两个显式接口。
- defineProps 声明"能接收什么"：父组件数据 → 子组件可用变量，附带类型校验与默认值。
- defineEmits 声明"会触发什么"：子组件修改请求 → 父组件处理，维持单向数据流。
- 一个 `v-model:xxx` = prop `xxx` + 事件 `update:xxx`，成对出现。
- `defineModel` 是二者的自动打包，与手写完全等价。

相关示例：[父子双向绑定演示](../src/views/binding/BindingDemo.vue)
