# 命名视图不渲染 — 错误分析与排查记录

> 问题记录：`/named-view` 页面中四个命名出口 `<router-view name="header/main/sidebar/footer" />` 全部渲染为空，页面上只显示 NamedViewDemo 布局组件自己的静态 HTML（彩色框），NamedHeader 等组件的内容一概没有出现。

## 一、问题现象

访问 `http://localhost:5175/named-view`，页面布局（绿/黄/灰四个色块）正常，但色块内没有任何内容——`NamedHeader.vue` 里的「🎛️ 命名视图 / header 视图」等文字都没有渲染出来。

## 二、排查思路

排查按"从内到外"逐层排除：

1. **组件本身**：`NamedHeader.vue` 等四个组件模板内容完整，单独渲染没有问题 → 排除组件自身原因。
2. **路由配置**：`/named-view` 用 `components`（复数）把 5 个组件都映射上了，名字也一一对应 → 单看配置"看似正确"。
3. **渲染机制**：问题必然出在 `<router-view>` 如何"找到"要渲染的组件。深入 RouterView 的渲染规则后，定位到 **depth（层级）** 机制——这是根因所在。

排查经验：当"配置看起来对、组件也没问题，但就是渲染不出来"时，优先怀疑出口（router-view）与组件所挂载的记录**不在同一层级**。

## 三、根因分析

Vue Router 的每个 `<router-view>` 按**嵌套层级（depth）**和 `name` 两个条件查找组件：

- `depth` = 它在 RouterView 链中的嵌套层数，决定渲染 `matched[depth]` 这条路由记录；
- `name` = 决定取这条记录 `components` 中的哪个键（缺省为 `default`）。

### 修复前的匹配链（有问题的版本）

```
URL /named-view → matched = [ 记录R ]   ← 只有一条记录
记录R = { components: { default: NamedViewDemo, header: ..., main: ..., ... } }

App.vue
  └─ <router-view />  （第 0 层）
       └─ 渲染 matched[0].components.default = NamedViewDemo ✓

NamedViewDemo（由第 0 层渲染出来）内部
  └─ <router-view name="header" />  （第 1 层）
       └─ 去取 matched[1].components.header → matched[1] 是记录R的子路由，不存在 ✗ → 渲染为空
```

**根因**：命名组件（header/main/sidebar/footer）全部挂在第 0 层的记录 R 上，但接它们的出口却放在了第 1 层（default 组件内部）。第 1 层的出口只会渲染 `matched[1]`（即 R 的**子路由**）的组件，而 R 没有子路由，所以四个出口全部落空。

换句话说：**命名出口必须与组件所在的记录同层级**——同一条记录的 `components` 里的所有组件，其出口必须在同一个模板里彼此平级；不能把命名出口塞进 `default` 组件内部。

## 四、解决方案

把命名组件从第 0 层记录下沉到**子路由**，让布局组件（NamedViewDemo）作为父级：

```js
// src/router/index.js
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

NamedViewDemo 模板完全不用改。修复后的匹配链：

```
URL /named-view → matched = [ 父记录, 子记录 ]

App.vue
  └─ <router-view />  （第 0 层）→ 父记录.component = NamedViewDemo ✓

NamedViewDemo 内部
  └─ <router-view name="header" />  （第 1 层）→ 子记录.components.header ✓
```

层级对齐：布局在第 0 层渲染，命名组件在第 1 层渲染，出口也在第 1 层——正好接住。

## 五、由此总结的通用原则

1. **层级对齐**：`<router-view>` 只渲染"与自己同层级的那条记录"的组件；放在哪个组件的模板里，就渲染哪一层子路由。
2. **两种正确的命名视图写法**：
   - 所有出口（含 default）平级放在同一个模板里，挂在同一条记录的 `components` 上；
   - 布局组件作父级 + 子路由承载命名组件（本项目采用，好处是布局样式留在布局组件里）。
3. **快速自查**：数 RouterView 的嵌套层数。第 N 层出口 → 对应 `matched[N]` 记录 → 再看该记录的 `components` 里有没有同名键。
4. **子记录没有 `default` 键时**，同层不带 name 的 `<router-view />` 也不会渲染任何内容。

## 六、验证

刷新 `http://localhost:5175/named-view`，四个区域分别显示 NamedHeader / NamedMain / NamedSidebar / NamedFooter 的内容；切到其他路由再切回来，命名组件随路由一起销毁与重建。

---

相关文档：
- [`<router-view />` 渲染机制](./router-view.md)
- [Vue Router 与浏览器核心 API](./vue-router.md)
