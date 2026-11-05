# `<router-link>` 渲染机制与自定义渲染

`<router-link>` 是 vue-router 提供的全局组件 `RouterLink`，用于声明式导航。本文档说明它最终渲染成什么 HTML 元素、激活状态如何生效，以及如何渲染成任意自定义元素。

## 一、默认渲染成 `<a>` 标签

默认情况下，`<router-link>` 渲染为一个普通的 `<a>` 元素，`to` 会被解析成真实路径写入 `href`。

`to` 支持两种写法，都会被解析成完整路径：

```html
<!-- 字符串形式 -->
<router-link to="/user/1">用户1</router-link>

<!-- 对象形式（可带 name / params / query） -->
<router-link :to="{ name: 'news' }">新闻列表</router-link>
```

本项目 [App.vue](src/App.vue) 中的写法渲染后（以 `/user/1` 为例）：

```html
<a href="/user/1" class="">用户1</a>
```

## 二、激活状态：自动添加类名与 aria 属性

当前路由与 `to` 匹配时，RouterLink 会自动给 `<a>` 添加：

- `router-link-active`：目标路由是当前路由（或其父级）时添加；
- `router-link-exact-active`：与当前路由**完全匹配**时添加；
- `aria-current="page"`：精确匹配时添加，便于无障碍访问。

本项目 [App.vue:37-39](src/App.vue#L37-L39) 的样式就是靠这个类生效的：

```css
nav a.router-link-active {
  color: #2c3e50;
}
```

## 三、点击行为被拦截

虽然渲染成了 `<a href="...">`，但 RouterLink 内部监听了 `click` 事件并拦截浏览器默认行为（整页跳转），改为调用 `router.push(...)`（`replace` 属性为真时调用 `router.replace(...)`），实现无刷新导航。

> 这背后正是浏览器 History API 的 `pushState`，详见 [Vue Router 与浏览器核心 API](./vue-router.md) 第二节。

## 四、渲染成任意元素：`custom` + 作用域插槽

给 `<router-link>` 加上 `custom` 属性后，它**不再渲染 `<a>`**，而是通过作用域插槽把导航能力交给你，由你决定渲染什么元素。

插槽暴露的属性：

| 属性 | 说明 |
|------|------|
| `href` | 解析后的目标 URL |
| `route` | 解析后的目标 route 对象 |
| `navigate` | 触发导航的函数（内部即 `router.push`） |
| `isActive` | 是否处于激活状态（对应 `router-link-active`） |
| `isExactActive` | 是否精确匹配（对应 `router-link-exact-active`） |

### 项目实例：把链接渲染成 `<button>`

[HomeView.vue:5-10](src/views/HomeView.vue#L5-L10)：

```html
<router-link :to="{ name: 'news' }" custom v-slot="{ navigate, isActive }">
  <button :class="{ active: isActive }" @click="navigate">📰 新闻列表</button>
</router-link>
```

说明：

- 最终 DOM 中是 `<button>`，没有 `<a>`，也不会有 `href`；
- `@click="navigate"` 绑定插槽提供的导航函数，点击后仍是无刷新跳转；
- `isActive` 替代了默认的激活类，需要自己把状态落到元素上（本例绑定为 `active` 类，配合同名 CSS 样式）。

### 适合用 `custom` 的场景

- 语义/样式上必须是 `<button>`、`<li>` 等非 `<a>` 元素（如菜单项、标签页）；
- 需要完全自定义激活态的视觉呈现；
- 只需导航能力、不需要链接语义（如 `<div>` 卡片整体可点）。

## 五、两种用法对比

| | 默认用法 | `custom` + 插槽 |
|---|---|---|
| 渲染结果 | `<a href>` | 任意自定义元素 |
| 激活类名 | 自动加 `router-link-active` 等 | 手动用 `isActive` 控制 |
| `aria-current` | 自动 | 需手动添加 |
| 适用场景 | 常规导航链接 | 按钮、菜单项等特殊元素 |

## 六、小结

- 默认渲染成 `<a>` 标签，`to`（字符串或对象）解析为 `href`；
- 激活时自动加 `router-link-active` / `router-link-exact-active` 类；
- 点击默认行为被拦截，内部走 `router.push`，页面不刷新；
- 加 `custom` 后不渲染 `<a>`，通过 `href` / `navigate` / `isActive` / `isExactActive` 插槽属性渲染成任意元素（本项目 HomeView 中渲染成了 `<button>`）。

相关文档：

- [`<router-view />` 渲染机制](./router-view.md)
- [Vue Router 与浏览器核心 API](./vue-router.md)
- [命名视图不渲染 — 错误分析与排查记录](./named-view-debug.md)
