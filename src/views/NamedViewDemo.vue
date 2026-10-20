<template>
  <div>
    <h1>🎛️ 命名视图演示</h1>
    <p>同一个页面有多个 <code>&lt;router-view&gt;</code>，通过 name 区分</p>
    <div class="named-views">
      <header class="header-view">
        <router-view name="header" />
      </header>
      <main class="main-view">
        <router-view name="main" />
      </main>
      <aside class="sidebar-view">
        <router-view name="sidebar" />
      </aside>
      <footer class="footer-view">
        <router-view name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.named-views {
  display: grid;
  grid-template-columns: 1fr 200px;
  grid-template-rows: auto 1fr auto;
  gap: 10px;
  min-height: 300px;
}
.header-view {
  grid-column: 1 / -1;
  background: #42b983;
  color: white;
  padding: 15px;
}
.main-view {
  background: #e8f5e9;
  padding: 15px;
}
.sidebar-view {
  background: #fff3e0;
  padding: 15px;
}
.footer-view {
  grid-column: 1 / -1;
  background: #eceff1;
  padding: 10px;
  font-size: 14px;
}
code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
