# Vue3 路由功能演示

本项目用于演示 Vue3（Vite + Composition API）下 vue-router 的各项功能。

## 演示内容

- ✅ 基础路由与嵌套路由
- ✅ 动态路由参数（`/user/:id`）
- ✅ 命名视图（多个 `<router-view>`）
- ✅ 编程式导航（`push / replace / go`）
- ✅ 路由守卫（全局 `beforeEach`、组件内 `onBeforeRouteUpdate`）
- ✅ 路由懒加载（`() => import()`）

## 快速开始

```bash
npm install
npm run dev
```

## 路由列表

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/home` | 主页（嵌套路由父级） |
| `/home/news` | 新闻列表（嵌套子路由） |
| `/home/messages` | 消息列表（嵌套子路由） |
| `/user/:id` | 用户详情（动态参数） |
| `/named-view` | 命名视图演示 |
| `/programmatic` | 编程式导航演示 |
| `/guard-demo` | 路由守卫演示（需登录后访问） |
