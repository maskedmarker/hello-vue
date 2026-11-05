# `<router-view />` — 组件到底在哪里渲染

## 一、核心结论

**不是所有组件都在 `<router-view />` 处渲染，而是"当前路由匹配到的组件"渲染在那里。**

`<router-view />` 是 Vue Router 提供的**路由出口（outlet）**：它自身不渲染任何内容，只是一个占位符，vue-router 根据当前 URL 匹配到的路由记录，把对应的组件渲染到这个位置。URL 变化时，这个位置的内容被替换成新匹配的组件。

具体到本项目，完整的渲染链路如下：

```
main.js 挂载 App.vue（mount('#app')，与路由无关）
  └─ App.vue 的 <router-view />          ← 渲染顶层路由组件
       │
       ├─ /  → HomePage
       ├─ /home → HomeView
       │    └─ HomeView 内部的 <router-view />   ← 渲染嵌套子路由组件
       │         ├─ /home/news     → NewsList
       │         └─ /home/messages → MessagesList
       ├─ /user/1 → UserView
       ├─ /named-view → NamedViewDemo（父级：布局组件）
       │    └─ 子路由（path: ''）的 components 渲染进布局内的 4 个命名 <router-view />
       │         ├─ <router-view name="header" />  → NamedHeader
       │         ├─ <router-view name="main" />    → NamedMain
       │         ├─ <router-view name="sidebar" /> → NamedSidebar
       │         └─ <router-view name="footer" />  → NamedFooter
       └─ 其他 → NotFound
```

---

## 二、App.vue 自己不在 router-view 里渲染

`src/App.vue` 是根组件，由 `src/main.js` 中的 `createApp(App).mount('#app')` 挂载，**不经过路由**。

因此 App.vue 中 `<router-view />` 之外的模板（本项目里是顶部的 `<nav>` 导航栏）始终显示、永不变化；只有 `<router-view />` 那一处会随着 URL 变化而替换内容：

```html
<template>
  <div id="app">
    <nav>…导航栏始终存在…</nav>
    <router-view />  <!-- 只有这里随 URL 变化 -->
  </div>
</template>
```

---

## 三、嵌套路由需要各自的出口

路由配置支持 `children` 嵌套（见 `src/router/index.js` 的 `/home` 路由）。嵌套的子路由组件**不会**渲染在 App.vue 的 router-view 里，而是渲染在**父级组件内部的 `<router-view />`** 里。

`src/views/HomeView.vue`：

```html
<template>
  <div>
    <h1>📁 主页（嵌套路由父级）</h1>
    <router-view />  <!-- /home/news、/home/messages 渲染在这里 -->
  </div>
</template>
```

**规则：每嵌套一层路由，就需要在对应层级的父组件里放一个 `<router-view />`。**

- 顶层路由 → 渲染在 App.vue 的 router-view
- 一级子路由 → 渲染在父组件（HomeView）的 router-view
- 若子路由还有孙路由，则子组件里还需要再放一个 router-view，以此类推

---

## 四、命名视图：同一路由渲染多个组件

默认情况下，一条路由记录用一个 `component` 匹配一个 `<router-view />`（即未写 name 的默认出口）。当需要在同一个页面上同时渲染多个组件时，使用**命名视图**。

### 关键规则：命名出口必须与组件所在的记录同层级

每个 `<router-view />` 按**嵌套层级（depth）**和 `name` 找组件：

- App.vue 的顶层 `<router-view />` 是第 0 层，渲染 `matched[0]` 记录的 `default` 组件；
- 第 0 层组件**内部**的 `<router-view />` 是第 1 层，只渲染 `matched[1]`（子路由）的组件。

因此，把命名出口写进同一条记录的 `default` 组件内部是接不到该记录的命名组件的——层级对不上。要么把命名出口平级放到 App.vue（与顶层出口同为第 0 层），要么把命名组件拆到**子路由**、由父级布局组件内部的命名出口渲染。本项目采用后者，以保留 NamedViewDemo 里的布局样式。

### 1. 路由配置：布局组件 + 带命名组件的子路由

`src/router/index.js`：

```js
{
  path: '/named-view',
  name: 'named-view',
  component: NamedViewDemo,   // 父级：布局组件，内部放置命名 <router-view>
  children: [
    {
      path: '',               // 空路径，URL 仍为 /named-view
      components: {
        header: () => import('../views/named/NamedHeader.vue'),
        main: () => import('../views/named/NamedMain.vue'),
        sidebar: () => import('../views/named/NamedSidebar.vue'),
        footer: () => import('../views/named/NamedFooter.vue')
      }
    }
  ]
}
```

匹配链为两层：第 0 层记录渲染布局（NamedViewDemo），第 1 层子记录渲染命名组件，正好落进布局里那四个第 1 层的命名出口。

### 2. 布局组件中用 `name` 指定出口

`src/views/NamedViewDemo.vue`：

```html
<template>
  <div>
    <h1>🎛️ 命名视图演示</h1>
    <router-view name="header" />
    <router-view name="main" />
    <router-view name="sidebar" />
    <router-view name="footer" />
  </div>
</template>
```

注意：

- 路由里 `component`（单数）等同于 `components: { default: component }`，对应模板中**不带 name** 的 `<router-view />`。
- 带 `name="xxx"` 的出口只接收 `components` 中同名的组件；名字对不上（或该位置没有出口）则对应组件不会被渲染。
- 本例子记录没有 `default` 键，因此即使布局里放一个不带 name 的 `<router-view />` 也不会渲染任何内容。
- 另一种经典写法：把命名出口与顶层 `<router-view />` 平级放在 App.vue 中（同为第 0 层），即可直接挂在同一条记录的 `components` 上；缺点是布局结构会写进 App.vue。

本节所述的层级问题曾在本项目真实发生过，完整排查记录见 [命名视图不渲染 — 错误分析与排查记录](./named-view-debug.md)。

---

## 五、常见疑问

**Q：`<router-view />` 是组件还是普通标签？**
它是 vue-router 注册的全局组件 `RouterView`，内部通过 `defineComponent` 实现，会根据当前路由取出匹配组件并渲染。写 `<router-view />` 和写 `<RouterView />` 等价。

**Q：为什么子路由组件没有出现在 App.vue 的出口里？**
因为每个 `<router-view />` 只渲染"当前路由链上属于自己的那一层"。App.vue 的出口渲染顶层路由组件，嵌套子路由被父组件内部的出口接住。

**Q：路由匹配不到时渲染什么？**
渲染 `:pathMatch(.*)*` 通配路由对应的组件，本项目为 `NotFound`（见 `src/router/index.js`）。

---

## 六、小结

- `main.js` 挂载 App.vue，与路由无关；App.vue 中 router-view 以外的部分永不变化。
- App.vue 的 `<router-view />` 只渲染**顶层**路由组件。
- 嵌套子路由渲染在**父组件内部**的 `<router-view />`，每层嵌套一层出口。
- 命名视图用 `components` + `<router-view name="xxx" />` 渲染多个组件，但出口必须与组件所在的记录**同层级**（本项目通过"布局父组件 + 子路由"实现）。

相关文档：[Vue Router 与浏览器核心 API](./vue-router.md)
