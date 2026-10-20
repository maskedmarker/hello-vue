<template>
  <div id="app">
    <nav>
      <router-link to="/">首页</router-link> |
      <router-link to="/home">主页</router-link> |
      <router-link to="/user/1">用户1</router-link> |
      <router-link to="/user/2">用户2</router-link> |
      <router-link to="/named-view">命名视图</router-link> |
      <router-link to="/programmatic">编程导航</router-link> |
      <router-link to="/guard-demo">路由守卫</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
nav {
  padding: 20px;
  background: #f8f9fa;
  margin-bottom: 20px;
}
nav a {
  margin: 0 8px;
  text-decoration: none;
  color: #42b983;
  font-weight: bold;
}
nav a.router-link-active {
  color: #2c3e50;
}
</style>
