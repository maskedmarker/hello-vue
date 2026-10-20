# Vue Router 与浏览器核心 API

本文档说明 Vue Router（基于 [`vue-router@4.6.4`](https://router.vuejs.org/zh/)）使用到的浏览器核心方法，以及如何基于这些方法构建出完整的 SPA 路由功能。

## 一、整体思路

传统多页应用（MPA）每次页面跳转都向服务器重新请求 HTML，浏览器会触发 `window.location.href` 变化、刷新整个文档，URL 也会改变。

SPA（单页应用）只加载一次 HTML，之后所有"页面切换"都在浏览器端完成，由 JavaScript 接管用户 URL 与视图渲染。Vue Router 的核心使命就是：**在不真正刷新页面的前提下，让 URL 与 UI 始终保持同步**。

要实现这一点，必须依赖浏览器提供的一组 History / Location / Event 核心 API。

---

## 二、Vue Router 用到的浏览器核心方法

### 1. `history.pushState()` — 加入新历史记录

```js
window.history.pushState(state, title, url)
```

- **作用**：向浏览器历史栈压入一条新记录，地址栏 URL 变化，但**不触发页面刷新**。
- **Vue Router 中**：调用 `router.push('/user/1')` 时，vue-router 内部会调用 `pushState` 把 `/user/1` 入栈。
- **SPA 必需性**：如果不调用 `pushState`，仅靠 hash 方案（或纯 JS 改状态）也能模拟跳转，但无法使用 URL 美化模式（`createWebHistory`），且无法在浏览器历史中保留前向/后向状态。

### 2. `history.replaceState()` — 替换当前历史记录

```js
window.history.replaceState(state, title, url)
```

- **作用**：覆盖当前历史条目，URL 变化但**历史长度不变**（无法用浏览器"后退"按钮回到被替换前的状态）。
- **Vue Router 中**：`router.replace(...)` 调用此 API。常用于"重定向"或"登录后不应回退到登录页"的场景。
- **典型用法**：
  - 路由 `redirect` 配置（重定向 `/` → `/home`）
  - 守卫中返回 `'/login'` 时的跳转
  - 404 → 真实页面，避留下访问 404 的痕迹

### 3. `popstate` 事件 — 监听用户前进 / 后退

```js
window.addEventListener('popstate', (event) => { ... })
```

- **作用**：浏览器在执行 `history.back()` / `history.forward()` / 浏览器前进后退按钮 / `history.go(n)` 时触发；`event.state` 即当初 `pushState` 时传入的 state。
- **Vue Router 中**：vue-router 在初始化时全局注册 `popstate` 监听。当用户点击浏览器"后退"按钮，浏览器自动调用 `history.back()` 切到上一个 URL，触发该事件，vue-router 再根据新 URL 重新匹配路由并替换视图。
- **注意**：`popstate` **不会**在 `pushState` / `replaceState` 时主动触发——所以 vue-router 必须自己手动调用这两个 API 后同步内部状态。

### 4. `location` 对象 — URL 解析来源

```js
window.location.pathname   // '/user/1'
window.location.search     // '?tab=profile'
window.location.hash       // '#section'
window.location.href       // 完整 URL
```

- **Vue Router 中**：`createWebHistory()` 在初始化时会读取 `location.pathname + location.search + location.hash` 来解析首屏 URL（直接访问 `/user/2` 时，刷新仍需恢复该视图）。
- **守卫中的 `from.path`**：vue-router 拦截路由切换时，会基于被中断的 URL 构造一个 `route` 对象暴露给守卫。

### 5. `history.state` — 关联自定义状态

```js
history.pushState({ key: 'abc123' }, '', '/user/1')
console.log(history.state) // { key: 'abc123', ... }
```

- **作用**：每个历史条目可绑定一个 `state` 对象（≤ 640KB，序列化存储）。
- **Vue Router 中**：vue-router 为每条历史记录生成一个 `key`（内部递增），写入 `history.state`。这样在 `popstate` 触发后，vue-router 能区分"前进"与"后退"，从而正确还原滚动位置（参见本文档 _七、其他_ 节）。

### 6. `addEventListener` / `removeEventListener` — 事件订阅

- Vue Router 通过订阅 `popstate` 来同步 URL → 视图。
- 在组件内则通过 Vue 的生命周期（`onMounted`、`onBeforeUnmount`）订阅/解绑，更细粒度。
- 本项目 `src/views/ProgrammaticNav.vue` 中演示了同样的模式：

  ```js
  onMounted(() => {
    window.addEventListener('popstate', updateHistory)
  })
  ```

### 7. `<a>` 元素的默认行为 — 拦截

- **浏览器默认行为**：点击 `<a href="/user/1">` 会触发整页跳转（页面刷新）。
- **Vue Router 中**：`RouterLink` 组件内部渲染成 `<a>`，但绑定 `@click` 拦截默认行为，改为调用 `router.push(...)` 或 `router.replace(...)`，从而避免刷新。

### 8. `scrollTo()` — 滚动恢复

```js
window.scrollTo(0, savedY)
```

- 用户在 `/user/1` 滚动到位置 1000 后切到 `/user/2`，vue-router 会保存当前滚动位置；用户从 `/user/2` 后退回 `/user/1` 时，调用 `scrollTo` 还原位置 1000。
- 即：`createWebHistory()` 默认启用 `scrollBehavior`，基于 `sessionStorage` 存储滚动位置。

---

## 三、两种 History 模式对比

Vue Router 4 提供两种历史栈 API 实现：

| | `createWebHashHistory()` | `createWebHistory()` |
|---|---|---|
| 实现原理 | 监听 `hashchange` + `location.hash` | 监听 `popstate` + `pushState/replaceState` |
| URL 形式 | `https://x.com/#/user/1` | `https://x.com/user/1` |
| 浏览器兼容 | IE 及所有老浏览器 | IE10+ |
| 服务器配置 | **不需要**（hash 不发送到服务器） | **需要**所有路径都返回 `index.html`（SPA fallback） |
| 推荐的 history scroll 还原 | 弱 | 强（搭配 `scrollBehavior`） |

本项目使用的是 **`createWebHistory()`**（见 `src/router/index.js`），由 `pushState` / `replaceState` + `popstate` 提供支撑。

---

## 四、完整流程：从用户点击链接到视图更新

```
用户点击 <router-link to="/user/1">
   │
   ▼
RouterLink @click 拦截默认行为
   │
   ▼
router.push('/user/1')
   │
   ▼
vue-router 匹配路由 → 得到目标 route 对象
   │
   ▼
执行守卫链:
  beforeRouteLeave (旧组件) → beforeEach (全局) → beforeEnter (路由) → onBeforeRouteUpdate (新组件)
   │
   ▼ (全部返回 true / 未定义)
history.pushState(state, '', '/user/1')  ◀───── ★★★ 浏览器核心 API
   │
   ▼
渲染新组件到 <router-view />
   │
   ▼
afterEach (全局) → DOM 更新完成
```

当用户按浏览器"后退"按钮：

```
history.back()  (浏览器内置)
   │
   ▼
popstate 事件触发   ◀───── ★★★ 浏览器核心 API
   │
   ▼
vue-router 读取新 URL → 匹配路由 → 执行守卫 → 替换 <router-view>
```

---

## 五、编程式导航背后发生了什么

`router.push` 与 `router.replace` 本质区别就是分别调用 `pushState` 与 `replaceState`：

| API | 调用的浏览器底层方法 | 历史栈变化 |
|-----|---------------------|------------|
| `router.push('/x')` | `history.pushState(state, '', '/x')` | 压栈（可后退） |
| `router.replace('/x')` | `history.replaceState(state, '', '/x')` | 替换（不可后退） |
| `router.go(n)` | `history.go(n)` | 用户/前进/后退 |
| `router.back()` | `history.back()` | 后退一步 |
| `router.forward()` | `history.forward()` | 前进一步 |

本项目 `src/views/ProgrammaticNav.vue` 中所有按钮演示了上述 API。

---

## 六、路由懒加载背后的浏览器能力

```js
const UserView = () => import('../views/UserView.vue')
```

- 编译后变为动态 `import('...')`。
- **浏览器核心 API**：底层是 `<script type="module">` + ES Module 动态加载（Chromium / Firefox / Safari 均支持）。
- **搭配 webpack/vite 的 code-splitting**：每个动态 `import` 被拆成独立的 chunk（`.js` 文件），只有当路由匹配上时才发出请求加载，从而减少首屏体积。
- 本项目构建产物可见，所有视图都被拆为独立 chunk（见构建日志中的 `UserView-XXX.js` 等）。

---

## 七、其他浏览器 API 角色

- **`sessionStorage` / `localStorage`**：保存滚动位置、演示中的登录状态（`localStorage.getItem('vue3-demo-logged-in')`）。
- **`URL` / `URLSearchParams`**：vue-router 内部解析 query 字符串用。
- **`confirm()` / `prompt()`**：本项目 `beforeEnter` 守卫中用作"是否登录"的简单 UI，见 `src/router/index.js`。
- **`IntersectionObserver` / `MutationObserver`**：vue-router 不直接使用，但常用于实现滚动到元素、动态标题更新等扩展场景。

---

## 八、本项目演示点对照表

| 项目功能 | 文件 / 路由 | 用到的浏览器核心 API |
|---------|------------|----------------------|
| `<router-link>` 跳转 | `src/App.vue` | `pushState`（默认行为被拦截） |
| `router.push / replace / go` | `src/views/ProgrammaticNav.vue` | `pushState` / `replaceState` / `history.go` |
| `popstate` 监听 | `src/views/ProgrammaticNav.vue` | `addEventListener('popstate')` |
| 浏览器后退触发守卫 | `src/views/UserView.vue` 中的 `onBeforeRouteUpdate` | `popstate` 触发 vue-router 重新匹配 |
| 命名视图 | `/named-view` | 多个 `<router-view>`，由 vue-router 协调 DOM |
| 守卫拦截未登录 | `src/router/index.js` + `GuardDemo.vue` | `beforeEach` / `beforeEnter` 串行执行 |
| 懒加载 | 路由配置中的 `() => import(...)` | ES Module dynamic import → 独立 chunk |
| 404 | `:pathMatch(.*)*` | URL 不匹配任何路由，由 vue-router 渲染回退组件 |

---

## 九、小结

Vue Router 的本质可以概括为一句话：

> **借助 `pushState` / `replaceState` / `popstate` 这三个浏览器 History API，把 URL 变化拦截下来并交由 JS 处理，配合 Vue 的组件系统实现 SPA 视图切换。**

所有其他能力（守卫、嵌套路由、命名视图、懒加载、滚动恢复）都是在这一基础上构建的"上层建筑"。

更多细节可参考：
- [MDN: History API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)
- [MDN: popstate 事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event)
- [Vue Router 官方文档](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html)
