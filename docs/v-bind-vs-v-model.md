# `v-bind` 与 `v-model` — 单向绑定与双向绑定的语法糖

## 一、核心结论

**`v-bind` 是单向属性绑定指令；`v-model` 不是独立指令，而是"v-bind + 事件监听"组合出来的双向绑定语法糖。**

- `v-bind`（简写 `:`）：把属性值绑定到 JS 表达式，数据变化 → 属性跟着变，**只有下行**；
- `v-model`：编译后变成「一条属性绑定 + 一条事件监听」，数据下行、修改上行，**双向同步**；
- `v-model` 并不违反单向数据流——它底层仍然是"绑定数据进来 + 发事件请求修改"。

---

## 二、v-bind：单向属性绑定

### 简写与字面量对比

```html
<input value="modelValue" />   <!-- 字面量：显示字符串 "modelValue" -->
<input :value="modelValue" />  <!-- 绑定：显示 modelValue 变量的实际值 -->
```

`:` 是 `v-bind` 的简写，`v-bind:属性名="表达式"` 表示该属性的值是一个要计算的 JS 表达式，而非字面字符串。

### 特点

- **单向**：JS 数据变化 → 属性更新；用户在 DOM 上的修改不会反向写回数据；
- **通用**：可以绑定任意属性（`href`、`disabled`…）、`class`、`style`，以及组件 prop；
- **无参数形式**：`v-bind="obj"` 可一次性绑定一个对象里的所有键。

---

## 三、v-model：双向绑定的语法糖

### 在原生表单元素上

```html
<input v-model="msg" />   <!-- 编译为 -->
<input :value="msg" @input="msg = $event.target.value" />
```

即 `:value`（v-bind 下行）+ `@input`（v-on 上行）的组合。不同表单元素编译出的属性/事件不同：checkbox 用 `checked` + `change`，select 用 `value` + `change`。

### 在组件上

```html
<ClassicChild v-model="name" />   <!-- 编译为 -->
<ClassicChild :model-value="name" @update:model-value="name = $event" />
```

组件上的 `v-model` 默认对接 prop `modelValue` + 事件 `update:modelValue`；`v-model:title` 则对接 prop `title` + 事件 `update:title`（具名 model）。

本项目 [ClassicChild.vue](../src/views/binding/ClassicChild.vue) 正是手写了这组编译结果：

```html
<input
  :value="modelValue"
  @input="$emit('update:modelValue', $event.target.value)"
/>
```

### 修饰符

- `.lazy`：改为 `change` 事件触发（失焦/回车时才更新，而非每次输入）；
- `.number`：自动 `parseFloat` 转成数字；
- `.trim`：自动去除首尾空格。

---

## 四、区别对照表

| | `v-bind`（`:xxx`） | `v-model` |
|---|---|---|
| 方向 | 单向（JS → DOM） | 双向（JS ⇄ DOM） |
| 本质 | 属性绑定指令 | 语法糖：属性绑定 + 事件监听 |
| 编译结果 | 只有属性绑定 | `:value` + `@input`（原生元素）/ `:model-value` + `@update:model-value`（组件） |
| 使用场景 | 任意属性、任意值 | 表单输入、父子双向通信 |
| 数据流 | 下行 | 下行 + 上行（仍符合单向数据流） |

---

## 五、常见疑问

**Q：v-model 双向绑定不是违反单向数据流吗？**
不违反。它只是语法糖，展开后仍是"props 下行 + 事件上行"两条单向通道，没有谁绕过父组件直接改数据。详见 [defineProps / defineEmits 文档](./define-props-emits.md)。

**Q：能在同一个 input 上同时写 `:value` 和 `v-model` 吗？**
不能。`v-model` 本身就包含了 `:value` 的绑定，重复绑定同一属性会产生冲突。

**Q：v-bind 自己能实现双向吗？**
不能。`v-bind` 只管绑定，要双向必须再配一条 `@input`/`@update:xxx` 事件监听——而这两者组合起来就是 `v-model`。

**Q：`:value` 绑定的是 DOM 属性还是 HTML attribute？**
对表单元素而言绑定的是 DOM property（输入框的当前值），这也解释了为什么不用 `:value` 配合事件时，输入框显示会与数据脱节。

---

## 六、小结

- `v-bind`（简写 `:`）是单向属性绑定，通用指令，数据只下行。
- `v-model` 是双向绑定的语法糖，编译为「一条绑定 + 一条事件」，不违反单向数据流。
- 原生元素上 `v-model` = `:value` + `@input`；组件上 = `:model-value` + `@update:model-value`（具名形式换名字即可）。
- 记忆点：冒号 `:` 管绑定，`@` 管事件，`v-model` 把这两件事打包。

相关示例：[父子双向绑定演示](../src/views/binding/BindingDemo.vue) ｜ [defineProps / defineEmits](./define-props-emits.md)
