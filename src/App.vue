<template>
  <div id="app">
    <NavBar />
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
export default {
  components: { NavBar }
}
</script>

<style>
body { font-family: Arial, sans-serif; margin:0; padding:0; }
.container { padding: 1rem; }
nav { background:#2c3e50; color:#fff; padding:1rem; }
nav a { color:#fff; margin-right:1rem; text-decoration:none; }
nav a.router-link-active { font-weight:bold; text-decoration:underline; }
</style>
