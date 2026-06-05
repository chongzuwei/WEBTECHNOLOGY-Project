<template>
  <div id="app" class="app-container">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
export default {
  components: { NavBar }
}
</script>

<style>
/* App-wide container heights */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
